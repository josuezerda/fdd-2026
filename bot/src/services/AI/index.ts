import OpenAI from "openai";
import { config } from "../config/index.js";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

class AIClass {
  private openAI: OpenAI;
  private model: string;

  constructor(
    apiKey: string = config.OPENAI_KEY,
    model: string = config.OPENAI_MODEL
  ) {
    this.openAI = new OpenAI({ apiKey });
    this.model = model;
  }

  async chat(prompt: string, messages: ChatMessage[]): Promise<string> {
    try {
      const completion = await this.openAI.chat.completions.create({
        model: this.model,
        messages: [{ role: "system", content: prompt }, ...messages],
      });
      return completion.choices[0]?.message?.content || "No response";
    } catch (err) {
      console.error("Error al conectar con OpenAI:", err);
      return "ERROR";
    }
  }
}

export default AIClass;
