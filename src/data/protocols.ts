export type ProtocolModality = 'hormone' | 'peptide'

export interface Protocol {
  id: string
  name: string
  group: string
  modality: ProtocolModality
  featured?: boolean
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
    group: 'Hormone Optimization · TRT',
    modality: 'hormone',
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
    group: 'Hormone Optimization · TRT',
    modality: 'hormone',
    tagline: 'Preserves natural production alongside hormone therapy.',
    description:
      'Human Chorionic Gonadotropin is used adjunctively with hormone therapy to help maintain reproductive function and endogenous production.',
    benefits: ['Supports fertility goals', 'Maintains natural hormone function', 'Synergistic with hormone protocols'],
    administration: 'Low-dose subcutaneous injections, frequency set by protocol.',
  },
  {
    id: 'bpc-157',
    name: 'BPC-157',
    group: 'Recovery & Repair Peptides',
    modality: 'peptide',
    featured: true,
    tagline: 'The "body protection compound" for tissue and gut healing.',
    description:
      'A researched peptide associated with accelerated soft-tissue repair, gut lining support, and reduced inflammatory response.',
    benefits: ['Accelerated recovery from injury', 'Gut & joint support', 'Anti-inflammatory action'],
    administration: 'Subcutaneous micro-dosing, cycle length determined by practitioner.',
  },
  {
    id: 'cjc-ipamorelin',
    name: 'CJC-1295 / Ipamorelin',
    group: 'Growth Hormone Peptides',
    modality: 'peptide',
    featured: true,
    tagline: 'Synergistic growth-hormone-releasing peptide stack.',
    description:
      'A combination peptide protocol that supports the body\'s natural pulsatile release of growth hormone, often used for recovery, sleep quality, and body composition goals.',
    benefits: ['Deeper, more restorative sleep', 'Improved body composition', 'Enhanced recovery'],
    administration: 'Nightly subcutaneous injection prior to sleep.',
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    group: 'Growth Hormone Peptides',
    modality: 'peptide',
    tagline: 'Targeted visceral fat reduction support.',
    description:
      'A growth-hormone-releasing hormone analogue studied for its effect on visceral adipose tissue and metabolic markers.',
    benefits: ['Targets visceral fat', 'Supports metabolic health', 'Complements body recomposition goals'],
    administration: 'Daily subcutaneous injection; cycled per practitioner guidance.',
  },
  {
    id: 'pt-141',
    name: 'PT-141 (Bremelanotide)',
    group: 'Intimacy & Vitality',
    modality: 'peptide',
    tagline: 'Supports libido and intimate wellness.',
    description:
      'A melanocortin peptide used to support healthy libido and sexual response as part of a broader hormone optimization plan.',
    benefits: ['Supports libido', 'Complements hormone therapy', 'Individualized dosing'],
    administration: 'As-needed subcutaneous injection, timed per practitioner instruction.',
  },
  {
    id: 'bhrt-estrogen-progesterone',
    name: 'HRT — Estrogen & Progesterone',
    group: 'Hormone Optimization · HRT',
    modality: 'hormone',
    tagline: 'Bio-identical balance through hormonal transitions.',
    description:
      'Custom-compounded bio-identical hormone therapy formulated to ease transitional symptoms and restore hormonal equilibrium.',
    benefits: ['Reduced hot flashes & night sweats', 'Improved sleep & mood', 'Support for bone & heart health'],
    administration: 'Available as creams, patches, or troches; individualized by lab work & symptom review.',
    disclaimer: 'Compounded formulations reviewed with our clinical partner based on comprehensive hormone panels.',
  },
  {
    id: 'bhrt-dhea-pregnenolone',
    name: 'DHEA & Pregnenolone',
    group: 'Hormone Optimization · HRT',
    modality: 'hormone',
    tagline: 'The "mother hormones" for energy and resilience.',
    description:
      'Precursor hormone support used to help restore adrenal balance, cognitive clarity, and overall vitality.',
    benefits: ['Supports adrenal balance', 'Cognitive clarity', 'Foundational hormone precursor support'],
    administration: 'Oral or topical, dosed per individualized lab assessment.',
  },
  {
    id: 'glow-nad',
    name: 'NAD+ Cellular Renewal',
    group: 'Glow & Longevity',
    modality: 'peptide',
    tagline: 'Cellular energy and radiance from within.',
    description:
      'NAD+ therapy supports mitochondrial function and cellular repair, frequently paired with our Glow aesthetic protocols.',
    benefits: ['Cellular energy support', 'Supports healthy aging', 'Pairs with aesthetic treatments'],
    administration: 'IV infusion or subcutaneous series, scheduled in-clinic.',
  },
  {
    id: 'glp-1',
    name: 'Semaglutide / Tirzepatide',
    group: 'Metabolic & Weight Optimization',
    modality: 'peptide',
    featured: true,
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
    group: 'Growth Hormone Peptides',
    modality: 'peptide',
    tagline: 'Gentle growth hormone support for graceful aging.',
    description:
      'A growth-hormone-releasing hormone analogue used to support natural GH rhythms, skin quality, and recovery.',
    benefits: ['Supports skin elasticity', 'Improves sleep quality', 'Gentle, natural GH stimulation'],
    administration: 'Nightly subcutaneous injection.',
  },
]
