const categoryRepo = require('@/repositories/category.repository');
const ERR_RESPONSE = require('@/utils/httpErrors');
const fs = require('fs');
const cloudinary = require('@/config/cloudinary.config');

class AdminCategoryService {

  async create(data, filePath) {
    let category = null;
    try {
      // 1. tạo category
      category = await categoryRepo.create(data);

      if (filePath) {
        // 2. Upload ảnh vào folder có tên là _id của tên folder 
        const result = await cloudinary.uploader.upload(filePath, {
          folder: `food-order/categories/${category._id}`,
          public_id: `image`,
          overwrite: true
        });

        category = await categoryRepo.updateById(category._id, { imageUrl: result.secure_url });

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      return category;
    } catch (err) {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
      throw err;
    }
  }

  async update(categoryId, data, filePath) {
    const category = await categoryRepo.getById(categoryId);

    if (!category) throw new ERR_RESPONSE.NotFoundError("Category not found");

    // If category is not active, cannot update
    if (!category.isActive) {
      throw new ERR_RESPONSE.UnprocessableEntityError("Only active category can change info");
    }

    try {
      // nếu có ảnh cũ tồn tại thì xóa ảnh cũ
      if (filePath) {
        // 1 upload len cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
          folder: `food-order/categories/${categoryId}`,
          public_id: `image`,
          overwrite: true,
        });

        data.imageUrl = result.secure_url;

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        
      }

      return await categoryRepo.updateById(categoryId, data);
    } catch (err) {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
      throw err;
    }
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