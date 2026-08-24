import { useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, ChevronUp, FileText, Tag } from "lucide-react";
import type { RAGChunk } from "@/lib/ragKnowledgeBase";

interface KnowledgeSourcesProps {
  sources: RAGChunk[];
}

function formatChunkLabel(chunk: RAGChunk): string {
  const match = chunk.chunk_id.match(/\d+/);
  const num = match ? parseInt(match[0], 10) : "";
  const prefix = num ? `Chunk ${num} — ` : "";
  return `${prefix}${chunk.title}`;
}

export function KnowledgeSources({ sources }: KnowledgeSourcesProps) {
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [expandedChunkId, setExpandedChunkId] = useState<string | null>(null);

  if (!sources || sources.length === 0) {
    return null;
  }

  const toggleSourceCard = (chunkId: string) => {
    setExpandedChunkId((prev) => (prev === chunkId ? null : chunkId));
  };

  return (
    <div
      id="knowledge-used-container"
      className="mt-4 overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/5 dark:bg-emerald-950/20 transition-all duration-200"
    >
      {/* Collapsible Header */}
      <button
        id="toggle-knowledge-used-btn"
        type="button"
        onClick={() => setIsSectionOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-xs font-semibold text-emerald-900 dark:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
        aria-expanded={isSectionOpen}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="flex items-center gap-1.5">
            <span>📚 Knowledge Used</span>
            <span className="text-muted-foreground font-normal">·</span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
              {sources.length} {sources.length === 1 ? "source" : "sources"}
            </span>
          </span>
        </div>

        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
          <span>{isSectionOpen ? "Hide" : "View"}</span>
          {isSectionOpen ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </span>
      </button>

      {/* Expanded Knowledge Sources Section */}
      {isSectionOpen && (
        <div className="space-y-2 border-t border-emerald-500/15 bg-background/50 p-3">
          <p className="text-[11px] text-muted-foreground">
            The response above was generated using the following verified AgriSmart agricultural
            knowledge chunks:
          </p>

          <div className="space-y-2">
            {sources.map((chunk) => {
              const isExpanded = expandedChunkId === chunk.chunk_id;
              const formattedTitle = formatChunkLabel(chunk);

              return (
                <div
                  key={chunk.chunk_id}
                  id={`chunk-card-${chunk.chunk_id}`}
                  className="rounded-lg border border-border/80 bg-card transition-all duration-150 overflow-hidden shadow-xs hover:border-emerald-500/40"
                >
                  {/* Card Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleSourceCard(chunk.chunk_id)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="truncate font-semibold text-foreground">
                        {formattedTitle}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="hidden sm:inline-flex rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {chunk.topic}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-border/60 bg-muted/20 p-3 text-xs space-y-2.5">
                      <div>
                        <span className="font-semibold text-muted-foreground block text-[11px] mb-0.5">
                          Topic:
                        </span>
                        <p className="font-medium text-foreground">{chunk.topic}</p>
                      </div>

                      <div>
                        <span className="font-semibold text-muted-foreground block text-[11px] mb-0.5">
                          Content:
                        </span>
                        <p className="text-muted-foreground leading-relaxed bg-background/80 rounded-md p-2.5 border border-border/40 whitespace-pre-wrap">
                          {chunk.content}
                        </p>
                      </div>

                      {chunk.keywords && chunk.keywords.length > 0 && (
                        <div>
                          <span className="font-semibold text-muted-foreground flex items-center gap-1 text-[11px] mb-1.5">
                            <Tag className="h-3 w-3" aria-hidden="true" />
                            Keywords:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {chunk.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
