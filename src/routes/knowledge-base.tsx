import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import {
  BookOpen,
  FileText,
  UploadCloud,
  Trash2,
  CheckCircle2,
  FileUp,
  Search,
  FileType,
  Sparkles,
  Info,
  Clock,
  Database,
} from "lucide-react";
import { DashboardLayout } from "@/components/site/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/knowledge-base")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Knowledge Base — AgriSmart" },
      {
        name: "description",
        content: "Upload agriculture documents for AgriSmart AI Coach.",
      },
      { property: "og:title", content: "Knowledge Base — AgriSmart" },
      {
        property: "og:description",
        content: "Upload agriculture documents for AgriSmart AI Coach.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: KnowledgeBasePage,
});

interface KnowledgeDoc {
  id: string;
  name: string;
  size: number;
  type: "pdf" | "docx" | "doc";
  uploadedAt: string;
  category: string;
  pageCount?: number;
}

const INITIAL_SAMPLE_DOCS: KnowledgeDoc[] = [
  {
    id: "doc-1",
    name: "ICAR_Paddy_Nutrient_Management_Guide_2025.pdf",
    size: 2450000,
    type: "pdf",
    uploadedAt: "2026-08-18",
    category: "Crop Management",
    pageCount: 18,
  },
  {
    id: "doc-2",
    name: "Telangana_Black_Soil_Fertility_Benchmark.docx",
    size: 1180000,
    type: "docx",
    uploadedAt: "2026-08-19",
    category: "Soil Health",
    pageCount: 12,
  },
  {
    id: "doc-3",
    name: "Integrated_Pest_Management_Cotton_Chilli.pdf",
    size: 3820000,
    type: "pdf",
    uploadedAt: "2026-08-20",
    category: "Pest & Disease",
    pageCount: 26,
  },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>(INITIAL_SAMPLE_DOCS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadSuccessMsg(null);

    const newDocs: KnowledgeDoc[] = [];

    Array.from(files).forEach((file, index) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      const isDocType = (ext: string | undefined): ext is "pdf" | "docx" | "doc" =>
        ext === "pdf" || ext === "docx" || ext === "doc";
      const fileType: "pdf" | "docx" | "doc" = isDocType(extension) ? extension : "pdf";

      newDocs.push({
        id: `doc-${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        type: fileType,
        uploadedAt: new Date().toISOString().split("T")[0],
        category: file.name.toLowerCase().includes("soil")
          ? "Soil Health"
          : file.name.toLowerCase().includes("pest") || file.name.toLowerCase().includes("disease")
            ? "Pest & Disease"
            : file.name.toLowerCase().includes("water") || file.name.toLowerCase().includes("irrig")
              ? "Irrigation"
              : "Crop Advisory",
        pageCount: Math.floor(Math.random() * 20) + 5,
      });
    });

    setTimeout(() => {
      setDocuments((prev) => [...newDocs, ...prev]);
      setIsUploading(false);
      setUploadSuccessMsg(
        `Successfully added ${newDocs.length} document${newDocs.length > 1 ? "s" : ""} to your Knowledge Base!`,
      );
      setTimeout(() => setUploadSuccessMsg(null), 4000);
    }, 600);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // reset input value so re-uploading same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleClearAll = () => {
    setDocuments([]);
  };

  const handleRestoreSample = () => {
    setDocuments(INITIAL_SAMPLE_DOCS);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    "Crop Management",
    "Soil Health",
    "Pest & Disease",
    "Crop Advisory",
    "Irrigation",
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8" id="knowledge-base-page">
        {/* Header section */}
        <div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          id="kb-header"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                Knowledge Base
              </h1>
            </div>
            <p className="text-sm text-muted-foreground sm:text-base">
              Upload agriculture documents for AgriSmart AI Coach.
            </p>
          </div>

          {documents.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 py-1 text-xs">
                <Database className="h-3.5 w-3.5 text-primary" />
                <span>{documents.length} Files Ingested</span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Info banner */}
        <div
          id="kb-info-card"
          className="flex items-start gap-3.5 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5"
        >
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-foreground">AI Coach Knowledge Repository</p>
            <p className="leading-relaxed text-muted-foreground">
              Uploaded research papers, university extension manuals, and soil health bulletins
              provide context to the AgriSmart AI Coach for domain-specific recommendations.
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div
          id="kb-upload-card"
          className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
        >
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">Upload Agriculture Documents</h2>
            <p className="text-sm text-muted-foreground">
              Add your PDFs, Word documents, or research notes to ground the AI with local agronomic
              facts.
            </p>
          </div>

          <div
            id="kb-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all sm:p-12 ${
              isDragging
                ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                : "border-border hover:border-primary/50 hover:bg-accent/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="kb-file-input"
              multiple
              accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-105">
              {isUploading ? (
                <FileUp className="h-8 w-8 animate-bounce text-primary" />
              ) : (
                <UploadCloud className="h-8 w-8 text-primary" />
              )}
            </div>

            <h3 className="text-base font-semibold text-foreground">
              {isUploading
                ? "Uploading & processing documents..."
                : isDragging
                  ? "Drop your agriculture documents here"
                  : "Drag and drop your documents here"}
            </h3>

            <p className="mt-1.5 max-w-sm text-xs text-muted-foreground sm:text-sm">
              Supports <span className="font-medium text-foreground">PDF</span>,{" "}
              <span className="font-medium text-foreground">DOCX</span>, and{" "}
              <span className="font-medium text-foreground">DOC</span> formats (up to 25MB each)
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                id="choose-files-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2 rounded-xl px-5 py-2.5 font-medium shadow-sm"
              >
                <FileType className="h-4 w-4" />
                <span>Choose Files</span>
              </Button>
            </div>
          </div>

          {uploadSuccessMsg && (
            <div
              id="kb-upload-success"
              className="mt-4 flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-sm font-medium text-primary"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Uploaded Documents Section */}
        <div id="kb-documents-section" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Uploaded Documents</h2>
              <p className="text-sm text-muted-foreground">
                Manage files accessible to the AI Coach
              </p>
            </div>

            {documents.length > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="kb-search-input"
                    type="text"
                    placeholder="Search documents…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Category filter pills if documents exist */}
          {documents.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1" id="kb-category-pills">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Documents Grid / Empty State */}
          {documents.length === 0 ? (
            /* Empty State */
            <div
              id="kb-empty-state"
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center shadow-soft"
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-foreground mb-4">
                <BookOpen className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-foreground">
                No agriculture documents uploaded yet
              </h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Upload crop management guides, soil test benchmarks, or ICAR advisories so your AI
                Coach can answer with precision.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  id="empty-state-choose-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 rounded-xl"
                >
                  <FileUp className="h-4 w-4" />
                  <span>Choose Files</span>
                </Button>
                <Button
                  id="empty-state-sample-btn"
                  variant="outline"
                  onClick={handleRestoreSample}
                  className="gap-2 rounded-xl"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Load Sample Documents</span>
                </Button>
              </div>
            </div>
          ) : filteredDocs.length === 0 ? (
            /* Search mismatch state */
            <div
              id="kb-no-search-results"
              className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center"
            >
              <Info className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="font-semibold text-foreground">No matching documents</p>
              <p className="text-xs text-muted-foreground mt-1">
                No files match "{searchQuery}" in category "{selectedCategory}".
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-3 text-xs"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            /* Documents List */
            <div className="grid gap-3 sm:grid-cols-1" id="kb-document-list">
              {filteredDocs.map((doc) => {
                const isPdf = doc.type === "pdf";
                return (
                  <div
                    key={doc.id}
                    id={`doc-card-${doc.id}`}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-bold text-xs ${
                          isPdf
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {isPdf ? (
                          <FileText className="h-5 w-5" />
                        ) : (
                          <FileType className="h-5 w-5" />
                        )}
                      </span>

                      <div className="min-w-0 space-y-1">
                        <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                          {doc.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge
                            variant="secondary"
                            className="font-normal text-[11px] px-2 py-0.5 rounded-lg"
                          >
                            {doc.category}
                          </Badge>
                          <span className="inline-block">•</span>
                          <span>{formatFileSize(doc.size)}</span>
                          {doc.pageCount && (
                            <>
                              <span className="inline-block">•</span>
                              <span>{doc.pageCount} pages</span>
                            </>
                          )}
                          <span className="inline-block">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {doc.uploadedAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t border-border pt-3 sm:border-0 sm:pt-0">
                      <Badge
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20 text-xs gap-1 font-medium"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Indexed</span>
                      </Badge>
                      <Button
                        id={`delete-btn-${doc.id}`}
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                        aria-label={`Delete ${doc.name}`}
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
