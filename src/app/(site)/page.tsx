import { preload } from "react-dom";
import { getProducts } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { HomeHero } from "@/components/home/hero";
import { ProductMarquee } from "@/components/home/marquee";
import { VideoSection } from "@/components/home/video-section";
import { Stats } from "@/components/home/stats";
import { CtaBand, WhatPeopleAsk, WhatWeDo } from "@/components/home/sections";

export const metadata = pageMeta({
  title: "Socal Bioresearch: Curious about peptides? Start here.",
  description:
    "Plain language answers about peptides: what they are, how they work, and how to explore them responsibly. Talk to a real person.",
  ogTitle: "Socal Bioresearch: Curious about peptides? Start here.",
  ogDescription: "Plain language answers about peptides. Talk to a real person before you order.",
  ogImage: "og-home.jpg",
  path: "/",
});

export default async function Home() {
  preload("/hero-video-poster.jpg", { as: "image", fetchPriority: "high" });
  const products = await getProducts();
  const wellness = products.filter((p) => p.category === "wellness-longevity").slice(0, 4);
  const performance = products.filter((p) => p.category === "performance-recovery").slice(0, 4);
  return (
    <>
      <HomeHero />
      <ProductMarquee names={products.map((p) => p.name)} />
      <VideoSection
        src="/hero-video.mp4"
        poster="/hero-video-poster.jpg"
        eyebrow="02: Watch · 50 seconds"
        title="Peptides, in plain English."
        description="What a peptide actually is, why cells already makes them, and the four reasons people are talking about them right now."
      />
      <Stats />
      <WhatWeDo />
      <WhatPeopleAsk wellness={wellness} performance={performance} />
      <CtaBand />
    </>
  );
}
