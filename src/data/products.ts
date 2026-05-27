export interface ProductCategory {
  title: string;
  summary: string;
  details: string[];
}

export const productCategories: { [key: string]: ProductCategory } = {
  cabinetry: {
    title: 'Kitchen Cabinetry',
    summary: 'Discover custom cabinetry options from standard to premium.',
    details: [
      'Different carcass materials and thicknesses influence durability and price.',
      'Upgrades like plywood and coloured board increase cost but improve longevity.',
      'Linear metres and cabinet types determine base pricing.',
    ],
  },
  doors: {
    title: 'Doors & Panels',
    summary: 'Explore finishes from melamine to high-end timber veneer.',
    details: [
      'Melamine and laminate offer economical durability.',
      'Polyurethane (2-pack) provides a seamless painted finish with higher cost.',
      'Shaker and profiled doors add craftsmanship and labour.',
    ],
  },
  benchtops: {
    title: 'Kitchen Benchtops',
    summary: 'Compliance-safe materials including laminate, solid surface and porcelain.',
    details: [
      'Engineered stone is restricted – we offer compliant natural stone alternatives subject to confirmation.',
      'Laminate benchtops provide cost-effective style with many colours.',
      'Porcelain and sintered surfaces offer premium durability and heat resistance.',
    ],
  },
  hardware: {
    title: 'Hardware & Accessories',
    summary: 'Premium hinges, runners and internal accessories for longevity.',
    details: [
      'Choose between standard and premium soft-close hardware.',
      'Internal accessories improve functionality but add to the budget.',
      'Brands like Blum, Häfele and Hettich offer lifetime warranties.',
    ],
  },
  sinkstaps: {
    title: 'Sinks & Taps',
    summary: 'Complete your kitchen with quality sinks and tapware.',
    details: [
      'Stainless steel and granite composite sinks available.',
      'Mixers, pull-out taps and filtered water systems offered.',
      'Plumbing allowances apply for installation.',
    ],
  },
  splashbacks: {
    title: 'Splashbacks',
    summary: 'Tile, glass and compliant slab splashbacks.',
    details: [
      'Tiles provide flexibility and affordability.',
      'Glass offers a seamless contemporary look.',
      'Stone or porcelain slabs provide a premium finish subject to compliance.',
    ],
  },
};