const express = require("express");
const router = express.Router();

const {
  sendOtp,
  signUp,
  login,
  changePassword,
} = require("../controllers/Auth.controller");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword.controller");

const { auth } = require("../middlewares/Auth.middleware");

// **************************************************************
//                  Authentication routers
// **************************************************************

// User Login
router.post("/login", login);
// User SignUp
router.post("/signup", signUp);
// Sending Otp to User's email
router.post("/sendotp", sendOtp);
//  Reset password
router.post("/changepassword", auth, changePassword);

// **************************************************************
//                  Reset Password
// **************************************************************

// Genrating token for reset password
router.post("/resetPasswordToken", resetPasswordToken);

// Password reset after verification
router.post("/resetPassword", resetPassword);

module.exports = router;
