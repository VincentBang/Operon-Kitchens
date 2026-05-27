import SeoEducationPage from '@/components/SeoEducationPage';
import { getEducationPage } from '@/lib/seoEducation';

export default function ApartmentKitchenRenovationSydneyPage() {
  return <SeoEducationPage page={getEducationPage('apartment-kitchen-renovation-sydney')!} />;
}
