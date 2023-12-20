const SubSection = require("../models/SubSection.model");
const Section = require("../models/Section.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader.utils");

exports.createSubSection = async (req, res) => {
  try {
    // Fetch data
    const { sectionId, title, description } = req.body;
    // Exrect file
    const video = req.files.video;
    // validation
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fileds are required",
      });
    }
    // Upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // Create SubSection
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // Update section with this subsection
    const updateSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");
    // HW:Add populate to log
    // return res
    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      updateSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in creating SubSection.",
    });
  }
};

//HW: updateSubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found.",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }

    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate("subSection")

    return res.status(200).json({
      success: true,
      message: "SubSection is update successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      sucess: false,
      message: "Something went wrong while updating the sub-section.",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $pull: { subSection: subSectionId } }
    );
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });
    if (!subSection) {
      return res.status(400).json({
        success: false,
        message: "SubSection is not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "subSection deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the subSection.",
    });
  }
};
