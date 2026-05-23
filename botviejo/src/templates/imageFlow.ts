import { addKeyword, EVENTS } from "@builderbot/bot";

const imageFlow = addKeyword(EVENTS.MEDIA)
  .addAction(async (ctx, ctxFn) => {
    await ctxFn.flowDynamic("Actualmente no es posible procesar documentos con este sistema 🚫.");
    return ctxFn.endFlow();
  });

export { imageFlow }