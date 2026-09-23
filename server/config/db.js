import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/talentx_db');
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Local Connection Notice: ${error.message}`);
    console.log('💡 Note: If local MongoDB is not running, API gracefully serves pre-seeded local data.');
  }
};
