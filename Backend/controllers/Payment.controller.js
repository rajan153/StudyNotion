const { default: mongoose } = require("mongoose");
const { instance } = require("../configs/razorpay");
const Course = require("../models/Course.model");
const User = require("../models/User.model");
const mailSender = require("../utils/mailSender.utils");
// const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
require("dotenv").config();

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
      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Your order could'nt initiate",
      });
    }
    // return response
    return res.status(200).json({
      success: true,
      message: "You enrolled to the courses",
    });
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

  crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasu.digest("hex");
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
