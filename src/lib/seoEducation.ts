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
    summary: 'Understand the main cost drivers before you book a site visit: layout, cabinetry, surfaces, services, access, approvals and selection certainty.',
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
        body: 'An early online estimate should show a budget range and confidence score, not contract pricing. The range narrows when measurements, photos, plans, selections and site risks are reviewed.',
      },
      {
        heading: 'What to prepare',
        body: 'Prepare basic room dimensions, photos of every wall, service locations, access notes, appliance intentions and any current quotes. This helps reveal assumptions and exclusions before site measure.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Can I get a confirmed kitchen renovation price online?', answer: 'No. Operon Kitchens provides an estimate range and review flags. Price confirmation requires site measure, confirmed selections and professional scope review.' },
      { question: 'Why do two kitchen quotes look so different?', answer: 'They may include different cabinetry materials, hardware, benchtops, trade work, demolition, waste, appliances, GST, exclusions or provisional allowances.' },
    ],
  },
  {
    slug: 'kitchen-quote-sydney',
    eyebrow: 'Kitchen quote Sydney',
    title: 'A clearer way to start a Sydney kitchen quote.',
    summary: 'Build an estimate that separates scope, confidence, assumptions and review items before site measure.',
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
        body: 'After online intake, photos, plans or a current quote can be reviewed. A site measure and confirmed selections are still required before written scope confirmation.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'What does the quote wizard ask for?', answer: 'It asks about property type, layout, size, scope inclusions, finishes, services, risk flags, uploads and contact details.' },
      { question: 'Can I use the estimate to compare builders?', answer: 'Use it as a scope clarity tool. It helps you spot assumptions and exclusions, but it is not a substitute for a written builder proposal.' },
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
      { question: 'Does the review automatically approve a quote?', answer: 'No. The intake captures structured review flags. A person still needs to review the scope before advice or next steps are confirmed.' },
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
    summary: 'Compare benchtop directions such as porcelain, stainless steel, timber, laminate, natural stone and supplier-confirmed low-silica products.',
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
    summary: 'Move from online estimate to document upload, review, site measure, selections and written scope confirmation without pretending everything is known on day one.',
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
        heading: '3. Written scope confirmation',
        body: 'Written scope confirmation follows confirmed site conditions, product selections, trade requirements and client decisions. The early estimate is a planning range only.',
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
  {
    slug: 'kitchen-quote-vs-estimate',
    eyebrow: 'Quote vs estimate',
    title: 'Kitchen quote vs estimate: what each one should tell you.',
    summary: 'Understand the difference between an early planning range, a quote for defined scope and the written confirmation needed after site measure.',
    primaryCta: 'Review existing quote',
    primaryHref: '/quote/review',
    secondaryCta: 'Start kitchen estimate',
    secondaryHref: '/quote',
    sections: [
      {
        heading: 'An estimate shows planning direction',
        body: 'A kitchen estimate is useful when it shows a range, confidence score, assumptions, exclusions and items that still need professional review.',
      },
      {
        heading: 'A quote should show defined scope',
        body: 'A useful kitchen quote should make demolition, cabinetry, surfaces, appliances, trades, delivery, waste, GST, exclusions and allowances clear enough to compare.',
      },
      {
        heading: 'Why this matters before accepting',
        body: 'A lower number can be misleading if it leaves trade relocation, PC sums, provisional sums, splashback, rubbish removal or access conditions unresolved.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Can I compare an estimate with a quote?', answer: 'Only carefully. Compare scope, assumptions and missing items first, then compare the range or total.' },
      { question: 'When should I request review?', answer: 'Request review when you have a quote, photos, plans or enough scope detail to identify unclear inclusions.' },
    ],
  },
  {
    slug: 'pc-sums-vs-provisional-sums',
    eyebrow: 'PC sums vs provisional sums',
    title: 'PC sums vs provisional sums in kitchen quotes.',
    summary: 'Learn how item allowances and uncertain work allowances can change the real cost of a kitchen renovation.',
    primaryCta: 'Review allowance clarity',
    primaryHref: '/quote/review',
    secondaryCta: 'Read PC sums guide',
    secondaryHref: '/kitchen-pc-sums-and-provisional-sums',
    sections: [
      {
        heading: 'PC sums are usually item allowances',
        body: 'Appliances, fixtures, sinks, taps or selected products may be shown as PC sums when the exact product has not been chosen.',
      },
      {
        heading: 'Provisional sums are usually work allowances',
        body: 'Demolition, service relocation, preparation or access-sensitive work may be provisional when the final scope is not known yet.',
      },
      {
        heading: 'The check before comparing totals',
        body: 'Ask whether the allowance is realistic, what happens if it is exceeded, and whether the quote explains the labour or installation attached to that allowance.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Are allowances a warning sign?', answer: 'Not always. They are useful when honest and realistic. The risk is unclear or low allowances that shift cost later.' },
      { question: 'Can Operon Kitchens check allowances?', answer: 'The review intake captures allowance wording so it can be checked against the rest of the scope.' },
    ],
  },
  {
    slug: 'flatpack-kitchen-vs-custom-kitchen',
    eyebrow: 'Flatpack vs custom kitchen',
    title: 'Flatpack kitchen vs custom kitchen: compare scope, not just price.',
    summary: 'Understand where flatpack, modular and custom joinery quotes differ in design fit, installation, trades, finish and review risk.',
    primaryCta: 'Start kitchen estimate',
    primaryHref: '/quote',
    secondaryCta: 'Review existing quote',
    secondaryHref: '/quote/review',
    sections: [
      {
        heading: 'Flatpack can work when scope is simple',
        body: 'Flatpack or modular kitchens may suit straightforward layouts, standard sizes and customers who understand what is included and what is by others.',
      },
      {
        heading: 'Custom joinery changes the comparison',
        body: 'Custom kitchens can handle uneven walls, premium finishes, exact storage needs, integrated appliances and design detail, but the quote needs clearer documentation.',
      },
      {
        heading: 'What to check',
        body: 'Compare installation, delivery, waste, trade disconnection, benchtop cut-outs, splashback, make-good, warranty boundaries and who coordinates site issues.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Is custom always better?', answer: 'No. The right path depends on layout, finish goals, budget, timeline and how much coordination the project needs.' },
      { question: 'Can I use the wizard for both?', answer: 'Yes. Use the estimate to clarify scope and confidence before choosing a delivery model.' },
    ],
  },
  {
    slug: 'kitchen-renovation-quote-checklist',
    eyebrow: 'Kitchen quote checklist',
    title: 'Kitchen renovation quote checklist before you accept.',
    summary: 'Use this checklist to check inclusions, exclusions, allowances, trade scope and review flags before relying on a kitchen quote total.',
    primaryCta: 'Review my quote',
    primaryHref: '/quote/review',
    secondaryCta: 'Start estimate',
    secondaryHref: '/quote',
    sections: [
      {
        heading: 'Inclusions to confirm',
        body: 'Check demolition, delivery, cabinetry, benchtop, splashback, sink, tap, appliances, plumbing, electrical, gas, painting, patching, waste and final clean.',
      },
      {
        heading: 'Allowances to question',
        body: 'Ask whether PC sums and provisional sums are realistic, what they include and what changes if the final selection or work scope differs.',
      },
      {
        heading: 'Approval and compliance prompts',
        body: 'Check HBC and deposit guidance, licensed trades, strata approval, DBP/class 2 screening, engineered-stone restrictions and site measure requirements where relevant.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Should I accept the cheapest kitchen quote?', answer: 'Not until you understand whether the cheaper quote includes the same scope, quality, allowances and risk items.' },
      { question: 'What should I upload for review?', answer: 'Upload the quote, photos, plans, appliance list and any strata or approval notes.' },
    ],
  },
  {
    slug: 'why-kitchen-quotes-vary',
    eyebrow: 'Why quotes vary',
    title: 'Why kitchen renovation quotes vary so much.',
    summary: 'Kitchen quotes can vary because they are often pricing different assumptions. Learn the common differences before comparing totals.',
    primaryCta: 'Review quote differences',
    primaryHref: '/quote/review',
    secondaryCta: 'Build a planning range',
    secondaryHref: '/quote',
    sections: [
      {
        heading: 'The total hides many choices',
        body: 'Cabinet quantity, finish tier, hardware, benchtop, splashback, appliances, trades, access and approvals can all change the same-looking kitchen brief.',
      },
      {
        heading: 'Exclusions change the real comparison',
        body: 'One quote may include demolition, rubbish removal, delivery, patching and final clean while another leaves them as by others or provisional.',
      },
      {
        heading: 'Confidence changes the range',
        body: 'A quote based on site measure, photos, known selections and clear service assumptions should be treated differently from a quote with many unknowns.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Why is one quote much cheaper?', answer: 'It may be a genuine efficiency, or it may exclude scope, use lower allowances or leave risk unresolved.' },
      { question: 'How do I compare fairly?', answer: 'Normalise inclusions, exclusions, allowances and review flags before comparing the total.' },
    ],
  },
  {
    slug: 'questions-before-accepting-kitchen-quote',
    eyebrow: 'Questions before accepting',
    title: 'Questions to ask before accepting a kitchen quote.',
    summary: 'Use these questions to clarify scope, allowances, services, approvals and site-measure requirements before you proceed.',
    primaryCta: 'Upload quote for review',
    primaryHref: '/quote/review',
    secondaryCta: 'Start estimate',
    secondaryHref: '/quote',
    sections: [
      {
        heading: 'Scope questions',
        body: 'Is demolition included? Is rubbish removal included? Are appliances included or PC sums? Is splashback included? What painting or patching is excluded?',
      },
      {
        heading: 'Trade questions',
        body: 'Is plumbing relocation included? Is electrical upgrade work included? Is gas involved? Which licensed trades will confirm the work?',
      },
      {
        heading: 'Decision questions',
        body: 'What happens after site measure? What assumptions could change the price? Are deposit, HBC, strata and material compliance prompts clearly addressed?',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Should every answer be in writing?', answer: 'Important scope, allowance and exclusion answers should be documented before you rely on them.' },
      { question: 'Can I continue without a quote file?', answer: 'Yes. The quote review page includes a no-file checklist path for early comparison.' },
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
