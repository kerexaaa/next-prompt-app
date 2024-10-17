import mongoose from "mongoose";

let isConnected = false; // track connection status
export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log(`Mongodb is already connected`);
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "share_prompt",
    });

    isConnected = true;

    console.log(`Mongodb connected`);
  } catch (error) {
    console.error(`Mongodb connection error: ${error}`);
  }
};
