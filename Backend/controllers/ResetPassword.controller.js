const User = require("../models/User.model");
const mailSender = require("../utils/mailSender.utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Reset Password Token
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req.body
    const { email } = req.body;
    // check if user is present, email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email is not regiestered",
      });
    }
    // Generate token
    const token = crypto.randomBytes(20).toString("hex");

    // adding token and expire date in user
    // NOTE: This i am using for while saved or updating the password in database, how i can fetch the correct
    // user, for selecting the correct user i am using this token.
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );
    // Create Url link
    const url = `http://localhost:3000/update-password/${token}`;
    // send mail
    await mailSender(
      email,
      "Reset Password Link",
      `Password reset link: ${url}`
    );
    // send response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully, Please check your email",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset password",
    });
  }
};

// Reset Password in DB
exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      res.status(401).json({
        success: false,
        message: "Password is not match",
      });
    }

    // get userDetails from DB using token
    const userDetails = await User.findOne({ token: token });
    // if token is invaild
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Token is invaild",
      });
    }
    // if token is expired
    if (userDetails.resetPasswordExpires < Date.Now) {
      return res.status(401).json({
        success: false,
        message: "Token is expired, Please generate new one",
      });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update the password in DB
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    // response return
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      messgae: "Something went wrong while reset the password",
    });
  }
};
