import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Leaf, Linkedin, Twitter } from "lucide-react";
import { PageContainer } from "./PageContainer";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/signin", label: "Sign In" },
  { to: "/signup", label: "Sign Up" },
] as const;

const socials = [
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <PageContainer className="py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Leaf className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="truncate text-lg font-bold">AgriSmart</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-primary">
              Smart Farming, Better Future.
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              An AI-powered platform designed to support smarter, more informed, and sustainable
              farming decisions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Navigation</h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Follow</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  aria-label={`${label} (coming soon)`}
                  title={`${label} (coming soon)`}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Social profiles coming soon.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            © 2026 AgriSmart. All rights reserved.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
