const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
        console.log(`[MongoDB] Connected to provided URI: ${mongoUri}`);
        return;
      } catch (err) {
        console.warn(`[MongoDB] Could not connect to MONGODB_URI. Falling back to in-memory MongoDB database... (${err.message})`);
      }
    }

    // Fallback: Mongo Memory Server for zero-config demonstration
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected to In-Memory MongoDB instance at: ${mongoUri}`);

  } catch (error) {
    console.error(`[MongoDB] Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
