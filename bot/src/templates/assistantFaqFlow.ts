import { addKeyword } from "@builderbot/bot";
import { faqFiestaFlow } from "./faqFlow.js";

export const assistantFaqFlow = addKeyword("consultIA00").addAnswer(
  "¡Bienvenido/a! 🙌 Estoy disponible para resolver tus preguntas. ¿Cómo puedo ayudarte?",
  { capture: true },
  async (ctx, { gotoFlow }) => gotoFlow(faqFiestaFlow)
);
