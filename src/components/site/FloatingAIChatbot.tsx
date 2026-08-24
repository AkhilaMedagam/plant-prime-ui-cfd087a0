import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { Bot, X, Send, Loader2, BookOpen } from "lucide-react";
import { queryAgriSmartRAG, type RAGChunk } from "@/lib/ragKnowledgeBase";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  chunks?: RAGChunk[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-msg",
    sender: "assistant",
    text: "👋 **Hello! I am your AgriSmart AI Assistant.**\n\nAsk me questions about crops, soil, diseases, farming, weather, and other agricultural topics.",
  },
];

export function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever messages change or loading starts
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when opened on desktop
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = inputMessage.trim();
    if (!trimmed || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Execute the required AgriSmart RAG Flow:
      // User Question -> Semantic Retrieval -> Retrieve Top Knowledge Chunks -> Grounded RAG Answer Function -> Return Answer
      const result = queryAgriSmartRAG(trimmed);

      // Artificial micro-delay (300ms) for natural responsive feeling
      await new Promise((resolve) => setTimeout(resolve, 300));

      const assistantMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: result.answer,
        chunks: result.chunks,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "assistant",
          text: "An error occurred while retrieving agricultural guidance. Please try again with a specific farming question.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen ? (
          <button
            id="open-floating-ai-assistant-btn"
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open AgriSmart AI Assistant"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
            <Bot className="h-7 w-7 transition-transform group-hover:scale-110" />
            <span className="sr-only">Open AgriSmart AI Assistant</span>
          </button>
        ) : null}
      </div>

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div
          id="floating-ai-assistant-window"
          role="dialog"
          aria-label="AgriSmart AI Assistant"
          className="fixed bottom-5 right-5 z-50 flex h-[520px] max-h-[calc(100vh-2.5rem)] w-[calc(100vw-2.5rem)] sm:w-[380px] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-emerald-500/30 bg-background shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95"
        >
          {/* 1. Header with Title & Close Button */}
          <div className="flex items-center justify-between border-b border-border bg-emerald-950/10 dark:bg-emerald-950/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-bold leading-tight text-foreground">
                    AgriSmart AI Assistant
                  </h2>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Online" />
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <BookOpen className="h-2.5 w-2.5 text-emerald-600" />
                  RAG Knowledge Grounded
                </p>
              </div>
            </div>

            <button
              id="close-floating-ai-assistant-btn"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI Assistant"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 2. Message Area (Compact & Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs bg-muted/15">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-xs shadow-xs"
                      : "bg-card text-card-foreground border border-border/80 rounded-tl-xs shadow-2xs space-y-1.5"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                  {/* Knowledge source pill if answer is grounded */}
                  {msg.chunks && msg.chunks.length > 0 && (
                    <div className="pt-1 mt-1 border-t border-border/40 flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                      <BookOpen className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        Source: {msg.chunks.map((c) => c.title).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 6. Loading Indicator */}
            {isLoading && (
              <div className="flex items-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-xs border border-border/80 bg-card px-3.5 py-2.5 text-xs text-muted-foreground shadow-2xs flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                  <span>AI Assistant is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 4. Message Input & 5. Send Button */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 border-t border-border bg-card p-2.5"
          >
            <input
              ref={inputRef}
              id="floating-ai-assistant-input"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask your farming question..."
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />
            <button
              id="floating-ai-assistant-send-btn"
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              aria-label="Send farming question"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-all hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
