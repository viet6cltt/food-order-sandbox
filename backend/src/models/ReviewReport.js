const mongoose = require("mongoose");

const ReportStatus = ["PENDING", "RESOLVED", "REJECTED"];

const reviewReportSchema = new mongoose.Schema(
  {
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
      index: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String, 
      trim: true,
      required: true,
    },
    adminNote: {
      type: String,
      trim: true,
      default: null
    },
    status: {
      type: String,
      enum: ReportStatus,
      default: "PENDING",
      index: true
    },
  },
  { timestamps: true }
);

const ReviewReport = mongoose.model("ReviewReport", reviewReportSchema);
module.exports = ReviewReport;