import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import authImage from "@/assets/auth-side.jpg";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">AgriSmart</span>
          </Link>

          <h1 className="mt-9 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img
          src={authImage}
          alt="Green seedling growing in rich soil"
          width={900}
          height={1400}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="gradient-cta absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="text-2xl font-bold text-primary-foreground">
            Smart Farming, Better Future.
          </p>
          <p className="mt-2 max-w-sm text-sm text-primary-foreground/85">
            Crop, soil, weather, disease and market insights in one simple platform.
          </p>
        </div>
      </div>
    </div>
  );
}
