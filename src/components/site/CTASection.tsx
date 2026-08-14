import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageContainer } from "./PageContainer";

export function CTASection({
  title = "Ready to Farm Smarter?",
  description = "Start exploring AgriSmart and discover a simpler way to access useful agricultural insights.",
  buttonLabel = "Get Started",
}: {
  title?: string;
  description?: string;
  buttonLabel?: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <PageContainer>
        <div className="gradient-cta relative overflow-hidden rounded-3xl px-6 py-14 text-center shadow-lift sm:px-12">
          <div className="leaf-grid pointer-events-none absolute inset-0 opacity-15" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-2xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-primary-foreground/85">
              {description}
            </p>
            <div className="mt-8">
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link to="/sign-up">{buttonLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
