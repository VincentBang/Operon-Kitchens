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

    expect(await screen.findByText('Step 1 of 9: Basics')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Property and access')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Kitchen layout and size')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Base cabinets (linear m)'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Doors (qty)'), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText('Panels (qty)'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

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

    expect(screen.getByText('Upload photos, plans or current quote')).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole('button', { name: 'Request professional review' }));

    expect(await screen.findByText(/your estimate has been saved/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/quotes', expect.objectContaining({ method: 'POST' }));
    });
  });
});
