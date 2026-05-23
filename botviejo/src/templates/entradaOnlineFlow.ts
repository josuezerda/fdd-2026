import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menu";

export const entradaOnlineFlow = addKeyword(["entrada", "entradas", "ticket", "boleto"]).addAction(
  async (ctx, { flowDynamic, endFlow, gotoFlow, provider }) => {
    try {
      await flowDynamic(
        "🌐 Podés comprar tu entrada online aquí: https://www.passline.com/eventos/fiesta-de-disfraces-fdz"
      );

      // Botón para volver al menú
      await provider.sendButtons(
        ctx.from,
        [{ body: "Volver al menú" }],
        "¿Querés volver al menú principal?"
      );

      return endFlow();
    } catch (error) {
      console.error("Error en Entrada Online Flow:", error);
      return endFlow("Ocurrió un error, por favor intenta de nuevo.");
    }
  }
);
