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
    summary: 'Check material, cut-outs, joins, splashback relationship and engineered-stone compliance before relying on a benchtop quote.',
    whoFor: ['Customers replacing benchtops without a full kitchen renovation', 'Homeowners comparing material options after engineered-stone restrictions', 'Projects where cut-outs, joins or splashback treatment need clarity'],
    typicalScope: ['Existing benchtop removal and disposal', 'New benchtop material, thickness, joins and edge detail', 'Sink, tap, cooktop cut-outs and installation assumptions'],
    scopeDrivers: ['Material and thickness', 'Sink, cooktop and tap cut-outs', 'Joins, waterfalls and edge detail', 'Removal, disposal and installation access'],
    preparation: ['Benchtop length', 'Photos of joins and appliances', 'Preferred material', 'Current quote if comparing'],
    confidenceBoosters: ['Measured benchtop runs', 'Photos of each join and cut-out', 'Selected supplier-confirmed material direction', 'Known sink, tap and cooktop requirements'],
    quoteRisks: ['Restricted material selection', 'Missing cut-out costs', 'Splashback assumptions', 'Damage or make-good exclusions'],
    exclusionsToCheck: ['Splashback removal or replacement', 'Cabinet strengthening', 'Plumbing disconnection/reconnection', 'Wall damage and make-good'],
    relatedAreas: ['Double Bay', 'Vaucluse', 'Manly', 'Castle Hill'],
    related: [['Benchtop options after engineered stone restrictions', '/kitchen-benchtop-options-after-engineered-stone-ban'], ['Review existing quote', '/quote/review']],
    faqs: [['Can I choose engineered stone?', 'Restricted products require supplier and installer confirmation. The estimate directs users toward supplier-confirmed alternatives.'], ['Do I need a full kitchen quote?', 'Not always, but sink, tap, appliances and splashback impacts should be checked.']],
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
    title: 'Strata kitchen renovation estimates for Sydney apartments.',
    summary: 'Apartment and strata kitchens need access, approvals, work hours, licensed trades and class 2 screening considered early.',
    whoFor: ['Apartment owners planning kitchen works', 'Customers who need strata or building management approval', 'Projects where lift, parking, work hours or service locations may affect scope'],
    typicalScope: ['Cabinetry and surface scope with access assumptions', 'Licensed trade relocation review', 'Strata, DBP/class 2 and building management prompts'],
    scopeDrivers: ['Strata approval requirements', 'Lift and loading access', 'Plumbing/electrical locations', 'Work-hour and protection requirements'],
    preparation: ['Strata rules', 'Floorplan', 'Lift and parking notes', 'Photos of service points'],
    confidenceBoosters: ['Strata rules or renovation by-laws', 'Lift and parking notes', 'Photos of plumbing, electrical and gas points', 'Existing quote or building approval notes'],
    quoteRisks: ['Approval pathway uncertainty', 'DBP/class 2 screening', 'Service relocation limits', 'Waste removal and building protection'],
    exclusionsToCheck: ['Strata approval costs', 'Building protection and lift booking', 'After-hours work restrictions', 'Licensed trade certificates and compliance documents'],
    relatedAreas: ['Chatswood', 'Rhodes', 'Parramatta', 'Bondi'],
    related: [['Apartment kitchen renovation Sydney', '/apartment-kitchen-renovation-sydney'], ['Quote review', '/quote/review']],
    faqs: [['Do strata kitchens need extra review?', 'Often yes. Building rules, access and licensed trade requirements should be confirmed.'], ['Can I start before approval?', 'Approval requirements must be confirmed for the specific building and scope.']],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug) || null;
}
