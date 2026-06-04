import fs from 'node:fs';
import path from 'node:path';

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('Operon Kitchens visual system guardrails', () => {
  it('uses the Operon Flooring-style white chrome and dark footer/button ink locally', () => {
    const css = read('src/styles/globals.css');

    expect(css).toContain('--paper: #ffffff;');
    expect(css).toContain('--ink: #142f38;');
    expect(css).toContain('--accent: #142f38;');
    expect(css).toContain('--accent-dark: #142f38;');
    expect(css).toContain('--line: #dbe6e2;');
    expect(css).toContain('background: rgba(255, 255, 255, 0.98);');
  });

  it('keeps the footer as a rounded dark container with white spacing around it', () => {
    const css = read('src/styles/globals.css');

    expect(css).toContain('.siteFooter {');
    expect(css).toContain('border-radius: 30px;');
    expect(css).toContain('color: #e8efec;');
    expect(css).toContain('margin: 48px clamp(16px, 4vw, 72px) 24px;');
    expect(css).toContain('padding: clamp(32px, 6vw, 72px);');
    expect(css).toContain('background: #fff;');
  });

  it('uses the current Operon Kitchens brand assets across header, footer and favicon', () => {
    const layout = read('src/components/PublicLayout.tsx');
    const headerLogo = read('public/brand/operon-kitchens-logo-header.svg');
    const horizontalLogo = read('public/brand/operon-kitchens-logo-horizontal.svg');
    const favicon = read('public/brand/operon-kitchens-favicon.svg');

    expect(layout).toContain('/brand/operon-kitchens-logo-header.svg');
    expect(layout).toContain('/brand/operon-kitchens-logo-horizontal.svg');
    expect(layout).toContain('/brand/operon-kitchens-favicon.svg');
    expect(headerLogo).toContain('<rect class="divider"');
    expect(horizontalLogo).toContain('<rect class="divider"');
    expect(headerLogo).toContain('KITCHENS');
    expect(horizontalLogo).toContain('OPERON');
    expect(favicon).toContain('#08233F');
    expect(favicon).toContain('#B8842C');
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
});
