import React from 'react';
import { getProducts } from '@/lib/api';
import { MenuFilterSection } from '@/components/MenuFilterSection';
import { Sparkles, Utensils } from 'lucide-react';

export const metadata = {
  title: 'Order Extras & A La Carte Indian Dishes | Tiffin Wales Cambridge',
  description: 'Order authentic Butter Chicken, Dal Makhani, Shahi Paneer, Tandoori Naan, Rotis, Crispy Samosas, and Mango Lassi in Cambridge & Boston.',
};

export default async function MenuPage() {
  const products = await getProducts();

  return (
    <div style={{ background: '#fffaf5' }}>
      {/* Compact Rich Saffron-Cream Header Banner */}
      <div style={{
        background: 'radial-gradient(circle at 50% 0%, rgba(255, 100, 19, 0.12) 0%, transparent 60%), linear-gradient(145deg, #fff4e8 0%, #ffebd9 50%, #fff8f2 100%)',
        padding: '28px 0 20px 0',
        borderBottom: '1.5px solid #f0e1d2',
        textAlign: 'center',
      }}>
        <div className="tw-container">
          <div className="section-tag" style={{ background: '#fff0e6', borderColor: '#fed7aa', marginBottom: '8px', padding: '4px 14px' }}>
            <Sparkles size={13} />
            <span>Order Extras</span>
          </div>
          <h1 className="section-title" style={{ marginBottom: '8px' }}>Order Extras &amp; Add-Ons</h1>
          <p className="section-subtitle" style={{ maxWidth: '900px', margin: '0 auto', fontSize: '0.92rem' }}>
            Order individual single meals, fresh tandoori breads, rich curries, samosas, and chilled mango lassi anytime.
          </p>
        </div>
      </div>

      <React.Suspense fallback={<div className="tw-container" style={{ padding: '60px 0', textAlign: 'center' }}>Loading menu...</div>}>
        <MenuFilterSection initialProducts={products} hideHeader={true} />
      </React.Suspense>
    </div>
  );
}
