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
import KitchenRenovationProcessPage from '../src/pages/kitchen-renovation-process';
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
    const footer = container.querySelector('footer');
    const quoteReviewColumn = screen.getByRole('heading', { name: /Quote & review/i }).closest('div');
    const companyColumn = screen.getByRole('heading', { name: /Areas & company/i }).closest('div');

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
    expect(quoteReviewColumn).toHaveTextContent('Request review');
    expect(companyColumn).not.toHaveTextContent('Request review');
    expect(screen.queryByRole('link', { name: /admin leads/i })).not.toBeInTheDocument();
    expect(container.querySelector('a[href="/admin/leads"]')).not.toBeInTheDocument();
    expect(screen.getByText(/Kitchen renovation estimate and quote review support/i)).toBeInTheDocument();
    expect(screen.getByText(/brand\. Planning guidance only/i)).toBeInTheDocument();
    expect(screen.getByText(/© 2026 Operon Kitchens\. All rights reserved\./i)).toBeInTheDocument();
    expect(footer).toHaveTextContent('Operon Kitchens is a separate customer-facing kitchen renovation brand. Planning guidance only. Site measure and written scope confirmation are required before contract pricing.');
    expect(footer?.textContent).not.toContain('brand.Planning');
    expect(document.body.textContent).not.toContain('scope??Ask');
  });

  it('renders the area index and individual area template', () => {
    const { container } = render(<AreasPage />);
    expect(screen.getByRole('heading', { name: /Sydney kitchen renovation service areas and quote review support/i })).toBeInTheDocument();
    expect(screen.getByText(/Kitchen quote confidence can change by suburb/i)).toBeInTheDocument();
    expect(screen.getByText(/Planning guidance only\. Site measure, selections, licensed trade checks/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Why suburb and property type affect kitchen quote confidence/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Apartments and strata/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Older homes/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Premium renovations/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Growth corridors and family homes/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Premium homes$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Apartment and strata-heavy suburbs/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Older housing and heritage-style areas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Mixed homes and apartments/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Family-home suburbs/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Growth corridors and new-home upgrades/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Choose the right next step for your kitchen project/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Start kitchen estimate/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Review existing quote/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Request review/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Prepare for site measure/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Mosman/i })).toBeInTheDocument();
    expect(container.querySelector('a[href="/kitchen-renovation-process"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/faqs"]')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/final quote|approved quote|certified quote|guaranteed savings/i);

    const areaPage = render(<AreaPage area={kitchenAreas[0]} />);
    expect(screen.getByRole('heading', { name: /Kitchen renovation quotes in Mosman/i })).toBeInTheDocument();
    expect(screen.getByText(/Quote risks to check/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Mosman quote review pathway/i })).toBeInTheDocument();
    expect(screen.getByText(/Quote review is useful when totals are hard to compare/i)).toBeInTheDocument();
    expect(areaPage.container.querySelector('a[href="/quote/review"]')).toBeInTheDocument();
    expect(areaPage.container.querySelector('a[href="/site-measure"]')).toBeInTheDocument();
  });

  it('keeps high-value area pages unique without doorway-page repetition', () => {
    const mosman = kitchenAreas.find((area) => area.name === 'Mosman');
    const doubleBay = kitchenAreas.find((area) => area.name === 'Double Bay');
    const neutralBay = kitchenAreas.find((area) => area.name === 'Neutral Bay');
    const manly = kitchenAreas.find((area) => area.name === 'Manly');
    const vaucluse = kitchenAreas.find((area) => area.name === 'Vaucluse');

    expect(mosman?.projectStyles).toContain('Harbour-side apartment quote review');
    expect(mosman?.quoteRisks.join(' ')).toContain('Steep access');
    expect(mosman?.preparation.join(' ')).toContain('Parking, driveway, strata or building-management notes');

    expect(doubleBay?.quoteRisks.join(' ')).toContain('Lift booking');
    expect(doubleBay?.quoteRisks.join(' ')).toContain('class 2 review prompts');
    expect(doubleBay?.preparation.join(' ')).toContain('renovation by-laws');

    expect(neutralBay?.quoteRisks.join(' ')).toContain('common-area protection');
    expect(neutralBay?.projectStyles).toContain('Compact kitchen and appliance allowance review');

    expect(manly?.quoteRisks.join(' ')).toContain('Coastal durability');
    expect(manly?.quoteRisks.join(' ')).toContain('ventilation');

    expect(vaucluse?.quoteRisks.join(' ')).toContain('engineered-stone restriction prompts');
    expect(vaucluse?.preparation.join(' ')).toContain('steep sites');
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
    const { container } = render(<FaqsPage />);
    expect(screen.getByRole('heading', { name: /Kitchen renovation FAQs for Sydney quotes, scope and site measure/i })).toBeInTheDocument();
    expect(screen.getByText(/Clear answers about planning estimates, kitchen quote review/i)).toBeInTheDocument();
    expect(screen.getByText(/Planning guidance only\. Site measure, selections, licensed trade checks/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Kitchen estimates$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Quote review$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Scope, allowances and exclusions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Site measure and written scope/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Apartments, strata and access/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /NSW contract, deposit and HBC prompts/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Materials, benchtops and engineered stone/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Using Operon Kitchens/i })).toBeInTheDocument();
    expect(screen.getByText(/Is the online estimate a confirmed price/i)).toBeInTheDocument();
    expect(screen.getByText(/Project-specific pricing requires site measure/i)).toBeInTheDocument();
    expect(screen.getByText(/Can Operon Kitchens review an existing kitchen quote/i)).toBeInTheDocument();
    expect(screen.getByText(/What are PC sums/i)).toBeInTheDocument();
    expect(screen.getByText(/What are provisional sums/i)).toBeInTheDocument();
    expect(screen.getByText(/Do I need a site measure before confirmed pricing/i)).toBeInTheDocument();
    expect(screen.getByText(/Do apartment kitchens need extra review/i)).toBeInTheDocument();
    expect(screen.getByText(/Does a kitchen renovation need a written contract/i)).toBeInTheDocument();
    expect(screen.getByText(/When might HBC review be relevant/i)).toBeInTheDocument();
    expect(screen.getByText(/What about engineered stone restrictions/i)).toBeInTheDocument();
    expect(screen.getByText(/File upload is not required to complete the planning estimate/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Start kitchen estimate/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Review existing quote/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Request review/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Prepare for site measure/i }).length).toBeGreaterThan(0);
    expect(container.querySelector('a[href="/kitchen-renovation-process"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/kitchen-renovation-cost-sydney"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/kitchen-pc-sums-and-provisional-sums"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/areas"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/privacy"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/terms"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/admin/leads"]')).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/final fixed quote|approved quote|certified quote|guaranteed savings|order instantly/i);
  });

  it('renders the upgraded homepage hero and sample estimate output', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { name: /Sydney kitchen renovation estimates and quote review before you commit/i })).toBeInTheDocument();
    expect(screen.getByText(/Get a planning estimate, review hidden quote risks/i)).toBeInTheDocument();
    expect(screen.getByText(/Planning estimate only\. Site measure, selections and written scope confirmation/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Start kitchen estimate/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Review existing quote/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Request review/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Planning range preview/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$38k - \$52k/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Example only — actual range depends on scope and site review/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Know what you receive before completing the wizard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /What Operon Kitchens checks before you compare kitchen quotes/i })).toBeInTheDocument();
    expect(screen.getAllByText(/PC sums and provisional sums/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/HBC, deposit and contract review prompts/i).length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain('Upload a current quote');
    expect(document.body.textContent).not.toContain('Upload context');
    expect(document.body.textContent).not.toContain('Upload plans');
  });

  it('renders a safe deployment fingerprint page', () => {
    render(<DeployCheckPage />);
    const pageText = document.body.textContent ?? '';

    expect(screen.getByRole('heading', { name: /Operon Kitchens deploy check/i })).toBeInTheDocument();
    expect(screen.getAllByText('2026-05-31-quote-safety-pass').length).toBeGreaterThan(0);
    expect(screen.getByText(/Sydney kitchen renovation estimates and quote review before you commit/i)).toBeInTheDocument();
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

  it('deepens the strata kitchen service page with access and approval review prompts', () => {
    const page = getServicePage('strata-kitchen-renovation-sydney');
    expect(page).toBeTruthy();
    if (!page) throw new Error('Missing strata-kitchen-renovation-sydney service page');

    expect(page.whoFor.length).toBeGreaterThanOrEqual(4);
    expect(page.typicalScope.length).toBeGreaterThanOrEqual(4);
    expect(page.scopeDrivers.length).toBeGreaterThanOrEqual(5);
    expect(page.preparation.length).toBeGreaterThanOrEqual(5);
    expect(page.confidenceBoosters.length).toBeGreaterThanOrEqual(5);
    expect(page.quoteRisks.length).toBeGreaterThanOrEqual(5);
    expect(page.exclusionsToCheck.length).toBeGreaterThanOrEqual(5);
    expect(page.relatedAreas).toEqual(expect.arrayContaining(['Neutral Bay', 'Manly']));
    expect(page.related.map(([, href]) => href)).toEqual(expect.arrayContaining(['/kitchen-quote-sydney', '/kitchen-pc-sums-and-provisional-sums', '/quote/review']));
    expect(JSON.stringify(page)).toContain('DBP/class 2');
    expect(JSON.stringify(page)).toContain('lift booking');
    expect(JSON.stringify(page)).toContain('written scope confirmation');
    expect(JSON.stringify(page)).toContain('project-specific confirmation');
  });

  it('deepens the benchtop replacement service page for material, access and exclusion review', () => {
    const page = getServicePage('kitchen-benchtop-replacement-sydney');
    expect(page).toBeTruthy();
    if (!page) throw new Error('Missing kitchen-benchtop-replacement-sydney service page');

    expect(page.whoFor.length).toBeGreaterThanOrEqual(5);
    expect(page.typicalScope.length).toBeGreaterThanOrEqual(5);
    expect(page.scopeDrivers.length).toBeGreaterThanOrEqual(6);
    expect(page.preparation.length).toBeGreaterThanOrEqual(6);
    expect(page.confidenceBoosters.length).toBeGreaterThanOrEqual(6);
    expect(page.quoteRisks.length).toBeGreaterThanOrEqual(6);
    expect(page.exclusionsToCheck.length).toBeGreaterThanOrEqual(6);
    expect(page.related.map(([, href]) => href)).toEqual(expect.arrayContaining([
      '/kitchen-benchtop-options-after-engineered-stone-ban',
      '/kitchen-pc-sums-and-provisional-sums',
      '/quote/review',
    ]));
    expect(JSON.stringify(page)).toContain('engineered-stone');
    expect(JSON.stringify(page)).toContain('splashback');
    expect(JSON.stringify(page)).toContain('Licensed plumbing, electrical or gas');
    expect(JSON.stringify(page)).toContain('project-specific confirmation');
  });

  it('renders quote review with a sample result preview', () => {
    render(<QuoteReviewPage />);
    expect(screen.getByRole('heading', { name: /Kitchen quote review Sydney/i })).toBeInTheDocument();
    expect(screen.getAllByText(/before comparing totals/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Start quote review/i })).toHaveAttribute('href', '#quote-review-intake');
    expect(screen.getByRole('link', { name: /Need a planning estimate instead/i })).toHaveAttribute('href', '/quote');
    expect(screen.getByText(/Sample review result/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /What Operon Kitchens checks before you compare kitchen quotes/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Quote details, photos and plans/i })).toBeInTheDocument();
    expect(screen.getByText(/Prepare or describe the quote, photos and plans/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Scope and inclusions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Allowances and provisional sums/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Trades and services/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Benchtop, splashback and appliances/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Apartment, strata and contract prompts/i })).toBeInTheDocument();
    expect(screen.getByText(/Add quote details to generate a review readiness preview/i)).toBeInTheDocument();
    expect(screen.queryByText(/0\/100/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Upload your quote or answer the checklist/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Phase 1/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Scope clarity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Allowance risk/i).length).toBeGreaterThan(0);
  });

  it('renders commercial conversion layer pages', () => {
    render(<HowItWorksPage />);
    expect(screen.getByRole('heading', { name: /How kitchen renovation estimates and quote review work in Sydney/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Start kitchen estimate/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Review existing quote/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Request review/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Planning guidance only\. Site measure, selections, licensed trade checks/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /The five-step Operon Kitchens path/i })).toBeInTheDocument();
    expect(screen.getByText(/Start with your kitchen goal and budget range/i)).toBeInTheDocument();
    expect(screen.getByText(/Measure layout, access and existing conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose scope: refresh, full renovation or apartment kitchen/i)).toBeInTheDocument();
    expect(screen.getByText(/Check selections, finishes and allowances/i)).toBeInTheDocument();
    expect(screen.getByText(/Compare quotes beyond the headline total/i)).toBeInTheDocument();
    expect(screen.getByText(/Review PC sums, provisional sums and exclusions/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Prepare for site measure/i })).toBeInTheDocument();
    expect(screen.getByText(/Confirm licensed trades, strata and contract prompts/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Confirm written scope before pricing commitment/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Request review or start estimate/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /What you receive from the process/i })).toBeInTheDocument();
    expect(screen.getByText(/planning estimate range/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /What this process does not replace/i })).toBeInTheDocument();
    expect(screen.getByText(/Not legal advice/i)).toBeInTheDocument();
    expect(screen.getByText(/Not an online custom kitchen purchase/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Choose the right next step/i })).toBeInTheDocument();
    expect(screen.getByText(/No quote yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Already have a quote/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready for site measure/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('Upload quote, photos or plans');
    expect(document.body.textContent).not.toContain('upload a quote');

    render(<QuoteReviewServicePage />);
    expect(screen.getByRole('heading', { name: /Review your kitchen quote before comparing totals/i })).toBeInTheDocument();
    expect(screen.getByText(/What the customer receives/i)).toBeInTheDocument();
    expect(screen.getByText(/Future detailed review/i)).toBeInTheDocument();
    expect(screen.getByText(/What to prepare/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Review existing quote/i }).length).toBeGreaterThan(0);

    render(<KitchenRenovationProcessPage />);
    expect(screen.getByRole('heading', { name: /Kitchen renovation process in Sydney: from planning estimate to written scope/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Start with your kitchen goal and budget range/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Confirm written scope before pricing commitment/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Review existing quote/i }).length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain('Upload quote, photos or plans');
    expect(document.body.textContent).not.toContain('upload a quote');

    render(<SiteMeasurePage />);
    expect(screen.getByRole('heading', { name: /Confirm the kitchen scope before locking in price/i })).toBeInTheDocument();
    expect(screen.getByText(/What site measure is not/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Request site measure/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Review existing quote/i }).length).toBeGreaterThan(0);

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
