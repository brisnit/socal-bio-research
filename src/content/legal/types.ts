// Shapes for legal page copy (kept as data so it can become admin-editable).

export type LegalClause = { n: string; title: string; summary: string; clause: string };

export type LegalPolicy = {
  hero: { eyebrow: string; meta: string; title: string; titleMuted?: string; description: string };
  /** Optional callout rendered above the sections (Disclaimer only). */
  notice?: { label: string; body: string };
  sections: LegalClause[];
  /** Closing line: `{lead} <Link>{link}</Link> {trail}`. */
  footer: { lead: string; link: string; trail: string };
};

export type LegalHubCard = { n: string; title: string; to: string; summary: string };

export type LegalHub = {
  hero: { eyebrow: string; meta: string; title: string; titleMuted: string; description: string };
  cards: LegalHubCard[];
  contact: { eyebrow: string; lead: string; link: string; trail: string };
};
