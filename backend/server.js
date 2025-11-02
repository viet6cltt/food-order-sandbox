const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load enviroment variables
dotenv.config();


const morgan = require('morgan');
const app = require('./src');


// Get PORT and Mongo URI
const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;

// Connect to MongoDB and start server
mongoose
  .connect(dbURI, {
    autoIndex: true, // tự động tạo index được định nghĩa trong Schema
  })
  .then(() => {
    console.log('Connected to DB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect DB: ', err);
  });
