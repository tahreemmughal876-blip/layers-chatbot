import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { sendMessage as sendGeminiMessage } from "../gemini/gemini";
import { sendMessage as sendOpenAiMessage } from "../openai/openai";

const QUICK_PROMPTS = [
  "What cakes do you have?",
  "What flavors of cupcakes?",
  "How much is a 9 inch chocolate cake?",
  "What's your delivery time?",
];

const PROVIDERS = {
  gemini: { label: "Gemini", send: sendGeminiMessage },
  openai: { label: "OpenAI", send: sendOpenAiMessage },
};

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to Layers Bakery! Ask me about our cakes, flavors, or prices.",
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [provider, setProvider] = useState("gemini");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async (text) => {
    const nextMessages = [...messages, { sender: "user", text }];
    setMessages(nextMessages);
    setTyping(true);

    try {
      // Give the model a little short-term memory of the conversation.
      const history = nextMessages.slice(0, -1).map((m) => ({
        role: m.sender === "bot" ? "assistant" : "user",
        content: m.text,
      }));

      const reply = await PROVIDERS[provider].send(text, history);

      setTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (error) {
      console.log(error);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ " + (error.response?.data?.error || error.message),
        },
      ]);
    }
  };

  return (
    <div className="w-full max-w-md h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
      {/* Header, styled like a bakery awning */}
      <div className="relative bg-[#3C2A21] text-[#FBF3E7] px-5 pt-5 pb-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#F5C563] flex items-center justify-center text-2xl shrink-0">
              🥐
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold tracking-wide">
                Layers Bakery
              </h1>
              <p className="text-xs text-[#F5C563]">AI Assistant • Online</p>
            </div>
          </div>

          {/* Model switch */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex bg-[#2B1D16] rounded-full p-1 text-xs">
              {Object.entries(PROVIDERS).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setProvider(key)}
                  disabled={typing}
                  className={[
                    "px-3 py-1 rounded-full transition-colors disabled:opacity-50",
                    provider === key
                      ? "bg-[#F5C563] text-[#3C2A21] font-medium"
                      : "text-[#FBF3E7]/70 hover:text-[#FBF3E7]",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#FBF3E7]/50 text-right max-w-[140px] leading-tight">
              Needs both VITE_GEMINI_API_KEY and VITE_OPENAI_API_KEY set in
              .env.local
            </p>
          </div>
        </div>
        <div className="awning-scallop" />
      </div>

      {/* Quick prompts */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-[#FBF3E7] border-b border-[#F0E2C8] scrollbar-none">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={typing}
            className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full bg-white border border-[#E8D9BE] text-[#6B5B4E] hover:bg-[#F5C563]/30 disabled:opacity-50 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto bg-[#FBF3E7] p-4">
        {messages.map((msg, index) => (
          <Message
            key={index}
            sender={msg.sender}
            text={msg.text}
          />
        ))}

        {typing && (
          <div className="flex justify-start mb-3">
            <div className="bg-[#FFFBF3] border border-[#F0E2C8] px-4 py-2 rounded-2xl rounded-bl-sm shadow-md text-sm text-[#6B5B4E]">
              🍰 typing…
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <ChatInput
        onSend={handleSend}
        disabled={typing}
      />
    </div>
  );
}
