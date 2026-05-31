import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RequestReviewPage from '../src/pages/request-review';

describe('request review page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function fillRequiredFields() {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Vincent' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'vincent@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Please review my kitchen quote scope and site measure next step.' },
    });
    fireEvent.click(screen.getByLabelText(/I acknowledge this collection notice/i));
    fireEvent.click(screen.getByLabelText(/I acknowledge the Terms of Use/i));
  }

  it('renders backend-backed intake fields and requires privacy and terms acknowledgement', () => {
    render(<RequestReviewPage />);

    expect(screen.getByRole('heading', { name: /Ask Operon Kitchens to review your kitchen scope/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Property type')).toBeInTheDocument();
    expect(screen.getByLabelText('Project stage')).toBeInTheDocument();
    expect(screen.getByLabelText('Have a current quote?')).toBeInTheDocument();
    expect(screen.getByLabelText('Have photos or plans?')).toBeInTheDocument();
    expect(screen.getByLabelText('Preferred next step')).toBeInTheDocument();
    expect(screen.getByText(/This request form only sends text, contact and project details/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit request/i })).toBeDisabled();

    fillRequiredFields();
    expect(screen.getByRole('button', { name: /Submit request/i })).not.toBeDisabled();
  });

  it('submits to the kitchen Netlify function and shows acknowledgement', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        request: { requestId: 'okr_test_request' },
        storage: 'logged',
        notificationPrepared: false,
      }),
    }));
    global.fetch = fetchMock as typeof fetch;

    render(<RequestReviewPage />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /Submit request/i }));

    await screen.findByText(/Your request has been received for Operon Kitchens review intake/i);
    expect(screen.getByText(/okr_test_request/i)).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/.netlify/functions/kitchen-request-review', expect.objectContaining({
      method: 'POST',
    })));
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body).toEqual(expect.objectContaining({
      name: 'Vincent',
      email: 'vincent@example.com',
      privacyAcknowledged: true,
      termsAcknowledged: true,
      sourceRoute: '/request-review',
    }));
    expect(body).not.toHaveProperty('margin');
    expect(body).not.toHaveProperty('leadScore');
  });

  it('shows a helpful error state when the endpoint rejects the request', async () => {
    global.fetch = jest.fn(async () => ({
      ok: false,
      json: async () => ({ ok: false, errors: ['Message must include at least 10 characters.'] }),
    })) as typeof fetch;

    render(<RequestReviewPage />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /Submit request/i }));

    expect(await screen.findByText(/Message must include at least 10 characters/i)).toBeInTheDocument();
  });
});
