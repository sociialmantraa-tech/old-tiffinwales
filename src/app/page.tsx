import { getProducts } from '@/lib/api';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { ExtraDelightsSection } from '@/components/ExtraDelightsSection';
import { HomeKitchenGallery } from '@/components/HomeKitchenGallery';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { WeeklyMenuSection } from '@/components/WeeklyMenuSection';
import { MenuFilterSection } from '@/components/MenuFilterSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ServiceAreasSection } from '@/components/ServiceAreasSection';

export default async function HomePage() {
  // Safe fetch from live WP REST API with built-in 0ms fallback protection
  const products = await getProducts();

  return (
    <>
      {/* 1. Hero Banner with delivery checker & customer trust badges */}
      <HeroSection />

      {/* 2. How TiffinWales Works (4-Step Process) */}
      <HowItWorks />

      {/* 3. Extra Delights (Perfect Add-Ons for Every Meal) */}
      <ExtraDelightsSection />

      {/* 4. A Glimpse of Our Home Kitchen Gallery */}
      <HomeKitchenGallery />

      {/* 5. Why TiffinWales ?? */}
      <WhyChooseUs />

      {/* 6. Explore Our Daily Menus (4-Week Rotation with dish tooltips) */}
      <WeeklyMenuSection />

      {/* 7. Extra Delicacies & Category Filter Menu */}
      <MenuFilterSection initialProducts={products} />

      {/* 8. What Community Says (Customer Testimonials) */}
      <TestimonialsSection />

      {/* 9. Service Areas & Delivery Coverage */}
      <ServiceAreasSection />
    </>
  );
}
