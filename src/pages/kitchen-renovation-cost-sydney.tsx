import SeoEducationPage from '@/components/SeoEducationPage';
import { getEducationPage } from '@/lib/seoEducation';

export default function KitchenRenovationCostSydneyPage() {
  return <SeoEducationPage page={getEducationPage('kitchen-renovation-cost-sydney')!} />;
}
