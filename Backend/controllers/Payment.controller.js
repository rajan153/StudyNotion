const { default: mongoose } = require("mongoose");
const { instance } = require("../configs/razorpay");
const Course = require("../models/Course.model");
const User = require("../models/User.model");
const mailSender = require("../utils/mailSender.utils");
require("dotenv").config();
const { paymentSuccessEmail } = require("../mails/paymentSuccessfulTemplate");
const CourseProgress = require("../models/CourseProgress.model");
const crypto = require("crypto");
const { courseEnrollmentEmail } = require("../mails/courseEnrollmentTemplate");

// Capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  try {
    // Get id
    const { course_Id } = req.body;
    const userId = req.user.id;
    console.log("CourseId", course_Id);
    // Valid courseId
    if (!course_Id) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    let totalAmount = 0;
    // Valid courseDetails
    try {
      let course;
      console.log("done");
      for (const course_id of course_Id) {
        // Find the course by its ID
        course = await Course.findById(course_id);

        // If the course is not found, return an error
        if (!course) {
          return res
            .status(200)
            .json({ success: false, message: "Could not find the Course" });
        }
        // User already paid for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentEnrolled.includes(uid)) {
          return res.status(200).json({
            success: false,
            message: "Student already enrolled",
          });
        }
        // Add the price of the course to the total amount
        totalAmount += course.price;
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Course is not valid",
      });
    }
    // Order create
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };

    try {
      // Initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      // return response
      console.log("Payment Response", paymentResponse);
      return res.status(200).json({
        success: true,
        data: paymentResponse,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Your order could'nt initiate",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while capturing payment.",
    });
  }
};

// Verify signature
exports.verifySignature = async (req, res) => {
  console.log("Body ", req.body);
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.course_Id;

  const userId = req.user.id;
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  console.log("EX", expectedSignature);
  console.log("RS", razorpay_signature);

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  try {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" });
    }
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending payment email",
    });
  }
};

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  console.log("Kive aa");
  try {
    if (!courses || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Course ID and User ID",
      });
    }

    for (const courseId of courses) {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }
      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log("Enrolled student: ", enrolledStudent);
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );

      console.log("Email sent successfully: ", emailResponse.response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while enrolling the student in course",
    });
  }
};
