import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Signing you in — AgriSmart" },
      { name: "description", content: "Completing your AgriSmart sign-in." },
      { property: "og:title", content: "Signing you in — AgriSmart" },
      { property: "og:description", content: "Completing your AgriSmart sign-in." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    navigate({ to: user ? "/dashboard" : "/sign-in", replace: true });
  }, [user, loading, navigate]);

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </main>
  );
}
