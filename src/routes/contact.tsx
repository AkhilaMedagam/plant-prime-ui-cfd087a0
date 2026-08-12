import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessagesSquare } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageContainer } from "@/components/site/PageContainer";
import { ContactForm } from "@/components/site/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AgriSmart — Questions & Feedback" },
      {
        name: "description",
        content:
          "Get in touch with the AgriSmart team. Send a question, suggestion or feedback about the smart farming platform.",
      },
      { property: "og:title", content: "Contact AgriSmart" },
      {
        property: "og:description",
        content: "Have a question, suggestion, or feedback? We'd love to hear from you.",
      },
    ],
  }),
  component: Contact,
});

const infoCards = [
  {
    icon: Mail,
    title: "Email",
    body: "support@agrismart.example",
    note: "Placeholder address for this demo.",
  },
  { icon: MapPin, title: "Location", body: "India", note: "" },
  {
    icon: MessagesSquare,
    title: "Support",
    body: "We're here to help you learn more about AgriSmart.",
    note: "",
  },
];

function Contact() {
  return (
    <SiteLayout>
      <section className="gradient-hero">
        <PageContainer className="py-14 text-center sm:py-20">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Have a question, suggestion, or feedback? We'd love to hear from you.
          </p>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <h2 className="text-xl font-bold">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We typically reply to messages as soon as we can.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            <div className="grid content-start gap-5">
              {infoCards.map(({ icon: Icon, title, body, note }) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mt-1 break-words text-sm text-muted-foreground">{body}</p>
                  {note ? <p className="mt-2 text-xs text-muted-foreground/80">{note}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>
    </SiteLayout>
  );
}
