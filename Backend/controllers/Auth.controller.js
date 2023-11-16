const User = require("../models/User.model");
const Otp = require("../models/OTP.model");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Send Otp
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if User already exist
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    // Check otp is unique or not
    // REMEBER: This code is not optimised because it going to Database to check the entry
    // again and again
    const result = await Otp.findOne({ otp: otp });
    while (result) {
      otp = tpGenerator.generate(6, {
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
      });
    }

    const otpPaylaod = { email, otp };
    const otpBody = await Otp.create(otpPaylaod);
    res.status(200).json({
      success: true,
      message: "OTP send successfully.",
      otp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "OTP send successfully.",
    });
  }
};

// Sign-Up Function
exports.signUp = async (req, res) => {
  try {
    // Data Fetch from req.body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // data validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // match both password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is not match",
      });
    }

    // user exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // if everything is okay then fetch otp
    const recentOtp = await Otp.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    // VAlidate OTP
    if (recentOtp == 0) {
      return res.status(400).json({
        success: false,
        message: "Otp is not found",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is incorrect",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create database entry
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      images: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return res
    return res.status(200).json({
      success: true,
      message: "User is registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please SignUp",
    });
  }
};

// Login

exports.login = async (req, res) => {
  try {
    // Get data from req.body
    const { email, password } = req.body;

    // validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    // checks user exits or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not register. Please SignUp first",
      });
    }
    // generate JWT, after matching password
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed, Please try again",
    });
  }
};

// Change Password
// TODO:HomeWork
exports.changePassword = async(req,res) => {
  try {
    // get data from req.body
    // get oldPassword, newPassword, confirmPassword
    // Validation

    // Update password in Db
    // Send mail - Password change successfully
    // return response
  } catch (error) {
    
  }
}