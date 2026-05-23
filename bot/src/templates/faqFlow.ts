import { addKeyword, EVENTS } from "@builderbot/bot";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import AIClass from "../services/AI/index.js";
import { menuFlow } from "./menu.js";
import { userRegister } from "./userRegister.js";
import { getUserInfo } from "../services/MongoDB/services/userService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prompt = fs.readFileSync(
  path.join(__dirname, "..", "assets", "Prompt", "prompt_FiestaDisfraces.txt"),
  "utf8"
);

const iso2text = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString("es-ES", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export const faqFiestaFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { endFlow, flowDynamic, gotoFlow, provider }) => {
    const phone = ctx.from;
    const user = await getUserInfo(phone);
    if (!user || user.success === false) return gotoFlow(userRegister);

    try {
      const AI = new AIClass();
      const date = iso2text(new Date().toISOString());
      const response = await AI.chat(
        `${prompt}\n\nLa fecha de hoy es ${date}. El usuario se llama ${ctx.name}.`,
        [{ role: "user", content: ctx.body }]
      );

      const chunks = response.match(/.{1,500}(\s|$)/g) || [response];
      for (const chunk of chunks) {
        await flowDynamic([{ body: chunk.trim(), delay: 200 }]);
      }

      if (/men[uú]/i.test(ctx.body)) return gotoFlow(menuFlow);

      await provider.sendButtons(ctx.from, [{ body: "Menú" }], "¿Necesitás volver al menú?");
    } catch (error) {
      console.error("Error en faqFiestaFlow:", error);
      return endFlow("Ocurrió un error, por favor intentá de nuevo.");
    }
  }
);
