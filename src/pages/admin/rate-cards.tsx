import StaticServiceNotice from '@/components/StaticServiceNotice';

export default function RateCardsAdminPage() {
  return (
    <StaticServiceNotice
      eyebrow="Admin access"
      title="Rate-card tools are not enabled on the public site"
      description="Kitchen rate-card editing is intentionally disabled on this static deployment so internal assumptions are not exposed. Public estimates use customer-safe summary outputs only."
      primaryHref="/admin"
      primaryLabel="Back to admin notice"
      secondaryHref="/quote"
      secondaryLabel="Start kitchen estimate"
    />
  );
}
