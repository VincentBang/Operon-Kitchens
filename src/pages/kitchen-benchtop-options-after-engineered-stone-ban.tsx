import SeoEducationPage from '@/components/SeoEducationPage';
import { getEducationPage } from '@/lib/seoEducation';

export default function KitchenBenchtopOptionsPage() {
  return <SeoEducationPage page={getEducationPage('kitchen-benchtop-options-after-engineered-stone-ban')!} />;
}
