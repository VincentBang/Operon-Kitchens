import { fireEvent, render, screen } from '@testing-library/react';
import PublicLayout from '../src/components/PublicLayout';
import ScopeBuilderPage from '../src/pages/scope-builder';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/scope-builder',
    pathname: '/scope-builder',
  }),
}));

describe('ScopeBuilderPage', () => {
  const originalEnv = process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER;
    } else {
      process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER = originalEnv;
    }
  });

  it('is disabled by default and routes customers to existing safe pathways', () => {
    delete process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER;
    render(<ScopeBuilderPage />);

    expect(screen.getByRole('heading', { name: /Kitchen scope builder is not live yet/i })).toBeInTheDocument();
    expect(screen.getByText(/intentionally hidden/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start kitchen estimate/i })).toHaveAttribute('href', '/quote');
    expect(screen.getByRole('link', { name: /Review existing quote/i })).toHaveAttribute('href', '/quote/review');
    expect(screen.getByRole('link', { name: /Request review/i })).toHaveAttribute('href', '/request-review');
    expect(document.body.textContent).not.toContain('0/100');
  });

  it('renders enabled local fields, validation and scope review output', () => {
    process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER = 'true';
    render(<ScopeBuilderPage />);

    expect(screen.getByRole('heading', { name: /Build a kitchen scope checklist before quote review or site measure/i })).toBeInTheDocument();
    expect(screen.getByText(/Scope summary only/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText(/Choose the closest kitchen layout/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: /L-shape Two connected wall runs/i }));
    fireEvent.change(screen.getByLabelText('Room length mm'), { target: { value: '3400' } });
    fireEvent.change(screen.getByLabelText('Room width mm'), { target: { value: '2600' } });
    fireEvent.change(screen.getByLabelText('Ceiling height mm'), { target: { value: '2400' } });
    fireEvent.change(screen.getByLabelText('Windows, doors and fixed openings'), { target: { value: 'Window above sink and doorway near fridge wall' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Cabinet and storage zones')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Base cabinets'));
    fireEvent.click(screen.getByLabelText('Pantry'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Appliances, benchtop and splashback')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Cooktop'));
    fireEvent.click(screen.getByLabelText('Dishwasher'));
    fireEvent.change(screen.getByLabelText('Benchtop scope'), { target: { value: 'new' } });
    fireEvent.change(screen.getByLabelText('Splashback scope'), { target: { value: 'new' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Works, services and access')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Demolition and removal included?'), { target: { value: 'yes' } });
    fireEvent.change(screen.getByLabelText('Make-good work included?'), { target: { value: 'yes' } });
    fireEvent.change(screen.getByLabelText('Plumbing'), { target: { value: 'sameLocation' } });
    fireEvent.change(screen.getByLabelText('Electrical'), { target: { value: 'sameLocation' } });
    fireEvent.change(screen.getByLabelText('Gas'), { target: { value: 'sameLocation' } });
    fireEvent.change(screen.getByLabelText('Ventilation'), { target: { value: 'sameLocation' } });
    fireEvent.change(screen.getByLabelText('Lighting'), { target: { value: 'sameLocation' } });
    fireEvent.change(screen.getByLabelText(/Short scope note/i), { target: { value: 'Full cabinet replacement with new benchtop and same service locations.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Review your kitchen scope')).toBeInTheDocument();
    expect(screen.getByText('Structured scope summary')).toBeInTheDocument();
    expect(screen.getByText('Allowance and quote-risk prompts')).toBeInTheDocument();
    expect(screen.getByText('L-shape')).toBeInTheDocument();
    expect(screen.getByText('3400mm x 2600mm')).toBeInTheDocument();
    expect(screen.getByText('Site measure and written scope still required')).toBeInTheDocument();
    expect(screen.getByText('Customer questions')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Measurement preparation/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Site measure and written scope confirmation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not legal advice/i).length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain('0/100');
    expect(document.body.textContent).not.toContain('supplier cost');

    fireEvent.click(screen.getByRole('button', { name: 'Prepare kitchen scope' }));
    expect(screen.getByRole('status')).toHaveTextContent('Kitchen scope prepared locally.');
    expect(screen.getByRole('link', { name: /Prepare for site measure/i })).toHaveAttribute('href', '/site-measure');
  });

  it('does not expose the disabled advanced route in public layout navigation', () => {
    render(
      <PublicLayout>
        <main><h1>Public page</h1></main>
      </PublicLayout>,
    );

    expect(document.querySelector('a[href="/scope-builder"]')).not.toBeInTheDocument();
  });
});
