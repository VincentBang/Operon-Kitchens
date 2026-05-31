import StaticServiceNotice from '@/components/StaticServiceNotice';

export default function SignInPage() {
  return (
    <StaticServiceNotice
      eyebrow="Sign in"
      title="Sign-in is not enabled on this public deployment"
      description="Customer login and admin authentication are deferred until the Operon Kitchens backend is connected. You can still start an estimate or request quote review from the public site."
      primaryHref="/quote"
      primaryLabel="Start kitchen estimate"
      secondaryHref="/quote/review"
      secondaryLabel="Review existing quote"
    />
  );
}
