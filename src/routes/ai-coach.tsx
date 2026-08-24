import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AlertTriangle, BookOpen, Bot, Info, Plus, SendHorizonal } from "lucide-react";
import { DashboardLayout } from "@/components/site/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { KnowledgeSources } from "@/components/ai-elements/knowledge-sources";
import { parseMessageTextWithSources } from "@/lib/ragParser";
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
  "How can I improve my soil health and organic matter?",
  "Why is crop rotation important for pest control?",
  "What is the best way to monitor pests using surveillance?",
  "How do I correct soil acidity and pH balance?",
] as const;

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
  const { messages, sendMessage, status, error, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const handleSubmit = useCallback(
    ({ text }: { text: string }) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      void sendMessage({ text: trimmed });
    },
    [sendMessage],
  );

  const newConversation = useCallback(() => {
    stop();
    setMessages([]);
    controller.textInput.clear();
  }, [controller, setMessages, stop]);

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
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-bold leading-tight">AgriSmart AI Coach</h1>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <BookOpen className="h-3 w-3" />
                  RAG Knowledge Grounded
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                Retrieval-Augmented agricultural guidance for crops, soil, pests & weather
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
                <div className="space-y-1.5 text-center">
                  <h3 className="text-base font-semibold">AgriSmart Agricultural Coach</h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Exclusively for smart farming advice: crop care, soil health, fertilizer dosing,
                    weather protection, and pest control.
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
              messages.map((message) => {
                const partsText = Array.isArray(message.parts)
                  ? message.parts.map((part) => (part.type === "text" ? part.text : "")).join("")
                  : "";
                const rawText =
                  partsText ||
                  ("content" in message && typeof message.content === "string"
                    ? message.content
                    : "");
                if (!rawText) return null;

                const { cleanText, sources } = parseMessageTextWithSources(rawText);

                return (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      {message.role === "assistant" ? (
                        <div className="w-full space-y-2">
                          <MessageResponse>{cleanText}</MessageResponse>
                          <KnowledgeSources sources={sources} />
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{rawText}</p>
                      )}
                    </MessageContent>
                  </Message>
                );
              })
            )}

            {error ? <ErrorNotice message={error.message} /> : null}

            {status === "submitted" ? (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer as="p" className="text-sm">
                    Retrieving AgriSmart knowledge base...
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
              placeholder="Ask a farming question (crops, soil, fertilizers, pests, irrigation)…"
            />
            <PromptInputFooter className="justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" aria-hidden="true" />
                Exclusively for Smart Farming & Agriculture Guidance
              </span>
              <PromptInputSubmit status={status} onStop={stop} disabled={status === "submitted"}>
                {isLoading ? undefined : <SendHorizonal className="h-4 w-4" aria-hidden="true" />}
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-semibold">Couldn't get an answer</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {message || "Something went wrong. Please try sending your question again."}
        </p>
      </div>
    </div>
  );
}
