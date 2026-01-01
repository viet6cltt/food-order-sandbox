const Payment = require('../models/Payment');

class PaymentRepository {

  async find(payload) {
    return await Payment.find(payload);
  }

  async findOne(payload, sort = { createdAt: -1 }) {
    return await Payment.findOne(payload).sort(sort);
  }

  async findById(id) {
    return await Payment.findById(id);
  }

  async create(payload) {
    return await Payment.create(payload);
  }
}

module.exports = new PaymentRepository();