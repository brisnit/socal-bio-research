import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Socal Bioresearch: Peptides in Plain English",
  description: "Plain language peptide education for wellness, longevity, performance, and recovery questions.",
  robots: { index: true, follow: true },
  verification: { google: "7X0zbleRlpNVseC4YyubjXW8s1bz2RdFmubiXtKh1zI" },
  openGraph: { type: "website" },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Socal Bioresearch",
  url: "https://socalbioresearch.org",
  description: "Plain language peptide education for wellness, longevity, performance, and recovery questions.",
  areaServed: "US",
  knowsAbout: [
    "Peptide education",
    "GLP 1 receptor agonists",
    "Mitochondrial peptides",
    "Recovery peptides",
    "Longevity science",
  ],
};
const WEBSITE = { "@context": "https://schema.org", "@type": "WebSite", name: "Socal Bioresearch", url: "https://socalbioresearch.org" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/Logo2.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <JsonLd data={ORGANIZATION} />
        <JsonLd data={WEBSITE} />
      </head>
      <body>{children}</body>
    </html>
  );
}
