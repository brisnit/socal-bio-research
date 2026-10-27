import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { OrangeWord } from "@/components/site/orange-word";
import { NewCustomerForm } from "@/components/forms/new-customer-form";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "New here?: Socal Bioresearch",
  description:
    "New to peptides? Tell us a bit about yourself and we'll help you get started: honestly, with no pressure.",
  ogTitle: "New here?: Socal Bioresearch",
  ogDescription: "Plain language intro for people new to peptides.",
  ogImage: "og-new-customer.jpg",
  path: "/new-customer",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="06: New here?"
        meta="Plain language · No pressure"
        title="New to"
        titleMuted={
          <>
            <OrangeWord>peptides</OrangeWord>?
          </>
        }
        description="Share a few details so we know who we're talking to. We'll get back personally: no automated drip, no sales script."
      >
        <Link
          href="/contact"
          className="group inline-flex items-center justify-between gap-8 border-b border-foreground pb-3 text-[15px] font-medium hover:opacity-70 transition-opacity"
        >
          <span>Just have a question? Ask instead</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </PageHero>
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28 grid gap-16 md:grid-cols-12 md:gap-20">
          <Reveal className="md:col-span-4">
            <aside className="space-y-12">
              <div>
                <p className="eyebrow-mono">What we ask for</p>
                <p className="mt-4 text-base text-foreground leading-relaxed">
                  Your name, contact, and where to ship. Used only to fulfill orders and stay in touch.
                </p>
              </div>
              <div>
                <p className="eyebrow-mono">Before you order</p>
                <p className="mt-4 text-base text-foreground leading-relaxed">
                  Tell us what you need and ask questions first. We will respond clearly before anything moves forward.
                </p>
              </div>
              <div>
                <p className="eyebrow-mono">Response window</p>
                <p className="mt-4 text-base text-foreground leading-relaxed">Within one business day.</p>
              </div>
            </aside>
          </Reveal>
          <Reveal delay={150} className="md:col-span-8">
            <NewCustomerForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
