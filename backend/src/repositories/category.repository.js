const Category = require('../models/Category');

class CategoryRepository {
  async create(data) {
    return await Category.create(data);
  }

  async getAll({ limit = 50, skip = 0 }) {
    return await Category.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });
  }

  async getById(id) {
    return await Category.findById(id);
  }

  async updateById(id, data) {
    return await Category.findByIdAndUpdate(
      id, 
      data,
      { new: true }
    );
  }

  async setIsActive(id, isActive = true) {
    return await Category.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );
  }

  async deleteById(id) {
    return await Category.findByIdAndDelete(id);
  }
}

module.exports = new CategoryRepository();