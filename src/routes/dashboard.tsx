import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, LogOut } from "lucide-react";
import { PageContainer } from "@/components/site/PageContainer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — AgriSmart" },
      {
        name: "description",
        content: "Your AgriSmart dashboard with your account details and farming insights.",
      },
      { property: "og:title", content: "Dashboard — AgriSmart" },
      { property: "og:description", content: "Your personal AgriSmart dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type Profile = { full_name: string; email: string; phone: string };

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/sign-in", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setProfile(data as Profile);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    await signOut();
    navigate({ to: "/sign-in", replace: true });
  };

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
      </div>
    );
  }

  const name = profile?.full_name || (user.user_metadata?.["full_name"] as string) || "Farmer";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/85 backdrop-blur">
        <PageContainer>
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Leaf className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="truncate text-lg font-bold tracking-tight">AgriSmart</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} disabled={signingOut}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {signingOut ? "Signing out…" : "Sign Out"}
            </Button>
          </div>
        </PageContainer>
      </header>

      <main>
        <PageContainer className="py-10">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Welcome, {name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in to AgriSmart. Your account details are below.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p className="mt-1 font-semibold">{profile?.full_name || "—"}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="mt-1 break-words font-semibold">{profile?.email || user.email}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <p className="mt-1 font-semibold">{profile?.phone || "—"}</p>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
