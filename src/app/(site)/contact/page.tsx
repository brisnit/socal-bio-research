import { Suspense } from "react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { OrangeWord } from "@/components/site/orange-word";
import { ContactForm, ContactFormWithSearch } from "@/components/forms/contact-form";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Talk to a real person: Socal Bioresearch",
  description:
    "Send a question about peptides: what they are, what they do, or whether they're right for you. A real person responds within a day.",
  ogTitle: "Talk to a real person: Socal Bioresearch",
  ogDescription: "Honest answers, no pressure, no script.",
  ogImage: "og-contact.jpg",
  path: "/contact",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="05: Contact"
        meta="Real humans · Real answers"
        title="Talk to"
        titleMuted={
          <>
            a <OrangeWord>real</OrangeWord> person.
          </>
        }
        description="No script. No pressure. Tell us what you're curious about and we'll get back: usually within one business day."
      />
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28 grid gap-16 md:grid-cols-12 md:gap-20">
          <Reveal className="md:col-span-4">
            <aside className="space-y-12">
              <div>
                <p className="eyebrow-mono">Direct</p>
                <p className="mt-2 text-base text-foreground">Veronica Hollis</p>
                <a
                  href="mailto:vchollis05@gmail.com"
                  className="mt-1 block text-base text-foreground break-all hover:text-primary transition-colors"
                >
                  vchollis05@gmail.com
                </a>
              </div>
              <div>
                <p className="eyebrow-mono">Response window</p>
                <p className="mt-4 text-base text-foreground leading-relaxed">Within one business day.</p>
              </div>
              <div>
                <p className="eyebrow-mono">No commitment</p>
                <p className="mt-4 text-base text-foreground leading-relaxed">
                  You don&apos;t need a lab, a credential, or a reason. If you&apos;re curious, ask.
                </p>
              </div>
            </aside>
          </Reveal>
          <Reveal delay={150} className="md:col-span-8">
            {/* Static HTML renders the form with no search params; the param-aware form replaces it on hydration. */}
            <Suspense fallback={<ContactForm />}>
              <ContactFormWithSearch />
            </Suspense>
          </Reveal>
        </div>
      </section>
    </>
  );
}
