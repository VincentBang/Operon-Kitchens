import { render, screen } from '@testing-library/react';
import PublicLayout from '../src/components/PublicLayout';
import AreasPage from '../src/pages/areas';
import AreaPage from '../src/pages/areas/[slug]';
import FaqsPage from '../src/pages/faqs';
import QuoteReviewPage from '../src/pages/quote/review';
import TermsPage from '../src/pages/terms';
import { kitchenAreas } from '../src/lib/areas';
import ServicePageTemplate from '../src/components/ServicePageTemplate';
import { getServicePage, servicePages } from '../src/lib/servicePages';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
    pathname: '/',
  }),
}));

describe('public site structure', () => {
  it('renders global navigation and footer links', () => {
    render(
      <PublicLayout>
        <main><h1>Page content</h1></main>
      </PublicLayout>,
    );

    expect(screen.getByRole('link', { name: /Operon Kitchens home/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Start kitchen estimate/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Privacy Policy/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Terms/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Kitchen renovation estimate and quote review support/i)).toBeInTheDocument();
  });

  it('renders the area index and individual area template', () => {
    render(<AreasPage />);
    expect(screen.getByRole('heading', { name: /Kitchen renovation quote support across Sydney/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Mosman/i })).toBeInTheDocument();

    render(<AreaPage area={kitchenAreas[0]} />);
    expect(screen.getByRole('heading', { name: /Kitchen renovation quotes in Mosman/i })).toBeInTheDocument();
    expect(screen.getByText(/Quote risks to check/i)).toBeInTheDocument();
  });

  it('renders public terms with estimate and disclaimer guidance', () => {
    render(<TermsPage />);
    expect(screen.getByRole('heading', { name: /Operon Kitchens terms of use/i })).toBeInTheDocument();
    expect(screen.getByText(/not binding building quotes/i)).toBeInTheDocument();
    expect(screen.getByText(/does not provide legal advice/i)).toBeInTheDocument();
  });

  it('renders the public FAQ page without admin data dependencies', () => {
    render(<FaqsPage />);
    expect(screen.getByRole('heading', { name: /Questions before you renovate/i })).toBeInTheDocument();
    expect(screen.getByText(/Still comparing kitchen options/i)).toBeInTheDocument();
  });

  it('renders service pages with scope, risks and CTAs', () => {
    const page = getServicePage('full-kitchen-renovation-sydney');
    expect(page).toBeTruthy();
    if (!page) throw new Error('Missing full-kitchen-renovation-sydney service page');
    render(<ServicePageTemplate page={page} />);
    expect(screen.getByRole('heading', { name: /Full kitchen renovation estimates/i })).toBeInTheDocument();
    expect(screen.getByText(/Scope drivers/i)).toBeInTheDocument();
    expect(screen.getByText(/Who this is for/i)).toBeInTheDocument();
    expect(screen.getByText(/What improves confidence/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Start kitchen estimate/i }).length).toBeGreaterThan(0);
  });

  it('has configured content for every service page slug', () => {
    servicePages.forEach((page) => {
      expect(getServicePage(page.slug)).toEqual(page);
      expect(page.whoFor.length).toBeGreaterThanOrEqual(2);
      expect(page.typicalScope.length).toBeGreaterThanOrEqual(2);
      expect(page.confidenceBoosters.length).toBeGreaterThanOrEqual(2);
      expect(page.exclusionsToCheck.length).toBeGreaterThanOrEqual(2);
      expect(page.relatedAreas.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('renders quote review with a sample result preview', () => {
    render(<QuoteReviewPage />);
    expect(screen.getByRole('heading', { name: /Review your kitchen quote/i })).toBeInTheDocument();
    expect(screen.getByText(/Already received a kitchen quote/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample review result/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Scope clarity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Allowance risk/i).length).toBeGreaterThan(0);
  });
});
