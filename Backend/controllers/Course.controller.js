const Category = require("../models/Category.model");
const Course = require("../models/Course.model");
// const Tag = require("../models/Tags.model");
const User = require("../models/User.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader.utils");

// Create course Handler function
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    // fetch data
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      // instructions: _instructions,
    } = req.body;
    // Get thumbnail
    const thumbnail = req.files.thumbnailImage;
    // console.log(first)
    const tag = _tag;
    // Convert the tag and instructions from stringified Array to Array
    // const tag = JSON.parse(_tag);
    // const instructions = JSON.parse(_instructions);

    // Validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !tag.length ||
      !price ||
      !thumbnail ||
      !category
      // !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    // Check instructor valid or not

    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.status(401).json({
        success: false,
        message: "Instructor details not found",
      });
    }
    // Check given category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
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
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      // instructions,
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
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

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

// Get course details
exports.getCourseDetails = async (req, res) => {
  try {
    // Get id
    const { courseId } = req.body;
    // Find course details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "Instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();
    // Validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `could not find the course with ${courseId}`,
      });
    }
    // Return response
    return res.status(200).json({
      success: true,
      message: "Course Details successfully fetched",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the course details.",
    });
  }
};
