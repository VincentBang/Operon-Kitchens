import { fireEvent, render, screen } from '@testing-library/react';
import PublicLayout from '../src/components/PublicLayout';
import DesignBriefPage from '../src/pages/design-brief';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/design-brief',
    pathname: '/design-brief',
  }),
}));

describe('DesignBriefPage', () => {
  const originalEnv = process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_DESIGN_BRIEF;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_DESIGN_BRIEF;
    } else {
      process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_DESIGN_BRIEF = originalEnv;
    }
  });

  it('is disabled by default and routes customers to existing safe pathways', () => {
    delete process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_DESIGN_BRIEF;
    render(<DesignBriefPage />);

    expect(screen.getByRole('heading', { name: /Kitchen design brief assistant is not live yet/i })).toBeInTheDocument();
    expect(screen.getByText(/intentionally hidden/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start kitchen estimate/i })).toHaveAttribute('href', '/quote');
    expect(screen.getByRole('link', { name: /Review existing quote/i })).toHaveAttribute('href', '/quote/review');
    expect(screen.getByRole('link', { name: /Request review/i })).toHaveAttribute('href', '/request-review');
    expect(document.body.textContent).not.toContain('0/100');
  });

  it('renders enabled local fields, validation and review summary', () => {
    process.env.NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_DESIGN_BRIEF = 'true';
    render(<DesignBriefPage />);

    expect(screen.getByRole('heading', { name: /Prepare a kitchen design brief before quote review or site measure/i })).toBeInTheDocument();
    expect(screen.getByText(/Deterministic summary only/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText(/Add a suburb or postcode/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Suburb or postcode/i), { target: { value: 'Mosman' } });
    fireEvent.click(screen.getByRole('radio', { name: /House Standalone or semi-detached home/i }));
    fireEvent.change(screen.getByLabelText('Existing quote status'), { target: { value: 'oneQuote' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Kitchen goals')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Current kitchen problem or reason for renovating/i), { target: { value: 'Storage is poor and the benchtop is worn' } });
    fireEvent.click(screen.getByLabelText('More storage'));
    fireEvent.change(screen.getByLabelText('Style direction'), { target: { value: 'Warm modern' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Available information')).toBeInTheDocument();
    expect(screen.getByText(/File upload is not required to complete this planning step/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Written quote details available?'), { target: { value: 'yes' } });
    fireEvent.click(screen.getByLabelText('Pantry storage'));
    fireEvent.click(screen.getByLabelText('New oven'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Apartment, access and service prompts')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Apartment or strata constraints?'), { target: { value: 'no' } });
    fireEvent.change(screen.getByLabelText('Parking or carry-distance concerns?'), { target: { value: 'no' } });
    fireEvent.change(screen.getByLabelText('Known service relocation?'), { target: { value: 'no' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Review your design brief')).toBeInTheDocument();
    expect(screen.getAllByText('Review existing quote').length).toBeGreaterThan(0);
    expect(screen.getByText('Storage is poor and the benchtop is worn')).toBeInTheDocument();
    expect(screen.getByText('Warm modern')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Missing-information checklist/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Site measure and written scope confirmation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not legal advice/i).length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain('0/100');

    fireEvent.click(screen.getByRole('button', { name: 'Prepare design brief' }));
    expect(screen.getByRole('status')).toHaveTextContent('Design brief prepared locally.');
    expect(screen.getByRole('link', { name: /Review existing quote/i })).toHaveAttribute('href', '/quote/review');
  });

  it('does not expose the disabled advanced route in public layout navigation', () => {
    render(
      <PublicLayout>
        <main><h1>Public page</h1></main>
      </PublicLayout>,
    );

    expect(document.querySelector('a[href="/design-brief"]')).not.toBeInTheDocument();
  });
});
