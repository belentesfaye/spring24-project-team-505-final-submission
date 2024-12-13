import mongoose from 'mongoose';

// MongoDB connection URI
const MONGO_URI = 'localhost:27017/coveytown-db';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    // Connected to MongoDB successfully
  } catch (error) {
    // Exit process with failure
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectDB;
