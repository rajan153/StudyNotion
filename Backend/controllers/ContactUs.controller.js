const mailSender = require("../utils/mailSender.utils");
const { contactFormTemplate } = require("../mails/contactFormTemplate");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } =
    req.body;
    console.log(req.body);
  try {
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactFormTemplate(
        email,
        firstname,
        lastname,
        message,
        phoneNo,
        countrycode
      )
    );
    return res.status(200).json({
      success: true,
      message: "Data send successfully",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending contactUs form",
    });
  }
};
