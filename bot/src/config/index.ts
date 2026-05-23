import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3030,

  JWT_TOKEN: process.env.JWT_TOKEN || "",
  NUMBER_ID: process.env.NUMBER_ID || "",
  VERIFY_TOKEN: process.env.VERIFY_TOKEN || "disfraces",
  VERSION: process.env.VERSION || "v22.0",

  OPENAI_KEY: process.env.OPENAI_KEY || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",

  MONGO_URL_DB: process.env.MONGO_URL_DB || "",

  IDLE_TIME: Number(process.env.IDLE_TIME) || 1000 * 60 * 3,

  URL_JUEGOS_Y_SORTEOS: process.env.URL_JUEGOS_Y_SORTEOS || "https://experiencias.fiestadedisfracesfdz.com.ar/",
};
