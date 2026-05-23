import { addKeyword } from "@builderbot/bot";
import { faqFiestaFlow } from "../templates/faqFlow.js";

export const assistantFaqFlow = addKeyword("consultIA00").addAnswer(
  "¡Bienvenido/a! 🙌 Estoy disponible para resolver tus preguntas. ¿Cómo puedo ayudarte?",
  { capture: true },
  async (ctx, { gotoFlow }) => {
    return gotoFlow(faqFiestaFlow);
  }
);
