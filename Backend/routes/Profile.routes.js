const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/Auth.middleware");

const {
  updateProfile,
  deleteProfile,
  getAllDetails,
  updateDisplayPicture,
  getEnrolledCourse,
} = require("../controllers/Profile.controller");

// **************************************************************
//                      Profile's Routes
// **************************************************************

// Delete Account
router.delete("/deleteProfile", auth, deleteProfile);
router.put("/updateProfile", auth, updateProfile);
router.get("/getAllDetails", auth, getAllDetails);

// Get Enrolled Courses
router.get("/getEnrolledCourse", auth, getEnrolledCourse);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

module.exports = router;
