const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const app = require('./src');

// Load enviroment variables
dotenv.config();

// Get PORT and Mongo URI
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});