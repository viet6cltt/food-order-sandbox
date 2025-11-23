const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

// Load enviroment variables
dotenv.config({ path: "./.env"});


const morgan = require('morgan');
const app = require('./src');

// Get PORT and Mongo URI
const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;

// Connect to MongoDB and start server
if (!dbURI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't exit, log and continue
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit immediately, log and try to continue
});

mongoose
  .connect(dbURI, {
    autoIndex: true, // tự động tạo index được định nghĩa trong Schema
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => {
    console.log('Connected to DB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect DB: ', err);
    // Still start server, but queries will fail gracefully
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (DB connection failed)`);
    });
  });
