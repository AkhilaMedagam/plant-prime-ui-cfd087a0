import type { RAGChunk } from "./ragKnowledgeBase";

export const RAG_DELIMITER_START = "<!-- AGRISMART_RAG_SOURCES_START -->";
export const RAG_DELIMITER_END = "<!-- AGRISMART_RAG_SOURCES_END -->";

export function formatSourcesPayload(sources: RAGChunk[]): string {
  if (!sources || sources.length === 0) return "";
  return `\n\n${RAG_DELIMITER_START}\n${JSON.stringify(sources)}\n${RAG_DELIMITER_END}`;
}

export function parseMessageTextWithSources(rawText: string): {
  cleanText: string;
  sources: RAGChunk[];
} {
  if (!rawText) return { cleanText: "", sources: [] };

  const startIndex = rawText.indexOf(RAG_DELIMITER_START);
  if (startIndex === -1) {
    return { cleanText: rawText.trim(), sources: [] };
  }

  const cleanText = rawText.substring(0, startIndex).trim();
  const jsonContent = rawText.substring(startIndex + RAG_DELIMITER_START.length);
  const endIndex = jsonContent.indexOf(RAG_DELIMITER_END);

  const rawJson = (endIndex === -1 ? jsonContent : jsonContent.substring(0, endIndex)).trim();

  try {
    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed)) {
      return { cleanText, sources: parsed as RAGChunk[] };
    }
  } catch {
    // During active streaming partial JSON string might not be complete yet
  }

  return { cleanText, sources: [] };
}
