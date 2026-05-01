"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What is the electoral college?",
  "How do I register to vote?",
  "What happens after polls close?",
  "How is my vote counted?",
  "What are ZK proofs in voting?",
  "Can I vote if I just moved?",
];

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery && !hasInitialized.current) {
      hasInitialized.current = true;
      handleSend(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  async function handleSend(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the chat API route (uses Gemini if configured, fallback otherwise)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response || "I couldn't process that question. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSend();
  }

  return (
    <div className="min-h-screen pt-20 flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-[var(--spacing-page)]">
        {/* Header */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-slide-up">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-3xl mb-6 glow-primary">
              ◎
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-3">
              Ask <span className="gradient-text">VoxChain</span>
            </h1>
            <p className="text-text-secondary text-center max-w-md mb-8">
              I answer questions about elections, voting processes, and civic
              participation. I help you understand — not pick a side.
            </p>

            {/* Suggested Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="glass rounded-xl px-4 py-3 text-sm text-left text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all card-hover"
                >
                  <span className="text-primary mr-2">▸</span>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 py-6 space-y-4 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-5 py-3 ${
                    msg.role === "user"
                      ? "chat-bubble-user text-white"
                      : "chat-bubble-ai text-text-primary"
                  }`}
                >
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-md gradient-primary flex items-center justify-center text-[10px]">
                        V
                      </div>
                      <span className="text-xs font-medium text-primary-light">
                        VoxChain AI
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <p
                    className={`text-[10px] mt-2 ${msg.role === "user" ? "text-white/50" : "text-text-muted"}`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="chat-bubble-ai px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md gradient-primary flex items-center justify-center text-[10px]">
                      V
                    </div>
                    <div className="flex gap-1.5">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Bar */}
        <div className="sticky bottom-0 py-4 bg-gradient-to-t from-bg-deep via-bg-deep to-transparent">
          <form onSubmit={handleSubmit}>
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-2xl gradient-primary opacity-10 group-focus-within:opacity-30 transition-opacity blur" />
              <div className="relative glass rounded-2xl flex items-center gap-2 p-2">
                <input
                  ref={inputRef}
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about elections, voting, civic processes..."
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm py-3 px-4"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="btn-primary !py-2.5 !px-5 text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  id="chat-send-btn"
                >
                  Send
                </button>
              </div>
            </div>
            <p className="text-[11px] text-text-muted text-center mt-2">
              VoxChain answers civic process questions only. Not political
              opinions.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}


export default function AskPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="typing-dot" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
