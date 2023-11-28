const express = require("express");
const router = express.Router();

const {
  capturePayment,
  verifySignature,
} = require("../controllers/Payment.controller");

const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middlewares/Auth.middleware");
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", verifySignature);

module.exports = router;
