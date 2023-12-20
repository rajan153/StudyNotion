const Profile = require("../models/Profile.model");
const User = require("../models/User.model");
const Course = require("../models/Course.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader.utils");

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    // Get data
    const {
      firstName,
      lastName,
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = null,
    } = req.body;

    const id = req.user.id;
    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    const user = await User.findByIdAndUpdate(id, { firstName, lastName });
    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    profileDetails.firstName = firstName;
    profileDetails.lastName = lastName;
    await profileDetails.save();

    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the profile",
    });
  }
};

// Delete account
exports.deleteProfile = async (req, res) => {
  try {
    // Get id
    const id = req.user.id;
    // validation
    const userDetails = await User.findById({ _id: id });
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }
    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    // delete user
    await User.findByIdAndDelete({ _id: id });
    // TODO: Unroll the user from the courses
    // READ: CORON JOB
    // return response
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the account.",
    });
  }
};

// Get all details
exports.getAllDetails = async (req, res) => {
  try {
    // Get id
    const id = req.user.id;
    // Validation
    if (!id) {
      return res.status(400).json({
        success: true,
        message: "User Id is undefined.",
      });
    }
    // get User details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    // return response
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully.",
      data: userDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all details of user.",
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { images: image.secure_url },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Image updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updaitng display picture.",
    });
  }
};

// Get enrolled course
exports.getEnrolledCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec();
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Could not find user",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully enrolled in this course",
      data: userDetails.courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching",
    });
  }
};

// Get Instructor Dashnoard
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });
    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });
    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching the data of instructor dashboard",
    });
  }
};
