const Profile = require("../models/Profile.model");
const User = require("../models/User.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader.utils");

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    // Get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    const id = req.user.id;
    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();
    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
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
      { image: image.secure_url },
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
