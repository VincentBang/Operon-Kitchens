import { render, screen } from '@testing-library/react';
import PublicLayout from '../src/components/PublicLayout';
import AreasPage from '../src/pages/areas';
import AreaPage from '../src/pages/areas/[slug]';
import TermsPage from '../src/pages/terms';
import { kitchenAreas } from '../src/lib/areas';

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
});
