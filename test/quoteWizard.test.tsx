import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import QuoteWizard from '../src/components/QuoteWizard';
import rateCard from '../src/data/rateCard.json';
import { defaultDesignPlan, designStorageKey } from '../src/lib/designPlan';

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
    query: {},
  }),
}));

function mockFetch() {
  const fetchMock = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    const href = String(url);
    if (href === '/api/rate-card') {
      return {
        ok: true,
        json: async () => ({ rateCard: { data: rateCard } }),
      } as Response;
    }
    if (href === '/api/quotes') {
      const payload = init?.body ? JSON.parse(String(init.body)) : {};
      return {
        ok: true,
        json: async () => ({
          quote: {
            id: 'quote-test-123',
            quoteInput: payload.quoteInput,
          },
        }),
      } as Response;
    }
    return {
      ok: false,
      json: async () => ({ error: `Unhandled fetch ${href}` }),
    } as Response;
  });
  global.fetch = fetchMock as typeof fetch;
  return fetchMock;
}

describe('QuoteWizard', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockFetch();
  });

  it('loads a saved design plan and completes an estimate submission flow', async () => {
    window.localStorage.setItem(designStorageKey, JSON.stringify({ ...defaultDesignPlan, exportedAt: '2026-01-01T00:00:00.000Z' }));
    render(<QuoteWizard />);

    expect(await screen.findByText('Step 1 of 9: Project')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Start a Sydney kitchen renovation planning estimate/i })).toBeInTheDocument();
    expect(screen.getByText(/Planning estimate only\. Site measure, selections, licensed trade checks/i)).toBeInTheDocument();
    expect(screen.getByText(/Takes about 3–5 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/Already have a quote\?/i)).toBeInTheDocument();
    expect(screen.getByText(/planning estimate range, confidence score, assumptions/i)).toBeInTheDocument();
    expect(screen.getByText('Planning estimate')).toBeInTheDocument();
    expect(screen.getByText('Quote review')).toBeInTheDocument();
    expect(screen.getByText('Site measure')).toBeInTheDocument();
    expect(screen.getByText('Written scope')).toBeInTheDocument();
    expect(screen.getByText(/Not sure yet is okay/i)).toBeInTheDocument();
    expect(screen.getByText(/project intent, suburb and timing/i)).toBeInTheDocument();
    expect(screen.getByText(/Use the suburb and timing/i)).toBeInTheDocument();
    expect(screen.getByText(/You can add quote details later for review/i)).toBeInTheDocument();
    expect(screen.getByText(/An indicative Sydney kitchen renovation range before site measure/i)).toBeInTheDocument();
    expect(screen.getByText(/Confidence signal/i)).toBeInTheDocument();
    expect(screen.getByText(/Review risk/i)).toBeInTheDocument();
    expect(screen.getByText(/Next step clarity/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('You can upload it later for review');

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Property and access')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Kitchen layout and size')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Base cabinets (linear m)'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Doors (qty)'), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText('Panels (qty)'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Step 4 of 9: Inclusions')).toBeInTheDocument();
    expect(screen.getByText('Scope inclusions')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Finishes and allowance tiers')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Benchtop length (m)'), { target: { value: '3.2' } });
    fireEvent.change(screen.getByLabelText('Splashback area (sqm)'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Services and risk flags')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('electrical'));
    fireEvent.change(screen.getByLabelText(/Proposed deposit percent/), { target: { value: '12' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Quote details and prepared files')).toBeInTheDocument();
    expect(screen.getByText(/File upload is optional and not required to complete this planning estimate/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Contact details and privacy notice')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Vincent Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'vincent@example.com' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '0400000000' } });
    fireEvent.click(screen.getByLabelText('I acknowledge this collection notice.'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Estimate summary')).toBeInTheDocument();
    expect(screen.getByText(/Customer design plan attached/)).toBeInTheDocument();
    expect(screen.getByText(/Recommended maximum deposit/)).toBeInTheDocument();
    expect(screen.getByText(/Planning budget range/)).toBeInTheDocument();
    expect(screen.getByText(/What improved confidence/)).toBeInTheDocument();
    expect(screen.getAllByText(/Review risk/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Compliance prompts/)).toBeInTheDocument();
    expect(screen.getByText(/Use this as planning guidance only/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Request professional review/i })).toHaveAttribute('href', '/request-review');
    expect(screen.getAllByRole('link', { name: /Review an existing quote/i }).some((link) => link.getAttribute('href') === '/quote/review')).toBe(true);
    expect(screen.getByRole('link', { name: /Prepare for site measure/i })).toHaveAttribute('href', '/site-measure');
    fireEvent.click(screen.getByRole('button', { name: 'Request professional review' }));

    expect(await screen.findByText(/your estimate has been saved/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/quotes', expect.objectContaining({ method: 'POST' }));
    });
  });
});
