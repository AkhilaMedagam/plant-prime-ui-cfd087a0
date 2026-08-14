import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign In — AgriSmart" },
      {
        name: "description",
        content: "Sign in to AgriSmart to continue exploring crop, soil, weather and market insights.",
      },
      { property: "og:title", content: "Sign In — AgriSmart" },
      { property: "og:description", content: "Sign in to continue to AgriSmart." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [notice, setNotice] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Please enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    setNotice(Object.keys(next).length === 0);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to AgriSmart."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/sign-up" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            aria-invalid={Boolean(errors.email)}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            aria-invalid={Boolean(errors.password)}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password ? <p className="text-sm text-destructive">{errors.password}</p> : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox id="remember" />
            Remember me
          </label>
          <span className="cursor-not-allowed text-sm font-medium text-primary">
            Forgot Password?
          </span>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Sign In
        </Button>

        {notice ? (
          <p className="rounded-xl border border-border bg-accent px-4 py-3 text-sm text-accent-foreground">
            Looks good! Accounts aren't connected yet — this screen is UI only for now.
          </p>
        ) : null}
      </form>
    </AuthLayout>
  );
}
