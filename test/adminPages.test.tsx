import { render, screen } from '@testing-library/react';
import AdminPage from '../src/pages/admin';
import RateCardsPage from '../src/pages/admin/rate-cards';

describe('public static admin safeguards', () => {
  it('renders a static admin notice without loading database-backed tools', () => {
    render(<AdminPage />);

    expect(screen.getByRole('heading', { name: 'Admin tools are not enabled on the public site' })).toBeInTheDocument();
    expect(screen.getByText(/configured for the customer website/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to public site' })).toHaveAttribute('href', '/');
  });

  it('keeps rate-card editing disabled on the public deployment', () => {
    render(<RateCardsPage />);

    expect(screen.getByRole('heading', { name: 'Rate-card tools are not enabled on the public site' })).toBeInTheDocument();
    expect(screen.getByText(/internal assumptions are not exposed/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Save rate card/i })).not.toBeInTheDocument();
  });
});
