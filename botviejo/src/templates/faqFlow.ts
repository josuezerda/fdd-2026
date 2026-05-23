import { addKeyword, EVENTS } from "@builderbot/bot";
import path from "path";
import fs from "fs";
import AIClass from "~/services/AI";
import { generateTimer } from "~/utils";
import { menuFlow } from "./menu";
import provider from "~/provider";
import { userRegister } from "./userRegister";
import { getUserInfo } from "~/services/MongoDB/services/userService";

const pathPrompt = path.join(
  process.cwd(),
  "src",
  "assets",
  "Prompt",
  "prompt_FiestaDisfraces.txt"
);
const prompt = fs.readFileSync(pathPrompt, "utf8");

const iso2text = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const faqFiestaFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { endFlow, flowDynamic, gotoFlow }) => {
    const phone = ctx.from;

    const user = await getUserInfo(phone);

    if (!user || user.success === false) {
      return gotoFlow(userRegister);
    }

    try {
      const name = ctx.name;
      const date = iso2text(new Date().toISOString());
      const userMessage = ctx.body;

      const AI = new AIClass();
      const response = await AI.chat(
        `${prompt}\n\nLa fecha de hoy es ${date}. El usuario se llama ${name}.`,
        [{ role: "user", content: userMessage }]
      );

      const chunks = response.match(/.{1,500}(\s|$)/g) || [response];

      for (const chunk of chunks) {
        await flowDynamic([
          { body: chunk.trim(), delay: generateTimer(150, 250) },
        ]);
      }

      const regex = /men[uú]/i;
      if (regex.test(ctx.body)) {
        return gotoFlow(menuFlow);
      }

      await provider.sendButtons(
        ctx.from,
        [{ body: "Menú" }],
        "¿Necesitás volver al menú?"
      );
    } catch (error) {
      console.error("Error en llamada GPT:", error);
      return endFlow("Ocurrió un error, por favor intenta de nuevo.");
    }
  }
);
