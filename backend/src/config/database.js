import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected successfully");
  } catch (e) {
    console.error("Error connecting MondoDB: ", e.message);
    process.exit(1);
  }
};
