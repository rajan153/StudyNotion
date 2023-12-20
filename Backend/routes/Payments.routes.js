const express = require("express");
const router = express.Router();

const {
  capturePayment,
  verifySignature,
  sendPaymentSuccessEmail
} = require("../controllers/Payment.controller");

const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middlewares/Auth.middleware");
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", auth, isStudent, verifySignature);
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router;
