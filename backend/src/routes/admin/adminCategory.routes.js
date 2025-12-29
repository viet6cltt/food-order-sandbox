const router = require('express').Router();

const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');

router.use(requireAuth, requireAdmin);

router.post("/categories", categoryController.createCategory);

router.get("/categories", categoryController.getAllCategories);

router.get('/categories/:categoryId', categoryController.getById);

router.put('/categories/:categoryId', categoryController.updateCategory);

router.patch('/categories/:categoryId/deactive',categoryController.deactiveCategory);

router.patch('/categories/:categoryId/active',categoryController.activeCategory);

router.delete('/categories/:categoryId', categoryController.deleteCategory);

module.exports = router;