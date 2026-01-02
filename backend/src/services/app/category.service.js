const categoryRepo = require('@/repositories/category.repository');
const ERR_RESPONSE = require('@/utils/httpErrors');
class CategoryService {

  async getAllCategories({ page = 1, limit = 12 }) {
    console.log(page);

    //const filter = { isActive: true };
    // hiện tại chưa xử lí cái tìm kiếm theo tên

    return categoryRepo.getAll({ limit, page });
  }

  async getById(categoryId) {
    return await categoryRepo.getById(categoryId);
  }
}

module.exports = new CategoryService();