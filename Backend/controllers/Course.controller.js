const Course = require("../models/Course.model");
const Tag = require("../models/Tags.model");
const User = require("../models/User.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader.utils");

// Create course Handler function
exports.createCourse = async (req, res) => {
  try {
    // fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    // Get thumbnail
    const thumbnail = req.files.thumbnailImage;
    // Validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    // Check instructor valid or not
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);

    if (!instructorDetails) {
      return res.status(401).json({
        success: false,
        message: "Instructor details not found",
      });
    }
    // Check given tags is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag details not found",
      });
    }

    // Upload Image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // Create an entry for new Course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // Add course in instructor course schema
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Update the Tag Schema
    // TODO: HomeWork

    // return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Course",
    });
  }
};

// GetAll course handler function

exports.getAllCourses = async (req, res) => {
  try {
    const allCourse = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data fetch successfully",
      data: allCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch all courses data",
    });
  }
};
