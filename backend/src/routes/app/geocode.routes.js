const express = require('express');
const router = express.Router();
const GeocodeController = require('@/controllers/app/geocode.controller');

router.post('/', GeocodeController.geocode);

module.exports = router;
