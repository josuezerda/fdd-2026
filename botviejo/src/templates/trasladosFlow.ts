import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menu";

export const trasladosFlow = addKeyword(["traslado", "traslados", "colectivo", "ómnibus", "bus"]).addAction(
  async (ctx, { flowDynamic, endFlow, provider }) => {
    try {
      await flowDynamic(
        "🚌✨ Traslados oficiales a la Fiesta ✨🚌 Los colectivos tendrán 2 puntos de salida: desde Fernández (Paseo del Agro, Av. Belgrano) y desde Santiago Capital (Forum, Av. Roca). Para poder viajar será necesario contar con una pulsera de viaje 🎟️, que podrás comprar al momento de subir o de manera anticipada vía WhatsApp a la empresa de transporte 👉 [link pendiente]. Muy pronto compartiremos el número oficial una vez que se confirme el proveedor 🚍."
      );

      await provider.sendButtons(
        ctx.from,
        [{ body: "Volver al menú" }],
        "¿Querés volver al menú principal?"
      );

      return endFlow();
    } catch (error) {
      console.error("Error en Traslados Flow:", error);
      return endFlow("Ocurrió un error, por favor intenta de nuevo.");
    }
  }
);
