import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/site/DashboardLayout";

export const Route = createFileRoute("/weather")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Weather — AgriSmart" },
      { name: "description", content: "Localised weather forecasts for your farm are coming soon." },
      { property: "og:title", content: "Weather — AgriSmart" },
      { property: "og:description", content: "Localised weather forecasts for your farm are coming soon." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Weather</h1>
        <p className="mt-2 text-sm text-muted-foreground">Localised weather forecasts for your farm are coming soon.</p>
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">This section is not available yet.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
