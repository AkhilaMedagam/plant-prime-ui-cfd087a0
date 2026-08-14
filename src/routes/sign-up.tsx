import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError, useAuth } from "@/lib/auth";

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

type Fields = { name: string; email: string; phone: string; password: string; confirm: string };
type Errors = Partial<Record<keyof Fields | "terms", string>>;

function SignUp() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [values, setValues] = useState<Fields>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [loading, user, navigate]);

  const set = (key: keyof Fields) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setFormError(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!values.phone.trim()) next.phone = "Please enter your phone number.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (values.confirm !== values.password) next.confirm = "Passwords don't match.";
    if (!terms) next.terms = "Please accept the Terms & Conditions.";
    setErrors(next);
    setFormError(null);
    setNotice(null);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: values.name.trim(),
            phone: values.phone.trim(),
          },
        },
      });

      if (error) {
        setFormError(friendlyAuthError(error.message));
        return;
      }

      if (!data.session) {
        setNotice("Almost there! Check your email to confirm your account, then sign in.");
        return;
      }

      await supabase
        .from("profiles")
        .update({
          full_name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
        })
        .eq("id", data.session.user.id);

      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      setFormError(friendlyAuthError(error instanceof Error ? error.message : null));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your AgriSmart Account"
      subtitle="Join AgriSmart and take the first step toward smarter farming."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="font-semibold text-primary hover:underline">
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

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={values.phone}
            aria-invalid={Boolean(errors.phone)}
            onChange={(e) => set("phone")(e.target.value)}
          />
          {errors.phone ? <p className="text-sm text-destructive">{errors.phone}</p> : null}
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

        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <Checkbox
              id="terms"
              checked={terms}
              onCheckedChange={(checked) => {
                setTerms(checked === true);
                setErrors((e) => ({ ...e, terms: undefined }));
              }}
            />
            <span>
              I agree to the <span className="font-medium text-primary">Terms</span> and{" "}
              <span className="font-medium text-primary">Privacy Policy</span>.
            </span>
          </label>
          {errors.terms ? <p className="text-sm text-destructive">{errors.terms}</p> : null}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Creating account…" : "Create Account"}
        </Button>

        {formError ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {formError}
          </p>
        ) : null}

        {notice ? (
          <p className="rounded-xl border border-border bg-accent px-4 py-3 text-sm text-accent-foreground">
            {notice}
          </p>
        ) : null}
      </form>
    </AuthLayout>
  );
}
