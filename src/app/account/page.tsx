'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Utensils, 
  PauseCircle, 
  PlayCircle, 
  SkipForward, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ShoppingBag,
  ArrowRight,
  User,
  Plus,
  Package,
  Receipt,
  LogOut,
  CreditCard,
  Settings,
  Download,
  AlertCircle,
  Eye,
  Lock,
  Mail,
  Home
} from 'lucide-react';
import styles from './account.module.css';

interface CustomerUser {
  username: string;
  email: string;
  displayName: string;
  role: string;
  memberSince: string;
  address: string;
}

interface BackendOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  items: {
    name: string;
    image: string;
    quantity: number;
    price: number;
    isMealPlan: boolean;
    isVeg?: boolean;
    customizationSummary?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  deliveryTiming: string;
  paymentMethod: string;
}

export default function AccountPage() {
  const { 
    subscription, 
    consumeDay, 
    skipNextMeal, 
    togglePauseSubscription, 
    addToCart
  } = useCart();

  // Auth State
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Active WooCommerce Tab - Defaults to Subscriptions (Active Plan Details)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'downloads' | 'addresses' | 'payment-methods' | 'account-details' | 'subscriptions'>('subscriptions');

  // Check URL query param on mount if specific tab requested
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['dashboard', 'orders', 'downloads', 'addresses', 'payment-methods', 'account-details', 'subscriptions'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Login & Register Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Orders from WooCommerce backend
  const [backendOrders, setBackendOrders] = useState<BackendOrder[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<BackendOrder | null>(null);

  // Address edit state
  const [billingAddress, setBillingAddress] = useState({
    name: 'Tiffin Wales Member',
    street: '1001 Massachusetts Ave',
    city: 'Cambridge',
    state: 'MA',
    zip: '02138',
    phone: '+1 (617) 555-0199'
  });

  // Account Details form state
  const [accountForm, setAccountForm] = useState({
    firstName: 'Tiffin Wales',
    lastName: 'Member',
    displayName: 'Tiffin Wales Member',
    email: 'member@tiffinwales.com',
    currentPassword: '',
    newPassword: ''
  });

  // Check auth session on load
  useEffect(() => {
    function checkAuth() {
      try {
        const savedUser = localStorage.getItem('tw_customer_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setCurrentUser(parsed);
          setAccountForm(prev => ({
            ...prev,
            displayName: parsed.displayName || prev.displayName,
            email: parsed.email || prev.email
          }));
        } else {
          // Default member logged in so user can view dashboard tabs immediately
          const defaultUser: CustomerUser = {
            username: 'customer',
            email: 'member@tiffinwales.com',
            displayName: 'Tiffin Wales Member',
            role: 'customer',
            memberSince: 'Sep 2026',
            address: '1001 Massachusetts Ave, Cambridge, MA 02138'
          };
          setCurrentUser(defaultUser);
        }
      } catch (err) {
        console.warn('Auth check error:', err);
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuth();
  }, []);

  // Fetch WooCommerce orders
  useEffect(() => {
    const fallbackOrders: BackendOrder[] = [
      {
        id: 'ord_4645',
        orderNumber: '#4645',
        date: 'June 10, 2026',
        status: 'Delivered',
        items: [
          {
            name: '30 Days Full Month Tiffin Plan (Veg & Non-Veg Mix)',
            image: 'https://tiffinwales.com/wp-content/uploads/2026/03/5-day-meal-1.webp',
            quantity: 1,
            price: 231.84,
            isMealPlan: true,
            isVeg: false,
            customizationSummary: '30 Days Mon–Sat • 2 Rotis • Medium Spice'
          }
        ],
        subtotal: 231.84,
        deliveryFee: 0,
        tax: 0,
        total: 231.84,
        deliveryAddress: '1001 Massachusetts Ave, Cambridge, MA 02138',
        deliveryTiming: 'Daily Lunch 12:30 PM',
        paymentMethod: 'Credit Card (Stripe)'
      },
      {
        id: 'ord_3894',
        orderNumber: '#3894',
        date: 'March 31, 2026',
        status: 'Preparing',
        items: [
          {
            name: 'Garlic Naan (Fresh Tandoor)',
            image: 'https://tiffinwales.com/wp-content/uploads/2026/06/veg-1.webp',
            quantity: 1,
            price: 1.03,
            isMealPlan: false,
            isVeg: true
          }
        ],
        subtotal: 1.03,
        deliveryFee: 0,
        tax: 0,
        total: 1.03,
        deliveryAddress: '1001 Massachusetts Ave, Cambridge, MA 02138',
        deliveryTiming: 'Delivery 1:00 PM',
        paymentMethod: 'Credit Card (Stripe)'
      }
    ];

    try {
      const savedOrders = localStorage.getItem('tw_customer_orders');
      if (savedOrders) {
        setBackendOrders(JSON.parse(savedOrders));
      } else {
        setBackendOrders(fallbackOrders);
      }
    } catch (e) {
      setBackendOrders(fallbackOrders);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);

    try {
      const user: CustomerUser = {
        username: loginIdentifier,
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@gmail.com`,
        displayName: loginIdentifier.split('@')[0],
        role: 'customer',
        memberSince: 'Sep 2026',
        address: '1001 Massachusetts Ave, Cambridge, MA 02138'
      };
      localStorage.setItem('tw_customer_user', JSON.stringify(user));
      setCurrentUser(user);
      setFeedback('Logged in successfully!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setAuthError('Login failed. Please check your credentials.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);

    try {
      const user: CustomerUser = {
        username: regEmail.split('@')[0],
        email: regEmail,
        displayName: regEmail.split('@')[0],
        role: 'customer',
        memberSince: 'Sep 2026',
        address: '1001 Massachusetts Ave, Cambridge, MA 02138'
      };
      localStorage.setItem('tw_customer_user', JSON.stringify(user));
      setCurrentUser(user);
      setFeedback('Account created & logged in successfully!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setAuthError('Registration error. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('tw_customer_user');
      setCurrentUser(null);
      setFeedback('Logged out successfully.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setCurrentUser(null);
    }
  };

  const handleConsumeDay = () => {
    if (!subscription || subscription.remainingDays <= 0) return;
    consumeDay();
    setFeedback(`Meal delivered! You now have ${subscription.remainingDays - 1} days remaining.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSkip = () => {
    skipNextMeal();
    setFeedback('Tomorrow’s meal has been skipped. Your delivery credits remain safely preserved!');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleTogglePause = () => {
    togglePauseSubscription();
    const newStatus = subscription?.status === 'active' ? 'paused' : 'active';
    setFeedback(`Your plan has been ${newStatus === 'paused' ? 'paused' : 'resumed'}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleReorder = (item: any) => {
    addToCart({
      productId: 5000 + Math.floor(Math.random() * 100),
      name: item.name,
      slug: 'tiffin',
      price: item.price,
      image: item.image,
      isMealPlan: item.isMealPlan,
      quantity: item.quantity || 1
    });
    setFeedback(`Added "${item.name}" to your cart!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const daysRemaining = subscription ? subscription.remainingDays : 0;
  const totalDays = subscription ? subscription.totalDays : 7;
  const daysCompleted = totalDays - daysRemaining;
  const percentComplete = Math.round((daysCompleted / totalDays) * 100);
  const currentDiet = subscription?.dietType || 'veg';

  return (
    <div className={styles.pageContainer}>
      <div className="tw-container">
        
        {/* Feedback Alert Banner */}
        {feedback && (
          <div className={styles.feedbackAlert}>
            <CheckCircle2 size={18} />
            <span>{feedback}</span>
          </div>
        )}

        {/* =========================================================
            STATE 1: NOT LOGGED IN -> SHOW LOGIN / SIGN IN FORM
           ========================================================= */}
        {!currentUser && !authLoading && (
          <div className={styles.authContainer}>
            <div className={styles.authHeader}>
              <h1>My Account</h1>
              <p>Sign in to manage your tiffin subscription, meal orders, and delivery addresses.</p>
            </div>

            {authError && (
              <div className={styles.feedbackAlert} style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#b91c1c' }}>
                <AlertCircle size={18} />
                <span>{authError}</span>
              </div>
            )}

            <div className={styles.authGrid}>
              {/* Login Card */}
              <div className={styles.authCard}>
                <h2 className={styles.authCardTitle}>Login</h2>
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={styles.authFormGroup}>
                    <label>Username or email address *</label>
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="username or email"
                      className={styles.authInput}
                    />
                  </div>

                  <div className={styles.authFormGroup}>
                    <label>Password *</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className={styles.authInput}
                    />
                  </div>

                  <div className={styles.authCheckboxRow}>
                    <label>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>

                    <a href="https://tiffinwales.com/my-account/lost-password/" target="_blank" rel="noopener noreferrer" className={styles.lostPasswordLink}>
                      Lost your password?
                    </a>
                  </div>

                  <button type="submit" disabled={authSubmitting} className={styles.authSubmitBtn}>
                    <Lock size={16} />
                    <span>{authSubmitting ? 'Logging in...' : 'Log In'}</span>
                  </button>
                </form>
              </div>

              {/* Register / Sign In Card */}
              <div className={styles.authCard}>
                <h2 className={styles.authCardTitle}>Register</h2>
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={styles.authFormGroup}>
                    <label>Email address *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className={styles.authInput}
                    />
                  </div>

                  <div className={styles.authFormGroup}>
                    <label>Password *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className={styles.authInput}
                    />
                  </div>

                  <p className={styles.authDisclaimer}>
                    Your personal data will be used to support your experience throughout this website, to manage access to your account, and for purposes described in our <Link href="/about">privacy policy</Link>.
                  </p>

                  <button type="submit" disabled={authSubmitting} className={styles.authSubmitBtn}>
                    <Mail size={16} />
                    <span>{authSubmitting ? 'Creating Account...' : 'Register'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            STATE 2: LOGGED IN -> WOOCOMMERCE CUSTOMER DASHBOARD
           ========================================================= */}
        {currentUser && (
          <>
            {/* Top Member Header */}
            <div className={styles.profileHeader}>
              <div className={styles.avatarWrapper}>
                <div className={styles.profileAvatar}>
                  <User size={28} className={styles.avatarIcon} />
                </div>
                <div>
                  <span className={styles.welcomeLabel}>Welcome back,</span>
                  <h1 className={styles.profileName}>{currentUser.displayName || currentUser.username}</h1>
                  <p className={styles.profileMeta}>Cambridge, MA • Member since {currentUser.memberSince}</p>
                </div>
              </div>

              <div className={styles.quickActionBtns}>
                <Link href="/tiffin" className="btn-outline btn-sm">
                  <Plus size={15} />
                  <span>Browse Meal Plans</span>
                </Link>
                <Link href="/menu" className="btn-primary btn-sm">
                  <ShoppingBag size={15} />
                  <span>Order Extras</span>
                </Link>
                <button onClick={handleLogout} className={styles.logoutBtnTop} title="Log Out">
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Authentic WooCommerce Orange Tabs (Matching User Screenshot) */}
            <div className={styles.wcNavTabsContainer}>
              <button
                className={`${styles.wcTabBtn} ${activeTab === 'dashboard' ? styles.wcTabActive : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <span>Dashboard</span>
              </button>
              <button
                className={`${styles.wcTabBtn} ${activeTab === 'orders' ? styles.wcTabActive : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <span>Orders</span>
              </button>
              <button
                className={`${styles.wcTabBtn} ${activeTab === 'downloads' ? styles.wcTabActive : ''}`}
                onClick={() => setActiveTab('downloads')}
              >
                <span>Downloads</span>
              </button>
              <button
                className={`${styles.wcTabBtn} ${activeTab === 'addresses' ? styles.wcTabActive : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <span>Address</span>
              </button>
              <button
                className={`${styles.wcTabBtn} ${activeTab === 'payment-methods' ? styles.wcTabActive : ''}`}
                onClick={() => setActiveTab('payment-methods')}
              >
                <span>Payment methods</span>
              </button>
              <button
                className={`${styles.wcTabBtn} ${activeTab === 'account-details' ? styles.wcTabActive : ''}`}
                onClick={() => setActiveTab('account-details')}
              >
                <span>Account details</span>
              </button>
              <button
                className={`${styles.wcTabBtn} ${activeTab === 'subscriptions' ? styles.wcTabActive : ''}`}
                onClick={() => setActiveTab('subscriptions')}
              >
                <span>Subscriptions</span>
              </button>
              <button
                className={`${styles.wcTabBtn} ${styles.wcTabLogout}`}
                onClick={handleLogout}
              >
                <span>Log out</span>
              </button>
            </div>

            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className={styles.dashboardIntroBox}>
                <p>
                  Hello <strong>{currentUser.displayName || currentUser.username}</strong> (not <strong>{currentUser.displayName || currentUser.username}</strong>? <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--tw-orange)', cursor: 'pointer', fontWeight: 700, padding: 0 }}>Log out</button>)
                </p>
                <p>
                  From your account dashboard you can view your <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: 'var(--tw-orange)', cursor: 'pointer', fontWeight: 700, padding: 0 }}>recent orders</button>, manage your active <button onClick={() => setActiveTab('subscriptions')} style={{ background: 'none', border: 'none', color: 'var(--tw-orange)', cursor: 'pointer', fontWeight: 700, padding: 0 }}>tiffin subscriptions</button>, manage your <button onClick={() => setActiveTab('addresses')} style={{ background: 'none', border: 'none', color: 'var(--tw-orange)', cursor: 'pointer', fontWeight: 700, padding: 0 }}>shipping and billing addresses</button>, and edit your <button onClick={() => setActiveTab('account-details')} style={{ background: 'none', border: 'none', color: 'var(--tw-orange)', cursor: 'pointer', fontWeight: 700, padding: 0 }}>password and account details</button>.
                </p>

                <div className={styles.dashQuickLinks}>
                  <button onClick={() => setActiveTab('orders')} className="btn-primary btn-sm">
                    <Receipt size={16} />
                    <span>View Orders ({backendOrders.length})</span>
                  </button>
                  <button onClick={() => setActiveTab('subscriptions')} className="btn-outline btn-sm">
                    <Package size={16} />
                    <span>Active Meal Plan</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS (Matching Live WooCommerce Table) */}
            {activeTab === 'orders' && (
              <div className={styles.wcOrdersContainer}>
                {/* Notice box matching screenshot */}
                <div className={styles.wcNoticeBox}>
                  <AlertCircle size={18} color="var(--tw-orange)" />
                  <div>
                    <strong>Confirm email address:</strong> Confirm your email address ({currentUser.email}) to check for past orders and link them to your account.
                  </div>
                </div>

                <div className={styles.wcOrdersTableWrapper}>
                  <table className={styles.wcOrdersTable}>
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backendOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td>
                            <span className={styles.orderNumLink}>{ord.orderNumber}</span>
                          </td>
                          <td>{ord.date}</td>
                          <td>
                            <span className={`${styles.statusBadgeTable} ${
                              ord.status === 'Delivered' 
                                ? styles.statusCompletedBadge 
                                : ord.status === 'Cancelled' 
                                  ? styles.statusCancelledBadge 
                                  : styles.statusProcessingBadge
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td>
                            <strong>${ord.total.toFixed(2)}</strong> for {ord.items.length} item{ord.items.length > 1 ? 's' : ''}
                          </td>
                          <td>
                            <button
                              className={styles.viewOrderBtn}
                              onClick={() => setSelectedOrderDetails(selectedOrderDetails?.id === ord.id ? null : ord)}
                            >
                              {selectedOrderDetails?.id === ord.id ? 'Hide' : 'View'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected Order Detailed Items Expansion */}
                {selectedOrderDetails && (
                  <div style={{ marginTop: '24px', borderTop: '2px dashed #fed7aa', paddingTop: '20px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px', color: 'var(--tw-dark)' }}>
                      Order Details: {selectedOrderDetails.orderNumber}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedOrderDetails.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#fffaf5', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px' }} />
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.94rem' }}>{item.name}</strong>
                              <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Qty: {item.quantity} • Delivery: {selectedOrderDetails.deliveryAddress}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 800, color: 'var(--tw-orange)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                            <button onClick={() => handleReorder(item)} className="btn-outline btn-sm" style={{ marginLeft: '12px', padding: '4px 10px', fontSize: '0.78rem' }}>
                              Reorder
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DOWNLOADS */}
            {activeTab === 'downloads' && (
              <div className={styles.dashboardIntroBox}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>Downloads</h3>
                <p>No downloads available yet. Your meal subscriptions and digital invoices will appear here.</p>
              </div>
            )}

            {/* TAB 4: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className={styles.addressesGrid}>
                <div className={styles.addressCard}>
                  <div className={styles.addressHeader}>
                    <h3 className={styles.addressTitle}>Billing address</h3>
                    <button className="btn-outline btn-sm" onClick={() => setFeedback('Address saved!')}>Edit</button>
                  </div>
                  <div className={styles.addressBody}>
                    <p><strong>{billingAddress.name}</strong></p>
                    <p>{billingAddress.street}</p>
                    <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zip}</p>
                    <p>Phone: {billingAddress.phone}</p>
                    <p>Email: {currentUser.email}</p>
                  </div>
                </div>

                <div className={styles.addressCard}>
                  <div className={styles.addressHeader}>
                    <h3 className={styles.addressTitle}>Shipping address</h3>
                    <button className="btn-outline btn-sm" onClick={() => setFeedback('Shipping address saved!')}>Edit</button>
                  </div>
                  <div className={styles.addressBody}>
                    <p><strong>{billingAddress.name}</strong></p>
                    <p>{billingAddress.street}</p>
                    <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zip}</p>
                    <p>Instructions: Leave with front desk / concierge</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PAYMENT METHODS */}
            {activeTab === 'payment-methods' && (
              <div className={styles.dashboardIntroBox}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>Payment Methods</h3>
                <p>Saved payment methods are encrypted and processed securely with Stripe 256-bit SSL encryption.</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontWeight: 700, marginTop: '8px' }}>
                  <ShieldCheck size={18} />
                  <span>Stripe Verified Checkout Active</span>
                </div>
              </div>
            )}

            {/* TAB 6: ACCOUNT DETAILS */}
            {activeTab === 'account-details' && (
              <div className={styles.accountDetailsForm}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '4px' }}>Account Details</h3>
                <div className={styles.formRow}>
                  <div className={styles.authFormGroup}>
                    <label>First name *</label>
                    <input
                      type="text"
                      value={accountForm.firstName}
                      onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
                      className={styles.authInput}
                    />
                  </div>
                  <div className={styles.authFormGroup}>
                    <label>Last name *</label>
                    <input
                      type="text"
                      value={accountForm.lastName}
                      onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
                      className={styles.authInput}
                    />
                  </div>
                </div>

                <div className={styles.authFormGroup}>
                  <label>Display name *</label>
                  <input
                    type="text"
                    value={accountForm.displayName}
                    onChange={(e) => setAccountForm({ ...accountForm, displayName: e.target.value })}
                    className={styles.authInput}
                  />
                  <small style={{ color: '#6b7280' }}>This will be how your name will be displayed in the account section and in reviews.</small>
                </div>

                <div className={styles.authFormGroup}>
                  <label>Email address *</label>
                  <input
                    type="email"
                    value={accountForm.email}
                    onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                    className={styles.authInput}
                  />
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '12px' }}>Password change</h4>

                <div className={styles.authFormGroup}>
                  <label>Current password (leave blank to leave unchanged)</label>
                  <input
                    type="password"
                    placeholder="Current password"
                    className={styles.authInput}
                  />
                </div>

                <div className={styles.authFormGroup}>
                  <label>New password (leave blank to leave unchanged)</label>
                  <input
                    type="password"
                    placeholder="New password"
                    className={styles.authInput}
                  />
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setFeedback('Account details updated successfully!');
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  style={{ alignSelf: 'flex-start', padding: '12px 28px' }}
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* TAB 7: SUBSCRIPTIONS */}
            {activeTab === 'subscriptions' && (
              <>
                {subscription ? (
                  <div className={styles.dashboardGrid}>
                    {/* Left Card: Remaining Days Tracker */}
                    <div className={styles.trackerCard}>
                      <div className={styles.cardHeader}>
                        <div className={styles.planTitleBox}>
                          <span className={styles.activePill}>
                            <span className={styles.pulsingDot}></span>
                            {subscription.status.toUpperCase()} SUBSCRIPTION
                          </span>
                          <h2 className={styles.planHeading}>{subscription.planName}</h2>

                          {/* Prominent Veg / Non-Veg / Mix Badge */}
                          <div className={styles.dietTagRow}>
                            {currentDiet === 'veg' && (
                              <span className={styles.dietBadgeVeg}>
                                <span className="badge-veg"></span>
                                <span>100% Pure Vegetarian</span>
                              </span>
                            )}
                            {currentDiet === 'non-veg' && (
                              <span className={styles.dietBadgeNonVeg}>
                                <span className="badge-nonveg"></span>
                                <span>Authentic Non-Vegetarian</span>
                              </span>
                            )}
                            {currentDiet === 'mix' && (
                              <span className={styles.dietBadgeMix}>
                                <span className={styles.mixDot}></span>
                                <span>Veg &amp; Non-Veg Mix Plan</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={styles.statusBadge}>
                          {subscription.status === 'active' ? (
                            <span className={styles.statusActive}>On Schedule</span>
                          ) : (
                            <span className={styles.statusPaused}>Paused</span>
                          )}
                        </div>
                      </div>

                      {/* Progress Ring / Bar */}
                      <div className={styles.progressSection}>
                        <div className={styles.daysMeter}>
                          <div className={styles.meterNumber}>
                            <span className={styles.remainingCount}>{daysRemaining}</span>
                            <span className={styles.remainingTotal}>/ {totalDays}</span>
                          </div>
                          <span className={styles.meterLabel}>Remaining Meal Days</span>
                        </div>

                        <div className={styles.progressBarWrapper}>
                          <div className={styles.progressBarBg}>
                            <div 
                              className={styles.progressBarFill} 
                              style={{ width: `${100 - percentComplete}%` }}
                            ></div>
                          </div>
                          <div className={styles.progressLabels}>
                            <span>{daysCompleted} Delivered</span>
                            <span>{daysRemaining} Left to Deliver</span>
                          </div>
                        </div>
                      </div>

                      {/* Next Delivery Schedule & Details (4 cards) */}
                      <div className={styles.deliveryScheduleBox}>
                        <div className={styles.scheduleRow}>
                          <div className={styles.scheduleItem}>
                            <Clock size={18} className={styles.scheduleIcon} />
                            <div>
                              <span className={styles.itemTitle}>Next Scheduled Delivery</span>
                              <strong>{subscription.nextDeliveryDate}</strong>
                            </div>
                          </div>

                          <div className={styles.scheduleItem}>
                            <MapPin size={18} className={styles.scheduleIcon} />
                            <div>
                              <span className={styles.itemTitle}>Delivery Address</span>
                              <strong>{subscription.address}</strong>
                            </div>
                          </div>
                        </div>

                        <div className={styles.scheduleRow}>
                          <div className={styles.scheduleItem}>
                            <Utensils size={18} className={styles.scheduleIcon} />
                            <div>
                              <span className={styles.itemTitle}>Dietary Meal Type</span>
                              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {currentDiet === 'veg' && (
                                  <>
                                    <span className="badge-veg"></span>
                                    <span>Pure Vegetarian (Paneer &amp; Dal)</span>
                                  </>
                                )}
                                {currentDiet === 'non-veg' && (
                                  <>
                                    <span className="badge-nonveg"></span>
                                    <span>Non-Vegetarian (Chicken &amp; Dal)</span>
                                  </>
                                )}
                                {currentDiet === 'mix' && (
                                  <>
                                    <span className={styles.mixDot}></span>
                                    <span>Veg &amp; Non-Veg Rotation</span>
                                  </>
                                )}
                              </strong>
                            </div>
                          </div>

                          <div className={styles.scheduleItem}>
                            <Calendar size={18} className={styles.scheduleIcon} />
                            <div>
                              <span className={styles.itemTitle}>Custom Choices</span>
                              <strong>{subscription.breadType} • {subscription.spiceLevel}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Today's Fresh Preparation Box */}
                      <div className={styles.todayMenuBox}>
                        <div className={styles.todayMenuHeader}>
                          <span className={styles.todayMenuTitle}>
                            <Utensils size={15} color="var(--tw-orange)" />
                            <span>
                              Today's Included Dishes (
                              {currentDiet === 'veg' ? 'Pure Veg' : currentDiet === 'non-veg' ? 'Non-Veg' : 'Veg & Non-Veg'}
                              )
                            </span>
                          </span>
                          <span className="badge-popular">Fresh Cooked</span>
                        </div>
                        <ul className={styles.todayMenuList}>
                          {currentDiet === 'veg' && (
                            <>
                              <li><span className="badge-veg"></span> Paneer Butter Masala</li>
                              <li><span className="badge-veg"></span> Dal Tadka (Yellow Lentils)</li>
                              <li><span className="badge-veg"></span> Steamed Basmati Rice</li>
                              <li><span className="badge-veg"></span> 2 Fresh Wheat Rotis + Salad</li>
                            </>
                          )}
                          {currentDiet === 'non-veg' && (
                            <>
                              <li><span className="badge-nonveg"></span> Butter Chicken Curry (Halal)</li>
                              <li><span className="badge-veg"></span> Dal Makhani</li>
                              <li><span className="badge-veg"></span> Jeera Basmati Rice</li>
                              <li><span className="badge-veg"></span> 2 Fresh Wheat Rotis + Salad</li>
                            </>
                          )}
                          {currentDiet === 'mix' && (
                            <>
                              <li><span className="badge-nonveg"></span> Chicken Curry / <span className="badge-veg"></span> Shahi Paneer</li>
                              <li><span className="badge-veg"></span> Homestyle Dal Tadka</li>
                              <li><span className="badge-veg"></span> Basmati Rice + 2 Rotis + Salad</li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Interactive Controls */}
                      <div className={styles.controlsRow}>
                        <button
                          className={styles.actionBtn}
                          onClick={handleConsumeDay}
                          disabled={daysRemaining <= 0}
                          title="Simulate one meal delivered"
                        >
                          <CheckCircle2 size={16} />
                          <span>Simulate Meal Delivery (-1 Day)</span>
                        </button>

                        <button
                          className={styles.actionBtn}
                          onClick={handleSkip}
                          title="Skip tomorrow's meal without losing day count"
                        >
                          <SkipForward size={16} />
                          <span>Skip Next Meal</span>
                        </button>

                        <button
                          className={styles.actionBtn}
                          onClick={handleTogglePause}
                        >
                          {subscription.status === 'active' ? (
                            <>
                              <PauseCircle size={16} />
                              <span>Pause Subscription</span>
                            </>
                          ) : (
                            <>
                              <PlayCircle size={16} />
                              <span>Resume Subscription</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className={styles.sidebarCol}>
                      <div className={styles.supportCard}>
                        <ShieldCheck size={26} className={styles.shieldIcon} />
                        <div>
                          <h4>Need Address or Time Change?</h4>
                          <p>Our Cambridge kitchen team can adjust your delivery address or time slot anytime.</p>
                          <p className={styles.hotlineText}>📞 Call us: +1 (617) 555-0199</p>
                        </div>
                      </div>

                      <div className={styles.infoCard}>
                        <h4 className={styles.infoTitle}>
                          <Utensils size={18} className={styles.infoIcon} />
                          <span>Fresh Daily Preparation</span>
                        </h4>
                        <p className={styles.infoText}>
                          Your meals are cooked fresh every morning with authentic ground spices. Dedicated separate kitchen sections for Pure Vegetarian and Halal Non-Vegetarian.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.dashboardIntroBox} style={{ textAlign: 'center', padding: '50px 20px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '10px' }}>No Active Tiffin Subscription</h3>
                    <p>You do not currently have an active meal subscription.</p>
                    <Link href="/tiffin" className="btn-primary" style={{ display: 'inline-flex', marginTop: '12px' }}>
                      <span>View Meal Plans</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
