import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "Create Your AgriSmart Account" },
      {
        name: "description",
        content:
          "Create an AgriSmart account and take the first step toward smarter, more informed farming decisions.",
      },
      { property: "og:title", content: "Create Your AgriSmart Account" },
      {
        property: "og:description",
        content: "Join AgriSmart and take the first step toward smarter farming.",
      },
    ],
  }),
  component: SignUp,
});

type Fields = { name: string; email: string; password: string; confirm: string };
type Errors = Partial<Record<keyof Fields, string>>;

function SignUp() {
  const [values, setValues] = useState<Fields>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState(false);

  const set = (key: keyof Fields) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setNotice(false);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Please enter a valid email address.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (values.confirm !== values.password) next.confirm = "Passwords don't match.";
    setErrors(next);
    setNotice(Object.keys(next).length === 0);
  };

  return (
    <AuthLayout
      title="Create Your AgriSmart Account"
      subtitle="Join AgriSmart and take the first step toward smarter farming."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            onChange={(e) => set("name")(e.target.value)}
          />
          {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            onChange={(e) => set("email")(e.target.value)}
          />
          {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={values.password}
              aria-invalid={Boolean(errors.password)}
              onChange={(e) => set("password")(e.target.value)}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={values.confirm}
              aria-invalid={Boolean(errors.confirm)}
              onChange={(e) => set("confirm")(e.target.value)}
            />
            {errors.confirm ? <p className="text-sm text-destructive">{errors.confirm}</p> : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Preferred Language (optional)</Label>
          <Select>
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="telugu">Telugu</SelectItem>
              <SelectItem value="tamil">Tamil</SelectItem>
              <SelectItem value="marathi">Marathi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Create Account
        </Button>

        <p className="text-xs leading-relaxed text-muted-foreground">
          By creating an account, you agree to our{" "}
          <span className="font-medium text-primary">Terms</span> and{" "}
          <span className="font-medium text-primary">Privacy Policy</span>.
        </p>

        {notice ? (
          <p className="rounded-xl border border-border bg-accent px-4 py-3 text-sm text-accent-foreground">
            Looks good! Account creation isn't connected yet — this screen is UI only for now.
          </p>
        ) : null}
      </form>
    </AuthLayout>
  );
}
