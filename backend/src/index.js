const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./config/passport.config');

const route = require('./routes');
const app = express();



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

// Route init
route(app);

module.exports = app;
