'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, UserSubscription, CartCustomization, UserOrder } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number; customization?: CartCustomization }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // Subscription state
  subscription: UserSubscription | null;
  setSubscription: (sub: UserSubscription | null) => void;
  consumeDay: () => void;
  skipNextMeal: () => void;
  togglePauseSubscription: () => void;
  activateDemoPlan: (days: number, planName: string, dietType?: 'veg' | 'non-veg' | 'mix') => void;
  updateDietPreference: (dietType: 'veg' | 'non-veg' | 'mix') => void;
  // Order history
  orders: UserOrder[];
  addOrder: (order: UserOrder) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_DEMO_SUB: UserSubscription = {
  id: 'sub_demo_5day',
  planId: '5-days-meal',
  planName: '5 Days Meal Plan',
  dietType: 'mix',
  dietLabel: 'Veg & Non-Veg Mix',
  totalDays: 5,
  remainingDays: 3,
  startDate: 'Sep 22, 2026',
  nextDeliveryDate: 'Tomorrow, 12:30 PM (Lunch Delivery)',
  deliveryType: 'delivery',
  status: 'active',
  address: '1001 Massachusetts Ave, Cambridge, MA 02138',
  spiceLevel: 'Medium Spice',
  breadType: '2 Whole Wheat Rotis'
};

const DEFAULT_ORDERS: UserOrder[] = [
  {
    id: 'ord_8952',
    orderNumber: '#TW-8952',
    date: 'Today, 11:30 AM',
    status: 'Out for Delivery',
    items: [
      {
        name: 'Veg Tiffin (Daily Fresh Thali)',
        image: 'https://tiffinwales.com/wp-content/uploads/2026/06/veg-1.webp',
        quantity: 1,
        price: 14.99,
        isMealPlan: false,
        isVeg: true,
        customizationSummary: 'Paneer Butter Masala + Dal Tadka • 2 Whole Wheat Rotis • Basmati Rice • Salad'
      },
      {
        name: 'Mango Lassi (Chilled Alphonso)',
        image: 'https://tiffinwales.com/wp-content/uploads/2026/06/veg-1.webp',
        quantity: 1,
        price: 4.99,
        isMealPlan: false,
        isVeg: true
      }
    ],
    subtotal: 19.98,
    deliveryFee: 3.99,
    tax: 1.25,
    total: 25.22,
    deliveryAddress: '1001 Massachusetts Ave, Cambridge, MA 02138',
    deliveryTiming: 'Estimated Delivery: Today by 12:45 PM',
    paymentMethod: 'Paid via Card (Stripe SSL)'
  },
  {
    id: 'ord_8942',
    orderNumber: '#TW-8942',
    date: 'Sep 22, 2026, 12:15 PM',
    status: 'Active',
    items: [
      {
        name: '7 Days Full Week Plan (Pure Veg)',
        image: 'https://tiffinwales.com/wp-content/uploads/2026/03/5-day-meal-1.webp',
        quantity: 1,
        price: 104.99,
        isMealPlan: true,
        isVeg: true,
        customizationSummary: '7 Consecutive Days • 2 Rotis • Medium Spice • 12:30 PM Lunch Slot (Active)'
      }
    ],
    subtotal: 104.99,
    deliveryFee: 0,
    tax: 6.56,
    total: 111.55,
    deliveryAddress: '1001 Massachusetts Ave, Cambridge, MA 02138',
    deliveryTiming: 'Daily 12:30 PM (Lunch Delivery)',
    paymentMethod: 'Paid via Card (Stripe SSL)'
  },
  {
    id: 'ord_8930',
    orderNumber: '#TW-8930',
    date: 'Sep 21, 2026, 7:00 PM',
    status: 'Preparing',
    items: [
      {
        name: 'Non-Veg Tiffin (Single Day Thali)',
        image: 'https://tiffinwales.com/wp-content/uploads/2026/06/Non-Veg-01.webp',
        quantity: 1,
        price: 14.99,
        isMealPlan: false,
        isVeg: false,
        customizationSummary: 'Butter Chicken Curry + Dal Makhani • 2 Fresh Rotis • Jeera Rice'
      },
      {
        name: 'Garlic Naan (Fresh Tandoor)',
        image: 'https://tiffinwales.com/wp-content/uploads/2026/06/veg-1.webp',
        quantity: 2,
        price: 3.99,
        isMealPlan: false,
        isVeg: true
      }
    ],
    subtotal: 22.97,
    deliveryFee: 3.99,
    tax: 1.44,
    total: 28.40,
    deliveryAddress: '1001 Massachusetts Ave, Cambridge, MA 02138',
    deliveryTiming: 'Scheduled for Tomorrow Dinner 7:00 PM',
    paymentMethod: 'Paid via Card (Stripe SSL)'
  },
  {
    id: 'ord_8876',
    orderNumber: '#TW-8876',
    date: 'Sep 19, 2026, 6:40 PM',
    status: 'Delivered',
    items: [
      {
        name: 'Veg Tiffin (Single Day Thali)',
        image: 'https://tiffinwales.com/wp-content/uploads/2026/06/veg-1.webp',
        quantity: 1,
        price: 14.99,
        isMealPlan: false,
        isVeg: true,
        customizationSummary: 'Paneer Butter Masala + Dal Tadka • 2 Whole Wheat Rotis • Basmati Rice'
      },
      {
        name: 'Gulab Jamun (2 pcs)',
        image: 'https://tiffinwales.com/wp-content/uploads/2026/06/veg-1.webp',
        quantity: 1,
        price: 4.50,
        isMealPlan: false,
        isVeg: true
      }
    ],
    subtotal: 19.49,
    deliveryFee: 3.99,
    tax: 1.22,
    total: 24.70,
    deliveryAddress: '1001 Massachusetts Ave, Cambridge, MA 02138',
    deliveryTiming: 'Delivered on Sep 19, 7:15 PM',
    paymentMethod: 'Paid via Card (Stripe SSL)'
  }
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>(DEFAULT_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tiffinwales_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        } else {
          setCart([]);
          localStorage.removeItem('tiffinwales_cart');
        }
      }

      const savedSub = localStorage.getItem('tiffinwales_subscription');
      if (savedSub) {
        setSubscription(JSON.parse(savedSub));
      } else {
        setSubscription(DEFAULT_DEMO_SUB);
        localStorage.setItem('tiffinwales_subscription', JSON.stringify(DEFAULT_DEMO_SUB));
      }

      const savedOrders = localStorage.getItem('tiffinwales_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(DEFAULT_ORDERS);
        localStorage.setItem('tiffinwales_orders', JSON.stringify(DEFAULT_ORDERS));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
      setCart([]);
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('tiffinwales_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (subscription) {
        localStorage.setItem('tiffinwales_subscription', JSON.stringify(subscription));
      } else {
        localStorage.removeItem('tiffinwales_subscription');
      }
    } catch (e) {}
  }, [subscription, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number; customization?: CartCustomization }) => {
    const qty = item.quantity || 1;
    // create unique ID based on item options
    const customKey = item.customization ? JSON.stringify(item.customization) : '';
    const id = `${item.productId}_${customKey}`;

    setCart(prev => {
      const list = Array.isArray(prev) ? prev : [];
      const existing = list.find(i => i.id === id);
      if (existing) {
        return list.map(i => i.id === id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...list, { ...item, id, quantity: qty }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => (Array.isArray(prev) ? prev.filter(item => item.id !== id) : []));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => (Array.isArray(prev) ? prev.map(item => item.id === id ? { ...item, quantity: qty } : item) : []));
  };

  const clearCart = () => {
    setCart([]);
  };

  const safeCart = Array.isArray(cart) ? cart : [];
  const cartCount = safeCart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartTotal = safeCart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

  const consumeDay = () => {
    if (!subscription) return;
    setSubscription(prev => {
      if (!prev || prev.remainingDays <= 0) return prev;
      return {
        ...prev,
        remainingDays: Math.max(0, prev.remainingDays - 1),
        status: prev.remainingDays - 1 === 0 ? 'completed' : prev.status
      };
    });
  };

  const skipNextMeal = () => {
    if (!subscription) return;
    alert('Next meal scheduled skipped! Your meal credits remain protected.');
  };

  const togglePauseSubscription = () => {
    if (!subscription) return;
    setSubscription(prev => {
      if (!prev) return prev;
      const nextStatus = prev.status === 'active' ? 'paused' : 'active';
      return { ...prev, status: nextStatus };
    });
  };

  const activateDemoPlan = (days: number, planName: string, dietType: 'veg' | 'non-veg' | 'mix' = 'mix') => {
    const dietLabels = {
      'veg': '100% Pure Vegetarian',
      'non-veg': 'Authentic Non-Vegetarian',
      'mix': 'Veg & Non-Veg Mix'
    };
    const newSub: UserSubscription = {
      id: `sub_${Date.now()}`,
      planId: `${days}-days-meal`,
      planName: planName,
      dietType: dietType,
      dietLabel: dietLabels[dietType],
      totalDays: days,
      remainingDays: days,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      nextDeliveryDate: 'Tomorrow, 12:30 PM (Lunch)',
      deliveryType: 'delivery',
      status: 'active',
      address: '1001 Massachusetts Ave, Cambridge, MA 02138',
      spiceLevel: 'Medium Spice',
      breadType: '2 Whole Wheat Rotis'
    };
    setSubscription(newSub);
  };

  const updateDietPreference = (dietType: 'veg' | 'non-veg' | 'mix') => {
    if (!subscription) return;
    const dietLabels = {
      'veg': '100% Pure Vegetarian',
      'non-veg': 'Authentic Non-Vegetarian',
      'mix': 'Veg & Non-Veg Mix'
    };
    setSubscription(prev => prev ? {
      ...prev,
      dietType,
      dietLabel: dietLabels[dietType]
    } : null);
  };

  const addOrder = (order: UserOrder) => {
    setOrders(prev => {
      const updated = [order, ...prev];
      try {
        localStorage.setItem('tiffinwales_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart: safeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        subscription,
        setSubscription,
        consumeDay,
        skipNextMeal,
        togglePauseSubscription,
        activateDemoPlan,
        updateDietPreference,
        orders,
        addOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
