const express = require('express');
const authRoutes = require('./auth.routes.js');
const usersRoutes = require('./users.routes.js');
const restaurantsRoutes = require('./restaurants.routes.js');
const menuItemRoutes = require('./menuItem.routes.js');
const errorHandler = require('../middlewares/error.middleware');

function route(app) {
  const apiRouter = express.Router();

  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/users', usersRoutes);
  apiRouter.use('/restaurants', restaurantsRoutes);
  apiRouter.use('/menu-items', menuItemRoutes);


  app.use('/api', apiRouter); // add all with /api

  // Handler err
  app.use(errorHandler);
}

module.exports = route;
