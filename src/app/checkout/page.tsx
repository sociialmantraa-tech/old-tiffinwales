'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, Truck, Store, CreditCard, Banknote, CheckCircle2, ArrowRight } from 'lucide-react';
import { calculateDeliveryFee } from '@/lib/delivery';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, activateDemoPlan, cartTotal, addOrder } = useCart();

  // Determine initial delivery mode from cart item customization if available
  const initialMode = cart.some(i => i.customization?.deliveryType === 'pickup') ? 'pickup' : 'delivery';

  const [formData, setFormData] = useState({
    firstName: 'Tiffin',
    lastName: 'Member',
    email: 'member@tiffinwales.com',
    phone: '+1 (617) 555-0199',
    address: '1001 Massachusetts Ave',
    apartment: 'Apt 4B',
    city: 'Cambridge',
    state: 'MA',
    zipCode: '02138',
    deliveryMode: initialMode as 'delivery' | 'pickup',
    paymentMethod: 'card',
    notes: 'Please buzz Apt 4B or leave at front lobby.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // If delivery is selected, force paymentMethod to card
  useEffect(() => {
    if (formData.deliveryMode === 'delivery' && formData.paymentMethod !== 'card') {
      setFormData(prev => ({ ...prev, paymentMethod: 'card' }));
    }
  }, [formData.deliveryMode, formData.paymentMethod]);

  const deliveryInfo = calculateDeliveryFee(cart, formData.deliveryMode);
  const deliveryFee = deliveryInfo.deliveryFee;
  const estimatedTax = cartTotal * 0.0625;
  const grandTotal = cartTotal + deliveryFee + estimatedTax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Check if any meal plan was purchased
      const mealPlanItem = cart.find(i => i.isMealPlan);
      if (mealPlanItem) {
        const days = mealPlanItem.customization?.planDuration || 5;
        activateDemoPlan(days, mealPlanItem.name);
      }

      // Save order to history
      const newOrder = {
        id: `ord_${Date.now()}`,
        orderNumber: `#TW-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Active' as const,
        items: cart.map(item => ({
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          isMealPlan: item.isMealPlan,
          customizationSummary: item.customization ? 
            [
              item.customization.breadType && (item.customization.breadType === '2roti' ? '2 Whole Wheat Rotis' : 'Naan'),
              item.customization.spiceLevel && `${item.customization.spiceLevel.charAt(0).toUpperCase() + item.customization.spiceLevel.slice(1)} Spice`
            ].filter(Boolean).join(' • ') : undefined
        })),
        subtotal: cartTotal,
        deliveryFee: deliveryFee,
        tax: estimatedTax,
        total: grandTotal,
        deliveryAddress: `${formData.address}${formData.apartment ? ` ${formData.apartment}` : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        deliveryTiming: formData.deliveryMode === 'pickup' ? 'Free In-Store Pickup (1001 Mass Ave)' : 'Scheduled Daily Delivery',
        paymentMethod: 'Paid via Card (Stripe SSL)'
      };
      addOrder(newOrder);

      clearCart();
      setIsSubmitting(false);
      setOrderSuccess(true);

      // Redirect to account dashboard
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    }, 1200);
  };

  if (orderSuccess) {
    return (
      <div className="tw-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--tw-veg)', marginBottom: '16px' }}>
          <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '12px' }}>
          Order Confirmed &amp; Subscription Active!
        </h1>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto 24px auto' }}>
          Thank you for choosing Tiffin Wales. Your meal plan has been registered and your 
          <strong> remaining days are now tracked live</strong> on your account dashboard!
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--tw-muted)' }}>Redirecting to your account dashboard...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="tw-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Your Cart is Empty</h1>
        <p style={{ color: 'var(--tw-muted)', marginBottom: '20px' }}>Please add meals to your cart before proceeding to checkout.</p>
        <button className="btn-primary" onClick={() => router.push('/tiffin')}>
          Browse Meal Plans
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px 0', background: 'var(--tw-cream)', minHeight: '85vh' }}>
      <div className="tw-container">
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '30px' }}>Complete Your Checkout</h1>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '30px' }}>
          {/* Left Column: Form Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Contact & Personal Info */}
            <div style={{ background: '#ffffff', border: '1.5px solid var(--tw-border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '18px' }}>1. Contact Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{ width: '100%', height: '46px', padding: '0 14px', border: '1px solid var(--tw-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{ width: '100%', height: '46px', padding: '0 14px', border: '1px solid var(--tw-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', height: '46px', padding: '0 14px', border: '1px solid var(--tw-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ width: '100%', height: '46px', padding: '0 14px', border: '1px solid var(--tw-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div style={{ background: '#ffffff', border: '1.5px solid var(--tw-border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '18px' }}>2. Delivery Preference</h2>

              <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryMode: 'delivery' })}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.deliveryMode === 'delivery' ? '2px solid var(--tw-orange)' : '1.5px solid var(--tw-border)',
                    background: formData.deliveryMode === 'delivery' ? 'var(--tw-orange-light)' : '#ffffff',
                    color: formData.deliveryMode === 'delivery' ? 'var(--tw-orange-dark)' : 'var(--tw-dark)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Truck size={18} />
                  <span>Doorstep Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryMode: 'pickup' })}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.deliveryMode === 'pickup' ? '2px solid var(--tw-orange)' : '1.5px solid var(--tw-border)',
                    background: formData.deliveryMode === 'pickup' ? 'var(--tw-orange-light)' : '#ffffff',
                    color: formData.deliveryMode === 'pickup' ? 'var(--tw-orange-dark)' : 'var(--tw-dark)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Store size={18} />
                  <span>Store Pick-up (1001 Mass Ave)</span>
                </button>
              </div>

              {formData.deliveryMode === 'delivery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      style={{ width: '100%', height: '46px', padding: '0 14px', border: '1px solid var(--tw-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Apt / Suite</label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        style={{ width: '100%', height: '46px', padding: '0 14px', border: '1px solid var(--tw-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        style={{ width: '100%', height: '46px', padding: '0 14px', border: '1px solid var(--tw-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Zip Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleChange}
                        style={{ width: '100%', height: '46px', padding: '0 14px', border: '1px solid var(--tw-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Delivery Instructions &amp; Dietary Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Gate code, drop-off spot, or allergy notes..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--tw-border)', borderRadius: 'var(--radius-sm)', outline: 'none', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background: '#ffffff', border: '1.5px solid var(--tw-border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '18px' }}>3. Payment Method</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '18px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--tw-orange)',
                    background: 'var(--tw-orange-light)',
                  }}
                >
                  <CreditCard size={22} style={{ color: 'var(--tw-orange)' }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', color: '#111827', fontSize: '0.95rem' }}>Credit / Debit Card (Stripe Checkout)</strong>
                    <span style={{ fontSize: '0.8rem', color: '#4b5563' }}>Visa, Mastercard, Amex, Apple Pay &amp; Google Pay</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#16a34a', fontWeight: 700, background: '#f0fdf4', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid #bbf7d0' }}>
                    <ShieldCheck size={14} />
                    <span>256-Bit Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div>
            <div style={{ background: '#ffffff', border: '1.5px solid var(--tw-border)', borderRadius: 'var(--radius-lg)', padding: '28px', position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--tw-border-light)', paddingBottom: '14px' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                    <div>
                      <strong style={{ display: 'block' }}>{item.quantity}x {item.name}</strong>
                      {item.customization?.planDuration && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--tw-orange)', fontWeight: 700 }}>
                          {item.customization.planDuration} Days Subscription
                        </span>
                      )}
                    </div>
                    <span style={{ fontWeight: 800 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--tw-border-light)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                  <span>Subtotal</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Delivery Fee</span>
                    {formData.deliveryMode === 'delivery' && deliveryInfo.totalDeliveryDays > 0 && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--tw-orange)', fontWeight: 600 }}>
                        {deliveryInfo.totalDeliveryDays > 1 ? `${deliveryInfo.totalDeliveryDays} Deliveries × $8.00/day` : '1 Scheduled Delivery'}
                      </span>
                    )}
                  </div>
                  {formData.deliveryMode === 'pickup' ? (
                    <strong style={{ color: 'var(--tw-veg)' }}>FREE (Store Pickup)</strong>
                  ) : (
                    <strong style={{ color: 'var(--tw-dark)' }}>${deliveryFee.toFixed(2)}</strong>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                  <span>Estimated Tax (6.25%)</span>
                  <strong>${estimatedTax.toFixed(2)}</strong>
                </div>
                <div style={{ borderTop: '1.5px solid var(--tw-border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 900, color: 'var(--tw-dark)' }}>
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', height: '54px', fontSize: '1.05rem', marginBottom: '16px' }}
              >
                {isSubmitting ? (
                  <span>Activating Subscription...</span>
                ) : (
                  <>
                    <span>Place Order &amp; Activate Plan</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#6b7280', background: 'var(--tw-cream)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <ShieldCheck size={18} style={{ color: 'var(--tw-veg)', flexShrink: 0 }} />
                <span>Zero Risk • Automatic Remaining Days Tracking</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
