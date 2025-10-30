const express = require('express');
const authRoutes = require('./auth.routes.js');

function route(app) {
  const apiRouter = express.Router();

  apiRouter.use('/auth', authRoutes);

  app.use('/api', apiRouter); // add all with /api

  // Handler err
  app.use((err, req, res, next) => {
    console.log('sending response error');
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  });
}

module.exports = route;
