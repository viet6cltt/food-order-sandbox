const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');
const {requireAuth, optinalAuth} = require('../middlewares/auth.middleware');


router.get('/', requireAuth, CartController.getCart);
router.post('/items', requireAuth, CartController.addItem);
router.put('/items/:itemId', requireAuth, CartController.updateItem); // itemId này khác menuItem, itemId là _id ấy
router.delete('/items/:itemId', requireAuth, CartController.deleteItem);
router.post('/checkout', requireAuth, CartController.checkout);

module.exports = router;