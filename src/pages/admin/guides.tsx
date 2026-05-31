import StaticServiceNotice from '@/components/StaticServiceNotice';

export default function GuidesAdminPage() {
  return (
    <StaticServiceNotice
      eyebrow="Admin access"
      title="Guide editing is not enabled on the public site"
      description="Planning guide content is served from the public app. Editable guide management is deferred until the operational backend is connected."
      primaryHref="/guides"
      primaryLabel="View guides"
      secondaryHref="/admin"
      secondaryLabel="Back to admin notice"
    />
  );
}
