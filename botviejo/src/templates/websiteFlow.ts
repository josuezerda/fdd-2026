import { addKeyword, EVENTS } from "@builderbot/bot";

export const websiteFlow = addKeyword([
  EVENTS.ACTION,
  "sitio web",
  "sitio",
  "web",
  "website",
  "página web",
  "página",
  "enlace",
  "link",
]).addAction(async (ctx, { provider}) => {
  const message = `🌐 *Sitio Web Oficial*
📰 Aquí puedes acceder a nuestro sitio web oficial

`;

  const urlButton = {
    body: "Ir al Sitio!",
    url: "https://fiestadedisfracesfdz.com.ar/",
    text: "📰 ¡Ir al Sitio!",
  };
// Botón para volver al menú
      await provider.sendButtons(
        ctx.from,
        [{ body: "Volver al menú" }],
        "¿Querés volver al menú principal?"
      );
  await provider.sendButtonUrl(ctx.from, urlButton, message);
});
