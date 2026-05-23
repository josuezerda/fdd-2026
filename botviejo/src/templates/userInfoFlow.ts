import { addKeyword } from "@builderbot/bot";
import { getUserInfo } from "~/services/MongoDB/services/userService";
import { menuFlow } from "./menu";
import { userRegister } from "./userRegister";

const userInfoFlow = addKeyword("userinfo0222").addAction(
  async (ctx, { endFlow, gotoFlow, flowDynamic, provider }) => {
    const phone = ctx.from;

    try {
      // Obtener info del usuario desde MongoDB
      const user = await getUserInfo(phone);

      // Si no existe el usuario, redirigir al registro
      if (!user || user.success === false || !user.data) {
        return gotoFlow(userRegister);
      }

      const { full_name, email, date_of_birth, gender, dni } = user.data;

      // Calcular edad a partir de date_of_birth (DD/MM/YYYY)
      const [dia, mes, anio] = date_of_birth.split("/").map(Number);
      const birthDateObj = new Date(anio, mes - 1, dia);

      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDateObj.getFullYear();
      const m = today.getMonth() - birthDateObj.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        calculatedAge--;
      }

      // Construir mensaje con perfil del usuario
      const userProfile =
        "👤 *Mi Perfil* \n" +
        "━━━━━━━━━━━━━━━\n\n" +
        `📝 *Nombre:* ${full_name}\n` +
        `📧 *Email:* ${email}\n` +
        `🎂 *Edad:* ${calculatedAge} años\n` +
        `📅 *Fecha de nacimiento:* ${date_of_birth}\n` +
        `👥 *Género:* ${gender}\n` +
        `📱 *Teléfono:* ${phone}\n` +
        `🆔 *DNI:* ${dni}\n\n` +
        "━━━━━━━━━━━━━━━\n";

      // Detectar si el usuario escribió algo relacionado al menú
      const regex = /men[uú]/i;
      if (regex.test(ctx.body)) {
        return gotoFlow(menuFlow);
      }

      // Enviar mensaje con botón de volver al menú
      await provider.sendButtons(
        ctx.from,
        [{ body: "Volver al menú" }],
        userProfile
      );

      return endFlow();
    } catch (error) {
      console.error("Error en userInfoFlow:", error);

      await flowDynamic(
        "❌ *Error al consultar tu información*\n\n" +
          "Ocurrió un problema técnico. Por favor intenta nuevamente o contacta soporte.\n\n" +
          "🔄 Para reintentar: *MI PERFIL*\n" +
          "🏠 Menú principal: *MENU*"
      );

      return endFlow();
    }
  }
);

export { userInfoFlow };
