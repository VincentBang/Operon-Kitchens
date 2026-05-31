import { fireEvent, render, screen } from '@testing-library/react';
import PrivacyCollectionNotice from '../src/components/PrivacyCollectionNotice';
import ReviewSubmit from '../src/components/steps/ReviewSubmit';
import { defaultQuoteInput } from '../src/lib/quoteDefaults';

describe('privacy collection notice', () => {
  it('renders collection notice, privacy policy link and separate unticked marketing checkbox', () => {
    const onAcknowledgedChange = jest.fn();
    const onMarketingChange = jest.fn();
    render(
      <PrivacyCollectionNotice
        acknowledged={false}
        marketingOptIn={false}
        onAcknowledgedChange={onAcknowledgedChange}
        onMarketingChange={onMarketingChange}
      />
    );

    expect(screen.getByText('Privacy collection notice')).toBeTruthy();
    expect(screen.getByText(/collects your contact, project/i)).toBeInTheDocument();
    expect(screen.getByText(/Only upload files you are authorised to share/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy policy/i }).getAttribute('href')).toBe('/privacy');
    expect(screen.getByLabelText(/I acknowledge this collection notice/i).hasAttribute('checked')).toBe(false);
    expect(screen.getByLabelText(/optional planning tips/i).hasAttribute('checked')).toBe(false);
  });

  it('blocks quote submission until the collection notice is acknowledged', async () => {
    render(<ReviewSubmit data={defaultQuoteInput} onBack={jest.fn()} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Vincent' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'vincent@example.com' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '0400000000' } });

    const submit = screen.getByRole('button', { name: /submit estimate/i });
    expect(submit.hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getByLabelText(/I acknowledge this collection notice/i));
    expect(submit.hasAttribute('disabled')).toBe(false);
    expect(screen.getByLabelText(/optional planning tips/i).hasAttribute('checked')).toBe(false);
  });
});
