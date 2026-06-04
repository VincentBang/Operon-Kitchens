import { render, screen } from '@testing-library/react';
import PublicLayout from '../src/components/PublicLayout';
import AreasPage from '../src/pages/areas';
import AreaPage from '../src/pages/areas/[slug]';
import FaqsPage from '../src/pages/faqs';
import ContactPage from '../src/pages/contact';
import DeployCheckPage from '../src/pages/deploy-check';
import DesignSpecificationPackagePage from '../src/pages/design-specification-package';
import HowItWorksPage from '../src/pages/how-it-works';
import HomePage from '../src/pages';
import QuoteReviewServicePage from '../src/pages/quote-review-service';
import RequestReviewPage from '../src/pages/request-review';
import QuoteReviewPage from '../src/pages/quote/review';
import PrivacyPage from '../src/pages/privacy';
import SiteMeasurePage from '../src/pages/site-measure';
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
  it('renders global navigation and a compact organised footer', () => {
    const { container } = render(
      <PublicLayout>
        <main><h1>Page content</h1></main>
      </PublicLayout>,
    );

    expect(screen.getByRole('link', { name: /Operon Kitchens home/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Operon Kitchens logo' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Start kitchen estimate/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /How it works/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Request review/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Privacy Policy/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Terms/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Quote & review/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Services/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Guides/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Areas & company/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View all areas/i })).toHaveAttribute('href', '/areas');
    expect(screen.queryByRole('link', { name: /admin leads/i })).not.toBeInTheDocument();
    expect(container.querySelector('a[href="/admin/leads"]')).not.toBeInTheDocument();
    expect(screen.getByText(/Kitchen renovation estimate and quote review support/i)).toBeInTheDocument();
    expect(screen.getByText(/brand\. Planning guidance only/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('scope??Ask');
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
    expect(screen.getByRole('heading', { name: /Terms of Use/i })).toBeInTheDocument();
    expect(screen.getByText(/Online estimates are planning ranges/i)).toBeInTheDocument();
    expect(screen.getByText(/does not approve, reject, certify or legally assess/i)).toBeInTheDocument();
    expect(screen.getByText(/Site measure is required before project-specific pricing/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin download links, where available, are internal short-lived access tools only/i)).toBeInTheDocument();
    expect(screen.getByText(/Residential kitchen work may require written contract review/i)).toBeInTheDocument();
    expect(screen.getByText(/Older homes, previous renovations or demolition work may require asbestos/i)).toBeInTheDocument();
    expect(screen.getByText(/not legal advice/i)).toBeInTheDocument();
  });

  it('renders public privacy content for uploads, rights and marketing consent', () => {
    render(<PrivacyPage />);
    expect(screen.getByRole('heading', { name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Uploaded quotes, plans, photos, screenshots, drawings, appliance lists/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/stored for review and follow-up where upload storage is configured/i)).toBeInTheDocument();
    expect(screen.getByText(/access to information held about you, ask for corrections, or request deletion/i)).toBeInTheDocument();
    expect(screen.getByText(/Marketing is optional/i)).toBeInTheDocument();
    expect(screen.getByText(/Public customer outputs are limited to planning ranges, confidence, assumptions, exclusions and review prompts/i)).toBeInTheDocument();
    expect(screen.getByText(/Office of the Australian Information Commissioner/i)).toBeInTheDocument();
  });

  it('renders the public FAQ page without admin data dependencies', () => {
    render(<FaqsPage />);
    expect(screen.getByRole('heading', { name: /Questions before you renovate/i })).toBeInTheDocument();
    expect(screen.getByText(/Still comparing kitchen options/i)).toBeInTheDocument();
    expect(screen.getByText(/Is the online estimate a confirmed price/i)).toBeInTheDocument();
  });

  it('renders the upgraded homepage hero and sample estimate output', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { name: /Clear kitchen renovation estimates for Sydney homes/i })).toBeInTheDocument();
    expect(screen.getByText(/Build a planning range, understand assumptions and exclusions/i)).toBeInTheDocument();
    expect(screen.getByText(/Planning range preview/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$38k - \$52k/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Example only — actual range depends on scope and site review/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Know what you receive before completing the wizard/i })).toBeInTheDocument();
  });

  it('renders a safe deployment fingerprint page', () => {
    render(<DeployCheckPage />);
    const pageText = document.body.textContent ?? '';

    expect(screen.getByRole('heading', { name: /Operon Kitchens deploy check/i })).toBeInTheDocument();
    expect(screen.getAllByText('2026-05-31-quote-safety-pass').length).toBeGreaterThan(0);
    expect(screen.getByText(/Clear kitchen renovation estimates for Sydney homes/i)).toBeInTheDocument();
    expect(screen.getByText(/Need help with scope\? Ask Operon/i)).toBeInTheDocument();
    expect(screen.getAllByText(/yes/i).length).toBeGreaterThan(0);
    expect(pageText).not.toMatch(/secret|service_role|database_url|password|token/i);
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
    expect(screen.getByText(/Upload your quote or answer the checklist/i)).toBeInTheDocument();
    expect(screen.queryByText(/Phase 1/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Scope clarity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Allowance risk/i).length).toBeGreaterThan(0);
  });

  it('renders commercial conversion layer pages', () => {
    render(<HowItWorksPage />);
    expect(screen.getByRole('heading', { name: /Kitchen quote clarity before commitment/i })).toBeInTheDocument();
    expect(screen.getByText(/Get a planning estimate/i)).toBeInTheDocument();
    expect(screen.getByText(/Review hidden scope and allowance risks/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Start kitchen estimate/i }).length).toBeGreaterThan(0);

    render(<QuoteReviewServicePage />);
    expect(screen.getByRole('heading', { name: /Review your kitchen quote before comparing totals/i })).toBeInTheDocument();
    expect(screen.getByText(/What the customer receives/i)).toBeInTheDocument();
    expect(screen.getByText(/Future detailed review/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Upload existing quote/i }).length).toBeGreaterThan(0);

    render(<SiteMeasurePage />);
    expect(screen.getByRole('heading', { name: /Confirm the kitchen scope before locking in price/i })).toBeInTheDocument();
    expect(screen.getByText(/What site measure is not/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Request site measure/i }).length).toBeGreaterThan(0);

    render(<DesignSpecificationPackagePage />);
    expect(screen.getByRole('heading', { name: /Turn a rough kitchen idea into a clearer scope/i })).toBeInTheDocument();
    expect(screen.getByText(/Who it is for/i)).toBeInTheDocument();
    expect(screen.getAllByText(/quote comparison/i).length).toBeGreaterThan(0);

    render(<RequestReviewPage />);
    expect(screen.getByRole('heading', { name: /Ask Operon Kitchens to review your kitchen scope/i })).toBeInTheDocument();
    expect(screen.getByText(/Required: name, email, message, privacy acknowledgement and terms acknowledgement/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit request/i })).toBeInTheDocument();
    expect(screen.getByText(/Privacy collection notice/i)).toBeInTheDocument();

    render(<ContactPage />);
    expect(screen.getAllByRole('heading', { name: /Ask Operon Kitchens to review your kitchen scope/i }).length).toBeGreaterThan(0);
  });
});
