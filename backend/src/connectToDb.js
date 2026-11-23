import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scentSampleNepal";
    await mongoose.connect(mongoUri);
    console.log("Connected successfully to MongoDB database: scentSampleNepal");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectToDb;
