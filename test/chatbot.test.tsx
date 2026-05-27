import { fireEvent, render, screen } from '@testing-library/react';
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
    expect(screen.getByText(/I can help with kitchen quote scope/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Kitchen assistant input'), {
      target: { value: 'Can I use engineered stone?' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(screen.getByText(/restricted engineered-stone selections/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse kitchen products' })).toHaveAttribute('href', '/products/benchtops');
  });

  it('keeps unsupported competitor-price claims inside a review-safe pathway', () => {
    const response = getKitchenChatbotResponse('Can Operon beat this quote and guarantee final price?');

    expect(response.intent).toBe('unsupported');
    expect(response.text).toContain('cannot promise final pricing');
    expect(response.route.href).toBe('/quote/review');
    expect(response.requiresReview).toBe(true);
  });
});
