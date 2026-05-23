import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menu";
import {
  registerUser,
  UserServiceError,
} from "~/services/MongoDB/services/userService";
import { config } from "~/config";
import { InitialFlow } from "./InitialFlow";

const userRegister = addKeyword("register")
  .addAnswer(
    "🎭 ¡Hola! Bienvenido/a a la Gran Fiesta de Disfraces 🎭\n\n👋 Veo que es tu primera vez aquí. No te preocupes, te ayudo a registrarte para vivir una noche inolvidable."
  )
  .addAnswer("Por favor, dime tu *nombre completo*:")
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    ctxFn.state.update({ full_name: ctx.body });
  })
  .addAnswer(
    "¡Perfecto! 🎉\n\nAhora necesito tu *correo electrónico*:",
    { capture: true },
    async (ctx, ctxFn) => {
      const email = ctx.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ctxFn.fallBack(
          "❌ El formato del email no es válido. Por favor ingresa un email correcto:"
        );
      }
      ctxFn.state.update({ email: email });
    }
  )
  .addAnswer(
    "Excelente! 🎂\n\nAhora necesito tu *fecha de nacimiento* (formato DD/MM/AAAA):",
    { capture: true },
    async (ctx, ctxFn) => {
      const fecha = ctx.body.trim();
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = fecha.match(regex);

      if (!match) {
        return ctxFn.fallBack(
          "❌ Formato inválido. Por favor ingresa tu fecha de nacimiento como DD/MM/AAAA:"
        );
      }

      const dia = parseInt(match[1]);
      const mes = parseInt(match[2]) - 1;
      const anio = parseInt(match[3]);
      const dateObj = new Date(anio, mes, dia);

      if (
        dateObj.getFullYear() !== anio ||
        dateObj.getMonth() !== mes ||
        dateObj.getDate() !== dia
      ) {
        return ctxFn.fallBack(
          "❌ Fecha inválida. Por favor ingresa una fecha real como DD/MM/AAAA:"
        );
      }

      const hoy = new Date();
      if (dateObj > hoy) {
        return ctxFn.fallBack(
          "❌ La fecha de nacimiento no puede ser futura. Por favor ingresa una fecha válida:"
        );
      }

      ctxFn.state.update({ date_of_birth: fecha });
    }
  )
  .addAnswer(
    "Perfecto! 📧\n\nAhora necesito tu *DNI* (solo números, sin puntos ni espacios):",
    { capture: true },
    async (ctx, ctxFn) => {
      const dni = ctx.body.trim();
      const cleanDNI = dni.replace(/[.\-\s]/g, "");

      if (!/^\d+$/.test(cleanDNI)) {
        return ctxFn.fallBack(
          "❌ El DNI debe contener solo números. Por favor ingresa tu DNI sin puntos, guiones ni espacios:"
        );
      }

      if (cleanDNI.length < 6 || cleanDNI.length > 9) {
        return ctxFn.fallBack(
          "❌ El DNI debe tener entre 6 y 9 dígitos. Por favor verifica e ingresa tu DNI nuevamente:"
        );
      }

      ctxFn.state.update({ dni: cleanDNI });
    }
  )
  .addAnswer(
    "Perfecto! 🎂\n\nPor último, ¿cuál es tu género?\n\n" +
      "1️⃣ Masculino\n" +
      "2️⃣ Femenino\n" +
      "3️⃣ Otro\n" +
      "4️⃣ Prefiero no decir\n\n" +
      "*Responde con el número (1, 2, 3 o 4):*"
  )
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    let gender;
    const response = ctx.body.toLowerCase().trim();

    switch (response) {
      case "1":
      case "masculino":
      case "hombre":
      case "m":
        gender = "Masculino";
        break;
      case "2":
      case "femenino":
      case "mujer":
      case "f":
        gender = "Femenino";
        break;
      case "3":
      case "otro":
      case "o":
        gender = "Otro";
        break;
      case "4":
      case "prefiero no decir":
      case "no decir":
      case "privado":
        gender = "Prefiero no decir";
        break;
      default:
        return ctxFn.fallBack(
          "❌ Opción no válida. Por favor selecciona:\n\n" +
            "1️⃣ Masculino\n" +
            "2️⃣ Femenino\n" +
            "3️⃣ Otro\n" +
            "4️⃣ Prefiero no decir"
        );
    }

    ctxFn.state.update({ gender: gender });

    const userData = await ctxFn.state.getMyState();

    await ctxFn.flowDynamic(
      "📋 *Resumen de tu registro:*\n\n" +
        `👤 Nombre: ${userData.full_name}\n` +
        `📧 Email: ${userData.email}\n` +
        `🎂 Fecha de nacimiento: ${userData.date_of_birth}\n` +
        `👥 Género: ${userData.gender}\n` +
        `📄 DNI: ${userData.dni}\n` +
        `📱 Teléfono: ${ctx.from}\n\n`
    );

    try {
      const userInfo = {
        full_name: userData.full_name,
        email: userData.email,
        gender: userData.gender,
        phone: ctx.from,
        date_of_birth: userData.date_of_birth,
        dni: userData.dni,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await registerUser(userInfo);

      if (result.success) {
        const message =
          "🎉 ¡Registro completado exitosamente!\n\n" +
          `¡${userData.full_name}! 🎉 Tu registro fue exitoso. Bienvenido/a oficialmente a la Fiesta de Disfraces 🎉\n\n` +
          "✨ Ahora puedes acceder a todas nuestras funciones y servicios.\n\n";

        await ctxFn.flowDynamic(message);
        ctxFn.state.clear();

        return ctxFn.gotoFlow(InitialFlow);
      } else {
        await ctxFn.flowDynamic(
          "❌ " +
            (result.error ||
              "Hubo un error al registrarte. Por favor intenta nuevamente más tarde.")
        );
        return ctxFn.endFlow();
      }
    } catch (error) {
      if (error instanceof UserServiceError) {
        await ctxFn.flowDynamic(`❌ ${error.message}`);
        await ctxFn.flowDynamic(
          "\n🔄 *¿Quieres intentar de nuevo?*\n\n" +
            "✅ Escribe *REGISTER* o *REGISTRO* para volver a registrarte\n" +
            "❌ O simplemente escribe cualquier otra cosa para salir"
        );
        ctxFn.state.clear();
        return ctxFn.endFlow();
      }

      await ctxFn.flowDynamic(
        "❌ Ocurrió un error inesperado al registrarte.\n\n" +
          "🔄 Por favor intenta nuevamente escribiendo *REGISTER*"
      );
      return ctxFn.endFlow();
    }
  });

const retryRegistration = addKeyword([
  "REGISTER",
  "register",
  "REGISTRO",
  "registro",
]).addAnswer(
  "🔄 Perfecto, vamos a intentar el registro nuevamente.\n\nAsegúrate de usar datos diferentes si el anterior falló.",
  null,
  async (ctx, ctxFn) => {
    ctxFn.state.clear();
    return ctxFn.gotoFlow(userRegister);
  }
);

export { userRegister, retryRegistration };
