import { getProducts } from '@/lib/api';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { MealPlansSection } from '@/components/MealPlansSection';
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

      {/* 3. Popular Meal Plans & Subscriptions */}
      <MealPlansSection />

      {/* 4. Extra Delights (Perfect Add-Ons for Every Meal) */}
      <ExtraDelightsSection />

      {/* 5. A Glimpse of Our Home Kitchen Gallery */}
      <HomeKitchenGallery />

      {/* 6. Why TiffinWales ?? */}
      <WhyChooseUs />

      {/* 7. Explore Our Daily Menus (4-Week Rotation with dish tooltips) */}
      <WeeklyMenuSection />

      {/* 8. Extra Delicacies & Category Filter Menu */}
      <MenuFilterSection initialProducts={products} />

      {/* 9. What Community Says (Customer Testimonials) */}
      <TestimonialsSection />

      {/* 10. Service Areas & Delivery Coverage */}
      <ServiceAreasSection />
    </>
  );
}
