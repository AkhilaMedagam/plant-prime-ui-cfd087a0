import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Fields = { name: string; email: string; phone: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type WebhookResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

const empty: Fields = { name: "", email: "", phone: "", message: "" };

const MAX_MESSAGE = 2000;
const N8N_WEBHOOK_URL = "https://akhila2004.app.n8n.cloud/webhook/agrismart-contact";

function validate(values: Fields): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2)
    errors.name = "Please enter your full name (at least 2 characters).";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "That email address doesn't look right.";
  if (!values.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!/^[0-9()+\-\s]{7,20}$/.test(values.phone.trim()))
    errors.phone = "Please enter a valid phone number.";
  if (values.message.trim().length < 10)
    errors.message = "Please write at least 10 characters so we can help.";
  else if (values.message.trim().length > MAX_MESSAGE)
    errors.message = `Please keep your message under ${MAX_MESSAGE} characters.`;
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof Fields) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSent(false);
    setSubmitError(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          message: values.message.trim(),
        }),
      });

      let data: WebhookResponse | null = null;
      try {
        data = (await response.json()) as WebhookResponse;
      } catch {
        // Response might be empty or non-JSON text
      }

      if (data && typeof data === "object" && data.success === false) {
        const errorMsg =
          data.message ||
          data.error ||
          "Validation failed. Please verify your details and try again.";
        setSubmitError(errorMsg);
      } else if (response.ok && (data?.success === true || !data || response.status === 200)) {
        setValues(empty);
        setSent(true);
      } else {
        setSubmitError("Unable to submit your message right now. Please try again.");
      }
    } catch (err) {
      console.error("Failed to submit contact message to n8n webhook:", err);
      setSubmitError("Unable to submit your message right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Full Name"
          placeholder="Your name"
          value={values.name}
          error={errors.name}
          onChange={set("name")}
        />
        <Field
          id="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          value={values.email}
          error={errors.email}
          onChange={set("email")}
        />
      </div>

      <Field
        id="phone"
        type="tel"
        label="Phone Number"
        placeholder="e.g. +91 98765 43210"
        value={values.phone}
        error={errors.phone}
        onChange={set("phone")}
      />

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Tell us a little more..."
          value={values.message}
          aria-invalid={Boolean(errors.message)}
          onChange={(e) => set("message")(e.target.value)}
        />
        {errors.message ? <p className="text-sm text-destructive">{errors.message}</p> : null}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
        {submitting ? "Submitting..." : "Send Message"}
      </Button>

      {sent ? (
        <p className="rounded-xl border border-border bg-accent px-4 py-3 text-sm text-accent-foreground">
          Thank you for contacting AgriSmart. Your message has been received.
        </p>
      ) : null}

      {submitError ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {submitError}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  error?: string | undefined;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
