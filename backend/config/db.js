const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return mongoose.connection;

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vishesh_app';

  mongoose.set('strictQuery', false);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });

  isConnected = true;
  return mongoose.connection;
}

module.exports = { connectToDatabase };


