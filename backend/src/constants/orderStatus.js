const orderStatus = [
  "draft",
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "completed",
  "cancelled",
];

const orderStatusObject = {
  draft: "draft",
  pending: "pending",
  confirmed: "confirmed",
  preparing: "preparing",
  delivering: "delivering",
  completed: "completed",
  cancelled: "cancelled"
};

const allowedTransitions = {
  draft: ["pending"],
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["delivering"],
  delivering: ["completed"],
  completed: [],
  cancelled: []
};

module.exports = { orderStatus, orderStatusObject, allowedTransitions };