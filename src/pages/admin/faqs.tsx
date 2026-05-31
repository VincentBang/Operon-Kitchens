import StaticServiceNotice from '@/components/StaticServiceNotice';

export default function FaqsAdminPage() {
  return (
    <StaticServiceNotice
      eyebrow="Admin access"
      title="FAQ editing is not enabled on the public site"
      description="Public FAQs render from the kitchen content files. Editing tools are reserved for the future kitchen admin workspace."
      primaryHref="/faqs"
      primaryLabel="View public FAQs"
      secondaryHref="/admin"
      secondaryLabel="Back to admin notice"
    />
  );
}
