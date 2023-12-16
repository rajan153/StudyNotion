const express = require("express");
const router = express.Router();
const { contactUsController } = require("../controllers/ContactUs.controller");

router.post("/contactUs", contactUsController);

module.exports = router;
