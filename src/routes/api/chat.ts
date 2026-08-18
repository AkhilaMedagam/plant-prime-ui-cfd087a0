import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are AgriSmart AI Coach, a friendly and practical farming advisor.
Help farmers with crops, soil health, irrigation, weather planning, pests and diseases, and market timing.
Give concise, actionable guidance in plain language. Use short paragraphs or bullet points.
Ask a brief clarifying question when region, crop or season materially changes the answer.
If a question is outside farming, say so briefly and steer back to agriculture.
Never give medical, legal, or financial advice, and remind users to follow local regulations for chemicals.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "AI is not configured." }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }

        const body = (await request.json()) as { messages?: UIMessage[] };
        const messages = body.messages ?? [];

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(apiKey, initialRunId);

        const result = streamText({
          model: gateway("google/gemini-3.7-flash"),
          system: SYSTEM_PROMPT,
          messages: convertToModelMessages(messages),
          abortSignal: request.signal,
        });

        const response = result.toUIMessageStreamResponse({
          headers: getLovableAiGatewayResponseHeaders(undefined, {
            ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
          }),
        });

        return withLovableAiGatewayRunIdHeader(response, gateway);
      },
    },
  },
});
