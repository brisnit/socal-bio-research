// Product catalog, extracted verbatim from the original site bundle.
// This is the seed/default content; the admin dashboard can override it via Supabase.

export type CategoryKey = "wellness-longevity" | "performance-recovery";

export type Reference = { title: string; source: string; year: number; url: string };

export type Product = {
  slug: string;
  name: string;
  category: CategoryKey;
  tagline: string;
  summary: string;
  mechanism: string;
  researchAreas: string[];
  purity: string;
  references: Reference[];
};

export type Coa = { label: string; purity: string; image: string };

export type ProductSpecs = {
  cas?: string;
  molecularWeight?: string;
  molecularFormula?: string;
  sequence?: string;
  form?: string;
  storage?: string;
  productImage?: string;
  coas?: Coa[];
};

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  "wellness-longevity": "Wellness & Longevity",
  "performance-recovery": "Performance & Recovery"
};

export const PRODUCTS: Product[] = [
  {
    "slug": "glp-1",
    "name": "GLP 1",
    "category": "wellness-longevity",
    "tagline": "Metabolic signaling peptide",
    "summary": "Glucagon like peptide 1 analog discussed for its role in glucose homeostasis and appetite regulating pathways.",
    "mechanism": "Published Available information discusses GLP 1 receptor agonism and its downstream effects on insulin secretion, gastric emptying, and central satiety signaling.",
    "researchAreas": [
      "Glucose metabolism",
      "Satiety pathways",
      "Receptor signaling"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "GLP 1 Physiology, Pharmacology and research Mechanisms",
        "source": "NIH / PMC",
        "year": 2022,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8859727/"
      },
      {
        "title": "GLP 1 Receptor Agonists in the Brain: Central Effects",
        "source": "Cell Metabolism",
        "year": 2023,
        "url": "https://pubmed.ncbi.nlm.nih.gov/37196634/"
      }
    ]
  },
  {
    "slug": "mots-c",
    "name": "MOTS C",
    "category": "wellness-longevity",
    "tagline": "Mitochondrial derived peptide",
    "summary": "A mitochondrial encoded peptide discussed in scientific models for its proposed role in metabolic regulation and cellular stress response.",
    "mechanism": "Available information suggests MOTS C influences AMPK signaling and mitochondrial homeostasis in cellular scientific models.",
    "researchAreas": [
      "Mitochondrial biology",
      "AMPK pathway",
      "Cellular metabolism"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "The Mitochondrial Derived Peptide MOTS c Promotes Metabolic Homeostasis",
        "source": "Cell Metabolism (USC)",
        "year": 2015,
        "url": "https://pubmed.ncbi.nlm.nih.gov/25738459/"
      },
      {
        "title": "MOTS c Functionally is studied around Metabolic Disorders",
        "source": "NIH / PMC",
        "year": 2023,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10571067/"
      }
    ]
  },
  {
    "slug": "bpc-157",
    "name": "BPC 157",
    "category": "performance-recovery",
    "tagline": "Body protection compound",
    "summary": "A pentadecapeptide derived from a gastric protective protein, widely discussed in available scientific tissue repair research.",
    "mechanism": "Available literature explores effects on angiogenic signaling, collagen remodeling, and tendon fibroblast activity in animal models.",
    "researchAreas": [
      "Tissue repair models",
      "Angiogenesis",
      "Connective tissue"
    ],
    "purity": "≥99% by HPLC",
    "references": [
      {
        "title": "Stable Gastric Pentadecapeptide BPC 157: Tendon and Ligament tissue repair research",
        "source": "NIH / PMC",
        "year": 2018,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6096549/"
      },
      {
        "title": "BPC 157 and Standard Angiogenic Growth Factors",
        "source": "NIH / PMC",
        "year": 2022,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9269931/"
      }
    ]
  },
  {
    "slug": "tb-500",
    "name": "TB 500",
    "category": "performance-recovery",
    "tagline": "Thymosin beta 4 fragment",
    "summary": "A synthetic fragment of thymosin beta 4 discussed in scientific contexts for cellular migration and actin regulation.",
    "mechanism": "Published studies examine actin sequestration and effects on endothelial cell behavior.",
    "researchAreas": [
      "Cell migration",
      "Actin dynamics",
      "Recovery support"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Thymosin β4: A Multi Functional Regenerative Peptide",
        "source": "Annals NY Academy of Sciences / NIH",
        "year": 2012,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3499781/"
      },
      {
        "title": "Thymosin β4 in Tissue Repair and Regeneration",
        "source": "NIH / PMC",
        "year": 2020,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7766832/"
      }
    ]
  },
  {
    "slug": "bpc-157-tb-500-blend",
    "name": "BPC 157 / TB 500 Blend",
    "category": "performance-recovery",
    "tagline": "Co formulated peptide blend",
    "summary": "A combined preparation of BPC 157 and TB 500 used in studies exploring synergistic tissue repair pathways.",
    "mechanism": "Discussed for parallel effects on angiogenic and cytoskeletal signaling .",
    "researchAreas": [
      "Combined pathways",
      "Tissue models"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "BPC 157 and Standard Angiogenic Growth Factors (background)",
        "source": "NIH / PMC",
        "year": 2022,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9269931/"
      },
      {
        "title": "Thymosin β4 in Tissue Repair and Regeneration (background)",
        "source": "NIH / PMC",
        "year": 2020,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7766832/"
      }
    ]
  },
  {
    "slug": "semaglutide",
    "name": "Semaglutide",
    "category": "wellness-longevity",
    "tagline": "GLP 1 receptor agonist",
    "summary": "A long acting GLP 1 analog widely discussed in metabolic available literature.",
    "mechanism": "Discussed for sustained GLP 1 receptor activation and downstream metabolic effects in scientific models.",
    "researchAreas": [
      "Metabolic support",
      "Receptor pharmacology"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Once Weekly Semaglutide in Adults with Overweight or Obesity (STEP 1)",
        "source": "NEJM",
        "year": 2021,
        "url": "https://www.nejm.org/doi/full/10.1056/NEJMoa2032183"
      },
      {
        "title": "Semaglutide and Cardiovascular Outcomes (SELECT)",
        "source": "NEJM",
        "year": 2023,
        "url": "https://www.nejm.org/doi/full/10.1056/NEJMoa2307563"
      }
    ]
  },
  {
    "slug": "tirzepatide",
    "name": "Tirzepatide",
    "category": "wellness-longevity",
    "tagline": "Dual GIP / GLP 1 agonist",
    "summary": "A dual incretin receptor agonist discussed for combined GIP and GLP 1 pathway activity.",
    "mechanism": "Available information examines simultaneous engagement of GIP and GLP 1 receptors in metabolic signaling models.",
    "researchAreas": [
      "Incretin biology",
      "Dual receptor signaling"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Tirzepatide Once Weekly for research of Obesity (SURMOUNT 1)",
        "source": "NEJM",
        "year": 2022,
        "url": "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038"
      },
      {
        "title": "Tirzepatide vs Semaglutide for Type 2 Diabetes (SURPASS 2)",
        "source": "NEJM",
        "year": 2021,
        "url": "https://www.nejm.org/doi/full/10.1056/NEJMoa2107519"
      }
    ]
  },
  {
    "slug": "retatrutide",
    "name": "Retatrutide",
    "category": "wellness-longevity",
    "tagline": "Triple incretin receptor candidate",
    "summary": "An emerging tri agonist targeting GLP 1, GIP, and glucagon receptors in metabolic pathway discussions.",
    "mechanism": "Discussed for concurrent activation of three metabolic receptor families .",
    "researchAreas": [
      "Tri agonist activity",
      "Energy expenditure models"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Triple Hormone Receptor Agonist Retatrutide for Obesity (Phase 2)",
        "source": "NEJM",
        "year": 2023,
        "url": "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972"
      },
      {
        "title": "Retatrutide for Type 2 Diabetes (Phase 2)",
        "source": "The Lancet",
        "year": 2023,
        "url": "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(23)01053-X/fulltext"
      }
    ]
  },
  {
    "slug": "cagrilintide",
    "name": "Cagrilintide",
    "category": "wellness-longevity",
    "tagline": "Long acting amylin analog",
    "summary": "An amylin receptor agonist discussed in metabolic and satiety pathway research.",
    "mechanism": "Discussed for amylin receptor binding and effects on gastric and central satiety signaling.",
    "researchAreas": [
      "Amylin signaling",
      "Satiety pathways"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Cagrilintide, a Long Acting Amylin Analogue, in Adults with Overweight",
        "source": "The Lancet",
        "year": 2021,
        "url": "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)01751-7/fulltext"
      },
      {
        "title": "Combination Cagrilintide + Semaglutide (CagriSema)",
        "source": "NIH / PubMed",
        "year": 2023,
        "url": "https://pubmed.ncbi.nlm.nih.gov/36495881/"
      }
    ]
  },
  {
    "slug": "nad-plus",
    "name": "NAD+",
    "category": "wellness-longevity",
    "tagline": "Nicotinamide adenine dinucleotide",
    "summary": "A coenzyme central to redox biology and sirtuin research.",
    "mechanism": "Available information discusses NAD+ availability in mitochondrial function and sirtuin mediated cellular signaling.",
    "researchAreas": [
      "Cellular energetics",
      "Sirtuin pathway",
      "aging related research"
    ],
    "purity": "≥99% by HPLC",
    "references": [
      {
        "title": "NAD+ Metabolism and Its Roles in Cellular Processes During Ageing",
        "source": "Nature Reviews Molecular Cell Biology",
        "year": 2021,
        "url": "https://www.nature.com/articles/s41580-020-00313-x"
      },
      {
        "title": "research Potential of NAD Boosting Molecules",
        "source": "Cell Metabolism / NIH",
        "year": 2018,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6342515/"
      }
    ]
  },
  {
    "slug": "glutathione",
    "name": "Glutathione",
    "category": "wellness-longevity",
    "tagline": "Endogenous antioxidant tripeptide",
    "summary": "A tripeptide widely discussed in oxidative stress and detoxification research.",
    "mechanism": "Available information examines its role as a redox buffer and cofactor in glutathione S transferase enzymatic pathways.",
    "researchAreas": [
      "Redox biology",
      "Cellular detoxification"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Glutathione: Antioxidant Properties Dedicated to Nanotechnologies",
        "source": "NIH / PMC",
        "year": 2018,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6316929/"
      },
      {
        "title": "Glutathione Metabolism and Its Implications for Health",
        "source": "Journal of Nutrition / NIH",
        "year": 2019,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6470349/"
      }
    ]
  },
  {
    "slug": "epitalon",
    "name": "Epitalon",
    "category": "wellness-longevity",
    "tagline": "Pineal derived tetrapeptide",
    "summary": "A short tetrapeptide discussed in chronobiology and telomere length research.",
    "mechanism": "Available information explores proposed effects on telomerase activity and circadian regulation in scientific models.",
    "researchAreas": [
      "Telomere biology",
      "Circadian biology"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Epithalamin and Epitalon: Effects on Aging and Telomerase Activity",
        "source": "NIH / PubMed",
        "year": 2003,
        "url": "https://pubmed.ncbi.nlm.nih.gov/14523363/"
      },
      {
        "title": "Peptide Geroprotectors: A Mechanism Review",
        "source": "NIH / PMC",
        "year": 2020,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7796954/"
      }
    ]
  },
  {
    "slug": "thymosin-alpha-1",
    "name": "Thymosin Alpha 1",
    "category": "wellness-longevity",
    "tagline": "Immunomodulatory peptide",
    "summary": "A 28 amino acid peptide discussed in immune modulation research.",
    "mechanism": "Available information discusses effects on T cell maturation pathways and innate immune signaling.",
    "researchAreas": [
      "Immune signaling",
      "T cell support"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Thymosin α1: A Comprehensive Review of the Literature",
        "source": "NIH / PMC",
        "year": 2019,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6716096/"
      },
      {
        "title": "Thymosin α1 research in Critical Illness and Infection",
        "source": "Frontiers in Immunology",
        "year": 2021,
        "url": "https://www.frontiersin.org/articles/10.3389/fimmu.2021.673239/full"
      }
    ]
  },
  {
    "slug": "selank",
    "name": "Selank",
    "category": "wellness-longevity",
    "tagline": "Tuftsin analog peptide",
    "summary": "A synthetic heptapeptide discussed in neuropeptide and stress response research.",
    "mechanism": "Available information examines interactions with GABAergic and serotonergic systems in animal scientific models.",
    "researchAreas": [
      "Neuropeptide signaling",
      "Anxiolytic models"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Anxiolytic Action of Selank in Rodent Models",
        "source": "NIH / PubMed",
        "year": 2007,
        "url": "https://pubmed.ncbi.nlm.nih.gov/17542195/"
      },
      {
        "title": "Effects of Selank on the Expression of GABAergic Genes",
        "source": "NIH / PubMed",
        "year": 2017,
        "url": "https://pubmed.ncbi.nlm.nih.gov/28534230/"
      }
    ]
  },
  {
    "slug": "semax",
    "name": "Semax",
    "category": "wellness-longevity",
    "tagline": "ACTH derived neuropeptide",
    "summary": "A heptapeptide fragment of ACTH discussed in cognitive and neurotrophic research.",
    "mechanism": "Available information explores effects on BDNF expression and cholinergic signaling in published studies.",
    "researchAreas": [
      "Neurotrophic factors",
      "Cognitive support"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Semax, an ACTH(4 to 10) Analog, Modulates BDNF and Memory",
        "source": "NIH / PubMed",
        "year": 2008,
        "url": "https://pubmed.ncbi.nlm.nih.gov/18536906/"
      },
      {
        "title": "Neuroprotective Effects of Semax in Cerebral Ischemia Models",
        "source": "NIH / PMC",
        "year": 2017,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5577458/"
      }
    ]
  },
  {
    "slug": "pt-141",
    "name": "PT 141",
    "category": "wellness-longevity",
    "tagline": "Melanocortin receptor agonist",
    "summary": "A synthetic peptide discussed for melanocortin receptor activity in scientific models.",
    "mechanism": "Discussed for MC3R / MC4R receptor binding and downstream central nervous system signaling.",
    "researchAreas": [
      "Melanocortin signaling",
      "Receptor signaling"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Bremelanotide for Hypoactive Sexual Desire Disorder (RECONNECT)",
        "source": "Obstetrics & Gynecology / NIH",
        "year": 2019,
        "url": "https://pubmed.ncbi.nlm.nih.gov/31090670/"
      },
      {
        "title": "Melanocortin Receptor Pharmacology and Bremelanotide",
        "source": "NIH / PMC",
        "year": 2021,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8221404/"
      }
    ]
  },
  {
    "slug": "melanotan-ii",
    "name": "Melanotan II",
    "category": "wellness-longevity",
    "tagline": "Melanocortin analog",
    "summary": "A synthetic alpha MSH analog discussed in pigmentation pathway research.",
    "mechanism": "Available information examines melanocortin receptor agonism and effects on melanogenesis in cellular models.",
    "researchAreas": [
      "Pigmentation pathways",
      "Melanocortin pathway"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Melanotan II: Pharmacology and Mechanism of Action",
        "source": "NIH / PubMed",
        "year": 2010,
        "url": "https://pubmed.ncbi.nlm.nih.gov/20546514/"
      },
      {
        "title": "Melanocortin Agonists and Skin Pigmentation",
        "source": "NIH / PMC",
        "year": 2020,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7589027/"
      }
    ]
  },
  {
    "slug": "cjc-1295",
    "name": "CJC 1295",
    "category": "performance-recovery",
    "tagline": "GHRH analog",
    "summary": "A synthetic growth hormone releasing hormone analog discussed in endocrine research.",
    "mechanism": "Discussed for sustained GHRH receptor activation in pituitary scientific models.",
    "researchAreas": [
      "GHRH signaling",
      "Endocrine signaling"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Sustained Activity of a GHRH Analog (CJC 1295) in Healthy Adults",
        "source": "J Clin Endocrinol Metab / NIH",
        "year": 2006,
        "url": "https://pubmed.ncbi.nlm.nih.gov/16352683/"
      },
      {
        "title": "Long Acting GHRH Analogs: Pharmacology and Endocrine Effects",
        "source": "NIH / PMC",
        "year": 2018,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5985817/"
      }
    ]
  },
  {
    "slug": "ipamorelin",
    "name": "Ipamorelin",
    "category": "performance-recovery",
    "tagline": "Selective GHS R agonist",
    "summary": "A pentapeptide discussed for selective ghrelin receptor activity in available literature.",
    "mechanism": "Available information examines GHS R1a binding with minimal cross activity in model systems.",
    "researchAreas": [
      "Ghrelin pathway",
      "Pulsatile GH signaling"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Ipamorelin, the First Selective Growth Hormone Secretagogue",
        "source": "Eur J Endocrinology / NIH",
        "year": 1998,
        "url": "https://pubmed.ncbi.nlm.nih.gov/9849822/"
      },
      {
        "title": "Ghrelin Receptor Agonists in Postoperative Ileus",
        "source": "NIH / PMC",
        "year": 2014,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4012909/"
      }
    ]
  },
  {
    "slug": "sermorelin",
    "name": "Sermorelin",
    "category": "performance-recovery",
    "tagline": "GHRH 1 to 29 fragment",
    "summary": "A truncated GHRH analog discussed in pituitary signaling research.",
    "mechanism": "Discussed for GHRH receptor binding and somatotroph activity in scientific models.",
    "researchAreas": [
      "GHRH receptor",
      "Somatotroph signaling"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Growth Hormone Releasing Hormone (GHRH 1 to 29) investigational Use",
        "source": "J Clin Endocrinol Metab / NIH",
        "year": 2008,
        "url": "https://pubmed.ncbi.nlm.nih.gov/18000087/"
      },
      {
        "title": "Sermorelin: A Review of GHRH Based research compounds",
        "source": "NIH / PMC",
        "year": 2020,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7290572/"
      }
    ]
  },
  {
    "slug": "tesamorelin",
    "name": "Tesamorelin",
    "category": "performance-recovery",
    "tagline": "Stabilized GHRH analog",
    "summary": "A stabilized GHRH analog discussed for prolonged receptor activity in metabolic research.",
    "mechanism": "Available information discusses effects on visceral adipose biology and lipid metabolism.",
    "researchAreas": [
      "Lipid metabolism",
      "GHRH stability"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "Tesamorelin and Visceral Adipose Tissue in HIV Associated Lipodystrophy",
        "source": "NEJM",
        "year": 2007,
        "url": "https://www.nejm.org/doi/full/10.1056/NEJMoa072375"
      },
      {
        "title": "Effects of Tesamorelin on Liver Fat and Visceral Fat",
        "source": "JAMA / NIH",
        "year": 2014,
        "url": "https://pubmed.ncbi.nlm.nih.gov/25182100/"
      }
    ]
  },
  {
    "slug": "ghk-cu",
    "name": "GHK Cu",
    "category": "performance-recovery",
    "tagline": "Copper binding tripeptide",
    "summary": "A naturally occurring copper binding peptide discussed in skin biology and tissue remodeling research.",
    "mechanism": "Available information examines copper transport and effects on collagen synthesis in fibroblast cultures.",
    "researchAreas": [
      "Skin biology",
      "Copper transport",
      "Fibroblast activity"
    ],
    "purity": "≥99% by HPLC",
    "references": [
      {
        "title": "GHK Peptide as a Natural Modulator of Multiple Cellular Pathways",
        "source": "NIH / PMC",
        "year": 2015,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4429173/"
      },
      {
        "title": "Tripeptide GHK Cu and Skin Regeneration",
        "source": "NIH / PMC",
        "year": 2018,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6164334/"
      }
    ]
  },
  {
    "slug": "aod-9604",
    "name": "AOD 9604",
    "category": "performance-recovery",
    "tagline": "hGH C terminal fragment",
    "summary": "A modified fragment of human growth hormone discussed in lipid metabolism research.",
    "mechanism": "Discussed for proposed effects on lipolytic pathways without classical GH receptor activity.",
    "researchAreas": [
      "Lipolysis models",
      "Lipid metabolism"
    ],
    "purity": "≥98% by HPLC",
    "references": [
      {
        "title": "AOD9604: A Lipolytic Fragment of Human Growth Hormone",
        "source": "NIH / PubMed",
        "year": 2004,
        "url": "https://pubmed.ncbi.nlm.nih.gov/15208835/"
      },
      {
        "title": "Growth Hormone C Terminal Fragments and Adipose Tissue",
        "source": "NIH / PMC",
        "year": 2011,
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3069661/"
      }
    ]
  }
];

export const PRODUCT_SPECS: Record<string, ProductSpecs> = {
  "glp-1": {
    "cas": "89750 14 1",
    "molecularWeight": "3297.7 Da",
    "molecularFormula": "C149H226N40O45",
    "sequence": "HAEGTFTSDVSSYLEGQAAKEFIAWLVKGRG"
  },
  "mots-c": {
    "cas": "1627580 64 6",
    "molecularWeight": "2174.5 Da",
    "molecularFormula": "C100H156N28O27S",
    "sequence": "MRWQEMGYIFYPRKLR"
  },
  "bpc-157": {
    "cas": "137525 51 0",
    "molecularWeight": "1419.5 Da",
    "molecularFormula": "C62H98N16O22",
    "sequence": "GEPPPGKPADDAGLV"
  },
  "tb-500": {
    "cas": "77591 33 4",
    "molecularWeight": "889.0 Da",
    "molecularFormula": "C38H68N9O14",
    "sequence": "Ac LKKTETQ"
  },
  "bpc-157-tb-500-blend": {
    "molecularWeight": "Blend (BPC 157 + TB 500)",
    "sequence": "Co formulated peptides: see individual entries",
    "productImage": "/products/bpc-157-tb-500-blend.webp",
    "coas": [
      {
        "label": "BPC 157 / TB 500 10/10 mg",
        "purity": "99.29%",
        "image": "/coa/bpc-157-tb-500-blend.webp"
      }
    ]
  },
  "semaglutide": {
    "cas": "910463 68 2",
    "molecularWeight": "4113.6 Da",
    "molecularFormula": "C187H291N45O59",
    "sequence": "HAibEGTFTSDVSSYLEGQAAK(γE-C18 diacid)EFIAWLVRGRG"
  },
  "tirzepatide": {
    "cas": "2023788 19 2",
    "molecularWeight": "4813.5 Da",
    "molecularFormula": "C225H348N48O68",
    "sequence": "YAibEGTFTSDYSIYLDKIAQK(γE-C20 diacid)AFVQWLIAGGPSSGAPPPS NH2",
    "productImage": "/products/tirzepatide.webp",
    "coas": [
      {
        "label": "Tirzepatide 20 mg",
        "purity": "99.972%",
        "image": "/coa/tirzepatide-20mg.webp"
      },
      {
        "label": "Tirzepatide 30 mg",
        "purity": "99.817%",
        "image": "/coa/tirzepatide-30mg.webp"
      }
    ]
  },
  "retatrutide": {
    "cas": "2381089 83 2",
    "molecularWeight": "4731.4 Da",
    "sequence": "Tri agonist (GLP 1 / GIP / glucagon)",
    "productImage": "/products/retatrutide.webp",
    "coas": [
      {
        "label": "Retatrutide 10 mg",
        "purity": "99.941%",
        "image": "/coa/retatrutide.webp"
      }
    ]
  },
  "cagrilintide": {
    "cas": "1415456 99 3",
    "molecularWeight": "3795.4 Da",
    "sequence": "Long acting amylin analog (37 aa)"
  },
  "nad-plus": {
    "cas": "53 84 9",
    "molecularWeight": "663.4 Da",
    "molecularFormula": "C21H27N7O14P2"
  },
  "glutathione": {
    "cas": "70 18 8",
    "molecularWeight": "307.3 Da",
    "molecularFormula": "C10H17N3O6S",
    "sequence": "γ ECG (γ Glu Cys Gly)",
    "productImage": "/products/glutathione.webp",
    "coas": [
      {
        "label": "Glutathione 1500 mg",
        "purity": "99.486%",
        "image": "/coa/glutathione.webp"
      }
    ]
  },
  "epitalon": {
    "cas": "307297 39 8",
    "molecularWeight": "390.4 Da",
    "molecularFormula": "C14H22N4O9",
    "sequence": "AEDG (Ala Glu Asp Gly)"
  },
  "thymosin-alpha-1": {
    "cas": "62304 98 7",
    "molecularWeight": "3108.3 Da",
    "molecularFormula": "C129H215N33O55",
    "sequence": "Ac SDAAVDTSSEITTKDLKEKKEVVEEAEN"
  },
  "selank": {
    "cas": "129954 34 3",
    "molecularWeight": "751.9 Da",
    "molecularFormula": "C33H57N11O9",
    "sequence": "TKPRPGP"
  },
  "semax": {
    "cas": "80714 61 0",
    "molecularWeight": "813.9 Da",
    "molecularFormula": "C37H51N9O10S",
    "sequence": "MEHFPGP",
    "productImage": "/products/semax.webp"
  },
  "pt-141": {
    "cas": "189691 06 3",
    "molecularWeight": "1025.2 Da",
    "molecularFormula": "C50H68N14O10",
    "sequence": "Ac Nle cyclo[Asp His DPhe Arg Trp Lys] OH"
  },
  "melanotan-ii": {
    "cas": "121062 08 6",
    "molecularWeight": "1024.2 Da",
    "molecularFormula": "C50H69N15O9",
    "sequence": "Ac Nle cyclo[Asp His DPhe Arg Trp Lys] NH2"
  },
  "cjc-1295": {
    "cas": "863288 34 0",
    "molecularWeight": "3367.9 Da",
    "molecularFormula": "C152H252N44O42",
    "sequence": "Tyr DAla Asp Ala Ile Phe Thr Gln Ser Tyr Arg Lys Val Leu Ala Gln Leu Ser Ala Arg Lys Leu Leu Gln Asp Ile Leu Ser Arg NH2"
  },
  "ipamorelin": {
    "cas": "170851 70 4",
    "molecularWeight": "711.9 Da",
    "molecularFormula": "C38H49N9O5",
    "sequence": "Aib His DBNal DPhe Lys NH2",
    "productImage": "/products/ipamorelin.webp",
    "coas": [
      {
        "label": "Ipamorelin 10 mg",
        "purity": "99.836%",
        "image": "/coa/ipamorelin.webp"
      }
    ]
  },
  "sermorelin": {
    "cas": "86168 78 7",
    "molecularWeight": "3357.9 Da",
    "molecularFormula": "C149H246N44O42S",
    "sequence": "GHRH (1 to 29)",
    "productImage": "/products/sermorelin.webp"
  },
  "tesamorelin": {
    "cas": "218949 48 5",
    "molecularWeight": "5135.8 Da",
    "sequence": "Stabilized GHRH (1 to 44) analog"
  },
  "ghk-cu": {
    "cas": "49557 75 7",
    "molecularWeight": "402.9 Da",
    "molecularFormula": "C14H24CuN6O4",
    "sequence": "GHK · Cu²⁺ (Gly His Lys + copper)"
  },
  "aod-9604": {
    "cas": "221231 10 3",
    "molecularWeight": "1815.1 Da",
    "molecularFormula": "C78H123N23O23S2",
    "sequence": "hGH (177 to 191) modified"
  }
};
