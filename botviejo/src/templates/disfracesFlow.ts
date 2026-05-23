import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menu";

export const disfracesFlow = addKeyword(["disfraz", "disfraces", "tema disfraces"]).addAction(
  async (ctx, { flowDynamic, endFlow, provider }) => {
    try {
      await flowDynamic(
        "🎭 Es obligatorio venir disfrazado para participar en concursos. Los disfraces pueden ser caseros o comprados, ¡la creatividad es bienvenida!"
      );

      await provider.sendButtons(
        ctx.from,
        [{ body: "Volver al menú" }],
        "¿Querés volver al menú principal?"
      );

      return endFlow();
    } catch (error) {
      console.error("Error en Disfraces Flow:", error);
      return endFlow("Ocurrió un error, por favor intenta de nuevo.");
    }
  }
);
