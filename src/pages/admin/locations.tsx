import StaticServiceNotice from '@/components/StaticServiceNotice';

export default function LocationsAdminPage() {
  return (
    <StaticServiceNotice
      eyebrow="Admin access"
      title="Area editing is not enabled on the public site"
      description="Sydney area pages are published as static customer-facing pages. Editable area management is planned for a future admin workspace."
      primaryHref="/areas"
      primaryLabel="View areas"
      secondaryHref="/admin"
      secondaryLabel="Back to admin notice"
    />
  );
}
