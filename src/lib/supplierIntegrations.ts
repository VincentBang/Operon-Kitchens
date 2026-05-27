export type SupplierIntegrationStatus = 'planned' | 'requires-approval' | 'unavailable';

export interface SupplierConnector {
  supplier: 'Polytec' | 'Laminex' | 'Blum' | 'Hafele';
  categories: string[];
  status: SupplierIntegrationStatus;
  publicPurpose: string;
  approvalRequired: boolean;
}

export const supplierConnectors: SupplierConnector[] = [
  {
    supplier: 'Polytec',
    categories: ['Cabinet doors', 'Panels', 'Laminate finishes'],
    status: 'requires-approval',
    publicPurpose: 'Future finish availability and selection validation.',
    approvalRequired: true,
  },
  {
    supplier: 'Laminex',
    categories: ['Benchtops', 'Panels', 'Laminate finishes'],
    status: 'requires-approval',
    publicPurpose: 'Future material catalogue and compliance metadata checks.',
    approvalRequired: true,
  },
  {
    supplier: 'Blum',
    categories: ['Hinges', 'Drawer systems', 'Hardware'],
    status: 'requires-approval',
    publicPurpose: 'Future hardware option validation and availability checks.',
    approvalRequired: true,
  },
  {
    supplier: 'Hafele',
    categories: ['Accessories', 'Lighting', 'Hardware'],
    status: 'requires-approval',
    publicPurpose: 'Future accessory, lighting and hardware catalogue checks.',
    approvalRequired: true,
  },
];

export function getSupplierIntegrationPolicy() {
  return {
    liveApiCallsEnabled: false,
    exposesSupplierCosts: false,
    requiresWrittenApproval: true,
    summary:
      'Supplier integrations are planned as kitchen-scoped connectors only. They must not expose internal supplier costs, margin logic or live availability until commercial approval and credentials are confirmed.',
  };
}
