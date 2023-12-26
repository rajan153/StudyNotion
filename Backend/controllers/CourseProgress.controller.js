const SubSection = require("../models/SubSection.model");
const CourseProgress = require("../models/CourseProgress.model");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  try {
    const subSection = await SubSection.findById(subsectionId);

    if (!subSection) {
      return res.status(400).json({
        success: false,
        message: "Invaild SubSectionId",
      });
    }
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      return res.status(400).json({
        success: false,
        message: "Course progress does'nt exist",
      });
    } else {
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({
          success: false,
          message: "Already Completed",
        });
      }
      courseProgress.completedVideos.push(subsectionId);
    }
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course progress updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the progress bar",
    });
  }
};
