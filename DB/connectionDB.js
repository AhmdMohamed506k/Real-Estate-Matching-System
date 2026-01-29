// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 50,
      minPoolSize: 10,
      waitQueueTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Lost MongoDB connection...");
    });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
