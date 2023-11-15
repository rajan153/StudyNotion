const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender.utils");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// Function for sending email

async function sendVerificationEmail(email,otp) {
  try {
    const mailResponse = await mailSender(email, "Verification for Email", otp);
    console.log("Otp send successfully", mailResponse);
  } catch (err) {
    console.error("Error in send verification function in otp model" ,err);
    throw err;
  }
}

otpSchema.pre("save", async function(next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
})

module.exports = mongoose.model("Otp", otpSchema);
