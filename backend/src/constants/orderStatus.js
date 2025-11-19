const orderStatus = [
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "completed",
  "cancelled",
];

const orderStatusObject = {
  pending: "pending",
  confirmed: "confirmed",
  preparing: "preparing",
  delivering: "delivering",
  completed: "completed",
  cancelled: "cancelled"
};

const allowedTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["delivering"],
  delivering: ["completed"],
  completed: [],
  cancelled: []
};

module.exports = { orderStatus, orderStatusObject, allowedTransitions };