import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menu";

const gamesAndRafflesFlow = addKeyword("gamesAndRafflesFlow03223").addAction(
  async (ctx, { provider, gotoFlow }) => {
    const message = `🎪 Juega, Gana y Sorpréndete!
🎉 La aventura comienza ahora
🎯 Participa y demuestra tu suerte
🎁 ¡Grandes premios te esperan!
`;

    // Botón principal para ir a los sorteos
    const urlButton = {
      body: "Jugar Ahora",
      url:
        process.env.URL_JUEGOS_Y_SORTEOS ||
        "https://experiencias.fiestadedisfracesfdz.com.ar/",
      text: "Jugar Ahora",
    };

    await provider.sendButtonUrl(ctx.from, urlButton, message);

    // Botón opcional para volver al menú
    await provider.sendButtons(
      ctx.from,
      [{ body: "Volver al Menú" }],
      "Cuando quieras, podés volver al menú principal:"
    );

    // Capturamos si el usuario pulsa el botón
    if (ctx.body.toLowerCase().includes("volver al menú")) {
      return gotoFlow(menuFlow);
    }
  }
);

export { gamesAndRafflesFlow };
