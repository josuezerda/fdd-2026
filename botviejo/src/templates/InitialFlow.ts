import { addKeyword, EVENTS } from "@builderbot/bot";
import { getUserInfo } from "~/services/MongoDB/services/userService";
import { userRegister } from "./userRegister";
import { menuFlow } from "./menu";
import { DetectIntention } from "./mainIntentionIaFlow";

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
          `¡Hola ${name}!`,
          `🎭 ¡Bienvenido/a a la Gran Fiesta de Disfraces!`,
          `¿En qué te puedo ayudar hoy?`,
        ]);

        return ctxFn.gotoFlow(menuFlow);
      }

      // Si ya fue bienvenido, ir directo a detectar intención
      return ctxFn.gotoFlow(DetectIntention);
    } catch (error) {
      console.error(`[InitialFlow] Error:`, error);
      await ctxFn.flowDynamic(
        "⚠️ Ocurrió un error. Te envío al menú principal."
      );
      return ctxFn.gotoFlow(menuFlow);
    }
  }
);
