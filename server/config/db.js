const mongoose = require('mongoose');
const { activateMemoryFallback } = require('../utils/memoryFallback');

let memoryFallbackActive = false;

/**
 * Connect to MongoDB using MONGO_URI. If no local/remote MongoDB instance is
 * reachable in development, activates the pure-JS in-memory fallback store so
 * all Mongoose-backed routes remain operational for local previewing.
 */
async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shinehome';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    memoryFallbackActive = false;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return { connection: conn.connection, isInMemory: false };
  } catch (err) {
    console.warn(`Primary MongoDB unavailable (${err.message}). Activating in-memory fallback store...`);
    activateMemoryFallback();
    memoryFallbackActive = true;
    return { connection: null, isInMemory: true };
  }
}

async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

function isMemoryFallback() {
  return memoryFallbackActive;
}

module.exports = { connectDB, disconnectDB, isMemoryFallback };
