const Section = require("../models/Section.model");
const Course = require("../models/Course.model");

exports.createSection = async (req, res) => {
  try {
    // Data fetch
    const { sectionName, courseId } = req.body;
    // Data validation
    if (!sectionName || !courseId) {
      return res.status(401).json({
        success: false,
        message: "All fields are required.",
      });
    }
    // creating Section
    const newSection = await Section.create({ sectionName });
    // Update course with section ObjectId
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      {
        new: true,
      }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    // return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully.",
      updatedCourseDetails,
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating section",
    });
  }
};

// Updating Section
exports.updateSection = async (req, res) => {
  try {
    // Data Input
    const { sectionName, sectionId } = req.body;
    // Data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Required all fields.",
      });
    }
    // Update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Section updated.",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating section",
    });
  }
};

// Delete Section
exports.deleteSection = async (req, res) => {
  try {
    // Data fetch (id)
    const { sectionId } = req.body;

    // find delete
    // TODO [Tesing]: any need to delete from the course schema.
    await Section.findByIdAndDelete(sectionId);
    // return res
    return res.status(200).json({
      success: true,
      message: "Delete section successfully.",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting Section.",
    });
  }
};
