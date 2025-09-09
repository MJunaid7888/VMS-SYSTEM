import mongoose from "mongoose";

const connectDB = async (mongoDbUrl) => {
  try {
    const conn = await mongoose.connect(mongoDbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
