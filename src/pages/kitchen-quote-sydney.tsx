import SeoEducationPage from '@/components/SeoEducationPage';
import { getEducationPage } from '@/lib/seoEducation';

export default function KitchenQuoteSydneyPage() {
  return <SeoEducationPage page={getEducationPage('kitchen-quote-sydney')!} />;
}
