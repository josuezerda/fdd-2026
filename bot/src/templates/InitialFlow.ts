import { addKeyword, EVENTS } from "@builderbot/bot";
import { getUserInfo } from "../services/MongoDB/services/userService.js";
import { userRegister } from "./userRegister.js";
import { menuFlow } from "./menu.js";
import { DetectIntention } from "./mainIntentionIaFlow.js";

export const InitialFlow = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, ctxFn) => {
    try {
      const phone = ctx.from;
      const name = ctx.name || "Usuario";

      const user = await getUserInfo(phone);
      if (!user || user.success === false) {
        return ctxFn.gotoFlow(userRegister);
      }

      const welcomeKey = `hasWelcomed_${phone}`;
      const hasWelcomed = await ctxFn.state.get(welcomeKey);

      if (!hasWelcomed) {
        await ctxFn.state.update({ [welcomeKey]: true });
        await ctxFn.flowDynamic([
          `¡Hola ${name}! 👋`,
          `🎭 ¡Bienvenido/a a la *Fiesta de Disfraces FDD 2026*! 🎃`,
          `¿En qué te puedo ayudar hoy?`,
        ]);
        return ctxFn.gotoFlow(menuFlow);
      }

      return ctxFn.gotoFlow(DetectIntention);
    } catch (error) {
      console.error(`[InitialFlow] Error:`, error);
      await ctxFn.flowDynamic("⚠️ Ocurrió un error. Te envío al menú principal.");
      return ctxFn.gotoFlow(menuFlow);
    }
  }
);
