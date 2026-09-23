export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  regularPrice: number;
  formattedPrice: string;
  description: string;
  shortDescription: string;
  images: string[];
  primaryImage: string;
  categories: string[];
  isMealPlan: boolean;
  isVeg: boolean;
  attributes?: any[];
  variations?: any[];
}

export interface MealPlanTier {
  id: string;
  name: string;
  days: number;
  image: string;
  tagline: string;
  price: number;
  formattedPrice: string;
  savings: string;
  popular: boolean;
  badge: string;
  slug: string;
  description: string;
  inclusions: string[];
}

export interface CartCustomization {
  deliveryType?: 'pickup' | 'delivery';
  breadType?: 'naan' | '2roti';
  spiceLevel?: 'mild' | 'medium' | 'hot';
  selectedDishes?: string[];
  planDuration?: number; // e.g. 5, 7, 15, 30
  notes?: string;
}

export interface CartItem {
  id: string; // unique key combining product id & options
  productId: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  isMealPlan: boolean;
  customization?: CartCustomization;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  totalDays: number;
  remainingDays: number;
  startDate: string;
  nextDeliveryDate: string;
  deliveryType: 'pickup' | 'delivery';
  status: 'active' | 'paused' | 'completed';
  address: string;
  spiceLevel: string;
  breadType: string;
  dietType?: 'veg' | 'non-veg' | 'mix';
  dietLabel?: string;
  selectedDishes?: string[];
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Delivered' | 'Active' | 'Out for Delivery' | 'Preparing';
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
