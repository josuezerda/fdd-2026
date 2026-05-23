import { createFlow } from "@builderbot/bot";
import { InitialFlow } from "./InitialFlow.js";
import { menuFlow } from "./menu.js";
import { faqFiestaFlow } from "./faqFlow.js";
import { userRegister, retryRegistration } from "./userRegister.js";
import { DetectIntention } from "./mainIntentionIaFlow.js";
import { assistantFaqFlow } from "./assistantFaqFlow.js";
import { userInfoFlow } from "./userInfoFlow.js";
import { gamesAndRafflesFlow } from "./gamesAndRafflesFlow.js";
import { entradaOnlineFlow } from "./entradaOnlineFlow.js";
import { trasladosFlow } from "./trasladosFlow.js";
import { disfracesFlow } from "./disfracesFlow.js";

export default createFlow([
  InitialFlow,
  menuFlow,
  faqFiestaFlow,
  userRegister,
  retryRegistration,
  DetectIntention,
  assistantFaqFlow,
  userInfoFlow,
  gamesAndRafflesFlow,
  entradaOnlineFlow,
  trasladosFlow,
  disfracesFlow,
]);
