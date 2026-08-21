import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Bot,
  CloudSun,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Settings,
  Sprout,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/use-profile";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/crops", label: "Crops", icon: Sprout },
  { to: "/soil", label: "Soil", icon: Leaf },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/ai-coach", label: "AI Coach", icon: Bot },
  { to: "/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function initialsOf(name: string, email: string) {
  const base = name.trim() || email.trim();
  if (!base) return "AS";
  const parts = base.split(/[\s@.]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "A").concat(parts[1]?.[0] ?? "").toUpperCase();
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { fullName, email, avatarUrl } = useProfile();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/sign-in", replace: true });
  }, [loading, user, navigate]);

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

  const navLinks = (onClick?: () => void) =>
    navItems.map((item) => (
      <Link
        key={item.to}
        to={item.to}
        onClick={onClick}
        activeProps={{ className: "bg-accent text-accent-foreground" }}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
      >
        <item.icon className="h-4 w-4" aria-hidden="true" />
        {item.label}
      </Link>
    ));

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="truncate text-lg font-bold tracking-tight">AgriSmart</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">{navLinks()}</nav>
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {signingOut ? "Signing out…" : "Sign Out"}
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border lg:hidden"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <span className="truncate text-base font-bold tracking-tight lg:hidden">
                AgriSmart
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 transition-colors hover:bg-accent/60"
                  aria-label="Account menu"
                >
                  <Avatar className="h-8 w-8">
                    {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName || email} /> : null}
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {initialsOf(fullName, email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:block">
                    {fullName || email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="space-y-0.5">
                  <p className="truncate text-sm font-semibold">{fullName || "Your account"}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground">{email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4" aria-hidden="true" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} disabled={signingOut}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {signingOut ? "Signing out…" : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {open ? (
            <div className="border-t border-border bg-background lg:hidden">
              <nav className="flex flex-col gap-1 p-3">
                {navLinks(() => setOpen(false))}
                <Button
                  variant="outline"
                  className="mt-2 w-full justify-start gap-3"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {signingOut ? "Signing out…" : "Sign Out"}
                </Button>
              </nav>
            </div>
          ) : null}
        </header>

        <main className={cn("px-4 py-8 sm:px-6 lg:px-8")}>{children}</main>
      </div>
    </div>
  );
}
