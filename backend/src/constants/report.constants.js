const ReportStatus = {
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED"
};

const TargetType = {
  REVIEW: "REVIEW",
  RESTAURANT: "RESTAURANT",
  USER: "USER"
};

const ResolutionAction = {
  NONE: "NONE",
  HIDE_REVIEW: "HIDE_REVIEW",
  BLOCK_USER: "BLOCK_USER",
  BLOCK_RESTAURANT: "BLOCK_RESTAURANT",
  REJECT_REPORT: "REJECT_REPORT"
};

module.exports = {
  ReportStatus,
  TargetType,
  ResolutionAction
};
