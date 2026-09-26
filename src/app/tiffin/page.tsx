import React from 'react';
import Link from 'next/link';
import { MealPlansSection } from '@/components/MealPlansSection';
import { HowItWorks } from '@/components/HowItWorks';
import { ExtraDelightsSection } from '@/components/ExtraDelightsSection';
import { WeeklyMenuSection } from '@/components/WeeklyMenuSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { TiffinFaqAccordion } from '@/components/TiffinFaqAccordion';
import { ServiceAreasSection } from '@/components/ServiceAreasSection';
import { Sparkles, ChevronRight, Star, Truck, ShieldCheck, Heart } from 'lucide-react';

export const metadata = {
  title: 'Indian Tiffin Meal Plans | 5 Days & Monthly Subscriptions | Tiffin Wales Boston & Cambridge',
  description: 'Select your preferred Indian meal plan in Cambridge & Boston. Daily, 2, 3, 4, 5-day meal packs or full week subscriptions with soft rotis, fragrant rice, rich dals, and authentic curries.',
};

export default function TiffinPage() {
  const faqs = [
    {
      q: 'How does the 5-Day Plan work?',
      a: 'Our 5-Day plan is our most popular flagship option. You receive a hot, freshly cooked meal box every day from Monday to Friday with zero cooking chores. You only pay one single delivery fee or enjoy free store pickup.'
    },
    {
      q: 'Can I track remaining meal days?',
      a: 'Yes! Your remaining days are shown right on the top notification bar across every page, as well as on your dedicated Account page (/account), where you can also skip dates or pause your schedule.'
    },
    {
      q: 'Can I switch between Veg & Non-Veg?',
      a: 'Absolutely. We offer pure Vegetarian, Non-Vegetarian, and combo packages. You can also pick your spice level (Mild, Medium, or Hot) and bread preference (Naan or 2 Rotis).'
    },
    {
      q: 'What time are tiffins delivered?',
      a: 'Lunch deliveries arrive between 11:45 AM and 1:15 PM, and dinner deliveries arrive between 5:30 PM and 7:30 PM, packed in thermal insulated food-safe containers ready to enjoy.'
    },
    {
      q: 'Can I pause or skip when traveling?',
      a: 'Yes! Simply click "Pause Subscription" or "Skip Next Meal" in your account dashboard or message our kitchen team on WhatsApp. Your unused meal days are safely stored for whenever you return.'
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Rich Saffron-Cream Header Banner with Indian Culinary Spice Pattern */}
      <div style={{
        backgroundImage: 'linear-gradient(180deg, rgba(255, 248, 240, 0.88) 0%, rgba(255, 237, 218, 0.95) 100%), url(/tiffin-banner-pattern.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '50px 20px 42px 20px',
        borderBottom: '1.5px solid #fed7aa',
        boxShadow: '0 6px 24px rgba(255, 100, 19, 0.05)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="tw-container" style={{ maxWidth: '850px', margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '16px',
            fontWeight: 600
          }}>
            <Link href="/" style={{ color: '#ff6912', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} color="#9ca3af" />
            <span>Tiffin &amp; Meal Plans</span>
          </div>

          <div className="section-tag" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#fed7aa',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            margin: '0 auto 14px auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={13} color="#ff6912" />
            <span>Boston &amp; Cambridge Meal Subscriptions</span>
          </div>

          <h1 className="section-title" style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', marginBottom: '14px' }}>
            Authentic Indian Tiffin Plans
          </h1>

          <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0 auto 24px auto', color: '#4b5563', fontSize: '17px', lineHeight: 1.6 }}>
            Select the meal plan that fits your schedule. Freshly cooked with authentic homestyle Indian recipes, 
            pure whole spices, and daily delivery across Cambridge &amp; Greater Boston.
          </p>

          {/* Trust Highlights Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            fontSize: '13.5px',
            color: '#374151',
            fontWeight: 600
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Star size={15} fill="#ff6912" color="#ff6912" /> 4.9/5 Rating (500+ Reviews)
            </span>
            <span style={{ color: '#d1d5db' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={15} color="#ff6912" /> Daily Cambridge &amp; Boston Delivery
            </span>
            <span style={{ color: '#d1d5db' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={15} color="#16a34a" /> 100% Homestyle Fresh Taste
            </span>
          </div>
        </div>
      </div>

      {/* 1. How TiffinWales Works */}
      <HowItWorks />

      {/* 2. Primary Meal Plans Catalog: Displays All Plans */}
      <MealPlansSection hideHeader={false} showAll={true} />

      {/* 3. Comparison Table Section */}
      <section className="tw-section" style={{ background: 'linear-gradient(180deg, #fef4eb 0%, #fae6d3 100%)', borderTop: '1.5px solid #f0e1d2', borderBottom: '1.5px solid #f0e1d2', overflowX: 'hidden' }}>
        <div className="tw-container" style={{ width: '100%', maxWidth: '1000px', boxSizing: 'border-box' }}>
          <div className="section-header">
            <div className="section-tag" style={{ background: 'rgba(255, 255, 255, 0.8)', borderColor: '#fed7aa' }}>
              <span>PLAN COMPARISON</span>
            </div>
            <h2 className="section-title">Compare Tiffin Plans</h2>
            <p className="section-subtitle">Find the exact right frequency for your routine and lifestyle.</p>
          </div>

          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '8px' }}>
            <table style={{
              minWidth: '600px',
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0',
              borderRadius: '18px',
              border: '1.5px solid #fed7aa',
              background: '#ffffff',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(255, 100, 19, 0.08)'
            }}>
              <thead>
                <tr style={{ background: '#1c1c1c', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '16px 18px', fontSize: '0.86rem', fontWeight: 800 }}>Plan Feature</th>
                  <th style={{ padding: '16px 18px', fontSize: '0.86rem', fontWeight: 800 }}>Daily Tiffin (1 Day)</th>
                  <th style={{ padding: '16px 18px', fontSize: '0.86rem', fontWeight: 800 }}>4 Days Pack</th>
                  <th style={{ padding: '16px 18px', fontSize: '0.86rem', fontWeight: 800, background: '#ff6912', color: '#ffffff' }}>⭐ 5 Days Plan</th>
                  <th style={{ padding: '16px 18px', fontSize: '0.86rem', fontWeight: 800 }}>7 Days Full Week</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f2e2d5' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.86rem', color: '#111827' }}>Total Price</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#4b5563' }}>$14.99</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#4b5563' }}>$59.96</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#ff6912', fontSize: '0.86rem' }}>$74.95</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, fontSize: '0.86rem', color: '#111827' }}>$104.93</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f2e2d5', background: '#fafafa' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.86rem', color: '#111827' }}>Effective Cost / Meal</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#4b5563' }}>$14.99</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#4b5563' }}>$14.99 / meal</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#ff6912', fontSize: '0.86rem' }}>$14.99 / meal</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, fontSize: '0.86rem', color: '#111827' }}>$14.99 / meal</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f2e2d5' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.86rem', color: '#111827' }}>Delivery Fee</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#4b5563' }}>Standard / Pickup</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#4b5563' }}>Bulk Rate</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#ff6912', fontSize: '0.86rem' }}>1 Delivery Fee Only</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, fontSize: '0.86rem', color: '#111827' }}>Bulk Rate</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f2e2d5', background: '#fafafa' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.86rem', color: '#111827' }}>Bread Options</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#4b5563' }}>Naan or 2 Rotis</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#4b5563' }}>Naan or 2 Rotis</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#4b5563' }}>Naan or 2 Rotis</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#4b5563' }}>Naan or 2 Rotis</td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.86rem', color: '#111827' }}>Remaining Days Tracker</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#9ca3af' }}>Daily Order</td>
                  <td style={{ padding: '14px 18px', color: '#16a34a', fontWeight: 800, fontSize: '0.86rem' }}>✓ Live on Account</td>
                  <td style={{ padding: '14px 18px', color: '#16a34a', fontWeight: 800, fontSize: '0.86rem' }}>✓ Live on Account</td>
                  <td style={{ padding: '14px 18px', color: '#16a34a', fontWeight: 800, fontSize: '0.86rem' }}>✓ Live on Account</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Perfect Add-Ons for Every Meal */}
      <ExtraDelightsSection />

      {/* 5. Explore Our Daily Menus (Weekly Rotation) */}
      <WeeklyMenuSection />

      {/* 6. Why TiffinWales ?? */}
      <WhyChooseUs />

      {/* 7. Interactive Collapsible FAQs */}
      <TiffinFaqAccordion faqs={faqs} />

      {/* 8. Service Areas & Delivery Locations */}
      <ServiceAreasSection />
    </div>
  );
}
