import { createFlow } from "@builderbot/bot";
import { InitialFlow } from "./InitialFlow";
import { menuFlow } from "./menu";
import { faqFiestaFlow } from "./faqFlow";
import { userRegister } from "./userRegister";
import { DetectIntention } from "./mainIntentionIaFlow";
import { assistantFaqFlow } from "./assistantFaqFlow";
import { userInfoFlow } from "./userInfoFlow";
import { websiteFlow } from "./websiteFlow";
import { imageFlow } from "./imageFlow";
import { docFlow } from "./docFlow";
import { gamesAndRafflesFlow } from "./gamesAndRafflesFlow";
import { entradaOnlineFlow } from "./entradaOnlineFlow";
import { trasladosFlow } from "./trasladosFlow";
import { disfracesFlow } from "./disfracesFlow";

export default createFlow([
  InitialFlow,
  menuFlow,
  faqFiestaFlow,
  userRegister,
  DetectIntention,
  assistantFaqFlow,
  userInfoFlow,
  websiteFlow,
  imageFlow,
  docFlow,
  gamesAndRafflesFlow,
  entradaOnlineFlow,
  trasladosFlow,
  disfracesFlow,
]);
