require('module-alias/register');

const mongoose = require('mongoose');

const app = require('../src');

let cached = global.__mongooseCached;
if (!cached) {
  cached = global.__mongooseCached = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri, {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
