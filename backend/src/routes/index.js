const express = require('express');
const authRoutes = require('./auth.routes.js');
const restaurantRoutes = require('./restaurant.routes');

function route(app) {
  const apiRouter = express.Router();

  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/restaurants', restaurantRoutes);

  app.use('/api', apiRouter); // add all with /api

  // Handler err
  app.use((err, req, res, next) => {
    console.log('sending response error');
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  });
}

module.exports = route;
