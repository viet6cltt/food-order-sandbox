const express = require('express');
const router = express.Router();
const ctl = require('@/controllers/category.controller');

router.get('/', ctl.getAllCategories);

module.exports = router;