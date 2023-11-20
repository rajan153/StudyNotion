const Category = require("../models/Category.model");

exports.createCategory = async (req, res) => {
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
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    // return response
    return res.status(200).json({
      success: true,
      message: "Category is added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in category.",
    });
  }
};

// Get all category
exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "You got all categories.",
      allCategories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching categories.",
    });
  }
};
