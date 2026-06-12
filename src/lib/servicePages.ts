export interface ServicePage {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  whoFor: string[];
  typicalScope: string[];
  scopeDrivers: string[];
  preparation: string[];
  confidenceBoosters: string[];
  quoteRisks: string[];
  exclusionsToCheck: string[];
  relatedAreas: string[];
  related: string[][];
  faqs: string[][];
}

export const servicePages: ServicePage[] = [
  {
    slug: 'full-kitchen-renovation-sydney',
    eyebrow: 'Full kitchen renovation Sydney',
    title: 'Full kitchen renovation estimates for Sydney homes.',
    summary: 'Plan cabinetry, surfaces, demolition, appliances, trades, access and review flags before booking site measure.',
    whoFor: ['Homeowners replacing cabinetry, benchtops, splashback and trade scope together', 'Clients comparing builder or joinery proposals before committing', 'Apartment or house projects where access, trades or approvals need early review'],
    typicalScope: ['Design direction and layout confirmation', 'Cabinetry, surfaces, splashback, appliances and trade allowances', 'Demolition, waste, make-good, access and final clean assumptions'],
    scopeDrivers: ['Cabinetry quantity and finish tier', 'Benchtop and splashback selections', 'Plumbing, electrical and gas changes', 'Demolition, waste, patching and clean-up'],
    preparation: ['Photos of all walls', 'Rough dimensions', 'Appliance preferences', 'Any plans, strata notes or current quotes'],
    confidenceBoosters: ['Measured cabinet runs or floorplan', 'Photos of each wall and service point', 'Known appliance allowance or model list', 'Clear decision on whether services move'],
    quoteRisks: ['Unclear service relocation', 'Provisional allowances', 'Older-property conditions', 'Approval pathway uncertainty'],
    exclusionsToCheck: ['Painting and plaster patching', 'Flooring transitions', 'Waste removal and protection', 'Engineering, approvals and strata conditions'],
    relatedAreas: ['Mosman', 'Randwick', 'Chatswood', 'Parramatta'],
    related: [['Kitchen renovation cost Sydney', '/kitchen-renovation-cost-sydney'], ['Kitchen renovation process', '/kitchen-renovation-process']],
    faqs: [['Is a full renovation estimate confirmed online?', 'No. It remains a planning range until site measure, selections and written scope confirmation.'], ['What affects full kitchen scope most?', 'Cabinetry quantity, finish tier, benchtop choice, trade relocation and access conditions.']],
  },
  {
    slug: 'kitchen-cabinetry-benchtop-refresh',
    eyebrow: 'Cabinetry and benchtop refresh',
    title: 'Kitchen cabinetry and benchtop refresh planning.',
    summary: 'Separate refresh scope from full renovation work so exclusions, trade boundaries and make-good items are easier to compare.',
    whoFor: ['Customers keeping the broad kitchen layout', 'Projects replacing doors, panels, hardware, benchtops or splashback', 'Owners checking whether a refresh quote hides full-renovation work'],
    typicalScope: ['Door, panel and hardware direction', 'Benchtop and splashback replacement assumptions', 'Sink, tap, cooktop and service disconnection/reconnection review'],
    scopeDrivers: ['Door and panel finish', 'Hardware and accessory level', 'Benchtop material and cut-outs', 'Painting, patching and service assumptions'],
    preparation: ['Existing cabinet photos', 'Benchtop measurements', 'Sink and tap notes', 'Finish direction'],
    confidenceBoosters: ['Clear cabinet condition photos', 'Benchtop dimensions and appliance cut-outs', 'Finish tier selected', 'Known service reconnection scope'],
    quoteRisks: ['Hidden full-renovation work', 'Unclear make-good scope', 'Benchtop compliance confirmation', 'Service disconnection/reconnection'],
    exclusionsToCheck: ['Cabinet carcass repairs', 'Wall patching after removal', 'Splashback make-good', 'Appliance reconnection assumptions'],
    relatedAreas: ['Lane Cove', 'Balmain', 'Coogee', 'Burwood'],
    related: [['Benchtop options', '/kitchen-benchtop-options-after-engineered-stone-ban'], ['Quote review', '/quote/review']],
    faqs: [['Is a refresh always cheaper?', 'Not always. Existing cabinet condition, benchtop scope and trade work can change the range.'], ['Can I keep the same layout?', 'Often yes, but a site check is needed to confirm cabinet condition and service locations.']],
  },
  {
    slug: 'kitchen-benchtop-replacement-sydney',
    eyebrow: 'Benchtop replacement Sydney',
    title: 'Kitchen benchtop replacement quote clarity.',
    summary: 'Check material, cut-outs, joins, splashback relationship, service reconnection and engineered-stone restriction prompts before relying on a benchtop quote.',
    whoFor: [
      'Customers replacing benchtops without a full kitchen renovation',
      'Homeowners comparing material options after engineered-stone restrictions',
      'Projects where cut-outs, joins, waterfalls or splashback treatment need clarity',
      'Apartment owners where lift access, parking, slab handling or work-hour limits may affect the quote',
      'Customers deciding whether a benchtop-only quote is enough or whether cabinetry, services or splashback also need review',
    ],
    typicalScope: [
      'Existing benchtop removal, protection, disposal and make-good assumptions',
      'New benchtop material, thickness, joins, edge detail and waterfall or island treatment',
      'Sink, tap, cooktop, drainage and appliance cut-out assumptions',
      'Splashback relationship, upstands, wall junctions and patching boundaries',
      'Licensed plumbing, electrical or gas disconnection/reconnection prompts where services or appliances are affected',
    ],
    scopeDrivers: [
      'Material direction, slab size, thickness and supplier documentation',
      'Sink, cooktop, tap, pop-up power, drainage and ventilation cut-outs',
      'Join positions, waterfall ends, overhangs, edge profiles and wall scribing',
      'Existing cabinet condition, support, levelling and strengthening requirements',
      'Removal, disposal, apartment access, lift size, parking and installation handling',
      'Splashback removal, replacement, tile damage, wall patching and final seal assumptions',
    ],
    preparation: [
      'Approximate benchtop run lengths, island dimensions and overhang notes',
      'Photos of every benchtop run, join, wall junction, sink, tap, cooktop and appliance cut-out',
      'Preferred material direction or supplier documentation if available',
      'Current benchtop quote details if comparing scope, inclusions or exclusions',
      'Apartment access notes, lift dimensions, parking conditions and building work-hour rules where relevant',
      'Notes on whether sink, tap, cooktop, splashback or cabinetry will remain, move or be replaced',
    ],
    confidenceBoosters: [
      'Measured benchtop runs, island dimensions and cut-out locations',
      'Photos of each join, cut-out, splashback junction and cabinet support condition',
      'Selected supplier-confirmed material direction with any compliance documentation noted',
      'Known sink, tap, cooktop, appliance and service reconnection requirements',
      'Clear answer on whether splashback, tiles, wall patching or cabinet strengthening are included',
      'Access and handling details for apartments, tight entries, stairs or premium slab materials',
    ],
    quoteRisks: [
      'Restricted or unclear material selection after engineered-stone changes',
      'Missing cut-out, templating, edge, join, waterfall or polishing costs',
      'Splashback, upstand, tile removal or wall make-good assumptions not described',
      'Cabinet strengthening, levelling or support work excluded from the benchtop quote',
      'Licensed plumbing, electrical or gas disconnection/reconnection left by others',
      'Apartment access, lift booking, slab handling, parking and waste removal not priced clearly',
    ],
    exclusionsToCheck: [
      'Splashback removal, replacement, tile damage and wall patching',
      'Cabinet strengthening, levelling, substrate repairs and support brackets',
      'Plumbing, electrical and gas disconnection/reconnection or appliance refit',
      'Templating, delivery, cranage, stair carry, lift booking and access protection',
      'Waste removal, final clean, sealants, warranties and material compliance documentation',
      'Supplier lead times, material availability and what happens if selected material changes',
    ],
    relatedAreas: ['Double Bay', 'Vaucluse', 'Manly', 'Castle Hill', 'Neutral Bay', 'Chatswood'],
    related: [
      ['Benchtop options after engineered stone restrictions', '/kitchen-benchtop-options-after-engineered-stone-ban'],
      ['PC sums and provisional sums', '/kitchen-pc-sums-and-provisional-sums'],
      ['Cabinetry and benchtop refresh', '/kitchen-cabinetry-benchtop-refresh'],
      ['Review existing quote', '/quote/review'],
    ],
    faqs: [
      ['Can I choose engineered stone?', 'Do not assume a product is allowed. Material and work should be checked against current supplier, installer and WHS requirements before selection.'],
      ['Do I need a full kitchen quote?', 'Not always. A benchtop-only pathway may be enough when cabinetry, splashback and services are unchanged, but sink, tap, cooktop, splashback and cabinet support impacts should be checked.'],
      ['What should a benchtop quote include?', 'Check material, thickness, edge profile, joins, cut-outs, templating, removal, disposal, delivery, installation, splashback assumptions, access and service reconnection boundaries.'],
      ['Why can benchtop quotes vary so much?', 'Quotes may assume different materials, slab sizes, cut-outs, joins, edge detail, access handling, splashback work, make-good and licensed trade responsibilities.'],
      ['Is this material compliance advice?', 'No. Operon Kitchens provides general quote clarity prompts. Material compliance and safe work requirements need supplier, installer and project-specific confirmation.'],
    ],
  },
  {
    slug: 'small-kitchen-renovation-sydney',
    eyebrow: 'Small kitchen renovation Sydney',
    title: 'Small kitchen renovation estimates without hidden scope.',
    summary: 'Compact kitchens still need clear cabinetry, appliance, access and service assumptions before comparing totals.',
    whoFor: ['Apartment owners and compact-home renovators', 'Customers trying to improve storage without overcapitalising', 'Projects where appliance fit and access are tight'],
    typicalScope: ['Compact cabinetry layout and storage choices', 'Benchtop, splashback and appliance allowance direction', 'Access, waste and service-location review'],
    scopeDrivers: ['Compact layout efficiency', 'Appliance size and ventilation', 'Storage accessories', 'Access and waste removal'],
    preparation: ['Wall-to-wall dimensions', 'Photos of services', 'Appliance sizes', 'Apartment or strata requirements'],
    confidenceBoosters: ['Wall-to-wall measurements', 'Photos showing services and access', 'Appliance dimensions', 'Strata or building notes where relevant'],
    quoteRisks: ['Tight access', 'Service relocation', 'Appliance fit', 'Small allowances that exclude make-good'],
    exclusionsToCheck: ['Ventilation upgrades', 'Rubbish removal', 'Painting and patching', 'Access protection in common areas'],
    relatedAreas: ['Newtown', 'Randwick', 'Neutral Bay', 'Strathfield'],
    related: [['Apartment kitchen renovation', '/apartment-kitchen-renovation-sydney'], ['Kitchen quote Sydney', '/kitchen-quote-sydney']],
    faqs: [['Can a small kitchen still be complex?', 'Yes. Access, service locations and appliance fit can create review items even in compact spaces.'], ['What improves confidence?', 'Measurements, photos and appliance details help narrow the planning range.']],
  },
  {
    slug: 'luxury-kitchen-renovation-sydney',
    eyebrow: 'Luxury kitchen renovation Sydney',
    title: 'Luxury kitchen renovation planning with scope clarity.',
    summary: 'Premium kitchens need careful review of joinery detail, finishes, appliances, surfaces, access and written scope before contract pricing.',
    whoFor: ['Owners planning premium joinery and surface selections', 'Projects with integrated appliances, islands or custom storage', 'Customers comparing high-value proposals before site measure'],
    typicalScope: ['Premium cabinetry and hardware direction', 'Surface, splashback and appliance schedule assumptions', 'Lighting, access protection and custom fabrication review'],
    scopeDrivers: ['Custom cabinetry detail', 'Premium door and hardware selections', 'Porcelain, natural stone or specialty surfaces', 'Integrated appliances and lighting'],
    preparation: ['Design references', 'Plans or sketches', 'Appliance schedule', 'Finish and surface direction'],
    confidenceBoosters: ['Plans, references and appliance schedule', 'Known finish and hardware tier', 'Benchtop material direction', 'Photos or drawings showing access and room constraints'],
    quoteRisks: ['Unclear premium allowances', 'Custom fabrication details', 'Long-lead selections', 'Access and protection requirements'],
    exclusionsToCheck: ['Specialty fabrication', 'Integrated appliance installation', 'Stone or porcelain documentation', 'Protection, staging and delivery conditions'],
    relatedAreas: ['Mosman', 'Bellevue Hill', 'Woollahra', 'Killara'],
    related: [['Kitchen renovation cost Sydney', '/kitchen-renovation-cost-sydney'], ['Typical project profiles', '/projects']],
    faqs: [['Can premium selections be estimated online?', 'They can be shown as a planning range, but exact products and site details need professional review.'], ['What should be documented?', 'Joinery detail, appliance model assumptions, surface selection, lighting and installation constraints.']],
  },
  {
    slug: 'strata-kitchen-renovation-sydney',
    eyebrow: 'Strata kitchen renovation Sydney',
    title: 'Strata kitchen renovation planning for Sydney apartments.',
    summary: 'Plan apartment and strata kitchen work with clearer prompts for approval pathway, access, work hours, licensed trades, class 2 screening and written scope confirmation.',
    whoFor: [
      'Apartment owners planning a kitchen refresh or full renovation under strata rules',
      'Customers who need owners corporation or building management review before work starts',
      'Projects where lift, parking, work hours, waste path or service locations may affect scope',
      'Quote-review customers comparing apartment kitchen proposals with different access and approval assumptions',
    ],
    typicalScope: [
      'Cabinetry, benchtop, splashback and appliance scope with apartment access assumptions',
      'Protection, delivery, lift booking, parking, waste movement and building-management coordination prompts',
      'Licensed plumbing, electrical and gas review where services move or appliances change',
      'Strata, DBP/class 2, written contract, deposit and HBC review prompts where relevant',
    ],
    scopeDrivers: [
      'Strata approval or renovation by-law requirements',
      'Lift size, loading access, parking and common-area protection',
      'Plumbing, electrical, gas, ventilation and service-location constraints',
      'Work-hour limits, noise controls, rubbish removal and final clean requirements',
      'Cabinetry quantity, benchtop handling, appliance allowance and finish tier',
    ],
    preparation: [
      'Strata rules, renovation by-laws or building-management instructions',
      'Floorplan, rough dimensions and photos of each wall',
      'Lift dimensions, parking notes and access path from loading area to kitchen',
      'Photos of plumbing, electrical, gas, ventilation and existing appliance locations',
      'Current quote, appliance direction and finish preferences if already available',
    ],
    confidenceBoosters: [
      'Strata rules or renovation by-laws available for review',
      'Lift and parking notes plus photos of the access path',
      'Photos of plumbing, electrical, gas and ventilation points',
      'Known decision on whether services stay in place or need relocation',
      'Existing quote or building approval notes showing inclusions and exclusions',
    ],
    quoteRisks: [
      'Approval pathway uncertainty or missing owners corporation conditions',
      'DBP/class 2 screening not addressed where building type or scope may require review',
      'Service relocation limits hidden inside provisional allowances',
      'Waste removal, protection, lift booking and loading conditions excluded from the quote',
      'Work-hour limits or after-hours requirements not described in the written scope',
    ],
    exclusionsToCheck: [
      'Strata approval fees, consultant review or building-management charges',
      'Building protection, lift booking, parking permits and loading restrictions',
      'After-hours work, noise management, rubbish movement and final common-area clean',
      'Licensed trade certificates, disconnection/reconnection and service relocation documentation',
      'Asbestos or hazardous-material review in older apartment buildings',
    ],
    relatedAreas: ['Chatswood', 'Rhodes', 'Parramatta', 'Bondi', 'Neutral Bay', 'Manly'],
    related: [
      ['Apartment kitchen renovation Sydney', '/apartment-kitchen-renovation-sydney'],
      ['Kitchen quote Sydney', '/kitchen-quote-sydney'],
      ['PC sums and provisional sums', '/kitchen-pc-sums-and-provisional-sums'],
      ['Quote review', '/quote/review'],
    ],
    faqs: [
      ['Do strata kitchens need extra review?', 'Often yes. Building rules, access, service locations and licensed trade requirements should be confirmed for the specific building and scope.'],
      ['Can I start before approval?', 'Approval requirements must be confirmed for the specific building and scope before work proceeds. Use the estimate or quote review to identify questions early.'],
      ['What access details affect a strata kitchen quote?', 'Lift size, loading zone, parking, work hours, protection, waste path and building-management rules can all affect the planning range and written scope.'],
      ['Does class 2 or DBP apply to every apartment kitchen?', 'Not every project follows the same pathway. Apartment and class 2 prompts should be reviewed against the building, work type and provider responsibilities.'],
      ['Is this strata or legal advice?', 'No. Operon Kitchens provides general planning and quote clarity prompts. Strata, contract, legal and licensed trade questions require project-specific confirmation.'],
    ],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug) || null;
}
