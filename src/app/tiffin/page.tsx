import React from 'react';
import { MealPlansSection } from '@/components/MealPlansSection';
import { TiffinFaqAccordion } from '@/components/TiffinFaqAccordion';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Indian Tiffin Meal Plans | 5 Days & Monthly Subscriptions | Tiffin Wales Boston & Cambridge',
  description: 'Select your preferred Indian meal plan in Cambridge & Boston. 2, 3, 4, 5-day meal packs or 15 and 30-day monthly subscriptions with soft rotis, fragrant rice, rich dals, and authentic curries.',
};

export default function TiffinPage() {
  const faqs = [
    {
      q: 'How does the 5-Day Meal Plan work?',
      a: 'Our 5-Day plan is our most popular flagship option. You receive a hot, freshly cooked meal box every day from Monday to Friday with zero cooking chores. You only pay one single delivery fee or enjoy free store pickup.'
    },
    {
      q: 'Can I track my remaining subscription days?',
      a: 'Yes! Your remaining days are shown right on the top notification bar across every page, as well as on your dedicated Account page (/account), where you can also skip dates or pause your schedule.'
    },
    {
      q: 'Can I switch between Vegetarian and Non-Vegetarian?',
      a: 'Absolutely. We offer pure Vegetarian, Non-Vegetarian, and combo packages. You can also pick your spice level (Mild, Medium, or Hot) and bread preference (Naan or 2 Rotis).'
    },
    {
      q: 'What time are tiffin meals delivered?',
      a: 'Lunch deliveries arrive between 11:45 AM and 1:15 PM, and dinner deliveries arrive between 5:30 PM and 7:30 PM, packed in thermal insulated food-safe containers ready to enjoy.'
    },
    {
      q: 'Can I pause my subscription if I travel?',
      a: 'Yes! Simply click "Pause Subscription" or "Skip Next Meal" in your account dashboard or message our kitchen team on WhatsApp. Your unused meal days are safely stored for whenever you return.'
    }
  ];

  return (
    <div style={{ background: '#fffaf5' }}>
      {/* Rich Saffron-Cream Header Banner */}
      <div style={{
        background: 'radial-gradient(circle at 50% 0%, rgba(255, 100, 19, 0.12) 0%, transparent 60%), linear-gradient(145deg, #fff4e8 0%, #ffebd9 50%, #fff8f2 100%)',
        padding: '50px 0 40px 0',
        borderBottom: '1.5px solid #f0e1d2',
        textAlign: 'center',
        marginBottom: '10px'
      }}>
        <div className="tw-container">
          <div className="section-tag" style={{ background: '#fff0e6', borderColor: '#fed7aa' }}>
            <Sparkles size={13} />
            <span>Boston &amp; Cambridge Meal Subscriptions</span>
          </div>
          <h1 className="section-title">Authentic Indian Tiffin Plans</h1>
          <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Select the meal plan that fits your schedule. Freshly cooked with mom&apos;s kitchen recipes, 
            authentic whole spices, and daily delivery across Cambridge &amp; Greater Boston.
          </p>
        </div>
      </div>

      {/* Primary Plans Section: Displays ALL meal plans directly without Read More/Load More */}
      <MealPlansSection hideHeader={true} hideSubDetails={true} showAll={true} />

      {/* Comparison Table Section */}
      <section className="tw-section" style={{ background: 'linear-gradient(180deg, #fef4eb 0%, #fae6d3 100%)', borderTop: '1.5px solid #f0e1d2', borderBottom: '1.5px solid #f0e1d2' }}>
        <div className="tw-container">
          <div className="section-header">
            <h2 className="section-title">Compare Tiffin Plans</h2>
            <p className="section-subtitle">Find the exact right frequency for your routine.</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid #fed7aa',
              background: '#ffffff',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(255, 100, 19, 0.08)'
            }}>
              <thead>
                <tr style={{ background: '#151515', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '16px 20px', fontSize: '0.88rem', fontWeight: 800 }}>Plan Feature</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.88rem', fontWeight: 800 }}>Daily Tiffin (1 Day)</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.88rem', fontWeight: 800 }}>4 Days Pack</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.88rem', fontWeight: 800, background: 'var(--tw-orange)' }}>⭐ 5 Days Plan (Flagship)</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.88rem', fontWeight: 800 }}>7 Days Full Week</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f2e2d5' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>Total Price</td>
                  <td style={{ padding: '14px 20px' }}>$14.99</td>
                  <td style={{ padding: '14px 20px' }}>$59.96</td>
                  <td style={{ padding: '14px 20px', fontWeight: 800, color: 'var(--tw-orange)' }}>$74.95</td>
                  <td style={{ padding: '14px 20px', fontWeight: 800 }}>$104.93</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f2e2d5' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>Effective Cost / Meal</td>
                  <td style={{ padding: '14px 20px' }}>$14.99</td>
                  <td style={{ padding: '14px 20px' }}>$14.99 / meal</td>
                  <td style={{ padding: '14px 20px', fontWeight: 800, color: 'var(--tw-orange)' }}>$14.99 / meal</td>
                  <td style={{ padding: '14px 20px', fontWeight: 800 }}>$14.99 / meal</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f2e2d5' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>Delivery Fee Advantage</td>
                  <td style={{ padding: '14px 20px' }}>Standard</td>
                  <td style={{ padding: '14px 20px' }}>Bulk Rate</td>
                  <td style={{ padding: '14px 20px', fontWeight: 800, color: 'var(--tw-orange)' }}>1 Delivery Fee Only</td>
                  <td style={{ padding: '14px 20px', fontWeight: 800 }}>Bulk Rate</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f2e2d5' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>Bread Options</td>
                  <td style={{ padding: '14px 20px' }}>Naan or 2 Rotis</td>
                  <td style={{ padding: '14px 20px' }}>Naan or 2 Rotis</td>
                  <td style={{ padding: '14px 20px' }}>Naan or 2 Rotis</td>
                  <td style={{ padding: '14px 20px' }}>Naan or 2 Rotis</td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>Remaining Days Tracker</td>
                  <td style={{ padding: '14px 20px' }}>Daily Order</td>
                  <td style={{ padding: '14px 20px', color: 'var(--tw-veg)', fontWeight: 800 }}>✓ Live on Top &amp; Account</td>
                  <td style={{ padding: '14px 20px', color: 'var(--tw-veg)', fontWeight: 800 }}>✓ Live on Top &amp; Account</td>
                  <td style={{ padding: '14px 20px', color: 'var(--tw-veg)', fontWeight: 800 }}>✓ Live on Top &amp; Account</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive Collapsible FAQs */}
      <TiffinFaqAccordion faqs={faqs} />
    </div>
  );
}
