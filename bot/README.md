# FDD 2026 — Bot de WhatsApp 🎃

Bot oficial de la Fiesta de Disfraces 2026, construido con **BuilderBot** + **Meta WhatsApp API**.

## Stack
- **Framework**: [@builderbot/bot](https://builderbot.vercel.app/) v1.2.2
- **Provider**: `@builderbot/provider-meta` (WhatsApp Cloud API)
- **AI**: OpenAI GPT-4o-mini
- **DB**: MongoDB (usuarios registrados)
- **Deploy**: Railway

## Flows disponibles
| Flow | Trigger | Descripción |
|------|---------|-------------|
| `InitialFlow` | WELCOME | Primer contacto, verifica registro |
| `userRegister` | `register` | Registro nuevo usuario (nombre, email, DNI, etc.) |
| `menuFlow` | ACTION | Menú principal con lista interactiva |
| `faqFiestaFlow` | ACTION | Responde preguntas con OpenAI |
| `entradaOnlineFlow` | `entrada` / `ticket` | Info y link para comprar entradas |
| `trasladosFlow` | `traslado` / `colectivo` | Info sobre traslados al evento |
| `disfracesFlow` | `disfraz` | Info sobre concurso y categorías |
| `gamesAndRafflesFlow` | `gamesAndRafflesFlow03223` | Juegos y sorteos |
| `userInfoFlow` | `userinfo0222` | Perfil del usuario |
| `DetectIntention` | ACTION | IA detecta intención del mensaje |

## Variables de entorno (Railway)
```
NUMBER_ID=674869202387648
JWT_TOKEN=<tu_token>
VERIFY_TOKEN=disfraces
VERSION=v22.0
OPENAI_KEY=<tu_key>
OPENAI_MODEL=gpt-4o-mini
MONGO_URL_DB=<tu_mongo_url>
PORT=3030
```

## Webhook Meta
Una vez deployado en Railway, configurá en Meta:
- **Webhook URL**: `https://tu-app.railway.app/webhook`
- **Verify Token**: `disfraces`
- **Suscribite a**: `messages`

## Comandos
```bash
npm run dev    # Desarrollo con hot-reload
npm run build  # Build para producción
npm start      # Producción
```
