import { fireEvent, render, screen } from '@testing-library/react';
import TrackedCtaLink from '../src/components/TrackedCtaLink';

describe('TrackedCtaLink', () => {
  it('dispatches a kitchen analytics event without external analytics services', async () => {
    const listener = jest.fn();
    window.addEventListener('operon-kitchens:analytics', listener);

    render(
      <TrackedCtaLink
        href="/quote"
        eventName="estimate_start_click"
        eventProperties={{ route: '/', cta_location: 'test' }}
      >
        Start estimate
      </TrackedCtaLink>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Start estimate' }));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toEqual({
      name: 'estimate_start_click',
      properties: {
        href: '/quote',
        route: '/',
        cta_location: 'test',
      },
    });

    window.removeEventListener('operon-kitchens:analytics', listener);
  });
});
