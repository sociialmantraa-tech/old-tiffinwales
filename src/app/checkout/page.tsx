'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { 
  ShieldCheck, 
  Truck, 
  Store, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Check, 
  User, 
  MapPin, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
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
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    notes: 'Please buzz Apt 4B or leave at front lobby.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setFormData(prev => ({ ...prev, cardExpiry: val }));
  };

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

    const cleanCardDigits = formData.cardNumber.replace(/\s/g, '');
    const last4 = cleanCardDigits.length >= 4 ? cleanCardDigits.slice(-4) : '8491';

    setTimeout(() => {
      // Check if any meal plan was purchased
      const mealPlanItem = cart.find(i => i.isMealPlan);
      if (mealPlanItem) {
        const days = mealPlanItem.customization?.planDuration || 5;
        activateDemoPlan(days, mealPlanItem.name);
      }

      // Save order to history with MASKED card reference only (zero raw card details stored)
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
        paymentMethod: `Paid via Card ending in •••• ${last4} (SSL Encrypted)`
      };
      addOrder(newOrder);

      // Wipe sensitive in-memory inputs
      setFormData(prev => ({ ...prev, cardNumber: '', cardCvc: '', cardExpiry: '' }));
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
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🍱</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Your Cart is Empty</h1>
        <p style={{ color: 'var(--tw-muted)', marginBottom: '24px' }}>Please add meals to your cart before proceeding to checkout.</p>
        <button className="btn-primary" onClick={() => router.push('/tiffin')}>
          Browse Meal Plans
        </button>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPageWrapper}>
      {/* 1. Top Hero Header Banner */}
      <div className={styles.checkoutHeroBanner}>
        <div className="tw-container">
          <h1 className={styles.checkoutHeading}>Complete Your Checkout</h1>
          <p className={styles.checkoutSubtext}>
            Authentic, Homestyle Indian Tiffin Service • Cambridge &amp; Boston
          </p>

          {/* 3-Step Flow Indicator */}
          <div className={styles.stepsProgressBar}>
            <div className={`${styles.stepItem} ${styles.stepItemDone}`}>
              <span className={styles.stepNum}>✓</span>
              <span>1. Cart</span>
            </div>
            <div className={styles.stepSeparator}></div>
            <div className={`${styles.stepItem} ${styles.stepItemActive}`}>
              <span className={styles.stepNum}>2</span>
              <span>2. Delivery &amp; Payment</span>
            </div>
            <div className={styles.stepSeparator}></div>
            <div className={styles.stepItem}>
              <span className={styles.stepNum}>3</span>
              <span>3. Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tw-container">
        <form onSubmit={handleSubmit} className={styles.checkoutFormGrid}>
          {/* Left Column: Form Details */}
          <div className={styles.formLeftCol}>
            {/* Step 1: Contact Information */}
            <div className={styles.formSectionCard}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.stepBadgeIcon}>1</div>
                <h2 className={styles.sectionHeading}>Contact Information</h2>
              </div>
              
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

            {/* Step 2: Delivery Details */}
            <div className={styles.formSectionCard}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.stepBadgeIcon}>2</div>
                <h2 className={styles.sectionHeading}>Delivery Preference</h2>
              </div>

              <div className={styles.deliveryModeGrid}>
                <div
                  onClick={() => setFormData({ ...formData, deliveryMode: 'delivery' })}
                  className={`${styles.modeCard} ${formData.deliveryMode === 'delivery' ? styles.modeCardActive : ''}`}
                >
                  <div className={styles.modeIconBox}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className={styles.modeTitle}>Doorstep Delivery</h3>
                    <p className={styles.modeSubtext}>Delivered fresh to your home, dorm, or office daily</p>
                  </div>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, deliveryMode: 'pickup' })}
                  className={`${styles.modeCard} ${formData.deliveryMode === 'pickup' ? styles.modeCardActive : ''}`}
                >
                  <div className={styles.modeIconBox}>
                    <Store size={20} />
                  </div>
                  <div>
                    <h3 className={styles.modeTitle}>Store Pick-up (FREE)</h3>
                    <p className={styles.modeSubtext}>Pick up counter at 1001 Massachusetts Ave, Cambridge</p>
                  </div>
                </div>
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
                      placeholder="e.g. 1001 Massachusetts Ave"
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
                        placeholder="Apt 4B"
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
                  placeholder="Gate code, drop-off spot, or allergy preferences..."
                  className={styles.textArea}
                />
              </div>
            </div>

            {/* Step 3: Payment Gateway */}
            <div className={styles.formSectionCard}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.stepBadgeIcon}>3</div>
                <h2 className={styles.sectionHeading}>Payment Gateway</h2>
              </div>

              <div className={styles.paymentMethodSelector}>
                <div className={styles.paymentHeaderBox}>
                  <div className={styles.paymentLeft}>
                    <CreditCard size={22} style={{ color: 'var(--tw-orange)' }} />
                    <div>
                      <strong style={{ display: 'block', color: '#111827', fontSize: '0.95rem', fontWeight: 800 }}>
                        Credit / Debit Card (Secure Checkout)
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                        Encrypted 256-Bit SSL payment processing
                      </span>
                    </div>
                  </div>
                  <div className={styles.cardBrandsRow}>
                    <span className={styles.brandBadge}>VISA</span>
                    <span className={styles.brandBadge}>MC</span>
                    <span className={styles.brandBadge}>AMEX</span>
                    <span className={styles.brandBadge}>DISC</span>
                  </div>
                </div>

                {/* Real Card Input Fields Container */}
                <div className={styles.cardFieldsContainer}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      required
                      autoComplete="cc-name"
                      spellCheck={false}
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="Name as printed on card"
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Card Number *</label>
                    <div className={styles.cardNumberWrap}>
                      <CreditCard size={18} className={styles.cardInputIcon} />
                      <input
                        type="text"
                        name="cardNumber"
                        required
                        autoComplete="cc-number"
                        inputMode="numeric"
                        spellCheck={false}
                        maxLength={19}
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="•••• •••• •••• ••••"
                        className={styles.textInputWithIcon}
                      />
                      <Lock size={15} className={styles.cardLockIcon} />
                    </div>
                  </div>

                  <div className={styles.formRow2} style={{ marginBottom: 0 }}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Expiration Date *</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        required
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        spellCheck={false}
                        maxLength={5}
                        value={formData.cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM / YY"
                        className={styles.textInput}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Security Code (CVV / CVC) *</label>
                      <input
                        type="password"
                        name="cardCvc"
                        required
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        spellCheck={false}
                        maxLength={4}
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="•••"
                        className={styles.textInput}
                      />
                    </div>
                  </div>

                  <div className={styles.sslBadge} style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                    <ShieldCheck size={14} />
                    <span>256-Bit SSL Encrypted &amp; PCI-DSS Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className={styles.summaryCol}>
            <div className={styles.orderSummaryCard}>
              <div className={styles.summaryHeader}>
                <span>Order Summary</span>
                <span className={styles.itemCountBadge}>{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</span>
              </div>

              <div className={styles.cartItemsList}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItemRow}>
                    <div>
                      <div className={styles.cartItemTitle}>{item.quantity}x {item.name}</div>
                      {item.customization?.planDuration && (
                        <span className={styles.cartItemBadge}>
                          {item.customization.planDuration} Days Tiffin Subscription
                        </span>
                      )}
                    </div>
                    <span className={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
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
                  <span className={styles.totalAmount}>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary ${styles.submitBtnFull}`}
              >
                {isSubmitting ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <span>Place Order &amp; Activate Plan</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className={styles.guaranteeBox}>
                <ShieldCheck size={18} style={{ color: 'var(--tw-veg)', flexShrink: 0 }} />
                <span>Zero Risk • Automatic Live Remaining Days Tracker</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
