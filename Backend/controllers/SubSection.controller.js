const SubSection = require("../models/SubSection.model");
const Section = require("../models/Section.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader.utils");

exports.createSubSection = async (req, res) => {
  try {
    // Fetch data
    const { sectionId, title, timeDuration, description } = req.body;
    // Exrect file
    const video = req.files.videoFile;
    // validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
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
      timeDuration: timeDuration,
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

//HW:deleteSubSection
