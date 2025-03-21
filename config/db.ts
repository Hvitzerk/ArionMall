import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL; // ✅ Ensure we use MONGO_URL
    if (!mongoUrl) {
      throw new Error('MONGO_URL is not defined in environment variables.');
    }

    await mongoose.connect(mongoUrl);
    console.log('✅ CONNECTED TO MONGODB SUCCESS...');
  } catch (error) {
    console.error('❌ CONNECTED TO MONGODB FAILED...', error);
  }
};

export default dbConnect;
