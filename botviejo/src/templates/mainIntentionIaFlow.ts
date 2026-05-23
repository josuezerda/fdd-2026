import { EVENTS } from "@builderbot/bot";
import { createFlowRouting } from "@builderbot-plugins/langchain";
import path from "path";
import fs from "fs";
import { config } from "~/config/index.js";
import { faqFiestaFlow } from "./faqFlow.js"; // 🔹 actualizado
import { menuFlow } from "./menu.js";

const pathPrompt = path.join(
  process.cwd(),
  "src",
  "assets",
  "Prompt",
  "prompt_Detection.txt"
);
const promptDetected = fs.readFileSync(pathPrompt, "utf8");

export const DetectIntention = createFlowRouting
  .setKeyword(EVENTS.ACTION)
  .setIntentions({
    intentions: ["FAQ_FIESTA", "MENU_OPCIONES", "NO_DETECTED"],
    description: promptDetected,
  })
  .setAIModel({
    modelName: "openai",
    args: {
      modelName: config.OPENAI_MODEL,
      apikey: config.OPENAI_KEY,
    },
  })
  .create({
    afterEnd(flow) {
      return flow.addAction(async (_, { state, gotoFlow, flowDynamic }) => {
        try {
          const intention = await state.get("intention");
          switch (intention) {
            case "FAQ_FIESTA":
              return gotoFlow(faqFiestaFlow);

            case "MENU_OPCIONES":
              return gotoFlow(menuFlow);

            case "NO_DETECTED":
            default:
              await flowDynamic(
                "Lo siento, no entendí tu mensaje 😞. Podés escribir otra pregunta o volver al menú con la palabra *menú*."
              );
              return gotoFlow(faqFiestaFlow);
          }
        } catch (error) {
          console.log("Error: ", error);
        }
      });
    },
  });
