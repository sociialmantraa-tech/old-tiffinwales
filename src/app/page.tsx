import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { ExtraDelightsSection } from '@/components/ExtraDelightsSection';
import { HomeKitchenGallery } from '@/components/HomeKitchenGallery';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { WeeklyMenuSection } from '@/components/WeeklyMenuSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ServiceAreasSection } from '@/components/ServiceAreasSection';

export default function HomePage() {
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

      {/* 7. What Community Says (Customer Testimonials) */}
      <TestimonialsSection />

      {/* 8. Service Areas & Delivery Coverage */}
      <ServiceAreasSection />
    </>
  );
}
