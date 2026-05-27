import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminPage from '../src/pages/admin';
import RateCardsPage from '../src/pages/admin/rate-cards';
import rateCard from '../src/data/rateCard.json';
import { AuthUser } from '../src/lib/auth';

const adminUser: AuthUser = {
  id: 'admin-1',
  email: 'admin@operonkitchens.local',
  name: 'Admin',
  phone: null,
  role: 'admin',
};

describe('admin pages', () => {
  it('renders the admin dashboard with content and quote management links', () => {
    render(
      <AdminPage
        user={adminUser}
        leads={[{ id: 'lead-1' }]}
        quotes={[{ id: 'quote-1', leadName: 'Alex', leadEmail: 'alex@example.com', total: 22000, confidenceLevel: 'high', status: 'SUBMITTED' }]}
        rateCards={[{ id: 'rate-1', name: 'Kitchen rate card', version: '2026-01', isActive: true }]}
        contentCounts={{ products: 4, glossary: 10, guides: 2, locations: 3, faqs: 4 }}
      />
    );

    expect(screen.getByRole('heading', { name: 'Operon Kitchens admin' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Leads/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Rate cards/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /FAQs/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Alex/)).toBeInTheDocument();
  });

  it('saves a rate-card quick edit through the admin API', async () => {
    const fetchMock = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      if (String(url) === '/api/admin/rate-cards' && init?.method === 'POST') {
        return {
          ok: true,
          json: async () => ({ rateCard: { id: 'rate-1' } }),
        } as Response;
      }
      if (String(url) === '/api/admin/rate-cards') {
        return {
          ok: true,
          json: async () => ({
            rateCards: [{ id: 'rate-1', name: 'Kitchen rate card', version: '2026-01', data: rateCard, isActive: true, createdAt: '', updatedAt: '' }],
          }),
        } as Response;
      }
      return {
        ok: false,
        json: async () => ({ error: 'Unexpected request' }),
      } as Response;
    });
    global.fetch = fetchMock as typeof fetch;

    render(
      <RateCardsPage
        user={adminUser}
        rateCards={[{ id: 'rate-1', name: 'Kitchen rate card', version: '2026-01', data: rateCard, isActive: true, createdAt: '', updatedAt: '' }]}
      />
    );

    fireEvent.change(screen.getByLabelText('Base cabinet rate quick edit'), { target: { value: '875' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save rate card' }));

    expect(await screen.findByText('Rate card saved. New submitted quotes will use the active card.')).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/admin/rate-cards', expect.objectContaining({ method: 'POST' })));
    const postCall = fetchMock.mock.calls.find(([url, init]) => String(url) === '/api/admin/rate-cards' && (init as RequestInit | undefined)?.method === 'POST');
    expect(JSON.parse(String((postCall?.[1] as RequestInit).body)).data.cabinetry.baseRate).toBe(875);
  });
});
