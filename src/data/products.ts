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
    summary: 'Benchtop materials labelled by engineered-stone compliance status and crystalline silica risk.',
    details: [
      'Engineered stone benchtops, panels and slabs containing more than 1% crystalline silica are banned for ordinary new work from 1 July 2024.',
      'Compliant alternatives include laminate, porcelain/sintered surfaces, stainless steel, timber or bamboo, and supplier-confirmed low-silica composites.',
      'Natural stone and custom slab selections require supplier documentation and professional fabrication/compliance review.',
      'Transition claims for contracts entered into on or before 31 Dec 2023 and installed before 31 Dec 2024 require manual documentation review.',
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
    summary: 'Tile, glass, stainless steel and supplier-confirmed compliant slab splashbacks.',
    details: [
      'Tile, glass and stainless steel splashbacks are common compliant alternatives to engineered-stone slab splashbacks.',
      'Engineered stone slab splashbacks containing more than 1% crystalline silica are restricted for new work.',
      'Stone, acrylic/composite or custom slab splashbacks require supplier documentation before compliance can be confirmed.',
    ],
  },
};
