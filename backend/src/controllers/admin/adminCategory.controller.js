const adminCategoryService = require('../../services/admin/adminCategory.service');
const ERR = require('../../constants/errorCodes');
const ERR_RESPONSE = require('../../utils/httpErrors');
const SUCCESS_RESPONSE = require('../../utils/successResponse'); 

class AdminCategoryController {
  async create(req, res, next) {
    try {
      const data = req.body;

      if (!data.name) {
        throw new ERR_RESPONSE.BadRequestError("Require name to create category");
      }

      const category = await adminCategoryService.create(data);

      return SUCCESS_RESPONSE.success(res, "Create new category successfully", category);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) throw new ERR_RESPONSE.BadRequestError("Missing category id");

      const data = req.body;

      if (!data || Object.keys(data).length === 0) {
        throw new ERR_RESPONSE.BadRequestError("No data provided");
      }

      const updated = await adminCategoryService.update(categoryId, data);

      return SUCCESS_RESPONSE.success(res, "Update category successfully", updated);
    } catch (err) {
      next(err);
    }
  }

  async deactive(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) throw new ERR_RESPONSE.BadRequestError("Missing category id");

      const updated = await adminCategoryService.deactive(categoryId);

      return SUCCESS_RESPONSE.success(res, "Deactive successfully", updated);
    } catch (err) {
      next(err);
    }
  }

  async active(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) throw new ERR_RESPONSE.BadRequestError("Missing category id");

      const updated = await adminCategoryService.active(categoryId);

      return SUCCESS_RESPONSE.success(res, "Active successfully", updated);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) throw new ERR_RESPONSE.BadRequestError("Missing category id");

      await adminCategoryService.deleteCategory(categoryId);

      return SUCCESS_RESPONSE.accepted(res, "Delete successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminCategoryController();

