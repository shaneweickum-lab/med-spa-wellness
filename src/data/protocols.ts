export type ProtocolCategory = 'men' | 'women' | 'both'

export interface Protocol {
  id: string
  name: string
  category: ProtocolCategory
  group: string
  tagline: string
  description: string
  benefits: string[]
  administration: string
  disclaimer?: string
}

export const protocols: Protocol[] = [
  {
    id: 'trt-cypionate',
    name: 'Testosterone Cypionate / Enanthate',
    category: 'men',
    group: "Men's Performance · TRT",
    tagline: 'Foundational hormone optimization for vitality, drive, and lean mass.',
    description:
      'Bio-identical testosterone therapy designed to restore serum levels to an optimal physiologic range, guided by comprehensive lab panels and our clinical partner\'s oversight.',
    benefits: ['Restored energy & drive', 'Improved lean muscle retention', 'Sharper focus & mood stability'],
    administration: 'Typically weekly or bi-weekly subcutaneous/IM injection; dose individualized after labs.',
    disclaimer: 'Requires baseline & follow-up bloodwork. Controlled substance — prescribed only after clinical evaluation.',
  },
  {
    id: 'hcg-support',
    name: 'HCG Fertility Support',
    category: 'men',
    group: "Men's Performance · TRT",
    tagline: 'Preserves natural production alongside hormone therapy.',
    description:
      'Human Chorionic Gonadotropin is used adjunctively with TRT to help maintain testicular volume and endogenous function.',
    benefits: ['Supports fertility goals', 'Maintains testicular function', 'Synergistic with TRT protocols'],
    administration: 'Low-dose subcutaneous injections, frequency set by protocol.',
  },
  {
    id: 'bpc-157',
    name: 'BPC-157',
    category: 'both',
    group: 'Recovery & Repair Peptides',
    tagline: 'The "body protection compound" for tissue and gut healing.',
    description:
      'A researched peptide associated with accelerated soft-tissue repair, gut lining support, and reduced inflammatory response.',
    benefits: ['Accelerated recovery from injury', 'Gut & joint support', 'Anti-inflammatory action'],
    administration: 'Subcutaneous micro-dosing, cycle length determined by practitioner.',
  },
  {
    id: 'cjc-ipamorelin',
    name: 'CJC-1295 / Ipamorelin',
    category: 'both',
    group: 'Growth Hormone Peptides',
    tagline: 'Synergistic growth-hormone-releasing peptide stack.',
    description:
      'A combination peptide protocol that supports the body\'s natural pulsatile release of growth hormone, often used for recovery, sleep quality, and body composition goals.',
    benefits: ['Deeper, more restorative sleep', 'Improved body composition', 'Enhanced recovery'],
    administration: 'Nightly subcutaneous injection prior to sleep.',
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    category: 'men',
    group: 'Growth Hormone Peptides',
    tagline: 'Targeted visceral fat reduction support.',
    description:
      'A growth-hormone-releasing hormone analogue studied for its effect on visceral adipose tissue and metabolic markers.',
    benefits: ['Targets visceral fat', 'Supports metabolic health', 'Complements body recomposition goals'],
    administration: 'Daily subcutaneous injection; cycled per practitioner guidance.',
  },
  {
    id: 'pt-141',
    name: 'PT-141 (Bremelanotide)',
    category: 'both',
    group: 'Intimacy & Vitality',
    tagline: 'Supports libido and sexual wellness for men and women.',
    description:
      'A melanocortin peptide used to support healthy libido and sexual response as part of a broader hormone optimization plan.',
    benefits: ['Supports libido', 'Complements hormone therapy', 'Individualized dosing'],
    administration: 'As-needed subcutaneous injection, timed per practitioner instruction.',
  },
  {
    id: 'bhrt-estrogen-progesterone',
    name: 'BHRT — Estrogen & Progesterone',
    category: 'women',
    group: "Women's Hormones · BHRT",
    tagline: 'Bio-identical balance for perimenopause & menopause.',
    description:
      'Custom-compounded bio-identical hormone therapy formulated to ease transitional symptoms and restore hormonal equilibrium.',
    benefits: ['Reduced hot flashes & night sweats', 'Improved sleep & mood', 'Support for bone & heart health'],
    administration: 'Available as creams, patches, or troches; individualized by lab work & symptom review.',
    disclaimer: 'Compounded formulations reviewed with our clinical partner based on comprehensive hormone panels.',
  },
  {
    id: 'bhrt-dhea-pregnenolone',
    name: 'DHEA & Pregnenolone',
    category: 'women',
    group: "Women's Hormones · BHRT",
    tagline: 'The "mother hormones" for energy and resilience.',
    description:
      'Precursor hormone support used to help restore adrenal balance, cognitive clarity, and overall vitality.',
    benefits: ['Supports adrenal balance', 'Cognitive clarity', 'Foundational hormone precursor support'],
    administration: 'Oral or topical, dosed per individualized lab assessment.',
  },
  {
    id: 'glow-nad',
    name: 'NAD+ Cellular Renewal',
    category: 'women',
    group: 'Glow & Longevity',
    tagline: 'Cellular energy and radiance from within.',
    description:
      'NAD+ therapy supports mitochondrial function and cellular repair, frequently paired with our Glow aesthetic protocols.',
    benefits: ['Cellular energy support', 'Supports healthy aging', 'Pairs with aesthetic treatments'],
    administration: 'IV infusion or subcutaneous series, scheduled in-clinic.',
  },
  {
    id: 'glp-1',
    name: 'Semaglutide / Tirzepatide',
    category: 'both',
    group: 'Metabolic & Weight Optimization',
    tagline: 'Provider-guided metabolic and weight management.',
    description:
      'GLP-1 receptor agonist therapy integrated into a broader metabolic optimization plan with nutritional and clinical support.',
    benefits: ['Appetite regulation', 'Supports sustainable weight goals', 'Paired with clinical monitoring'],
    administration: 'Weekly subcutaneous injection with dose titration.',
    disclaimer: 'Requires screening for contraindications and ongoing clinical follow-up.',
  },
  {
    id: 'sermorelin',
    name: 'Sermorelin',
    category: 'women',
    group: 'Growth Hormone Peptides',
    tagline: 'Gentle growth hormone support for graceful aging.',
    description:
      'A growth-hormone-releasing hormone analogue used to support natural GH rhythms, skin quality, and recovery.',
    benefits: ['Supports skin elasticity', 'Improves sleep quality', 'Gentle, natural GH stimulation'],
    administration: 'Nightly subcutaneous injection.',
  },
]

export const focusCopy = {
  men: {
    label: "Men's Performance",
    kicker: 'TRT · Peptides · Vitality',
    headline: 'Reclaim your edge.',
    body: 'Precision testosterone optimization and peptide therapy engineered for energy, strength, and focus.',
  },
  women: {
    label: "Women's Hormones",
    kicker: 'BHRT · Peptides · Glow',
    headline: 'Restore your balance.',
    body: 'Bio-identical hormone therapy and glow protocols designed around your body\'s natural rhythm.',
  },
} as const
