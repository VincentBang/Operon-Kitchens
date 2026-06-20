import fs from 'node:fs';
import path from 'node:path';

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('Operon Kitchens visual system guardrails', () => {
  it('uses the Operon Flooring-style white chrome and dark footer/button ink locally', () => {
    const css = read('src/styles/globals.css');

    expect(css).toContain('--paper: #ffffff;');
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
