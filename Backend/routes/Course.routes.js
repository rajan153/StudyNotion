const express = require("express");
const router = express.Router();

// Courser Controller import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  editCourse,
  getFullCourseDetails,
  getInstructorCourses,
  deletedCourse,
} = require("../controllers/Course.controller");

// Category Controller import
const {
  createCategory,
  getAllCategories,
  categoryPageDetails,
} = require("../controllers/Category.controller");
// Section Controller import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section.controller");
// Sub-Section Controller import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection.controller");
// Rating Controller import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReviewing.controller");

// Middleware
const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middlewares/Auth.middleware");

// **************************************************************
//               Routes for (isInstructor)
// **************************************************************

// ******************************************************
//                         Course
// *******************************************************
// Course created by instructor only
router.post("/createCourse", auth, isInstructor, createCourse);
// Edit course
router.post("/editCourse", auth, isInstructor, editCourse);
// Get all created course
router.get("/getAllCourses", getAllCourses);
// Get instructor courses
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// Course details
router.post("/getCourseDetails", getCourseDetails);
// Deleted Course
router.post("/deletedCourse", auth, isInstructor, deletedCourse);
// Get full deitals of Course
router.post("/getFullCourseDetails", auth, getFullCourseDetails);

// ******************************************************
//                         Sections
// *******************************************************
// Add Section
router.post("/createSection", auth, isInstructor, createSection);
// Update Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// ******************************************************
//                         Sub-Sections
// *******************************************************
// Create Sub-Section
router.post("/createSubSection", auth, isInstructor, createSubSection);
// Update Sub-Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub-Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// **************************************************************
//              Category Routes for (isAdmin)
// **************************************************************

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/getAllCategories", getAllCategories);
router.post("/categoryPageDetails", categoryPageDetails);

// **************************************************************
//                Rating and Review
// **************************************************************

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRating", getAllRating);

module.exports = router;
