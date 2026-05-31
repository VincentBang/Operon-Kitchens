import StaticServiceNotice from '@/components/StaticServiceNotice';

export default function AccountPage() {
  return (
    <StaticServiceNotice
      eyebrow="Customer account"
      title="Saved quote accounts are not enabled yet"
      description="Operon Kitchens currently supports planning estimates and quote review intake without a customer login. Saved accounts will be added after the kitchen backend is connected."
      primaryHref="/quote"
      primaryLabel="Start kitchen estimate"
      secondaryHref="/quote/review"
      secondaryLabel="Review existing quote"
    />
  );
}
