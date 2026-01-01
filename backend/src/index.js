const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const passport = require('passport');
require('./config/passport.config');



const route = require('./routes');
const app = express();

// Avoid 304 (ETag) responses with empty bodies for API calls.
// Axios/XHR does not reliably surface cached bodies on 304.
app.disable('etag');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(passport.initialize());

app.use(morgan('dev')); // Log HTTP requests


// Load and configure Swagger
app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  const swaggerPath = path.resolve(__dirname, '../dist/swagger.json');
  delete require.cache[swaggerPath];
  const swaggerDocument = require(swaggerPath);
  return swaggerUi.setup(swaggerDocument)(req, res, next);
});


// Route init
route(app);



module.exports = app;
