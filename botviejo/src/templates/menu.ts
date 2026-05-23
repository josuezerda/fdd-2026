import { addKeyword, EVENTS } from "@builderbot/bot";
import { faqFiestaFlow } from "./faqFlow";
import { entradaOnlineFlow } from "./entradaOnlineFlow";
import { trasladosFlow } from "./trasladosFlow";
import { disfracesFlow } from "./disfracesFlow";
import { userInfoFlow } from "./userInfoFlow";
import { gamesAndRafflesFlow } from "./gamesAndRafflesFlow";

const menuFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { provider, gotoFlow }) => {
    const list = {
      header: { type: "text", text: "Menú Principal" },
      body: { text: "Elige una opción:" },
      footer: { text: "Haz clic en opciones para continuar" },
      action: {
        button: "Opciones",
        sections: [
          {
            title: "Acciones disponibles",
            rows: [
              { id: "consultIA00", title: "Información General", description: "Consultas generales y más" },
              { id: "userinfo0222", title: "👤 Mi Perfil", description: "📋 Consulta tu información personal" },
              { id: "entradaOnlineFlow", title: "🌐 Entrada Online", description: "Comprar tu entrada para la fiesta" },
              { id: "trasladosFlow", title: "🚌 Traslados", description: "Información sobre traslados al evento" },
              { id: "disfracesFlow", title: "🎭 Disfraces", description: "Información y recomendaciones sobre disfraces" },
              { id: "gamesAndRafflesFlow03223", title: "🎁 Sorteos", description: "Participa de nuestros sorteos increibles" },
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
      default: return; // NO redirigir automáticamente para evitar loops
    }
  }
);

export { menuFlow };
