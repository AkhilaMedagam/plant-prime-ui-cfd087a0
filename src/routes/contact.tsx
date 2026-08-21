import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessagesSquare, ExternalLink, Navigation } from "lucide-react";
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
    note: "Feel free to reach out anytime.",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    body: "T-Hub, Phase 2, Inorbit Mall Rd, Knowledge City, Madhapur, Hyderabad, Telangana 500081",
    note: "India's Innovation & AgTech Ecosystem Hub",
  },
  {
    icon: MessagesSquare,
    title: "Support & Inquiries",
    body: "We're here to help farmers and partners learn more about AgriSmart.",
    note: "Monday to Saturday, 9:00 AM – 6:00 PM IST",
  },
];

function Contact() {
  return (
    <SiteLayout>
      <section className="gradient-hero" id="contact-hero">
        <PageContainer className="py-14 text-center sm:py-20">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Have a question, partnership inquiry, or feedback on our agricultural intelligence
            tools? We'd love to hear from you.
          </p>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20" id="contact-content-section">
        <PageContainer className="space-y-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div
              id="contact-form-container"
              className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
            >
              <h2 className="text-xl font-bold">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We typically reply to messages as soon as we can.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            <div className="grid content-start gap-5" id="contact-info-cards">
              {infoCards.map(({ icon: Icon, title, body, note }) => (
                <div
                  key={title}
                  id={`contact-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                >
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

          {/* Google Maps Location Section */}
          <div
            id="t-hub-map-section"
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <h2 className="text-lg font-bold sm:text-xl">Our Office Location</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  T-Hub, 2.0, Inorbit Mall Rd, Knowledge City, Madhapur, Hyderabad, Telangana 500081
                </p>
              </div>

              <a
                id="get-directions-btn"
                href="https://www.google.com/maps/search/?api=1&query=T-Hub+Hyderabad+Madhapur"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Directions</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            </div>

            <div className="relative h-[380px] w-full sm:h-[450px]">
              <iframe
                id="t-hub-google-map-iframe"
                title="T-Hub Hyderabad Location Map"
                src="https://maps.google.com/maps?q=T-Hub%20Phase%202%20Hyderabad%20Telangana&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </PageContainer>
      </section>
    </SiteLayout>
  );
}
