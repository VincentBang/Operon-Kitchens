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
        heading: '1. Start with scope, not a single number',
        body: 'Sydney kitchen renovation cost depends first on what is included: cabinetry, benchtop, splashback, demolition, trade work, appliances, waste, access and make-good. A useful estimate separates the planning range from the assumptions still needing review.',
      },
      {
        heading: '2. Major cost drivers to check',
        body: 'Cabinet quantity, cabinet finish, hardware, benchtop material, splashback detail, appliance allowance, service relocation, apartment access, strata constraints and older-property risk can all change the planning range.',
      },
      {
        heading: '3. Why a range is safer early',
        body: 'An early online estimate should show a budget range and confidence score, not contract pricing. The range narrows when measurements, photos, plans, selections and site risks are reviewed.',
      },
      {
        heading: '4. What improves estimate confidence',
        body: 'Prepare rough room dimensions, photos of every wall, service locations, access notes, appliance intentions, benchtop direction, splashback preference and any current quote. These details help reveal assumptions and exclusions before site measure.',
      },
      {
        heading: '5. Quote risks that can affect cost later',
        body: 'A low total may still carry risk if it excludes demolition, rubbish removal, final clean, painting, patching, flooring touch-ups, appliance installation, service relocation or realistic PC sums and provisional sums.',
      },
      {
        heading: '6. Apartment and strata cost prompts',
        body: 'Apartment kitchens may require lift bookings, parking coordination, work-hour limits, strata approval, protection, class 2 screening and more careful waste planning. These prompts should be visible before relying on a cost range.',
      },
      {
        heading: '7. When to move from estimate to site measure',
        body: 'Move toward site measure when the planning range is useful, the key inclusions are understood and the remaining uncertainty sits in site conditions, service checks or final selections.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Can I get a confirmed kitchen renovation price online?', answer: 'No. Operon Kitchens provides an estimate range and review flags. Price confirmation requires site measure, confirmed selections and professional scope review.' },
      { question: 'Why do two kitchen quotes look so different?', answer: 'They may include different cabinetry materials, hardware, benchtops, trade work, demolition, waste, appliances, GST, exclusions or provisional allowances.' },
      { question: 'What makes the planning range more useful?', answer: 'Measurements, photos, plans, appliance direction, finish choices, access details and a current quote can all improve confidence before site measure.' },
      { question: 'Should I compare quotes by total only?', answer: 'No. Compare the included scope, assumptions, exclusions, PC sums, provisional sums and site-measure requirements before relying on the headline total.' },
    ],
  },
  {
    slug: 'kitchen-quote-sydney',
    eyebrow: 'Kitchen quote Sydney',
    title: 'Kitchen quote Sydney: start with scope clarity before comparing totals.',
    summary: 'Understand what a useful Sydney kitchen quote should include, what affects confidence and which assumptions need review before site measure.',
    primaryCta: 'Start kitchen estimate',
    primaryHref: '/quote',
    secondaryCta: 'Review existing quote',
    secondaryHref: '/quote/review',
    sections: [
      {
        heading: '1. A kitchen quote needs scope, not just a total',
        body: 'Useful Sydney kitchen quoting starts with room type, layout, cabinetry quantity, finishes, benchtop direction, splashback, appliances, trades, demolition, waste, access and approval prompts. Without those details, totals are hard to compare.',
      },
      {
        heading: '2. What a useful quote should show',
        body: 'A quote should make inclusions, exclusions, PC sums, provisional sums, appliance allowances, GST, site-measure assumptions, warranty boundaries and work-by-others responsibilities easy to find.',
      },
      {
        heading: '3. Confidence matters before site measure',
        body: 'Operon Kitchens gives each estimate a confidence score so unclear measurements, missing photos, apartment access, service relocation or selection gaps are visible before decisions are made.',
      },
      {
        heading: '4. Cost drivers to clarify early',
        body: 'Cabinet finish, hardware, benchtop, splashback, appliance schedule, lighting, plumbing, electrical, gas, demolition, protection, rubbish removal and make-good can all change a kitchen quote.',
      },
      {
        heading: '5. Apartment and strata quote prompts',
        body: 'Apartment kitchen quotes may need extra notes for lift access, parking, work hours, strata review, class 2 screening, common-area protection and waste movement through the building.',
      },
      {
        heading: '6. Quote risks to check before commitment',
        body: 'Check for vague allowances, missing demolition, unclear appliance assumptions, excluded splashback, provisional service relocation, missing rubbish removal and site-measure clauses that could change the scope later.',
      },
      {
        heading: '7. What to prepare',
        body: 'Prepare measurements, room photos, plans if available, appliance ideas, finish direction, access notes and any existing quote. These details make review flags more useful and help narrow the planning range.',
      },
      {
        heading: '8. Next step after the estimate',
        body: 'After online intake, photos, plans or a current quote can be reviewed where available. A site measure, confirmed selections, licensed trade checks where needed and written scope confirmation are still required before contract pricing.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'What does the quote wizard ask for?', answer: 'It asks about property type, layout, size, scope inclusions, finishes, services, review flags, quote details and contact details.' },
      { question: 'Can I use the estimate to compare builders?', answer: 'Use it as a scope clarity tool. It helps you spot assumptions and exclusions, but it is not a substitute for a written provider proposal.' },
      { question: 'What should I check in a kitchen quote?', answer: 'Check inclusions, exclusions, allowances, appliance assumptions, trade scope, demolition, waste, site measure, GST, deposit and HBC prompts where relevant.' },
      { question: 'Why should I review a quote before comparing totals?', answer: 'Two quotes may price different scopes. Review helps identify missing items, unclear PC sums, provisional sums and risk flags before relying on the headline total.' },
      { question: 'Is a kitchen quote confirmed before site measure?', answer: 'Project-specific pricing should follow site measure, confirmed selections, site condition review and written scope confirmation.' },
    ],
  },
  {
    slug: 'kitchen-quote-review',
    eyebrow: 'Kitchen quote review',
    title: 'Review an existing kitchen quote before you compare totals.',
    summary: 'Use your current quote, photos and plans to help capture unclear inclusions, allowances, exclusions and risk items for professional review.',
    primaryCta: 'Review existing kitchen quote',
    primaryHref: '/quote/review',
    secondaryCta: 'Start new estimate',
    secondaryHref: '/quote',
    sections: [
      {
        heading: '1. Why quote review comes before comparing totals',
        body: 'Two kitchen quotes can show different totals because they describe different scopes. Quote review helps identify whether cabinetry, benchtop, splashback, trades, demolition, waste, access and allowances are being compared fairly.',
      },
      {
        heading: '2. What the review looks for',
        body: 'The review checks missing inclusions, unclear PC sums, provisional sums, exclusions, service relocation, appliance assumptions, benchtop clarity, splashback detail, access conditions and site measure requirements.',
      },
      {
        heading: '3. Allowances and provisional sums',
        body: 'PC sums, provisional sums and appliance allowances should be visible and realistic. A low allowance can make a quote look cheaper while shifting uncertainty into later selections or variation discussions.',
      },
      {
        heading: '4. Trade and service assumptions',
        body: 'Electrical, plumbing and gas changes require licensed trade review. The quote should make service relocation, lighting, ventilation, disconnection, reconnection and installation assumptions clear.',
      },
      {
        heading: '5. Apartment, strata and access prompts',
        body: 'Apartment quotes may need extra review for lift bookings, parking, work hours, building management rules, protection, waste path and class 2 screening where relevant.',
      },
      {
        heading: '6. Contract, deposit and HBC review prompts',
        body: 'Residential building work may require written contract review, deposit checks and HBC review depending on the project value and scope. These are prompts for project-specific confirmation, not legal advice.',
      },
      {
        heading: '7. What to prepare',
        body: 'Prepare the quote PDF or image, room photos, plans, appliance schedules, finish notes, variation documents and any questions already raised by the provider. The clearer the documents, the stronger the review context.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Does the review automatically approve a quote?', answer: 'No. The intake captures structured review flags. A person still needs to review the scope before advice or next steps are confirmed.' },
      { question: 'Can the review identify missing items?', answer: 'It is designed to capture likely missing or unclear items so they can be checked professionally before you rely on the quote.' },
      { question: 'What questions should I ask before accepting a kitchen quote?', answer: 'Ask whether demolition, rubbish removal, appliances, splashback, service relocation, deposit terms, HBC prompts, site measure and written scope are clearly included.' },
      { question: 'Is quote review legal advice?', answer: 'No. It is general scope and quote clarity guidance. Legal, strata, licensed trade and contract questions require project-specific professional confirmation.' },
    ],
  },
  {
    slug: 'apartment-kitchen-renovation-sydney',
    eyebrow: 'Apartment kitchen renovation Sydney',
    title: 'Apartment kitchen renovation in Sydney needs extra scope clarity.',
    summary: 'Plan apartment and strata kitchen work with clearer prompts for access, lifts, work hours, services, building rules, class 2 screening and written scope confirmation.',
    primaryCta: 'Start apartment estimate',
    primaryHref: '/quote',
    secondaryCta: 'Review apartment quote',
    secondaryHref: '/quote/review',
    sections: [
      {
        heading: '1. Who this guide is for',
        body: 'This guide is for Sydney apartment owners, investors and strata residents planning a kitchen refresh, full apartment kitchen renovation or quote review where building rules, access and services may affect the scope.',
      },
      {
        heading: '2. Apartment risks to capture early',
        body: 'Apartment projects may need strata approval, lift bookings, parking planning, protection, noise controls, work-hour limits, waste planning and careful confirmation of the path from loading area to kitchen.',
      },
      {
        heading: '3. Typical apartment kitchen scope',
        body: 'A typical scope may include demolition, cabinetry, benchtop, splashback, appliance fit-off, plumbing, electrical, ventilation, delivery, waste removal and protection of common areas. Each item should be clear before comparing quote totals.',
      },
      {
        heading: '4. Cost and timing drivers',
        body: 'Apartment kitchen renovation cost and timing can shift with lift access, parking, delivery windows, building management rules, service locations, noise restrictions, cabinetry size, benchtop handling and whether work is limited to like-for-like replacement.',
      },
      {
        heading: '5. Services, strata and class 2 prompts',
        body: 'Plumbing, electrical and gas changes must be confirmed by appropriately licensed trades. Apartment work may also require strata review, DBP or class 2 screening depending on the building, work type and provider responsibilities.',
      },
      {
        heading: '6. Quote risks to check',
        body: 'Check whether the quote includes protection, lift bookings, rubbish removal, service disconnection, service relocation, make-good, delivery coordination, appliance installation, access constraints and strata-related conditions.',
      },
      {
        heading: '7. What to prepare before review',
        body: 'Prepare floor plans, strata requirements, lift dimensions, parking instructions, access notes, photos of existing services and any current quote. File upload may help where available, but these details can also be described during request review.',
      },
      {
        heading: '8. What improves confidence',
        body: 'Confidence improves when measurements, service locations, photos, access conditions, strata requirements and finish selections are clear. If those items are missing, the estimate should stay wider and flag review risk.',
        expandable: true,
      },
      {
        heading: '9. Next step before pricing commitment',
        body: 'Use the planning estimate or quote review to identify assumptions first. Project-specific pricing still requires site measure, confirmed selections, licensed trade checks where needed and written scope confirmation.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Are apartment kitchens more expensive?', answer: 'They can be, depending on access, approvals, service constraints, waste handling and building rules. The estimate should flag those items rather than hide them.' },
      { question: 'Do I need strata approval?', answer: 'Many apartment renovations require some form of approval or notification. Confirm with your strata manager and obtain project-specific advice for your building.' },
      { question: 'What should an apartment kitchen quote include?', answer: 'Check cabinetry, benchtop, splashback, demolition, waste, delivery, protection, service assumptions, appliance installation, access conditions and site-measure requirements.' },
      { question: 'Can apartment service changes affect the quote?', answer: 'Yes. Plumbing, electrical, ventilation and gas assumptions can affect scope and may require licensed trade review before pricing is treated as reliable.' },
      { question: 'Is this strata or legal advice?', answer: 'No. These are general planning and quote review prompts. Strata, legal, contract and licensed trade questions require project-specific confirmation.' },
    ],
  },
  {
    slug: 'kitchen-benchtop-options-after-engineered-stone-ban',
    eyebrow: 'Benchtop options after engineered stone ban',
    title: 'Kitchen benchtop options after engineered stone restrictions.',
    summary: 'Compare benchtop directions such as porcelain, sintered surfaces, stainless steel, timber, laminate, natural stone and supplier-confirmed products while checking quote scope and material review prompts.',
    primaryCta: 'Start estimate',
    primaryHref: '/quote',
    secondaryCta: 'Review benchtop quote',
    secondaryHref: '/quote/review',
    sections: [
      {
        heading: '1. What changed',
        body: 'Australia introduced restrictions affecting engineered stone benchtops, panels and slabs from 1 July 2024. Product suitability and safe-work requirements should be confirmed by the supplier and installer before selection. Operon Kitchens treats this as a review prompt, not a compliance approval.',
      },
      {
        heading: '2. Who this guide is for',
        body: 'This guide is for Sydney homeowners comparing benchtop materials, reviewing a benchtop replacement quote, planning a cabinetry and benchtop refresh, or trying to understand why two surface quotes are not directly comparable.',
      },
      {
        heading: '3. Common alternative directions',
        body: 'Porcelain, sintered surfaces, stainless steel, timber, laminate, natural stone and supplier-confirmed lower-silica products may be considered, subject to supplier documentation, fabrication requirements, maintenance expectations, handling constraints and project suitability.',
      },
      {
        heading: '4. Material choice changes the quote',
        body: 'Different materials can change slab size, join positions, edge detail, cut-outs, templating, installation method, lead time, handling, warranty boundaries and the relationship with splashback, sink, tap and cooktop scope.',
      },
      {
        heading: '5. What a benchtop quote should show',
        body: 'A useful quote should state the benchtop material, thickness, supplier or product direction, edge detail, cut-outs, joins, splashback relationship, removal/disposal scope, installation assumptions and whether any material documentation or safe-work confirmation is still required.',
      },
      {
        heading: '6. Allowances and provisional items to check',
        body: 'Watch for PC sums or provisional sums covering material selection, cut-outs, edge details, service disconnection, splashback work, cabinet strengthening, access handling, waste or make-good. These can make a lower total less reliable until clarified.',
      },
      {
        heading: '7. Apartment and access considerations',
        body: 'Apartment projects may require lift booking, parking coordination, building protection, work-hour limits and careful slab handling. Heavy or fragile surfaces may need more access planning than a simple quote total suggests.',
      },
      {
        heading: '8. What to prepare before review',
        body: 'Prepare photos of each benchtop run, rough dimensions, sink/tap/cooktop details, splashback notes, material preferences, access constraints and any current quote. These details help separate material choice from installation and make-good assumptions.',
      },
      {
        heading: '9. Exclusions to check',
        body: 'Check whether the quote excludes splashback removal, tile damage, wall patching, cabinet strengthening, plumbing/electrical/gas disconnection or reconnection, appliance refit, delivery, stair carry, waste, final clean and material documentation.',
      },
      {
        heading: '10. Use quote review before comparing totals',
        body: 'Before choosing a benchtop quote, compare material assumptions, allowances, exclusions, cut-outs, joins, access and service boundaries. Project-specific confirmation is still required before relying on the final written scope.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Can I select engineered stone now?', answer: 'Do not assume it is allowed. Products and work must be checked against current WHS requirements and supplier documentation.' },
      { question: 'Which benchtop is best?', answer: 'The best option depends on budget, look, durability, maintenance, fabrication needs and compliance confirmation.' },
      { question: 'Are porcelain and sintered surfaces the same as engineered stone?', answer: 'Do not rely on category names alone. Ask the supplier and installer for project-specific product documentation and safe-work confirmation before selection.' },
      { question: 'What quote risks should I check for benchtops?', answer: 'Check cut-outs, joins, edge detail, removal, disposal, splashback, cabinet support, service reconnection, access handling, waste and material documentation.' },
      { question: 'Can Operon Kitchens approve a material?', answer: 'No. Operon Kitchens provides general quote clarity and review prompts. Material compliance and safe-work questions require supplier, installer and project-specific confirmation.' },
      { question: 'Should I review a benchtop-only quote?', answer: 'Yes if the quote is unclear about material, cut-outs, joins, splashback, service reconnection, access, waste or exclusions before you compare totals.' },
    ],
  },
  {
    slug: 'kitchen-renovation-process',
    eyebrow: 'Kitchen renovation process',
    title: 'Kitchen renovation process in Sydney: from planning estimate to written scope.',
    summary: 'A practical guide to moving from early budget planning to quote review, site measure, licensed trade prompts, confirmed selections and written scope confirmation.',
    primaryCta: 'Start kitchen estimate',
    primaryHref: '/quote',
    secondaryCta: 'Review current quote',
    secondaryHref: '/quote/review',
    sections: [
      {
        heading: '1. Start with your kitchen goal and budget range',
        body: 'Clarify whether the project is a refresh, full renovation, apartment kitchen or premium renovation. A broad budget band is enough to start; the range improves as more detail is added.',
      },
      {
        heading: '2. Measure layout, access and existing conditions',
        body: 'Record the current layout, approximate dimensions, access, parking, lift conditions, strata constraints and visible service locations. These details affect quote confidence before site measure.',
      },
      {
        heading: '3. Choose scope: refresh, full renovation or apartment kitchen',
        body: 'Separate cabinetry and benchtop refresh work from full renovation work. Apartment kitchens often need extra review around access, strata, work hours, class 2 prompts and waste handling.',
      },
      {
        heading: '4. Check selections, finishes and allowances',
        body: 'Cabinetry finish, hardware, benchtop, splashback, appliances and ventilation assumptions should be visible before a kitchen quote is treated as comparable.',
      },
      {
        heading: '5. Compare quotes beyond the headline total',
        body: 'A lower total can still carry more risk if demolition, rubbish removal, licensed trades, appliance allowances, benchtop details or exclusions are unclear.',
      },
      {
        heading: '6. Review PC sums, provisional sums and exclusions',
        body: 'Prime cost sums, provisional sums and exclusions should be reviewed so uncertain selections or work do not become surprise variation discussions later.',
      },
      {
        heading: '7. Prepare for site measure',
        body: 'Prepare quote details, photos, plans, service locations and questions before site measure. File upload is helpful where available but is not required to complete a planning estimate.',
      },
      {
        heading: '8. Confirm licensed trades, strata and contract prompts',
        body: 'Electrical, plumbing and gas work require licensed trade review. Apartment, HBC, deposit, written contract, older-property and material prompts may also require project-specific confirmation.',
      },
      {
        heading: '9. Confirm written scope before pricing commitment',
        body: 'Project-specific pricing should follow site measure, confirmed selections, site condition review, trade confirmation where needed and written scope confirmation.',
        expandable: true,
      },
      {
        heading: '10. Request review or start estimate',
        body: 'If you do not have a quote, start the planning estimate. If you already have a quote, review scope, allowances, exclusions and review prompts before comparing totals.',
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
    summary: 'Understand item allowances and uncertain work allowances before relying on a kitchen quote total.',
    primaryCta: 'Review existing quote',
    primaryHref: '/quote/review',
    secondaryCta: 'Start estimate',
    secondaryHref: '/quote',
    sections: [
      {
        heading: '1. Why allowances matter in kitchen quotes',
        body: 'PC sums and provisional sums are not automatically bad, but they can make two kitchen quotes hard to compare. The key is whether the allowance is realistic, clearly described and connected to the scope it affects.',
      },
      {
        heading: '2. PC sums are usually item allowances',
        body: 'A prime cost sum is usually an allowance for an item that has not been finally selected. In kitchens this may relate to appliances, sinks, taps, fixtures, fittings or visible products.',
      },
      {
        heading: '3. Provisional sums are usually work allowances',
        body: 'A provisional sum is usually an allowance for work where the exact scope is not known yet. In kitchens this can involve demolition, preparation, service relocation, access-sensitive work or site-specific repairs.',
      },
      {
        heading: '4. Common kitchen allowance examples',
        body: 'Common examples include appliance allowances, tapware, sinks, splashback allowances, benchtop cut-outs, electrical changes, plumbing relocation, patching, waste removal and hidden preparation work.',
      },
      {
        heading: '5. Why a low allowance can distort the total',
        body: 'A quote with low allowances can appear cheaper at the start while shifting decision risk into later selections or variations. Review the allowance amount, what it includes and what happens if the final selection differs.',
      },
      {
        heading: '6. Questions to ask before accepting',
        body: 'Ask what each allowance covers, whether labour is included, whether GST is included, what product level is assumed, what happens if actual work differs and whether the allowance was based on site measure.',
      },
      {
        heading: '7. What improves quote confidence',
        body: 'Confidence improves when appliances, fixtures, finishes, services, access and site conditions are confirmed. If those details are missing, a wider planning range and review flags are safer than treating the total as settled.',
      },
      {
        heading: '8. Review allowances before comparing totals',
        body: 'Before choosing between kitchen quotes, compare the PC sums, provisional sums, exclusions, site-measure notes and written scope. A quote with clearer allowances may be easier to rely on than a lower headline total.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Should I avoid every allowance?', answer: 'No. Some allowances are practical early on. The important thing is to know what is provisional, what could change and what must be confirmed before commitment.' },
      { question: 'Can Operon Kitchens check allowances?', answer: 'The quote review intake captures unclear PC sums and provisional sums so they can be reviewed as part of scope and quote clarity.' },
      { question: 'Are PC sums the same as provisional sums?', answer: 'No. PC sums usually relate to selected items. Provisional sums usually relate to work where the final scope is not known yet.' },
      { question: 'What is a risky kitchen allowance?', answer: 'An allowance may need review if it is very low, vague, missing labour assumptions, missing GST context or disconnected from the products and work you actually expect.' },
      { question: 'Is allowance review legal advice?', answer: 'No. Operon Kitchens provides general quote clarity and scope guidance. Contract, legal and provider-specific questions require project-specific confirmation.' },
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
    summary: 'Use this Sydney kitchen quote checklist to check inclusions, exclusions, allowances, trade scope, site-measure assumptions and review flags before relying on a kitchen quote total.',
    primaryCta: 'Review my quote',
    primaryHref: '/quote/review',
    secondaryCta: 'Start estimate',
    secondaryHref: '/quote',
    sections: [
      {
        heading: '1. Start with the included scope',
        body: 'Check whether demolition, delivery, cabinetry, benchtop, splashback, sink, tap, appliances, plumbing, electrical, gas, painting, patching, waste and final clean are clearly included or excluded.',
      },
      {
        heading: '2. Confirm cabinetry and benchtop details',
        body: 'Look for cabinet finish, hardware, internal storage, benchtop material, thickness, joins, cut-outs, edge detail, waterfall ends, splashback assumptions and engineered-stone restriction prompts where relevant.',
      },
      {
        heading: '3. Question PC sums and provisional sums',
        body: 'Ask whether PC sums and provisional sums are realistic, what each allowance includes, what is excluded and what changes if the final selection or site work differs.',
      },
      {
        heading: '4. Check trade and service boundaries',
        body: 'Electrical, plumbing and gas work should be described clearly and reviewed by appropriately licensed trades where relevant. Confirm disconnection, relocation, reconnection, appliance install and certification responsibilities.',
      },
      {
        heading: '5. Review access, strata and older-property risks',
        body: 'Apartment access, lift bookings, parking, work hours, common-area protection, strata review, older-property asbestos risk and waste movement can all affect scope and timing.',
      },
      {
        heading: '6. Check contract, deposit and HBC prompts',
        body: 'For NSW residential work, written contract, deposit and HBC prompts may require review depending on value and scope. This checklist is general guidance only and not legal advice.',
      },
      {
        heading: '7. Prepare your quote review pack',
        body: 'Prepare the quote, photos, plans, appliance list, finish preferences, strata notes and questions you want answered. Only share documents you are authorised to share.',
      },
      {
        heading: '8. Decide the next step',
        body: 'If the quote is missing inclusions, exclusions, allowance detail or site-measure assumptions, request clarification before comparing totals. Project-specific pricing still requires site measure, selections and written scope confirmation.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Should I accept the cheapest kitchen quote?', answer: 'Not until you understand whether the cheaper quote includes the same scope, quality, allowances and risk items.' },
      { question: 'What should I prepare for review?', answer: 'Prepare the quote, photos, plans, appliance list and any strata or approval notes you are authorised to share.' },
      { question: 'What are the highest-risk missing items?', answer: 'Common review items include demolition, rubbish removal, splashback, appliance allowances, service relocation, painting, patching, access costs and provisional work.' },
      { question: 'Should trade work be listed separately?', answer: 'It should be clear who is responsible for electrical, plumbing and gas work, and whether licensed trade inspection or confirmation is required.' },
      { question: 'Is this checklist a contract review?', answer: 'No. It is a quote clarity checklist. Contract, legal, strata and licensed trade questions require project-specific confirmation.' },
    ],
  },
  {
    slug: 'why-kitchen-quotes-vary',
    eyebrow: 'Why quotes vary',
    title: 'Why kitchen renovation quotes vary so much.',
    summary: 'Kitchen quotes can vary because they are often pricing different assumptions, allowances, exclusions and site risks. Learn the common differences before comparing totals.',
    primaryCta: 'Review quote differences',
    primaryHref: '/quote/review',
    secondaryCta: 'Build a planning range',
    secondaryHref: '/quote',
    sections: [
      {
        heading: '1. The total hides many choices',
        body: 'Cabinet quantity, finish tier, hardware, benchtop, splashback, appliances, trades, access and approvals can all change the same-looking kitchen brief.',
      },
      {
        heading: '2. Quotes may price different scopes',
        body: 'One kitchen quote may cover demolition, cabinetry, benchtop, splashback, service reconnection, waste and final clean. Another may price only part of that scope and leave the rest by others.',
      },
      {
        heading: '3. Exclusions change the real comparison',
        body: 'One quote may include demolition, rubbish removal, delivery, patching and final clean while another leaves them as by others or provisional.',
      },
      {
        heading: '4. Allowances can make a quote look cheaper',
        body: 'PC sums, provisional sums and appliance allowances can lower the headline total if the allowance is low or the work is not fully described. The risk is not the allowance itself, but unclear assumptions.',
      },
      {
        heading: '5. Site conditions can change the work',
        body: 'Uneven walls, service locations, older-property risk, access, lift bookings, parking, strata conditions and material handling can affect scope after site measure.',
      },
      {
        heading: '6. Trade responsibilities may differ',
        body: 'Electrical, plumbing and gas assumptions should be visible. A quote that excludes licensed trade work should not be compared directly with one that includes coordination and reconnection.',
      },
      {
        heading: '7. Confidence changes the range',
        body: 'A quote based on site measure, photos, known selections and clear service assumptions should be treated differently from a quote with many unknowns.',
      },
      {
        heading: '8. Normalise before comparing totals',
        body: 'Compare inclusions, exclusions, allowances, trade responsibilities, access assumptions, site-measure clauses and written scope before relying on the total. Operon Kitchens quote review is general guidance only and not legal advice.',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Why is one quote much cheaper?', answer: 'It may be a genuine efficiency, or it may exclude scope, use lower allowances or leave risk unresolved.' },
      { question: 'How do I compare fairly?', answer: 'Normalise inclusions, exclusions, allowances and review flags before comparing the total.' },
      { question: 'Can a low quote become more expensive later?', answer: 'It may if important work is excluded, provisional, under-allowed or subject to site conditions that have not been reviewed.' },
      { question: 'Do apartment kitchen quotes vary more?', answer: 'They can. Access, lift booking, parking, strata rules, work hours and waste movement may be handled differently by different providers.' },
      { question: 'What improves quote confidence?', answer: 'Site measure, photos, plans, confirmed selections, clear trade responsibilities and written scope confirmation all improve confidence.' },
    ],
  },
  {
    slug: 'questions-before-accepting-kitchen-quote',
    eyebrow: 'Questions before accepting',
    title: 'Questions to ask before accepting a kitchen quote.',
    summary: 'Use these customer-ready questions to clarify scope, allowances, services, exclusions, access, strata prompts and site-measure requirements before you proceed.',
    primaryCta: 'Review quote details',
    primaryHref: '/quote/review',
    secondaryCta: 'Start estimate',
    secondaryHref: '/quote',
    sections: [
      {
        heading: '1. Scope questions',
        body: 'Is demolition included? Is rubbish removal included? Are appliances included or PC sums? Is splashback included? What painting, patching, flooring touch-up or final clean is excluded?',
      },
      {
        heading: '2. Cabinetry, benchtop and appliance questions',
        body: 'What cabinet finish, hardware and storage are included? What benchtop material, edge, joins and cut-outs are priced? Are appliance supply, installation and allowances clearly separated?',
      },
      {
        heading: '3. PC sum and provisional sum questions',
        body: 'Which items are PC sums? Which works are provisional sums? What happens if the selection or actual work differs? Can the provider explain the allowance basis in writing?',
      },
      {
        heading: '4. Trade questions',
        body: 'Is plumbing relocation included? Is electrical upgrade work included? Is gas involved? Which licensed trades will confirm, disconnect, reconnect and sign off the work where required?',
      },
      {
        heading: '5. Access and strata questions',
        body: 'Are lift bookings, parking, work hours, common-area protection, rubbish movement and strata or building-management requirements included or left for the owner to arrange?',
      },
      {
        heading: '6. Contract and payment questions',
        body: 'Is the written contract pathway clear? Are deposit, HBC and variation prompts addressed for the project value? Ask for project-specific confirmation rather than relying on verbal assumptions.',
      },
      {
        heading: '7. Site-measure questions',
        body: 'What happens after site measure? What assumptions could change the scope? Which dimensions, service locations, materials and site conditions still need confirmation?',
      },
      {
        heading: '8. Decision questions',
        body: 'What should be clarified before acceptance? What should be added to the written scope? Are exclusions, allowances, licensed trade checks and material restriction prompts clear enough to compare the quote safely?',
        expandable: true,
      },
    ],
    faqs: [
      { question: 'Should every answer be in writing?', answer: 'Important scope, allowance and exclusion answers should be documented before you rely on them.' },
      { question: 'Can I continue without a quote file?', answer: 'Yes. The quote review page includes a no-file checklist path for early comparison.' },
      { question: 'What if the provider says an item is standard?', answer: 'Ask where it appears in the written scope. Standard inclusions can vary between providers and should not be assumed.' },
      { question: 'Should I ask about deposit and HBC?', answer: 'Yes. For NSW residential work, deposit and HBC prompts may require review depending on project value and scope. This is not legal advice.' },
      { question: 'What is the safest next step if answers are unclear?', answer: 'Request written clarification or use quote review before comparing totals or moving toward site measure.' },
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
