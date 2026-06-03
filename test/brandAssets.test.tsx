import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { render, screen } from '@testing-library/react';
import PublicLayout from '../src/components/PublicLayout';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
    pathname: '/',
  }),
}));

const brandAssets = [
  'public/brand/operon-kitchens-logo-horizontal.svg',
  'public/brand/operon-kitchens-logo-header.svg',
  'public/brand/operon-kitchens-logo-stacked.svg',
  'public/brand/operon-emblem.svg',
  'public/brand/operon-kitchens-favicon.svg',
];

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

describe('Operon Kitchens brand asset system', () => {
  it('provides local SVG logo variants for review', () => {
    for (const asset of brandAssets) {
      expect(existsSync(join(process.cwd(), asset))).toBe(true);
      expect(read(asset)).toContain('<svg');
    }

    const horizontal = read('public/brand/operon-kitchens-logo-horizontal.svg');
    expect(horizontal).toContain('OPERON');
    expect(horizontal).toContain('KITCHENS');
    expect(horizontal).toContain('divider');
    expect(horizontal).toContain('#08233F');
    expect(horizontal).toContain('#B8842C');
  });

  it('uses the compact header logo in navigation, the full lockup in the footer and a favicon reference', () => {
    render(
      <PublicLayout>
        <main><h1>Page content</h1></main>
      </PublicLayout>,
    );

    expect(screen.getByRole('link', { name: /Operon Kitchens home/i })).toBeInTheDocument();
    expect(screen.getAllByAltText('Operon Kitchens').length).toBeGreaterThanOrEqual(2);
    const layout = read('src/components/PublicLayout.tsx');
    expect(layout).toContain('/brand/operon-kitchens-logo-header.svg');
    expect(layout).toContain('/brand/operon-kitchens-logo-horizontal.svg');
    expect(layout).toContain('/brand/operon-kitchens-favicon.svg');
  });

  it('documents branch logo rules without literal kitchen icons', () => {
    const doc = read('docs/brand-system.md');
    const index = read('docs/README.md');
    const decisionLog = read('DECISION_LOG.md');

    expect(doc).toContain('[Operon circular emblem] + OPERON wordmark + vertical divider + KITCHENS descriptor');
    expect(doc).toContain('operon-kitchens-logo-header.svg');
    expect(doc).toContain('OPERON | KITCHENS');
    expect(doc).toContain('Do not create a disconnected kitchen-only logo');
    expect(doc).toContain('Do not add literal kitchen icons');
    expect(doc).toContain('OPERON FLOORING');
    expect(doc).toContain('OPERON SYSTEM');
    expect(index).toContain('brand-system.md');
    expect(decisionLog).toContain('Operon Branch Logo Structure Prepared Locally');
  });
});
