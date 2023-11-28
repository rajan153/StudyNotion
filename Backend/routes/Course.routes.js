const express = require("express");
const router = express.Router();

// Courser Controller import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
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

// Course created by instructor only
router.post("/createPost", auth, isInstructor, createCourse);
// Add Section
router.post("/createSection", auth, isInstructor, createSection);
// Update Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Create Sub-Section
router.post("/createSubSection", auth, isInstructor, createSubSection);
// Update Sub-Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub-Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Get all created course
router.get("/getAllCourses", getAllCourses);
// Course details
router.post("/getCourseDetails", getCourseDetails);

// **************************************************************
//              Category Routes for (isAdmin)
// **************************************************************

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/getAllCategories", auth, isAdmin, getAllCategories);
router.post("/categoryPageDetails", auth, isAdmin, categoryPageDetails);

// **************************************************************
//                Rating and Review
// **************************************************************

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRating", getAllRating);

module.exports = router;
