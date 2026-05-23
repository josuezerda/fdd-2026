import { addKeyword } from "@builderbot/bot";

export const disfracesFlow = addKeyword(["disfraz", "disfraces", "tema disfraces", "disfracesFlow"]).addAction(
  async (ctx, { flowDynamic, endFlow, provider }) => {
    try {
      await flowDynamic(
        "🎭 *Disfraces FDD 2026* 🎭\n\n" +
        "✅ Es *obligatorio* venir disfrazado para participar en los concursos\n" +
        "✅ Los disfraces pueden ser caseros o comprados — ¡la creatividad es bienvenida!\n" +
        "❌ No se permite imitar uniformes oficiales de fuerzas públicas (policía, gendarmes, etc.)\n\n" +
        "🏆 *Categorías de concurso:*\n" +
        "👤 Individual · 👫 Pareja · 👥 Grupo\n" +
        "😂 Más Gracioso · 🎨 Más Original\n" +
        "💎 Más Elaborado · 👻 Más Terrorífico\n\n" +
        "¡Animate y ganate un premio épico! 🎁"
      );
      await provider.sendButtons(ctx.from, [{ body: "Volver al menú" }], "¿Querés volver al menú principal?");
      return endFlow();
    } catch (error) {
      console.error("Error en disfracesFlow:", error);
      return endFlow("Ocurrió un error, por favor intentá de nuevo.");
    }
  }
);
