const RatingAndReviews = require("../models/RatingAndReview.model");
const Course = require("../models/Course.model");
const { default: mongoose } = require("mongoose");

exports.createRating = async (req, res) => {
  try {
    // Get User Id
    const userId = req.user.id;
    // Fetch data from req body
    const { rating, review, courseId } = req.body;
    // Check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "User is not enrolled in this course.",
      });
    }
    // if user already review the course
    const alreadyReviewed = await RatingAndReviews.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed.",
      });
    }
    // Create Rating
    const ratingReview = await RatingAndReviews.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    // Update course with this rating review
    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { ratingAndReviews: ratingReview._id },
      },
      { new: true }
    );
    // Return Response
    return res.status(200).json({
      success: true,
      message: "Rating is added",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating rating.",
    });
  }
};

// Get average rating
exports.getAverageRating = async (req, res) => {
  try {
    // Get Course id
    const courseId = req.body.courseId;
    //  Calculate average rating
    const result = await RatingAndReviews.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    //  Return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    // If no review is exists
    return res.status(200).json({
      success: true,
      message: "No rating given by you till now.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the Average rating.",
    });
  }
};

// Get all rating
exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReviews.find({})
      .sort({ rating: "desc" })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "course", select: "courseName" })
      .exec();
    return res.status(200).json({
      success: true,
      message: "All review fetched successfully.",
      data: allReviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the all ratings.",
    });
  }
};
