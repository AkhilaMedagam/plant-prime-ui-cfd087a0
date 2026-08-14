import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "./PageContainer";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <PageContainer>
        <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="truncate text-lg font-bold tracking-tight">AgriSmart</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="ml-3 flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="shadow-soft">
                <Link to="/sign-up">Get Started</Link>
              </Button>
            </div>
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}

          </button>
        </div>
      </PageContainer>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <PageContainer className="flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-muted-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/sign-in" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/sign-up" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </PageContainer>
        </div>
      ) : null}
    </header>
  );
}
