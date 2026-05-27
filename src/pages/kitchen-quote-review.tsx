import SeoEducationPage from '@/components/SeoEducationPage';
import { getEducationPage } from '@/lib/seoEducation';

export default function KitchenQuoteReviewEducationPage() {
  return <SeoEducationPage page={getEducationPage('kitchen-quote-review')!} />;
}
