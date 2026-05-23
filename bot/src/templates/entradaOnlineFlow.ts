import { addKeyword } from "@builderbot/bot";

export const entradaOnlineFlow = addKeyword(["entrada", "entradas", "ticket", "boleto", "entradaOnlineFlow"]).addAction(
  async (ctx, { flowDynamic, endFlow, provider }) => {
    try {
      await flowDynamic(
        "🌐 Podés comprar tu entrada online aquí:\n👉 https://www.passline.com/eventos/fiesta-de-disfraces-fdz\n\n🎟️ ¡No te quedes sin la tuya! Los cupos son limitados."
      );
      await provider.sendButtons(ctx.from, [{ body: "Volver al menú" }], "¿Querés volver al menú principal?");
      return endFlow();
    } catch (error) {
      console.error("Error en entradaOnlineFlow:", error);
      return endFlow("Ocurrió un error, por favor intentá de nuevo.");
    }
  }
);
