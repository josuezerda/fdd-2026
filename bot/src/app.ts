import { ConnectDB } from "./services/MongoDB/index.js";
import AIClass from "./services/AI/index.js";
import { MemoryDB as Database, createBot } from "@builderbot/bot";
import Templates from "./templates/index.js";
import { config } from "./config/index.js";
import provider from "./provider/index.js";

const main = async () => {
  await ConnectDB();

  const { httpServer } = await createBot(
    {
      flow: Templates,
      provider: provider,
      database: new Database(),
    },
    {
      extensions: {
        AI: new AIClass(config.OPENAI_KEY, config.OPENAI_MODEL),
      },
      queue: {
        timeout: 45000,
        concurrencyLimit: 200,
      },
    }
  );

  httpServer(+config.PORT);
  console.log(`🎃 FDD Bot corriendo en el puerto ${config.PORT}`);
  console.log(`🔗 Webhook: POST /v1/messages`);
  console.log(`✅ WhatsApp Number ID: ${config.NUMBER_ID}`);
};

main();
