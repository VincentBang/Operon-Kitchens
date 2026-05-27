import SeoEducationPage from '@/components/SeoEducationPage';
import { getEducationPage } from '@/lib/seoEducation';

export default function KitchenPcSumsAndProvisionalSumsPage() {
  return <SeoEducationPage page={getEducationPage('kitchen-pc-sums-and-provisional-sums')!} />;
}
