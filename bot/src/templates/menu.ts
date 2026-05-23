import { addKeyword, EVENTS } from "@builderbot/bot";
import { faqFiestaFlow } from "./faqFlow.js";
import { entradaOnlineFlow } from "./entradaOnlineFlow.js";
import { trasladosFlow } from "./trasladosFlow.js";
import { disfracesFlow } from "./disfracesFlow.js";
import { userInfoFlow } from "./userInfoFlow.js";
import { gamesAndRafflesFlow } from "./gamesAndRafflesFlow.js";

const menuFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { provider, gotoFlow }) => {
    const list = {
      header: { type: "text", text: "🎭 FDD 2026 — Menú Principal" },
      body: { text: "Elegí una opción para continuar:" },
      footer: { text: "Fiesta de Disfraces 2026 🎃" },
      action: {
        button: "Ver opciones",
        sections: [
          {
            title: "¿Qué querés saber?",
            rows: [
              { id: "consultIA00", title: "🤖 Info General", description: "Consultas sobre la fiesta" },
              { id: "userinfo0222", title: "👤 Mi Perfil", description: "Ver tu información personal" },
              { id: "entradaOnlineFlow", title: "🌐 Comprar Entrada", description: "Comprá tu ticket online" },
              { id: "trasladosFlow", title: "🚌 Traslados", description: "Info sobre colectivos al evento" },
              { id: "disfracesFlow", title: "🎭 Disfraces", description: "Info sobre disfraces y concurso" },
              { id: "gamesAndRafflesFlow03223", title: "🎁 Sorteos y Juegos", description: "Participá y ganá premios" },
            ],
          },
        ],
      },
    };

    await provider.sendList(ctx.from, list);

    const keyword = ctx.body;
    switch (keyword) {
      case "consultIA00": return gotoFlow(faqFiestaFlow);
      case "userinfo0222": return gotoFlow(userInfoFlow);
      case "entradaOnlineFlow": return gotoFlow(entradaOnlineFlow);
      case "trasladosFlow": return gotoFlow(trasladosFlow);
      case "disfracesFlow": return gotoFlow(disfracesFlow);
      case "gamesAndRafflesFlow03223": return gotoFlow(gamesAndRafflesFlow);
      default: return;
    }
  }
);

export { menuFlow };
