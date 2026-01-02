const express = require('express');
const router = express.Router();
const ctl = require('@/controllers/app/category.controller');

router.get('/', ctl.getAllCategories);

router.get(':categoryId', ctl.getById);

module.exports = router;