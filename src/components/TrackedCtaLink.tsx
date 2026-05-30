import Link from 'next/link';
import { ReactNode } from 'react';
import { AnalyticsEventName, trackKitchenEvent } from '@/lib/analytics';

interface TrackedCtaLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  eventName: AnalyticsEventName;
  eventProperties?: Record<string, string | number | boolean>;
  ariaLabel?: string;
}

export default function TrackedCtaLink({
  href,
  className,
  children,
  eventName,
  eventProperties = {},
  ariaLabel,
}: TrackedCtaLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackKitchenEvent(eventName, { href, ...eventProperties })}
    >
      {children}
    </Link>
  );
}
