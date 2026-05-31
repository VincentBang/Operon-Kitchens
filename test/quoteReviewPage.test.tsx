import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import QuoteReviewPage from '../src/pages/quote/review';

describe('quote review page submission', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function fillContactFields() {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Vincent' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'vincent@example.com' } });
    fireEvent.click(screen.getByLabelText(/I acknowledge this collection notice/i));
    fireEvent.click(screen.getByLabelText(/I acknowledge the Terms of Use/i));
  }

  it('uses the request-review Netlify Function instead of static-export API routes', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        request: { requestId: 'okr_quote_review_request' },
        delivery: { stored: true, notificationPrepared: false },
      }),
    }));
    global.fetch = fetchMock as typeof fetch;

    render(<QuoteReviewPage />);
    fireEvent.change(screen.getByLabelText('Quote ID or email'), { target: { value: 'OK-123' } });
    fireEvent.click(screen.getByRole('button', { name: /Add to review notes/i }));
    fillContactFields();
    fireEvent.click(screen.getByRole('button', { name: /Request quote review/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      '/.netlify/functions/kitchen-request-review',
      expect.objectContaining({ method: 'POST' }),
    ));
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body).toEqual(expect.objectContaining({
      name: 'Vincent',
      email: 'vincent@example.com',
      propertyType: 'notSure',
      projectStage: 'quoteInHand',
      preferredNextStep: 'quoteReview',
      privacyAcknowledged: true,
      termsAcknowledged: true,
      sourceRoute: '/quote/review',
    }));
    expect(body.message).toContain('Quote review request submitted from /quote/review.');
    expect(body.message).toContain('Saved estimate reference: OK-123.');
    expect(body.message).toContain('Files are not uploaded through this submit action yet.');
    expect(body).not.toHaveProperty('margin');
    expect(body).not.toHaveProperty('leadScore');
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain('/api/leads');
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain('/api/quotes');
  });

  it('keeps saved estimate lookup static-safe', () => {
    global.fetch = jest.fn() as typeof fetch;

    render(<QuoteReviewPage />);
    fireEvent.change(screen.getByLabelText('Quote ID or email'), { target: { value: 'OK-456' } });
    fireEvent.click(screen.getByRole('button', { name: /Add to review notes/i }));

    expect(screen.getByText(/Saved estimate lookup is not active on the public static launch/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
