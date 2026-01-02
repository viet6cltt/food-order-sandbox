const mongoose = require("mongoose");

// Các tập giá trị cố định để đảm bảo tính nhất quán dữ liệu
const ReportStatus = ["PENDING", "RESOLVED", "REJECTED"];
const TargetType = ["REVIEW", "RESTAURANT", "USER"];
const ResolutionAction = ["NONE", "HIDE_REVIEW", "BLOCK_USER", "BLOCK_RESTAURANT", "REJECT_REPORT"];

const reportSchema = new mongoose.Schema(
  {
    /** 1. ĐỐI TƯỢNG BỊ BÁO CÁO **/
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true, // Index để Admin tìm kiếm nhanh các vi phạm của 1 đối tượng cụ thể
    },
    targetType: {
      type: String,
      enum: TargetType,
      required: true,
      index: true,
    },

    /** 2. NGƯỜI THỰC HIỆN BÁO CÁO **/
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /** 3. NỘI DUNG VI PHẠM **/
    reason: {
      type: String,
      required: [true, "Lý do báo cáo là bắt buộc"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: null, // Mô tả chi tiết thêm về hành vi vi phạm
    },

    /** 4. QUÁ TRÌNH XỬ LÝ CỦA ADMIN **/
    status: {
      type: String,
      enum: ReportStatus,
      default: "PENDING",
      index: true,
    },

    adminNote: {
      type: String,
      trim: true,
      default: null, 
    },
    resolvedAction: {
      type: String,
      enum: ResolutionAction,
      default: "NONE", // Hành động Admin đã thực hiện (Khóa user, ẩn review...)
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { 
    timestamps: true
  }
);

/** CÁC INDEX TỐI ƯU **/

// Giúp Admin lọc nhanh các báo cáo chưa xử lý theo loại
reportSchema.index({ status: 1, targetType: 1 });

// Ngăn chặn 1 User báo cáo lặp đi lặp lại cùng 1 đối tượng (Chống spam report)
reportSchema.index({ reportedBy: 1, targetId: 1, targetType: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;