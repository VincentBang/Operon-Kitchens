import SeoEducationPage from '@/components/SeoEducationPage';
import { getEducationPage } from '@/lib/seoEducation';

export default function KitchenRenovationProcessPage() {
  return <SeoEducationPage page={getEducationPage('kitchen-renovation-process')!} />;
}
