import OpenAI from "openai";
import { config } from "~/config";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

class AIClass {
  private openAI: OpenAI;
  private model: string;

  constructor(apiKey: string = config.OPENAI_KEY, model: string = config.OPENAI_MODEL) {
    this.openAI = new OpenAI({
      apiKey: apiKey,
    });
    this.model = model;
  }

  async chat(prompt: string, messages: ChatMessage[]): Promise<string> {
    try {
      const completion = await this.openAI.chat.completions.create({
        model: this.model,
        messages: [{ role: "system", content: prompt }, ...messages],
      });
      
      const answer = completion.choices[0]?.message?.content || "No response";
      return answer;
    } catch (err) {
      console.error("Error al conectar con OpenAI:", err);
      return "ERROR";
    }
  }
}

export default AIClass;