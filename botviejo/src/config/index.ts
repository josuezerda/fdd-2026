import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3030,

  JWT_TOKEN: process.env.JWT_TOKEN || "",
  NUMBER_ID: process.env.NUMBER_ID || "",
  VERIFY_TOKEN: process.env.VERIFY_TOKEN || "",
  VERSION: process.env.VERSION || "v18.0",

  OPENAI_KEY: process.env.OPENAI_KEY || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "",

  MONGO_URL_DB: process.env.MONGO_URL_DB || "",

  IDLE_TIME: Number(process.env.IDLE_TIME) || 1000 * 60 * 3,
};
