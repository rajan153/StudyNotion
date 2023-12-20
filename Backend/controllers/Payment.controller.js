const { default: mongoose } = require("mongoose");
const { instance } = require("../configs/razorpay");
const Course = require("../models/Course.model");
const User = require("../models/User.model");
const mailSender = require("../utils/mailSender.utils");
require("dotenv").config();
const {
  paymentSuccessfulTemplate,
} = require("../mails/paymentSuccessfulTemplate");
const CourseProgress = require("../models/CourseProgress.model");

// Capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  try {
    // Get id
    const { course_Id } = req.body;
    const userId = req.user.id;
    // Valid courseId
    if (!course_Id) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    // Valid courseDetails
    let course;
    try {
      course = await Course.findById(course_Id);
      if (!course) {
        return res.status(400).json({
          success: false,
          message: "Could not find the course",
        });
      }
      // User already paid for the same course
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student already enrolled",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Course is not valid",
      });
    }
    // Order create
    const amount = course.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: course_Id,
        userId,
      },
    };

    try {
      // Initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      // return response
      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
        message: "You enrolled to the courses",
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
  const webhookSecret = process.env.WEBHOOKSECRET;

  const signature = req.header["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is authorized");
    const { courseId, userId } = req.body.payload.payment.entity.notes;
    try {
      // Full fill the action
      // Find the course and enroll the student
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      );
      if (!enrolledCourse) {
        return res.status(400).json({
          success: false,
          message: "Course not found",
        });
      }
      // Find the student and added in the course
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      // Send confirmation Mail
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations for Course",
        "Your payment we recevied now you can access the course"
      );
      return res.status(200).json({
        success: true,
        message: "Signature verified.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while verified the signature.",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invaild Request.",
    });
  }
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
      paymentSuccessfulTemplate(
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
exports.enrollStudents = async (courses, userId, res) => {
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
