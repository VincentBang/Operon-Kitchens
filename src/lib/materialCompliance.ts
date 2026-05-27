export type MaterialArea = 'benchtop' | 'splashback';

export interface MaterialCompliance {
  key: string;
  label: string;
  silicaLabel: string;
  crystallineSilicaPercent: number | null;
  status: 'allowed' | 'banned' | 'review';
  message: string;
  alternatives: string[];
}

const commonAlternatives = ['Porcelain/sintered surface', 'Stainless steel', 'Timber or bamboo', 'Laminate', 'Low-silica composite where supplier documentation confirms compliance'];

const benchtopMaterials: Record<string, MaterialCompliance> = {
  laminate: {
    key: 'laminate',
    label: 'Laminate',
    silicaLabel: '0% crystalline silica added',
    crystallineSilicaPercent: 0,
    status: 'allowed',
    message: 'Laminate is available as a practical low-silica benchtop option.',
    alternatives: [],
  },
  solidSurface: {
    key: 'solidSurface',
    label: 'Solid surface / acrylic composite',
    silicaLabel: 'Typically below engineered-stone threshold; supplier confirmation required',
    crystallineSilicaPercent: null,
    status: 'review',
    message: 'Solid surface selections should be confirmed against supplier documentation before ordering.',
    alternatives: ['Laminate', 'Porcelain/sintered surface', 'Stainless steel'],
  },
  engineeredStone: {
    key: 'engineeredStone',
    label: 'Engineered stone',
    silicaLabel: '>1% crystalline silica',
    crystallineSilicaPercent: 1.01,
    status: 'banned',
    message: 'Engineered stone containing more than 1% crystalline silica is not available for new selection under the national ban.',
    alternatives: commonAlternatives,
  },
  naturalStone: {
    key: 'naturalStone',
    label: 'Natural stone',
    silicaLabel: 'Natural material; supplier and fabrication compliance review required',
    crystallineSilicaPercent: null,
    status: 'review',
    message: 'Natural stone is not engineered stone, but selection, fabrication and controls still need supplier/trade confirmation.',
    alternatives: ['Porcelain/sintered surface', 'Stainless steel', 'Laminate'],
  },
  porcelain: {
    key: 'porcelain',
    label: 'Porcelain / sintered surface',
    silicaLabel: 'Compliant alternative; supplier documentation required',
    crystallineSilicaPercent: null,
    status: 'allowed',
    message: 'Porcelain and sintered surfaces are common alternatives to engineered stone, subject to supplier documentation.',
    alternatives: [],
  },
  timber: {
    key: 'timber',
    label: 'Timber / bamboo',
    silicaLabel: '0% crystalline silica added',
    crystallineSilicaPercent: 0,
    status: 'allowed',
    message: 'Timber and bamboo are available alternatives when detailed and sealed appropriately.',
    alternatives: [],
  },
  stainless: {
    key: 'stainless',
    label: 'Stainless steel',
    silicaLabel: '0% crystalline silica',
    crystallineSilicaPercent: 0,
    status: 'allowed',
    message: 'Stainless steel is a compliant, durable benchtop alternative.',
    alternatives: [],
  },
  custom: {
    key: 'custom',
    label: 'Other / custom',
    silicaLabel: 'Supplier documentation required before quoting',
    crystallineSilicaPercent: null,
    status: 'review',
    message: 'Custom materials require supplier documentation before they can be treated as compliant.',
    alternatives: commonAlternatives,
  },
};

const splashbackMaterials: Record<string, MaterialCompliance> = {
  tile: {
    key: 'tile',
    label: 'Tile',
    silicaLabel: 'Compliant alternative; cutting controls still apply',
    crystallineSilicaPercent: null,
    status: 'allowed',
    message: 'Tile splashbacks remain available with normal trade controls.',
    alternatives: [],
  },
  glass: {
    key: 'glass',
    label: 'Glass',
    silicaLabel: '0% crystalline silica',
    crystallineSilicaPercent: 0,
    status: 'allowed',
    message: 'Glass is a compliant splashback option.',
    alternatives: [],
  },
  engineeredStone: {
    key: 'engineeredStone',
    label: 'Engineered stone slab',
    silicaLabel: '>1% crystalline silica',
    crystallineSilicaPercent: 1.01,
    status: 'banned',
    message: 'Engineered stone slab splashbacks containing more than 1% crystalline silica are not available for new selection.',
    alternatives: ['Tile', 'Glass', 'Stainless steel', 'Acrylic/composite with supplier documentation', 'Porcelain/sintered slab'],
  },
  stone: {
    key: 'stone',
    label: 'Natural stone / compliant slab',
    silicaLabel: 'Natural or slab material; supplier documentation required',
    crystallineSilicaPercent: null,
    status: 'review',
    message: 'Stone or slab splashbacks require supplier documentation and fabrication review.',
    alternatives: ['Tile', 'Glass', 'Stainless steel'],
  },
  stainless: {
    key: 'stainless',
    label: 'Stainless steel',
    silicaLabel: '0% crystalline silica',
    crystallineSilicaPercent: 0,
    status: 'allowed',
    message: 'Stainless steel is a compliant splashback option.',
    alternatives: [],
  },
  acrylic: {
    key: 'acrylic',
    label: 'Acrylic / low-silica composite',
    silicaLabel: 'Supplier documentation required',
    crystallineSilicaPercent: null,
    status: 'review',
    message: 'Composite splashbacks should be confirmed against supplier documentation.',
    alternatives: ['Tile', 'Glass', 'Stainless steel'],
  },
  other: {
    key: 'other',
    label: 'Other',
    silicaLabel: 'Supplier documentation required before quoting',
    crystallineSilicaPercent: null,
    status: 'review',
    message: 'Other splashback materials require supplier documentation before they can be treated as compliant.',
    alternatives: ['Tile', 'Glass', 'Stainless steel'],
  },
};

export function getMaterialCompliance(area: MaterialArea, key: string) {
  const source = area === 'benchtop' ? benchtopMaterials : splashbackMaterials;
  return source[key] ?? {
    key,
    label: key,
    silicaLabel: 'Unknown; supplier documentation required',
    crystallineSilicaPercent: null,
    status: 'review' as const,
    message: 'This material requires supplier documentation before compliance can be confirmed.',
    alternatives: commonAlternatives,
  };
}

export function listMaterialOptions(area: MaterialArea) {
  const source = area === 'benchtop' ? benchtopMaterials : splashbackMaterials;
  return Object.values(source);
}

export function transitionProvisionApplies(input: {
  engineeredStoneTransitionClaimed: boolean;
  engineeredStoneContractBefore2023End: boolean;
  engineeredStoneInstallBefore2024End: boolean;
}) {
  return Boolean(input.engineeredStoneTransitionClaimed && input.engineeredStoneContractBefore2023End && input.engineeredStoneInstallBefore2024End);
}
