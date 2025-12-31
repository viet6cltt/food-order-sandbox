const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller.js');

router.get('/', CategoryController.getAllCategories);
router.get('/:categoryId', CategoryController.getById);

module.exports = router;

