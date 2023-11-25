const Profile = require("../models/Profile.model");
const User = require("../models/User.model");

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
