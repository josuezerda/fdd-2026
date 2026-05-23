import mongoose from "mongoose";
import { config } from "../../config/index.js";

const ConnectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL_DB || "");
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error de conexión MongoDB:", error);
    process.exit(1);
  }

  mongoose.connection.on("error", (error) => {
    console.error("❌ Error de conexión MongoDB:", error);
  });
};

export { ConnectDB };
