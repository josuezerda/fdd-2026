import { ConnectDB } from "./services/MongoDB";
import AIClass from "./services/AI";
import { MemoryDB as Database, createBot } from "@builderbot/bot";
import Templates from "./templates";
import { config } from "./config";
import provider from "./provider";

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
};

main();
