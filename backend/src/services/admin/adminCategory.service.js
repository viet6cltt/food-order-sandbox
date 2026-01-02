const categoryRepo = require('@/repositories/category.repository');
const ERR_RESPONSE = require('@/utils/httpErrors');

class AdminCategoryService {

  async create(data) {
    return await categoryRepo.create(data);
  }

  async update(categoryId, data) {
    const category = await categoryRepo.getById(categoryId);

    if (!category) throw new ERR_RESPONSE.NotFoundError("Category not found");

    // If category is not active, cannot update
    if (!category.isActive) {
      throw new ERR_RESPONSE.UnprocessableEntityError("Only active category can change info");
    }

    return await categoryRepo.updateById(categoryId, data);
  }

  async deactive(categoryId) {
    const category = await categoryRepo.getById(categoryId);

    if (!category) throw new ERR_RESPONSE.NotFoundError("Category not found");

    if (!category.isActive) {
      throw new ERR_RESPONSE.UnprocessableEntityError("Category is already deactivated");
    }

    return await categoryRepo.setIsActive(categoryId, false);
  }

  async active(categoryId) {
    const category = await categoryRepo.getById(categoryId);

    if (!category) throw new ERR_RESPONSE.NotFoundError("Category not found");

    if (category.isActive) {
      throw new ERR_RESPONSE.UnprocessableEntityError("Category is already activated");
    }

    return await categoryRepo.setIsActive(categoryId, true);
  }

  async deleteCategory(categoryId) {
    const category = await categoryRepo.getById(categoryId);

    if (!category) throw new ERR_RESPONSE.NotFoundError("Category not found");

    return await categoryRepo.deleteById(categoryId);
  }
}

module.exports = new AdminCategoryService();