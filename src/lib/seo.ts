import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://socalbioresearch.org";

/** Builds route metadata in the same shape the original site's head() emitted. */
export function pageMeta({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  path,
}: {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  path: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage ? `${SITE_URL}/og/${ogImage}` : undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

