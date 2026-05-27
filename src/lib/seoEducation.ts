export interface SeoEducationSection {
  heading: string;
  body: string;
  expandable?: boolean;
}

export interface SeoEducationFaq {
  question: string;
  answer: string;
}

export interface SeoEducationPage {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  sections: SeoEducationSection[];
  faqs: SeoEducationFaq[];
}

export const educationPages: SeoEducationPage[] = [
  {
    slug: 'kitchen-renovation-cost-sydney',
    eyebrow: 'Kitchen renovation cost Sydney',
    title: 'Kitchen renovation cost in Sydney, explained clearly.',
    summary: 'Understand the main cost drivers before you ask for a final quote: layout, cabinetry, surfaces, services, access, approvals and selection certainty.',
    primaryCta: 'Start kitchen estimate',
    primaryHref: '/quote',
    secondaryCta: 'Review existing quote',
    secondaryHref: '/quote/review',
    sections: [
      {
        heading: 'What affects cost',
        body: 'Sydney kitchen renovation budgets usually move with cabinet quantity, finish tier, benchtop and splashback selection, demolition, service relocation, apartment access and the amount of unresolved scope.',
      },
      {
        heading: 'Why a range is safer early',
        body: 'An early online estimate should show a budget range and confidence score, not a final fixed price. The range narrows when measurements, photos, plans, selections and site risks are reviewed.',
      },
      {
        heading: 'What to prepare',
        body: 'Prepare basic room dimensions, photos of every wall, service locations, access notes, appliance intentions and any current quotes. This helps reveal assumptions and exclusions before site measure.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Can I get a fixed kitchen renovation price online?', answer: 'No. Operon Kitchens provides an estimate range and review flags. Final pricing requires site measure, confirmed selections and professional scope review.' },
      { question: 'Why do two kitchen quotes look so different?', answer: 'They may include different cabinetry materials, hardware, benchtops, trade work, demolition, waste, appliances, GST, exclusions or provisional allowances.' },
    ],
  },
  {
    slug: 'kitchen-quote-sydney',
    eyebrow: 'Kitchen quote Sydney',
    title: 'A clearer way to start a Sydney kitchen quote.',
    summary: 'Build an estimate that separates scope, confidence, assumptions and review items before the final quote stage.',
    primaryCta: 'Start kitchen estimate',
    primaryHref: '/quote',
    secondaryCta: 'Read the process',
    secondaryHref: '/kitchen-renovation-process',
    sections: [
      {
        heading: 'A quote needs scope, not just a total',
        body: 'Useful kitchen quoting starts with room type, layout, cabinetry quantity, finishes, benchtop direction, splashback, trades, demolition, access and approvals.',
      },
      {
        heading: 'Confidence matters',
        body: 'Operon Kitchens gives each estimate a confidence score so unclear measurements, missing photos, apartment access or selection gaps are visible before decisions are made.',
      },
      {
        heading: 'Next step after the estimate',
        body: 'After online intake, photos, plans or a current quote can be reviewed. A site measure and confirmed selections are still required before a final written quote.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'What does the quote wizard ask for?', answer: 'It asks about property type, layout, size, scope inclusions, finishes, services, risk flags, uploads and contact details.' },
      { question: 'Can I use the estimate to compare builders?', answer: 'Use it as a scope clarity tool. It helps you spot assumptions and exclusions, but it is not a substitute for a final builder quote.' },
    ],
  },
  {
    slug: 'kitchen-quote-review',
    eyebrow: 'Kitchen quote review',
    title: 'Review an existing kitchen quote before you compare totals.',
    summary: 'Upload a current quote, photos and plans so the unclear inclusions, allowances, exclusions and risk items can be captured for professional review.',
    primaryCta: 'Review existing kitchen quote',
    primaryHref: '/quote/review',
    secondaryCta: 'Start new estimate',
    secondaryHref: '/quote',
    sections: [
      {
        heading: 'What the review looks for',
        body: 'The structured intake checks missing inclusions, unclear PC sums, provisional sums, exclusions, service relocation, appliance assumptions, benchtop clarity and site measure requirements.',
      },
      {
        heading: 'Compliance-aware prompts',
        body: 'The review flow flags deposit and HBC review items, licensed trade confirmation, strata or apartment risks and engineered-stone restrictions where relevant. It is guidance only, not legal advice.',
      },
      {
        heading: 'What to upload',
        body: 'Upload the quote PDF or image, room photos, plans, appliance schedules, finish notes and any variation documents. The clearer the documents, the stronger the review context.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Does the review automatically approve a quote?', answer: 'No. Phase 1 captures structured intake and review flags. A person still needs to review the scope before advice or next steps are confirmed.' },
      { question: 'Can the review identify missing items?', answer: 'It is designed to capture likely missing or unclear items so they can be checked professionally before you rely on the quote.' },
    ],
  },
  {
    slug: 'apartment-kitchen-renovation-sydney',
    eyebrow: 'Apartment kitchen renovation Sydney',
    title: 'Apartment kitchen renovation needs extra scope clarity.',
    summary: 'Strata, access, lifts, work hours, service locations and class 2 building considerations can affect timing and budget.',
    primaryCta: 'Start apartment estimate',
    primaryHref: '/quote',
    secondaryCta: 'Review apartment quote',
    secondaryHref: '/quote/review',
    sections: [
      {
        heading: 'Apartment risks to capture early',
        body: 'Apartment projects may need strata approval, lift bookings, parking planning, protection, noise controls, waste planning and careful service confirmation.',
      },
      {
        heading: 'Services and approvals',
        body: 'Plumbing, electrical and gas changes must be confirmed by appropriately licensed trades. Apartment work may also require DBP or class 2 screening depending on the building and scope.',
      },
      {
        heading: 'Photos and plans help',
        body: 'Upload floor plans, strata requirements, lift dimensions, access notes and photos of existing services. These details help prevent an estimate from looking more certain than it is.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Are apartment kitchens more expensive?', answer: 'They can be, depending on access, approvals, service constraints and building rules. The estimate should flag those items rather than hide them.' },
      { question: 'Do I need strata approval?', answer: 'Many apartment renovations require some form of approval or notification. Confirm with your strata manager and obtain professional advice for your specific building.' },
    ],
  },
  {
    slug: 'kitchen-benchtop-options-after-engineered-stone-ban',
    eyebrow: 'Benchtop options after engineered stone ban',
    title: 'Kitchen benchtop options after engineered stone restrictions.',
    summary: 'Compare compliant benchtop directions such as porcelain, stainless steel, timber, laminate, natural stone and supplier-confirmed low-silica products.',
    primaryCta: 'Start estimate',
    primaryHref: '/quote',
    secondaryCta: 'Review benchtop quote',
    secondaryHref: '/quote/review',
    sections: [
      {
        heading: 'What changed',
        body: 'Australia introduced a ban on engineered stone benchtops, panels and slabs from 1 July 2024. Product compliance should be confirmed by the supplier and installer before selection.',
      },
      {
        heading: 'Common alternatives',
        body: 'Porcelain, sintered stone, stainless steel, timber, laminate and natural stone may be considered, subject to supplier documentation, fabrication requirements and project suitability.',
      },
      {
        heading: 'Quote clarity matters',
        body: 'A quote should state the benchtop material, thickness, edge detail, cut-outs, splashback relationship, installation assumptions and whether any compliance confirmation is still required.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Can I select engineered stone now?', answer: 'Do not assume it is allowed. Products and work must be checked against current WHS requirements and supplier documentation.' },
      { question: 'Which benchtop is best?', answer: 'The best option depends on budget, look, durability, maintenance, fabrication needs and compliance confirmation.' },
    ],
  },
  {
    slug: 'kitchen-renovation-process',
    eyebrow: 'Kitchen renovation process',
    title: 'A calm process for kitchen renovation decisions.',
    summary: 'Move from online estimate to document upload, review, site measure, selections and final scope without pretending everything is known on day one.',
    primaryCta: 'Start kitchen estimate',
    primaryHref: '/quote',
    secondaryCta: 'Review current quote',
    secondaryHref: '/quote/review',
    sections: [
      {
        heading: '1. Online estimate',
        body: 'Capture project basics, property type, layout, scope, finishes, services, uploads and contact details to produce a budget range and confidence score.',
      },
      {
        heading: '2. Review and site measure',
        body: 'Photos, plans and current quotes are reviewed so assumptions, exclusions, access constraints and compliance flags can be checked before site measure.',
      },
      {
        heading: '3. Final scope and quote',
        body: 'Final quote work follows confirmed site conditions, product selections, trade requirements and client decisions. The early estimate is not a final fixed quote.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'When should I choose finishes?', answer: 'Choose a finish direction early, then confirm exact products after the scope and budget range make sense.' },
      { question: 'Why is site measure important?', answer: 'It confirms dimensions, access, services, walls, existing conditions and details that cannot be reliably proven online.' },
    ],
  },
  {
    slug: 'kitchen-pc-sums-and-provisional-sums',
    eyebrow: 'PC sums and provisional sums',
    title: 'Kitchen PC sums and provisional sums, in plain English.',
    summary: 'Understand allowances that can change later, so a kitchen quote is not judged only by its starting total.',
    primaryCta: 'Review existing quote',
    primaryHref: '/quote/review',
    secondaryCta: 'Start estimate',
    secondaryHref: '/quote',
    sections: [
      {
        heading: 'PC sums',
        body: 'A prime cost sum is usually an allowance for an item that has not been finally selected. In kitchens this may relate to appliances, fixtures, fittings or visible products.',
      },
      {
        heading: 'Provisional sums',
        body: 'A provisional sum is usually an allowance for work where the exact scope or cost is not known yet. In kitchens this can involve services, demolition, preparation or site-specific work.',
      },
      {
        heading: 'Why they matter',
        body: 'Allowances are not automatically bad, but they should be clear. A low allowance can make a quote look cheaper while shifting cost risk into later decisions.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Should I avoid every allowance?', answer: 'No. Some allowances are practical early on. The important thing is to know what is provisional and what could change.' },
      { question: 'Can Operon Kitchens check allowances?', answer: 'The quote review intake captures unclear PC sums and provisional sums so they can be professionally reviewed.' },
    ],
  },
];

export const renovationGlossaryTerms = [
  ['Allowance', 'A budget amount set aside for an item or work area that still needs confirmation.'],
  ['Assumption', 'A condition the estimate relies on, such as services staying in the same location or photos matching the site.'],
  ['Exclusion', 'Work, material or responsibility that is not included in the quoted scope.'],
  ['PC sum', 'A prime cost allowance for an item that has not been finally selected.'],
  ['Provisional sum', 'An allowance for work where the final scope or cost is not yet clear.'],
  ['Site measure', 'A professional measurement visit used to confirm dimensions, access, services and site conditions.'],
  ['HBC', 'Home Building Compensation cover, which may require confirmation for NSW residential projects over the relevant threshold.'],
  ['Strata approval', 'Approval or notification that may be needed before work in an apartment or strata property.'],
  ['Engineered stone restriction', 'A compliance review item for benchtop, panel or slab products affected by the engineered-stone ban.'],
  ['Licensed trade', 'Electrical, plumbing and gas work must be handled by appropriately licensed trades.'],
];

export function getEducationPage(slug: string) {
  return educationPages.find((page) => page.slug === slug) || null;
}
