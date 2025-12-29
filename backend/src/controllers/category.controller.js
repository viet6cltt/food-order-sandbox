const categoryService = require('../services/category.service');
const ERR = require('../constants/errorCodes');
const ERR_RESPONSE = require('../utils/httpErrors');
const SUCCESS_RESPONSE = require('../utils/successResponse'); 


class CategoryController {
  async getAllCategories(req, res, next) {
    try {
      const { page, limit } = req.query;

      const categories = await categoryService.getAllCategories({ page, limit });

      return SUCCESS_RESPONSE.success(res, "Get successfully", categories);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) throw new ERR_RESPONSE.BadRequestError("Missing category id");

      const category = await categoryService.getById(categoryId);

      return SUCCESS_RESPONSE.success(res, "Get successfully", category);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();