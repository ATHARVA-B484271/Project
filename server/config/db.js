const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('[MongoDB] Reusing existing connection.');
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.trim() === '') {
    // Fallback: in-memory MongoDB for local dev / demo without Atlas
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      isConnected = true;
      console.log('[MongoDB] ✅ Connected to In-Memory MongoDB (demo mode)');
      console.log('[MongoDB] ⚠️  Data resets on server restart. Set MONGODB_URI for persistence.');
    } catch (err) {
      console.error('[MongoDB] ❌ Could not start in-memory MongoDB:', err.message);
      console.error('[MongoDB] Please set MONGODB_URI environment variable.');
      throw new Error('No MONGODB_URI set and in-memory MongoDB unavailable.');
    }
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('[MongoDB] ✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('[MongoDB] ❌ Connection failed:', err.message);
    throw err;
  }
};

module.exports = connectDB;
