export interface Faq {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export const faqs: Faq[] = [
  {
    question: 'Is the online estimate a confirmed price?',
    answer: 'No. The online result is a planning estimate range based on the information supplied. Project-specific pricing requires site measure, selections, licensed trade checks and written scope confirmation.',
    category: 'kitchen-estimates',
    sortOrder: 10,
  },
  {
    question: 'What details affect a kitchen renovation estimate?',
    answer: 'Project type, suburb, property type, access, layout, room size, cabinetry finish, benchtop choice, appliance allowance, service movement and strata or older-property risks can all affect the planning range.',
    category: 'kitchen-estimates',
    sortOrder: 20,
  },
  {
    question: 'Can I start if I do not know all measurements?',
    answer: 'Yes. You can start with rough details and refine later. Measurements, photos, plans, appliance details and access notes usually improve confidence before professional review.',
    category: 'kitchen-estimates',
    sortOrder: 30,
  },
  {
    question: 'Why does the estimate show a range?',
    answer: 'A range is safer than a single number because selections, site conditions, access, service locations and exclusions may require confirmation before a written scope is prepared.',
    category: 'kitchen-estimates',
    sortOrder: 40,
  },
  {
    question: 'Can Operon Kitchens review an existing kitchen quote?',
    answer: 'Yes. Operon Kitchens can help review an existing kitchen quote for unclear inclusions, exclusions, PC sums, provisional sums, allowances, access assumptions and review flags.',
    category: 'quote-review',
    sortOrder: 110,
  },
  {
    question: 'What does a kitchen quote review check?',
    answer: 'A quote review looks at scope clarity, allowances, missing items, trade responsibilities, benchtop and splashback detail, appliance assumptions, demolition, waste, access and site measure requirements.',
    category: 'quote-review',
    sortOrder: 120,
  },
  {
    question: 'Why should I review scope before comparing totals?',
    answer: 'Two totals can look comparable while covering different work. Review scope first so demolition, trades, access, appliances, benchtops, exclusions and variations are clearer.',
    category: 'quote-review',
    sortOrder: 130,
  },
  {
    question: 'What happens after I submit a quote review request?',
    answer: 'Operon Kitchens stores the request for follow-up, reviews the supplied details where available, and may recommend the next step such as clarification, professional review or site measure preparation.',
    category: 'quote-review',
    sortOrder: 140,
  },
  {
    question: 'What should be included in a kitchen quote?',
    answer: 'A useful kitchen quote should make cabinetry, benchtops, splashback, appliances, demolition, rubbish removal, licensed trades, access, exclusions, variations and site measure assumptions clear.',
    category: 'scope-allowances-and-exclusions',
    sortOrder: 210,
  },
  {
    question: 'What are PC sums?',
    answer: 'PC sums are prime cost allowances for items that still need selection or confirmation. In kitchens, they can relate to appliances, fixtures, fittings or other nominated items.',
    category: 'scope-allowances-and-exclusions',
    sortOrder: 220,
  },
  {
    question: 'What are provisional sums?',
    answer: 'Provisional sums are allowances for work where the exact scope or condition is not fully known yet. They may require review once site details and trade checks are clearer.',
    category: 'scope-allowances-and-exclusions',
    sortOrder: 230,
  },
  {
    question: 'Why do exclusions matter?',
    answer: 'Exclusions show what is not covered. Painting, patching, electrical relocation, plumbing changes, rubbish removal, splashback or appliance supply can create later variation risk if unclear.',
    category: 'scope-allowances-and-exclusions',
    sortOrder: 240,
  },
  {
    question: 'Why can two kitchen quotes be hard to compare?',
    answer: 'Quotes can use different inclusions, allowance levels, trade assumptions, access conditions and exclusion wording. A lower total may not mean a clearer or lower-risk scope.',
    category: 'scope-allowances-and-exclusions',
    sortOrder: 250,
  },
  {
    question: 'Do I need a site measure before confirmed pricing?',
    answer: 'Yes. Site measure helps confirm dimensions, access, site conditions, appliance locations, services and selection assumptions before project-specific pricing and written scope.',
    category: 'site-measure-and-written-scope',
    sortOrder: 310,
  },
  {
    question: 'What gets checked during site measure?',
    answer: 'Site measure can check room dimensions, cabinet runs, services, access, walls, floors, appliance positions, benchtop conditions, strata constraints and site-specific risks.',
    category: 'site-measure-and-written-scope',
    sortOrder: 320,
  },
  {
    question: 'What is written scope confirmation?',
    answer: 'Written scope confirmation means the project inclusions, exclusions, selections, assumptions and responsibilities are documented before contract pricing or project commitment.',
    category: 'site-measure-and-written-scope',
    sortOrder: 330,
  },
  {
    question: 'Can pricing change after site measure?',
    answer: 'Yes, pricing may change if site conditions, selections, access, service requirements, strata conditions or exclusions differ from the original planning information.',
    category: 'site-measure-and-written-scope',
    sortOrder: 340,
  },
  {
    question: 'Do apartment kitchens need extra review?',
    answer: 'Often yes. Apartment kitchens may require strata review, lift booking, parking planning, work-hour limits, class 2 screening and licensed trade coordination.',
    category: 'apartments-strata-and-access',
    sortOrder: 410,
  },
  {
    question: 'What access issues affect kitchen renovation pricing?',
    answer: 'Lift access, stairs, parking, delivery distance, rubbish removal, protection of common areas and work-hour limits may affect timing, scope and review risk.',
    category: 'apartments-strata-and-access',
    sortOrder: 420,
  },
  {
    question: 'What should I check with strata before renovation?',
    answer: 'Ask your strata or building manager about approval requirements, work hours, lift bookings, parking, noise rules, protection requirements and any licensed trade documentation needed.',
    category: 'apartments-strata-and-access',
    sortOrder: 430,
  },
  {
    question: 'Why do lift bookings, parking and work hours matter?',
    answer: 'They can affect delivery, demolition, waste removal, installer access and the practical time needed on site. These items should be confirmed for the specific building.',
    category: 'apartments-strata-and-access',
    sortOrder: 440,
  },
  {
    question: 'Does a kitchen renovation need a written contract?',
    answer: 'Residential building work over $5,000 including GST may require written contract review. Project-specific confirmation is required, and this information is general guidance only.',
    category: 'nsw-contract-deposit-and-hbc-prompts',
    sortOrder: 510,
  },
  {
    question: 'What deposit questions should I ask?',
    answer: 'Ask what deposit is requested, what it covers, when it is payable and whether it aligns with applicable NSW requirements. Do not assume more than 10% is appropriate without review.',
    category: 'nsw-contract-deposit-and-hbc-prompts',
    sortOrder: 520,
  },
  {
    question: 'When might HBC review be relevant?',
    answer: 'Home Building Compensation review may be relevant for residential building work over $20,000 including GST. Ask your provider what applies to the project before commitment.',
    category: 'nsw-contract-deposit-and-hbc-prompts',
    sortOrder: 530,
  },
  {
    question: 'Is this legal advice?',
    answer: 'No. Operon Kitchens provides general planning and quote review guidance only. Legal, contract, strata, HBC and compliance questions require project-specific professional confirmation.',
    category: 'nsw-contract-deposit-and-hbc-prompts',
    sortOrder: 540,
  },
  {
    question: 'What should I check about benchtop pricing?',
    answer: 'Check the material type, thickness, joins, cut-outs, sink and cooktop details, waterfall ends, splashback scope, delivery, installation and any supplier confirmation needed.',
    category: 'materials-benchtops-and-engineered-stone',
    sortOrder: 610,
  },
  {
    question: 'Are splashback, cut-outs, joins and edge details included?',
    answer: 'They should be clearly stated. These details can materially change the scope, so unclear wording should be flagged before relying on the headline total.',
    category: 'materials-benchtops-and-engineered-stone',
    sortOrder: 620,
  },
  {
    question: 'What about engineered stone restrictions?',
    answer: 'Engineered stone restrictions may affect benchtop and splashback choices. Material selections should be checked with the supplier and installer for the specific product and project.',
    category: 'materials-benchtops-and-engineered-stone',
    sortOrder: 630,
  },
  {
    question: 'How should appliance allowances be handled?',
    answer: 'Confirm whether appliances are included, excluded, supplied by the customer, or treated as allowances. Model choices, installation and service connections should be clear.',
    category: 'materials-benchtops-and-engineered-stone',
    sortOrder: 640,
  },
  {
    question: 'What should I prepare before starting?',
    answer: 'Prepare suburb, property type, timing, budget band, rough measurements, layout notes, photos, appliance intentions, access information and any existing quote details.',
    category: 'using-operon-kitchens',
    sortOrder: 710,
  },
  {
    question: 'Can I use photos, plans or quote details?',
    answer: 'Yes. Photos, plans and quote details can improve review confidence. You can also describe them if files are not ready. File upload is not required to complete the planning estimate.',
    category: 'using-operon-kitchens',
    sortOrder: 720,
  },
  {
    question: 'Is file upload available?',
    answer: 'File storage is being handled carefully during controlled testing. If the upload path is available on a form, only provide files you are authorised to share. You can still prepare or describe quote details, photos and plans.',
    category: 'using-operon-kitchens',
    sortOrder: 730,
  },
  {
    question: 'How do I choose between estimate, quote review and request review?',
    answer: 'Use the estimate if you do not have a quote yet, quote review if you already have a contractor quote, and request review if you want help preparing scope, questions or site-measure readiness.',
    category: 'using-operon-kitchens',
    sortOrder: 740,
  },
  {
    question: 'What happens after I submit details?',
    answer: 'Your details help create planning guidance, quote review prompts or a follow-up request. The next step may be clarification, professional review, site measure or written scope preparation.',
    category: 'using-operon-kitchens',
    sortOrder: 750,
  },
];
