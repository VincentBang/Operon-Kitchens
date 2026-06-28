import fs from 'node:fs';
import path from 'node:path';

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('Operon Kitchens visual system guardrails', () => {
  it('uses the Operon Flooring-style white chrome and dark footer/button ink locally', () => {
    const css = read('src/styles/globals.css');

    expect(css).toContain('--paper: #ffffff;');
    expect(css).toContain('--operon-navy: #102b32;');
    expect(css).toContain('--operon-gold: #b98533;');
    expect(css).toContain('--operon-warm-white: #ffffff;');
    expect(css).toContain('--operon-charcoal: #102b32;');
    expect(css).toContain('--operon-border: #e2ddd2;');
    expect(css).toContain('--operon-shadow-soft: 0 18px 46px rgba(16, 43, 50, 0.08);');
    expect(css).toContain('--ink: #102b32;');
    expect(css).toContain('--accent: #102b32;');
    expect(css).toContain('--accent-dark: #102b32;');
    expect(css).toContain('--line: #e2ddd2;');
    expect(css).toContain('background: rgba(255, 255, 255, 0.98);');
    expect(css).toContain('min-height: 72px;');
    expect(css).toContain('width: 238px;');
    expect(css).toContain('min-height: 40px;');
    expect(css).toContain('.headerCta.secondary');
    expect(css).toContain('.finalCta .button.ghost');
    expect(css).toContain('border-color: rgba(255, 255, 255, 0.36);');
  });

  it('keeps the footer as a rounded dark container with white spacing around it', () => {
    const css = read('src/styles/globals.css');

    expect(css).toContain('.siteFooter {');
    expect(css).toContain('border-radius: 28px;');
    expect(css).toContain('color: #e8efec;');
    expect(css).toContain('margin: 52px clamp(16px, 4vw, 72px) 24px;');
    expect(css).toContain('padding: clamp(30px, 5.4vw, 64px);');
    expect(css).toContain('width: 190px;');
    expect(css).toContain('width: 170px;');
    expect(css).toContain('background: #fff;');
  });

  it('documents the public Operon System visual alignment audit', () => {
    const audit = read('docs/operon-system-visual-alignment-audit.md');

    expect(audit).toContain('Operon Flooring was used only as a public visual reference');
    expect(audit).toContain('No Operon Flooring source files, assets, production settings or repository files were opened or modified.');
    expect(audit).toContain('Planning estimate and quote review remain the main public conversion paths.');
    expect(audit).toContain('Areas & company');
    expect(audit).toContain('/pc-sums-provisional-sums');
    expect(audit).toContain('Deployment is not needed');
  });

  it('documents the local public trust gate before release', () => {
    const trustGate = read('docs/public-trust-gate-operon-kitchens.md');

    expect(trustGate).toContain('Deployment status: not deployed');
    expect(trustGate).toContain('Footer is intentionally compact and grouped into four public columns');
    expect(trustGate).toContain('/pc-sums-provisional-sums');
    expect(trustGate).toContain('Production upload verification remains an approved-release task');
    expect(trustGate).toContain('npm test -- --runInBand');
  });

  it('uses the current Operon Kitchens brand assets across header, footer and favicon', () => {
    const layout = read('src/components/PublicLayout.tsx');
    const liveAssets = [
      'public/brand/operon-kitchens-logo-header.png',
      'public/brand/operon-kitchens-logo-horizontal.png',
      'public/brand/operon-emblem.png',
      'public/brand/operon-kitchens-favicon.png',
    ];

    expect(layout).toContain('/brand/operon-kitchens-logo-header.png');
    expect(layout).toContain('/brand/operon-kitchens-logo-horizontal.png');
    expect(layout).toContain('/brand/operon-kitchens-favicon.png');
    liveAssets.forEach((asset) => {
      const stats = fs.statSync(path.join(process.cwd(), asset));
      expect(stats.size).toBeGreaterThan(10_000);
    });
  });

  it('keeps the mobile sticky CTA compact and customer-facing', () => {
    const layout = read('src/components/PublicLayout.tsx');
    const css = read('src/styles/globals.css');

    expect(layout).toContain("cta_location: 'mobile_sticky'");
    expect(layout).toContain('>Review quote</TrackedCtaLink>');
    expect(css).toContain('grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);');
    expect(css).toContain('max-width: 100vw;');
    expect(css).toContain('text-overflow: ellipsis;');
  });

  it('keeps shared article pages spaced without negative heading margins', () => {
    const css = read('src/styles/globals.css');

    expect(css).toContain('gap: clamp(28px, 4vw, 42px);');
    expect(css).toContain('line-height: 1.18;');
    expect(css).toContain('margin: 0 0 12px;');
    expect(css).toContain('.articleBody h2 + p');
    expect(css).not.toContain('margin: 8px 0 -8px;');
  });
});
