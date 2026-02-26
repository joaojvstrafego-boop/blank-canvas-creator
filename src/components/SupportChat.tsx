import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Msg = { role: "user" | "assistant"; content: string };

const genAI = new GoogleGenerativeAI("AIzaSyDpOSo4pWJzPBlijwN0kN9Rls5XQkwyBm0");

const SYSTEM_PROMPT = `Eres "Carmela IA", la asistente virtual experta en palomitas gourmet del curso "Palomitas Redonditas" de Carmela Vega. Respondes SIEMPRE en español latinoamericano neutro. Eres amable, profesional y apasionada por las palomitas.

REGLAS:
1. Responde SOLO sobre palomitas gourmet, negocio de palomitas, y temas del curso.
2. Si preguntan algo fuera del tema, redirige amablemente.
3. Sé práctica y da consejos accionables.
4. Usa emojis moderadamente (🍿, ✨, 💡, ✅).
5. Respuestas concisas pero completas.
6. Cuando menciones ingredientes, incluye nombres alternativos si aplica (ej: maní/cacahuate, fresa/frutilla).`;

const SupportChat = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      const content = assistantSoFar;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
        }
        return [...prev, { role: "assistant", content }];
      });
    };

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const history = newMessages.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.content }],
      }));

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: "Instrucciones del sistema: " + SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "¡Entendido! Soy Carmela IA 🍿, lista para ayudarte con todo sobre palomitas gourmet." }] },
          ...history.slice(0, -1),
        ],
      });

      const result = await chat.sendMessageStream(text);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) upsertAssistant(chunkText);
      }
    } catch (e: any) {
      console.error(e);
      let errorContent = "Lo siento, hubo un problema de conexión. Intenta de nuevo. 🍿";
      if (e?.status === 404 || e?.message?.includes("no longer available")) {
        errorContent = "⚠️ Esse modelo do Google foi descontinuado. Já atualizei para um modelo novo; recarregue a página e tente novamente.";
      } else if (e?.status === 429 || e?.message?.includes("429")) {
        errorContent = "⚠️ Se agotó la cuota de la API. Espera un momento e intenta de nuevo.";
      }
      if (assistantSoFar === "") {
        setMessages((prev) => [...prev, { role: "assistant", content: errorContent }]);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[60vh] bg-card border border-border rounded-xl overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground mb-1">¡Hola! Soy Carmela IA 🍿</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Tu asistente experta en palomitas gourmet. Pregúntame sobre recetas, técnicas, negocio, precios, empaque... ¡lo que necesites!
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[
                "¿Cómo hago el caramelo perfecto?",
                "¿Qué tipo de maíz debo usar?",
                "¿Cómo calculo mis precios?",
                "¿Cómo empaco mis palomitas?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-accent" />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta sobre palomitas gourmet..."
            className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportChat;
