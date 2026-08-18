import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AlertTriangle, Bot, Info, Plus, SendHorizonal } from "lucide-react";
import { DashboardLayout } from "@/components/site/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const Route = createFileRoute("/ai-coach")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "AI Coach — AgriSmart" },
      {
        name: "description",
        content: "Ask AgriSmart's AI Coach for guidance on crops, soil, weather and pests.",
      },
      { property: "og:title", content: "AI Coach — AgriSmart" },
      {
        property: "og:description",
        content: "Ask AgriSmart's AI Coach for guidance on crops, soil, weather and pests.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

const SUGGESTED_QUESTIONS = [
  "What crops grow best in my region this season?",
  "How can I improve my soil's nitrogen levels naturally?",
  "When should I water my fields during a dry week?",
  "Which pests commonly affect tomato plants in summer?",
] as const;

function makeMessage(role: UIMessage["role"], text: string): UIMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    parts: [{ type: "text", text }],
  };
}

function Page() {
  return (
    <DashboardLayout>
      <PromptInputProvider>
        <AICoach />
      </PromptInputProvider>
    </DashboardLayout>
  );
}

function AICoach() {
  const controller = usePromptInputController();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");

  // No AI backend is connected yet. Sending a message records the question and
  // replies with a clear "service not connected" notice instead of a fake answer.
  // When a real LLM is wired up (e.g. via /api/chat + useChat), replace this body.
  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage = makeMessage("user", trimmed);
    const notice = makeMessage(
      "assistant",
      "AI service is not connected yet.",
    );
    setMessages((prev) => [...prev, userMessage, notice]);
    setStatus("error");
  }, []);

  const handleSubmit = useCallback(
    ({ text }: { text: string }) => {
      sendMessage(text);
    },
    [sendMessage],
  );

  const newConversation = useCallback(() => {
    setMessages([]);
    setStatus("ready");
    controller.textInput.clear();
  }, [controller]);

  const isEmpty = messages.length === 0;
  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="mx-auto flex h-[calc(100dvh-8rem)] min-h-[26rem] w-full max-w-4xl flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold leading-tight">
                AgriSmart AI Coach
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                Smart farming guidance, on demand
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={newConversation}
            disabled={isEmpty && status !== "error"}
            className="shrink-0 gap-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">New conversation</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* Conversation */}
        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="px-3 py-6 sm:px-4">
            {isEmpty ? (
              <ConversationEmptyState>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Bot className="h-7 w-7" aria-hidden="true" />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold">
                    Ask the AgriSmart AI Coach
                  </h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Get guidance on crops, soil health, weather planning and pest
                    control. Start with a suggested question or ask your own.
                  </p>
                </div>
                <div className="mt-2 grid w-full max-w-lg gap-2 sm:grid-cols-2">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => controller.textInput.setInput(question)}
                      className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-accent/60"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap break-words">
                        {message.parts
                          .map((part) =>
                            part.type === "text" ? part.text : "",
                          )
                          .join("")}
                      </p>
                    ) : (
                      <NotConnectedNotice />
                    )}
                  </MessageContent>
                </Message>
              ))
            )}

            {isLoading ? (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer as="p" className="text-sm">
                    Thinking...
                  </Shimmer>
                </MessageContent>
              </Message>
            ) : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Composer */}
        <div className="shrink-0 border-t border-border p-3 sm:p-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              autoFocus
              placeholder="Ask about crops, soil, weather, pests…"
            />
            <PromptInputFooter className="justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" aria-hidden="true" />
                AI service is not connected yet
              </span>
              <PromptInputSubmit status={status} disabled={isLoading}>
                <SendHorizonal className="h-4 w-4" aria-hidden="true" />
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

function NotConnectedNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-4">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-semibold">AI service is not connected yet</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          AgriSmart AI Coach is still being prepared. Your question was noted, but
          no answer could be generated yet. Please check back soon — farming
          guidance will appear here once the AI service is connected.
        </p>
      </div>
    </div>
  );
}
