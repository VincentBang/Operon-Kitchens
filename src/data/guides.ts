export interface Guide {
  slug: string;
  title: string;
  content: string;
}

export const guides: Guide[] = [
  {
    slug: 'kitchen-renovation-cost-guide',
    title: 'Kitchen renovation cost guide (Sydney)',
    content: `Renovation costs depend on size, finishes and trade requirements. A small galley kitchen with laminate doors and benchtop may start from $15,000, whereas a high-end kitchen with premium finishes, island and integrated appliances can exceed $50,000. Always allow contingency for unforeseen site conditions.`,
  },
  {
    slug: 'measure-for-a-kitchen-quote',
    title: 'How to measure for a kitchen quote',
    content: `Measure wall lengths from corner to corner at benchtop height, note ceiling height, bulkhead height and positions of doors, windows and services. Provide photos or sketches to assist estimators.`,
  },
  {
    slug: 'benchtop-options-after-engineered-stone-ban',
    title: 'Benchtop options after engineered stone restrictions',
    content: `Engineered stone containing high crystalline silica content has been restricted. Compliant alternatives include porcelain, sintered stone, stainless steel, timber and natural stone subject to supplier verification. Always confirm material availability and legal compliance before ordering.`,
  },
  {
    slug: 'compare-kitchen-quotes',
    title: 'How to compare kitchen quotes',
    content: `Ensure quotes are like-for-like by comparing cabinet materials, finishes, hardware brands, benchtop material, splashback, trades included and exclusions. Check licence and insurance details and confirm allowances are adequate for your site.`,
  },
];