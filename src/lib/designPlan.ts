export type DesignItemType = 'baseCabinet' | 'tallCabinet' | 'sink' | 'cooktop' | 'fridge' | 'island';
export type DesignFinish = 'laminate' | 'polyurethane' | 'timber' | 'porcelain' | 'stainless';

export interface DesignItem {
  id: string;
  type: DesignItemType;
  label: string;
  xMm: number;
  yMm: number;
  widthMm: number;
  depthMm: number;
  finish: DesignFinish;
}

export interface DesignPlan {
  source: 'operon-kitchens-design-v1';
  exportedAt: string;
  room: {
    widthMm: number;
    depthMm: number;
    ceilingHeightMm: number;
  };
  measurementNotes: string[];
  items: DesignItem[];
  previewImage?: string;
}

export const designStorageKey = 'operon-kitchens-design-plan';

export const defaultDesignPlan: DesignPlan = {
  source: 'operon-kitchens-design-v1',
  exportedAt: '',
  room: {
    widthMm: 3600,
    depthMm: 2800,
    ceilingHeightMm: 2400,
  },
  measurementNotes: [
    'Measure wall lengths in millimetres.',
    'Mark windows, doors, services and ceiling height before site review.',
  ],
  items: [
    { id: 'base-1', type: 'baseCabinet', label: 'Base run', xMm: 0, yMm: 0, widthMm: 2400, depthMm: 600, finish: 'laminate' },
    { id: 'sink-1', type: 'sink', label: 'Sink', xMm: 1300, yMm: 0, widthMm: 600, depthMm: 600, finish: 'stainless' },
  ],
};

export function summarizeDesignPlan(plan?: DesignPlan | null) {
  if (!plan) return '';
  const itemCount = plan.items.length;
  return `${plan.room.widthMm} x ${plan.room.depthMm}mm room, ${itemCount} placed item${itemCount === 1 ? '' : 's'}`;
}
