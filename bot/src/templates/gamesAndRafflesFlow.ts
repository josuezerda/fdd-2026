import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menu.js";
import { config } from "../config/index.js";

const gamesAndRafflesFlow = addKeyword("gamesAndRafflesFlow03223").addAction(
  async (ctx, { provider, gotoFlow }) => {
    const message =
      "🎪 *¡Juegá, Ganá y Sorprendete!* 🎪\n\n" +
      "🎉 La aventura comienza ahora\n" +
      "🎯 Participá y demostrá tu suerte\n" +
      "🎁 ¡Grandes premios te esperan!\n\n" +
      "Podés ver todos los sorteos y juegos activos aquí 👇";

    await provider.sendButtonUrl(
      ctx.from,
      {
        body: "🎮 Jugar Ahora",
        url: config.URL_JUEGOS_Y_SORTEOS,
        text: "Jugar Ahora",
      },
      message
    );

    await provider.sendButtons(
      ctx.from,
      [{ body: "Volver al Menú" }],
      "Cuando quieras, podés volver al menú principal:"
    );

    if (ctx.body.toLowerCase().includes("volver al menú")) {
      return gotoFlow(menuFlow);
    }
  }
);

export { gamesAndRafflesFlow };
