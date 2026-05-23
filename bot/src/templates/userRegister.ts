import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menu.js";
import { registerUser, UserServiceError } from "../services/MongoDB/services/userService.js";
import { InitialFlow } from "./InitialFlow.js";

const userRegister = addKeyword("register")
  .addAnswer(
    "🎭 ¡Hola! Bienvenido/a a la *Gran Fiesta de Disfraces FDD 2026* 🎭\n\n👋 Veo que es tu primera vez aquí. Voy a ayudarte a registrarte para vivir una noche inolvidable 🎃"
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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return ctxFn.fallBack("❌ El formato del email no es válido. Por favor ingresá un email correcto:");
      }
      ctxFn.state.update({ email });
    }
  )
  .addAnswer(
    "Excelente! 🎂\n\nAhora necesito tu *fecha de nacimiento* (formato DD/MM/AAAA):",
    { capture: true },
    async (ctx, ctxFn) => {
      const fecha = ctx.body.trim();
      const match = fecha.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (!match) return ctxFn.fallBack("❌ Formato inválido. Usá DD/MM/AAAA:");
      const [, dia, mes, anio] = match.map(Number);
      const d = new Date(anio, mes - 1, dia);
      if (d.getFullYear() !== anio || d.getMonth() !== mes - 1 || d.getDate() !== dia)
        return ctxFn.fallBack("❌ Fecha inválida. Por favor ingresá una fecha real:");
      if (d > new Date()) return ctxFn.fallBack("❌ La fecha no puede ser futura:");
      ctxFn.state.update({ date_of_birth: fecha });
    }
  )
  .addAnswer(
    "Perfecto! 📄\n\nAhora necesito tu *DNI* (solo números, sin puntos ni espacios):",
    { capture: true },
    async (ctx, ctxFn) => {
      const dni = ctx.body.trim().replace(/[.\-\s]/g, "");
      if (!/^\d+$/.test(dni)) return ctxFn.fallBack("❌ El DNI debe contener solo números:");
      if (dni.length < 6 || dni.length > 9) return ctxFn.fallBack("❌ El DNI debe tener entre 6 y 9 dígitos:");
      ctxFn.state.update({ dni });
    }
  )
  .addAnswer(
    "Perfecto! 🎭\n\nPor último, ¿cuál es tu género?\n\n1️⃣ Masculino\n2️⃣ Femenino\n3️⃣ Otro\n4️⃣ Prefiero no decir\n\n*Respondé con el número (1, 2, 3 o 4):*"
  )
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    const genderMap: Record<string, string> = {
      "1": "Masculino", "masculino": "Masculino", "m": "Masculino", "hombre": "Masculino",
      "2": "Femenino", "femenino": "Femenino", "f": "Femenino", "mujer": "Femenino",
      "3": "Otro", "otro": "Otro", "o": "Otro",
      "4": "Prefiero no decir", "prefiero no decir": "Prefiero no decir", "privado": "Prefiero no decir",
    };
    const gender = genderMap[ctx.body.toLowerCase().trim()];
    if (!gender) {
      return ctxFn.fallBack("❌ Opción no válida. Seleccioná:\n\n1️⃣ Masculino\n2️⃣ Femenino\n3️⃣ Otro\n4️⃣ Prefiero no decir");
    }

    ctxFn.state.update({ gender });
    const userData = await ctxFn.state.getMyState();

    await ctxFn.flowDynamic(
      "📋 *Resumen de tu registro:*\n\n" +
      `👤 Nombre: ${userData.full_name}\n` +
      `📧 Email: ${userData.email}\n` +
      `🎂 Nacimiento: ${userData.date_of_birth}\n` +
      `👥 Género: ${userData.gender}\n` +
      `📄 DNI: ${userData.dni}\n` +
      `📱 Teléfono: ${ctx.from}\n\n`
    );

    try {
      const result = await registerUser({
        full_name: userData.full_name,
        email: userData.email,
        gender: userData.gender,
        phone: ctx.from,
        date_of_birth: userData.date_of_birth,
        dni: userData.dni,
      });

      if (result.success) {
        await ctxFn.flowDynamic(
          `🎉 ¡Registro completado!\n\n¡*${userData.full_name}*, bienvenido/a oficialmente a la *FDD 2026*! 🎭🎃\n\n✨ Ya podés acceder a todas las funciones.`
        );
        ctxFn.state.clear();
        return ctxFn.gotoFlow(InitialFlow);
      } else {
        await ctxFn.flowDynamic("❌ " + (result.error || "Error al registrarte. Intentá nuevamente."));
        return ctxFn.endFlow();
      }
    } catch (error) {
      if (error instanceof UserServiceError) {
        await ctxFn.flowDynamic(`❌ ${error.message}`);
        ctxFn.state.clear();
        return ctxFn.endFlow();
      }
      await ctxFn.flowDynamic("❌ Error inesperado. Intentá con *REGISTER*");
      return ctxFn.endFlow();
    }
  });

const retryRegistration = addKeyword(["REGISTER", "register", "REGISTRO", "registro"]).addAnswer(
  "🔄 Perfecto, vamos a intentar el registro nuevamente.",
  null,
  async (ctx, ctxFn) => {
    ctxFn.state.clear();
    return ctxFn.gotoFlow(userRegister);
  }
);

export { userRegister, retryRegistration };
