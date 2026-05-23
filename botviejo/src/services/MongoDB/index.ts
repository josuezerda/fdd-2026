import mongoose from "mongoose";
import { config } from "~/config";

const ConnectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL_DB
      || "");
    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }

  mongoose.connection.on("error", (error) => {
    console.error("Database connection error:", error);
  });
};




export {ConnectDB}
