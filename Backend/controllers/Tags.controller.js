const Tags = require("../models/Tags.model");

exports.createTag = async (req, res) => {
  try {
    // Fetching data
    const { name, description } = req.body;
    // Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    // create entry in db
    const tagDetails = await Tags.create({
      name: name,
      description: description,
    });
    // return response
    return res.status(200).json({
      success: true,
      message: "Tags are added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in tags.",
    });
  }
};

// Get all tags
exports.getALlTags = async (req, res) => {
  try {
    const allTags = await Tags.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "You got all tags.",
      allTags,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching tags.",
    });
  }
};
