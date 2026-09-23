'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, Truck, Store, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { calculateDeliveryFee } from '@/lib/delivery';
import styles from './checkout.module.css';

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
    <div className={styles.checkoutPageWrapper}>
      <div className="tw-container">
        <h1 className={styles.checkoutHeading}>Complete Your Checkout</h1>

        <form onSubmit={handleSubmit} className={styles.checkoutFormGrid}>
          {/* Left Column: Form Details */}
          <div className={styles.formLeftCol}>
            {/* 1. Contact & Personal Info */}
            <div className={styles.formSectionCard}>
              <h2 className={styles.sectionHeading}>1. Contact Information</h2>
              
              <div className={styles.formRow2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={styles.textInput}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={styles.textInput}
                  />
                </div>
              </div>

              <div className={styles.formRow2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.textInput}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.textInput}
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Details */}
            <div className={styles.formSectionCard}>
              <h2 className={styles.sectionHeading}>2. Delivery Preference</h2>

              <div className={styles.deliveryModeGrid}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryMode: 'delivery' })}
                  className={`${styles.modeBtn} ${formData.deliveryMode === 'delivery' ? styles.modeBtnActive : ''}`}
                >
                  <Truck size={18} />
                  <span>Doorstep Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryMode: 'pickup' })}
                  className={`${styles.modeBtn} ${formData.deliveryMode === 'pickup' ? styles.modeBtnActive : ''}`}
                >
                  <Store size={18} />
                  <span>Store Pick-up (1001 Mass Ave)</span>
                </button>
              </div>

              {formData.deliveryMode === 'delivery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.formRow3}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Apt / Suite</label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        className={styles.textInput}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className={styles.textInput}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Zip Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={styles.textInput}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '16px' }} className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Delivery Instructions &amp; Dietary Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Gate code, drop-off spot, or allergy notes..."
                  className={styles.textArea}
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className={styles.formSectionCard}>
              <h2 className={styles.sectionHeading}>3. Payment Method</h2>

              <div className={styles.paymentCard}>
                <CreditCard size={22} style={{ color: 'var(--tw-orange)' }} />
                <div className={styles.paymentInfo}>
                  <strong className={styles.paymentTitle}>Credit / Debit Card (Stripe SSL)</strong>
                  <span className={styles.paymentSubtitle}>Visa, Mastercard, Amex, Apple Pay &amp; Google Pay</span>
                </div>
                <div className={styles.sslBadge}>
                  <ShieldCheck size={14} />
                  <span>256-Bit Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className={styles.summaryCol}>
            <div className={styles.orderSummaryCard}>
              <h2 className={styles.summaryHeader}>
                Order Summary
              </h2>

              <div className={styles.cartItemsList}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItemSummaryRow}>
                    <div>
                      <strong style={{ display: 'block', color: '#111827' }}>{item.quantity}x {item.name}</strong>
                      {item.customization?.planDuration && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--tw-orange)', fontWeight: 700 }}>
                          {item.customization.planDuration} Days Subscription
                        </span>
                      )}
                    </div>
                    <span style={{ fontWeight: 800, color: '#111827' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.calculationRows}>
                <div className={styles.calcRow}>
                  <span>Subtotal</span>
                  <strong style={{ color: '#111827' }}>${cartTotal.toFixed(2)}</strong>
                </div>

                <div className={styles.calcRow}>
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
                    <strong style={{ color: '#111827' }}>${deliveryFee.toFixed(2)}</strong>
                  )}
                </div>

                <div className={styles.calcRow}>
                  <span>Estimated Tax (6.25%)</span>
                  <strong style={{ color: '#111827' }}>${estimatedTax.toFixed(2)}</strong>
                </div>

                <div className={styles.calcTotalRow}>
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary ${styles.submitBtnFull}`}
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

              <div className={styles.guaranteeBox}>
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
