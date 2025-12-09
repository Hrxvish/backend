// backend/src/utils/db.js
import mongoose from 'mongoose';

export async function connectDB(mongoUri) {
  try {
    await mongoose.connect(mongoUri, {
      // no special options required for mongoose v8+
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}
