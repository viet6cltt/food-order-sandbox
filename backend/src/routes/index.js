const express = require('express');
const authRoutes = require('./app/auth.routes.js');
const usersRoutes = require('./app/users.routes.js');
const restaurantsRoutes = require('./app/restaurants.routes.js');
const menuItemRoutes = require('./app/menuItem.routes.js');
const cartRoutes = require('./app/cart.routes.js');
const orderRoutes = require('./app/order.routes.js');
const paymentRoutes = require('./app/payment.routes.js');
const reviewRoutes = require('./app/reviews.routes.js');
const categoryRoutes = require('./app/category.routes.js');
const geocodeRoutes = require('./app/geocode.routes.js');

const adminUserRoutes = require('./admin/adminUser.routes.js');
const adminCategoryRoutes = require('./admin/adminCategory.routes.js');
const adminRestaurantRequestRoutes = require('./admin/adminRestaurantRequest.routes.js');
const adminReviewReport = require('./admin/adminReport.routes.js');
const adminOrderRoutes = require('./admin/adminOrder.routes.js');

const errorHandler = require('../middlewares/error.middleware');

function route(app) {
  const apiRouter = express.Router();

  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/users', usersRoutes);
  apiRouter.use('/restaurants', restaurantsRoutes);
  apiRouter.use('/menu-items', menuItemRoutes);
  apiRouter.use('/carts', cartRoutes);
  apiRouter.use('/orders', orderRoutes);
  apiRouter.use('/payments', paymentRoutes);
  apiRouter.use('/reviews', reviewRoutes);
  apiRouter.use('/categories', categoryRoutes);
  apiRouter.use('/geocode', geocodeRoutes);
  // admin
  apiRouter.use('/admin/users', adminUserRoutes);
  apiRouter.use('/admin/categories', adminCategoryRoutes);
  apiRouter.use('/admin/restaurant-requests', adminRestaurantRequestRoutes);
  apiRouter.use('/admin/reports', adminReviewReport)
  apiRouter.use('/admin/orders', adminOrderRoutes);
  app.use('/api', apiRouter); // add all with /api

  // Handler err
  app.use(errorHandler);
}

module.exports = route;
