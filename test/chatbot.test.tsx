import { fireEvent, render, screen, within } from '@testing-library/react';
import KitchenChatbot from '../src/components/KitchenChatbot';
import { classifyKitchenChatbotIntent, getKitchenChatbotResponse } from '../src/lib/chatbot';

describe('Operon Kitchens chatbot', () => {
  it('classifies kitchen-specific intents without offering final pricing', () => {
    expect(classifyKitchenChatbotIntent('Can I use engineered stone for my benchtop?')).toBe('materials');
    expect(classifyKitchenChatbotIntent('I need HBC and deposit advice')).toBe('compliance');
    expect(classifyKitchenChatbotIntent('Can you beat this quote?')).toBe('unsupported');

    const response = getKitchenChatbotResponse('How much will my kitchen cost as a final price?');
    expect(response.text).toContain('estimate range');
    expect(response.text).not.toMatch(/\$\s*\d/);
  });

  it('renders a floating assistant and routes material questions to product guidance', () => {
    render(<KitchenChatbot />);

    fireEvent.click(screen.getByRole('button', { name: /Ask Operon/i }));
    expect(screen.getByText(/I can help you understand kitchen quote scope/)).toBeInTheDocument();
    expect(screen.getByText(/I do not provide final pricing or legal advice/i)).toBeInTheDocument();
    expect(screen.getByText(/Site measure and written scope confirmation are required before contract pricing/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Kitchen assistant input'), {
      target: { value: 'Can I use engineered stone?' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(screen.getByText(/restricted engineered-stone selections/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Review benchtop and material scope' })).toHaveAttribute('href', '/kitchen-benchtop-options-after-engineered-stone-ban');
  });

  it('keeps unsupported competitor-price claims inside a review-safe pathway', () => {
    const response = getKitchenChatbotResponse('Can Operon beat this quote and guarantee final price?');

    expect(response.intent).toBe('unsupported');
    expect(response.text).toContain('cannot promise final pricing');
    expect(response.route.href).toBe('/quote/review');
    expect(response.requiresReview).toBe(true);
  });

  it('states the chatbot does not provide legal advice or compliance certainty', () => {
    render(<KitchenChatbot />);
    expect(screen.getByRole('button', { name: /Need help with scope\? Ask Operon/i })).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('??');
    fireEvent.click(screen.getByRole('button', { name: /Ask Operon/i }));
    expect(screen.getByText(/I do not provide final pricing or legal advice/i)).toBeInTheDocument();
    const paths = within(screen.getByRole('navigation', { name: /Kitchen next steps/i }));
    expect(paths.getByRole('link', { name: /Start kitchen estimate/i })).toHaveAttribute('href', '/quote');
    expect(paths.getByRole('link', { name: /Review existing quote/i })).toHaveAttribute('href', '/quote/review');
    expect(paths.getByRole('link', { name: /Request review/i })).toHaveAttribute('href', '/request-review');
    expect(paths.getByRole('link', { name: /Prepare for site measure/i })).toHaveAttribute('href', '/site-measure');
  });

  it('renders quick prompts as separate readable buttons', () => {
    render(<KitchenChatbot />);
    fireEvent.click(screen.getByRole('button', { name: /Ask Operon/i }));

    [
      'What measurements should I prepare?',
      'Can you review my existing quote?',
      'What are PC sums and provisional sums?',
      'What should I check before site measure?',
      'Do apartment kitchens need strata review?',
    ].forEach((prompt) => {
      expect(screen.getByRole('button', { name: prompt })).toBeInTheDocument();
    });

    expect(document.body.textContent).not.toContain('scope??Ask');
    expect(document.body.textContent).not.toMatch(/supplier cost|internal rate|lead score|admin priority/i);
  });
});
