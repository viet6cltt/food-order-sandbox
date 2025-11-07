const express = require('express');
const authRoutes = require('./auth.routes.js');
const usersRoutes = require('./users.routes.js');
const errorHandler = require('../middlewares/error.middleware');

function route(app) {
  const apiRouter = express.Router();

  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/users', usersRoutes);

  app.use('/api', apiRouter); // add all with /api

  // Handler err
  app.use(errorHandler);
}

module.exports = route;
