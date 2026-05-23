import { addKeyword } from "@builderbot/bot";

export const trasladosFlow = addKeyword(["traslado", "traslados", "colectivo", "bus", "trasladosFlow"]).addAction(
  async (ctx, { flowDynamic, endFlow, provider }) => {
    try {
      await flowDynamic(
        "🚌✨ *Traslados oficiales FDD 2026* ✨🚌\n\n" +
        "Los colectivos tendrán 2 puntos de salida:\n\n" +
        "📍 *Fernández:* Paseo del Agro, Av. Belgrano\n" +
        "📍 *Santiago Capital:* Forum, Av. Roca\n\n" +
        "🎟️ Para viajar necesitás una *pulsera de viaje*, que podés comprar al subir o de manera anticipada.\n\n" +
        "📲 Muy pronto compartiremos el número oficial una vez que se confirme el proveedor 🚍"
      );
      await provider.sendButtons(ctx.from, [{ body: "Volver al menú" }], "¿Querés volver al menú principal?");
      return endFlow();
    } catch (error) {
      console.error("Error en trasladosFlow:", error);
      return endFlow("Ocurrió un error, por favor intentá de nuevo.");
    }
  }
);
