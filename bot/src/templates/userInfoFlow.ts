import { addKeyword } from "@builderbot/bot";
import { getUserInfo } from "../services/MongoDB/services/userService.js";
import { menuFlow } from "./menu.js";
import { userRegister } from "./userRegister.js";

const userInfoFlow = addKeyword("userinfo0222").addAction(
  async (ctx, { endFlow, gotoFlow, flowDynamic, provider }) => {
    const phone = ctx.from;
    try {
      const user = await getUserInfo(phone);
      if (!user || user.success === false || !user.data) return gotoFlow(userRegister);

      const { full_name, email, date_of_birth, gender, dni } = user.data;
      const [dia, mes, anio] = date_of_birth.split("/").map(Number);
      const birthDate = new Date(anio, mes - 1, dia);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

      const profile =
        "👤 *Mi Perfil*\n" +
        "━━━━━━━━━━━━━━━\n\n" +
        `📝 *Nombre:* ${full_name}\n` +
        `📧 *Email:* ${email}\n` +
        `🎂 *Edad:* ${age} años\n` +
        `📅 *Nacimiento:* ${date_of_birth}\n` +
        `👥 *Género:* ${gender}\n` +
        `📱 *Teléfono:* ${phone}\n` +
        `🆔 *DNI:* ${dni}\n\n` +
        "━━━━━━━━━━━━━━━\n";

      if (/men[uú]/i.test(ctx.body)) return gotoFlow(menuFlow);

      await provider.sendButtons(ctx.from, [{ body: "Volver al menú" }], profile);
      return endFlow();
    } catch (error) {
      console.error("Error en userInfoFlow:", error);
      await flowDynamic("❌ Error al consultar tu información. Intentá nuevamente.");
      return endFlow();
    }
  }
);

export { userInfoFlow };
