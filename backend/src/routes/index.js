const express = require('express');
const authRoutes = require('./auth.routes.js');
const usersRoutes = require('./users.routes.js');
const restaurantsRoutes = require('./restaurants.routes.js');
const menuItemRoutes = require('./menuItem.routes.js');
const cartRoutes = require('./cart.routes.js');
const orderRoutes = require('./order.routes.js');
const paymentRoutes = require('./payment.routes.js');
const revenueRoutes = require('./revenue.routes.js');
const reviewRoutes = require('./app/reviews.routes.js');
const categoryRoutes = require('./category.routes.js');
const adminUserRoutes = require('./admin/adminUser.routes.js');
const adminCategoryRoutes = require('./admin/adminCategory.routes.js');
const adminRestaurantRequestRoutes = require('./admin/adminRestaurantRequest.routes.js');
const adminReviewReport = require('./admin/adminReviewReport.routes.js');

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
  apiRouter.use('/revenue', revenueRoutes);
  apiRouter.use('/reviews', reviewRoutes);
  apiRouter.use('/categories', categoryRoutes);

  // admin
  apiRouter.use('/admin/users', adminUserRoutes);
  apiRouter.use('/admin/categories', adminCategoryRoutes);
  apiRouter.use('/admin/restaurant-requests', adminRestaurantRequestRoutes);
  apiRouter.use('/review-reports', adminReviewReport)
  app.use('/api', apiRouter); // add all with /api

  // Handler err
  app.use(errorHandler);
}

module.exports = route;
