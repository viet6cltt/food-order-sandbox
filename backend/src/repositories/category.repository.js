const Category = require('../models/Category');

class CategoryRepository {
  async create(data) {
    return await Category.create(data);
  }

  async getAll({ limit = 10, page = 1 }) {
    console.log(page);
    const skip = (page - 1) * limit;

    // Chạy song song cả 2 query để tối ưu hiệu suất
    const [categories, total] = await Promise.all([
      Category.find()
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 }),
      Category.countDocuments() // Đếm tổng số bản ghi để tính số trang
    ]);

    return {
        categories,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit)
        }
    };
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