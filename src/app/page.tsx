import { getProducts } from '@/lib/api';
import { HeroSection } from '@/components/HeroSection';
import { MealPlansSection } from '@/components/MealPlansSection';
import { WeeklyMenuSection } from '@/components/WeeklyMenuSection';
import { ExtraDelightsSection } from '@/components/ExtraDelightsSection';
import { MenuFilterSection } from '@/components/MenuFilterSection';
import { HowItWorks } from '@/components/HowItWorks';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ServiceAreasSection } from '@/components/ServiceAreasSection';

export default async function HomePage() {
  // Safe fetch from live WP REST API with built-in 0ms fallback protection
  const products = await getProducts();

  return (
    <>
      <HeroSection />
      <MealPlansSection />
      <WeeklyMenuSection />
      <ExtraDelightsSection />
      <MenuFilterSection initialProducts={products} />
      <HowItWorks />
      <TestimonialsSection />
      <ServiceAreasSection />
    </>
  );
}
