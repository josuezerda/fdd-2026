import { addKeyword, EVENTS } from "@builderbot/bot";


const docFlow = addKeyword(EVENTS.DOCUMENT).addAction(async (ctx, ctxFn) => {
  await ctxFn.flowDynamic("Ups 😅, el sistema no puede trabajar con documentos en este momento.");
  return ctxFn.endFlow();
});

export { docFlow };
