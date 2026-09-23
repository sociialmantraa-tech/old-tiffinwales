'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, CartCustomization } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
  Truck, 
  Store, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown,
  Calendar,
  Clock,
  Sparkles,
  Utensils,
  Leaf,
  Wheat,
  CookingPot,
  Soup,
  Flame
} from 'lucide-react';
import { CustomDatePicker, isTuesday, formatDateToStr } from '@/components/CustomDatePicker';
import styles from './product.module.css';

const LUNCH_TIME_SLOTS = [
  '11:30AM to 12PM',
  '12:00PM to 12:30PM',
  '12:00PM to 1:00PM',
  '12:30PM to 1:00PM',
  '1:00PM to 1:30PM',
  '1:00PM to 2:00PM',
  '1:30PM to 2:00PM',
  '2:00PM to 2:30PM',
  '2:30PM to 3:00PM',
];

const DINNER_TIME_SLOTS = [
  '6:00PM to 6:30PM',
  '6:30PM to 7:00PM',
  '7:00PM to 7:30PM',
  '7:30PM to 8:00PM',
  '8:00PM to 8:30PM',
  '8:30PM to 9:00PM',
];

interface CustomTimeDropdownProps {
  value: string;
  onChange: (val: string) => void;
}

const CustomTimeDropdown: React.FC<CustomTimeDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.timeDropdownContainer} ref={dropdownRef}>
      <button
        type="button"
        className={`${styles.timeDropdownTrigger} ${isOpen ? styles.timeDropdownTriggerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className={styles.timeDropdownValue}>
          <Clock size={15} className={styles.timeIcon} />
          <span>{value || 'Select Delivery Timing'}</span>
        </div>
        <ChevronDown size={16} className={`${styles.dropdownChevron} ${isOpen ? styles.dropdownChevronRotate : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.timeDropdownMenu}>
          <div className={styles.timeGroupHeader}>
            <span>☀️ Lunch Delivery Slots (11:30 AM – 3:00 PM)</span>
          </div>
          <div className={styles.timeOptionsList}>
            {LUNCH_TIME_SLOTS.map((slot) => {
              const isSelected = value === slot;
              return (
                <div
                  key={slot}
                  className={`${styles.timeOptionItem} ${isSelected ? styles.timeOptionItemActive : ''}`}
                  onClick={() => {
                    onChange(slot);
                    setIsOpen(false);
                  }}
                >
                  <span className={styles.timeOptionText}>{slot}</span>
                  {isSelected && <Check size={14} className={styles.timeCheckIcon} />}
                </div>
              );
            })}
          </div>

          <div className={styles.timeGroupHeader}>
            <span>🌙 Dinner Delivery Slots (6:00 PM – 9:00 PM)</span>
          </div>
          <div className={styles.timeOptionsList}>
            {DINNER_TIME_SLOTS.map((slot) => {
              const isSelected = value === slot;
              return (
                <div
                  key={slot}
                  className={`${styles.timeOptionItem} ${isSelected ? styles.timeOptionItemActive : ''}`}
                  onClick={() => {
                    onChange(slot);
                    setIsOpen(false);
                  }}
                >
                  <span className={styles.timeOptionText}>{slot}</span>
                  {isSelected && <Check size={14} className={styles.timeCheckIcon} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function getDaysForDishMultiSet(
  dish: string,
  dishesMap: Record<string, string>,
  totalDays: number,
  currentSet: number,
  quantity: number
): { matchedCurrentSet: number[]; matchedAllLabels: string[] } {
  const matchedCurrentSet: number[] = [];
  const matchedAllLabels: string[] = [];

  for (let s = 0; s < quantity; s++) {
    for (let d = 0; d < totalDays; d++) {
      if (dishesMap[`${s}-${d}`] === dish) {
        if (s === currentSet) {
          matchedCurrentSet.push(d + 1);
        }
        matchedAllLabels.push(quantity > 1 ? `P${s + 1}·D${d + 1}` : `Day ${d + 1}`);
      }
    }
  }
  return { matchedCurrentSet, matchedAllLabels };
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

const VEG_DISHES = [
  'Chana Masala',
  'Aloo Gobi',
  'Dal Tadka',
  'Aloo Methi',
  'Aloo Jeera',
  'Punjabi Kadhi Pakora',
  'Bhindi Masala',
  'Malai Kofta',
  'Dal Makhani',
  'Paneer Butter Masala',
  'Shahi Paneer',
  'Rajma Masala'
];

const NON_VEG_DISHES = [
  'Chicken Curry',
  'Chicken Tikka Masala',
  'Butter Chicken',
  'Goat Achari Curry',
  'Lamb Kadhai'
];

const SUBSCRIPTION_PLANS = [
  { id: '2-days-plan', label: '2-Day Plan', days: 2, price: 29.98, subtext: '2 Daily Scheduled Deliveries' },
  { id: '3-days-plan', label: '3-Day Plan', days: 3, price: 44.97, subtext: '3 Daily Scheduled Deliveries' },
  { id: '4-days-plan', label: '4-Day Plan', days: 4, price: 59.96, subtext: '4 Daily Scheduled Deliveries' },
  { id: '5-days-plan', label: '5-Day Plan', days: 5, price: 74.95, subtext: '5 Daily Scheduled Deliveries' },
  { id: '7-days-plan', label: '7-Day Plan', days: 7, price: 104.93, subtext: '7 Daily Scheduled Deliveries' },
];

const BREAD_OPTIONS = ['Fresh Roti', 'Naan', 'Tandoori Roti', 'Paratha'];

const SPICE_OPTIONS = [
  { id: 'Mild', label: 'Mild', icon: '🌶️' },
  { id: 'Medium', label: 'Medium', icon: '🌶️🌶️' },
  { id: 'Spicy', label: 'Spicy', icon: '🔥' },
  { id: 'Extra Spicy', label: 'Extra Spicy', icon: '🔥🔥' },
];

const DAILY_TIFFIN_PLANS = [
  { id: 'daily-delight', label: 'Daily Delight', days: 1, price: 14.99, subtext: '1 Daily Scheduled Delivery' },
  { id: '5-days-plan', label: "5 Day's Plan", days: 5, price: 74.95, subtext: '5 Daily Scheduled Deliveries' },
  { id: '7-days-plan', label: "7 Day's Plan", days: 7, price: 104.93, subtext: '7 Daily Scheduled Deliveries' },
  { id: '10-days-plans', label: "10 Day's Plans", days: 10, price: 149.90, subtext: '10 Daily Scheduled Deliveries' },
  { id: '15-days-plans', label: "15 Day's Plans", days: 15, price: 224.85, subtext: '15 Daily Scheduled Deliveries' },
  { id: '30-days-plan', label: "30 day's Plan", days: 30, price: 449.70, subtext: '30 Daily Scheduled Deliveries' },
];

const DEFAULT_CYCLE_DISHES = [
  'Punjabi Kadhi Pakora',
  'Aloo Jeera',
  'Dal Tadka',
  'Aloo Gobi',
  'Dal Makhani',
  'Chana Masala',
  'Shahi Paneer',
  'Paneer Butter Masala',
  'Malai Kofta',
  'Bhindi Masala',
  'Rajma Masala',
  'Aloo Methi',
  'Matar Paneer',
  'Kadai Paneer'
];

const DELIVERY_TIME_SLOTS = [
  '12:00PM to 1:00PM',
  '1:00PM to 2:00PM',
  '11:30AM to 12PM',
  '12:00PM to 12:30PM',
  '12:30PM to 1:00PM',
  '1:00PM to 1:30PM',
  '1:30PM to 2:00PM',
  '2:00PM to 2:30PM',
  '2:30PM to 3:00PM',
  '6:00PM to 6:30PM',
  '6:30PM to 7:00PM',
  '7:00PM to 7:30PM',
  '7:30PM to 8:00PM',
  '8:00PM to 8:30PM',
  '8:30PM to 9:00PM',
];

const PLAN_IMAGES: Record<string, string> = {
  '2-days-plan': 'https://tiffinwales.com/wp-content/uploads/2026/09/2-Days-meal.png',
  '3-days-plan': 'https://tiffinwales.com/wp-content/uploads/2026/07/3-day-meal-plan.webp',
  '4-days-plan': 'https://tiffinwales.com/wp-content/uploads/2026/09/4-Days-meal.png',
  '5-days-plan': 'https://tiffinwales.com/wp-content/uploads/2026/03/5-day-meal-1.webp',
  '7-days-plan': 'https://tiffinwales.com/wp-content/uploads/2026/07/7-day-meal-plan.webp',
};

const DIET_TIFFIN_IMAGES: Record<string, string> = {
  'Veg': 'https://tiffinwales.com/wp-content/uploads/2026/06/veg-1.webp',
  'Non-Veg': 'https://tiffinwales.com/wp-content/uploads/2026/06/Non-Veg-01.webp',
  'Veg & Non-Veg Mix': 'https://tiffinwales.com/wp-content/uploads/2026/06/Non-Veg-Mix.webp',
};

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const { addToCart, activateDemoPlan } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // STRICT SEPARATION:
  // 1. Subscription Meal Plans: 2, 3, 4, 5, 7 days meal packs or subscription slugs
  const isSubscriptionPlan = product.slug === '2-days-meal' ||
                             product.slug === '3-days-meal' ||
                             product.slug === '4-days-meal' ||
                             product.slug === '5-days-meal' ||
                             product.slug === '7-days-meal' ||
                             product.slug.includes('subscription') ||
                             product.slug.includes('meal-plan');

  // 2. Daily Tiffins: veg-tiffin, non-veg, veg-non-veg-tiffin, or other tiffin items that are not subscriptions
  const isDailyTiffin = !isSubscriptionPlan && (
    product.slug === 'veg-tiffin' ||
    product.slug === 'non-veg' ||
    product.slug === 'veg-non-veg-tiffin' ||
    (product.categories && product.categories.includes('Tiffin'))
  );

  // --- Subscription Model State ---
  const initialSubPlanId = product.slug === '2-days-meal' ? '2-days-plan' :
                           product.slug === '3-days-meal' ? '3-days-plan' :
                           product.slug === '4-days-meal' ? '4-days-plan' :
                           product.slug === '5-days-meal' ? '5-days-plan' :
                           product.slug === '7-days-meal' ? '7-days-plan' : '3-days-plan';

  const [selectedSubPlanId, setSelectedSubPlanId] = useState<string>(initialSubPlanId);
  const currentSubPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedSubPlanId) || SUBSCRIPTION_PLANS[2];
  const subPlanDays = currentSubPlan.days;
  const subUnitPrice = currentSubPlan.price;

  // --- Daily Tiffin State ---
  const [selectedTiffinPlanId, setSelectedTiffinPlanId] = useState<string>('daily-delight');
  const currentTiffinPlan = DAILY_TIFFIN_PLANS.find((p) => p.id === selectedTiffinPlanId) || DAILY_TIFFIN_PLANS[0];
  const tiffinPlanDays = currentTiffinPlan.days;
  const tiffinUnitPrice = currentTiffinPlan.price;

  const getNextValidDeliveryDate = (): string => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    if (isTuesday(d)) {
      d.setDate(d.getDate() + 1); // Tuesday is closed, default to Wednesday
    }
    return formatDateToStr(d);
  };

  const todayStr = formatDateToStr(new Date());
  const [deliveryMode, setDeliveryMode] = useState<'store-pick-up' | 'home-delivery'>('store-pick-up');
  const [mealType, setMealType] = useState<string>(
    product.slug.includes('non-veg-mix') || product.slug.includes('veg-non-veg') ? 'Veg & Non-Veg Mix' :
    product.slug.includes('non-veg') ? 'Non-Veg' : 'Veg'
  );

  const initialImage = isSubscriptionPlan
    ? (PLAN_IMAGES[initialSubPlanId] || product.primaryImage)
    : (DIET_TIFFIN_IMAGES[product.slug.includes('non-veg-mix') || product.slug.includes('veg-non-veg') ? 'Veg & Non-Veg Mix' : product.slug.includes('non-veg') ? 'Non-Veg' : 'Veg'] || product.primaryImage);

  const [selectedImage, setSelectedImage] = useState<string>(initialImage);
  const [breadType, setBreadType] = useState<string>('Fresh Roti');
  const [spiceLevel, setSpiceLevel] = useState<string>('Mild');
  const [deliveryDate, setDeliveryDate] = useState<string>(getNextValidDeliveryDate());
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>('12:00PM to 1:00PM');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Day-by-Day dish selection for Subscriptions (Multi-set aware) - starts empty
  const [activeSetIndex, setActiveSetIndex] = useState<number>(0);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [dayDishes, setDayDishes] = useState<Record<string, string>>({});

  // Day-by-Day dish selection for Daily Tiffins (Multi-set aware) - starts empty
  const [tiffinActiveSetIndex, setTiffinActiveSetIndex] = useState<number>(0);
  const [tiffinActiveDayIndex, setTiffinActiveDayIndex] = useState<number>(0);
  const [tiffinDayDishes, setTiffinDayDishes] = useState<Record<string, string>>({});
  const [dishValidationError, setDishValidationError] = useState<string | null>(null);

  // Ensure active set index stays valid if quantity is decreased
  const currentEffectiveActiveSet = Math.min(activeSetIndex, Math.max(0, quantity - 1));
  const currentEffectiveTiffinActiveSet = Math.min(tiffinActiveSetIndex, Math.max(0, quantity - 1));

  const availableDishes = mealType === 'Veg' ? VEG_DISHES : [...VEG_DISHES, ...NON_VEG_DISHES];

  const handleSelectDishForDay = (dish: string) => {
    setDishValidationError(null);
    setDayDishes((prev) => ({
      ...prev,
      [`${currentEffectiveActiveSet}-${activeDayIndex}`]: dish,
    }));

    // Auto-advance to next day
    if (activeDayIndex < subPlanDays - 1) {
      setActiveDayIndex(activeDayIndex + 1);
    } else if (quantity > 1 && currentEffectiveActiveSet < quantity - 1) {
      setActiveSetIndex(currentEffectiveActiveSet + 1);
      setActiveDayIndex(0);
    }
  };

  const handleSelectTiffinDishForDay = (dish: string) => {
    setDishValidationError(null);
    setTiffinDayDishes((prev) => ({
      ...prev,
      [`${currentEffectiveTiffinActiveSet}-${tiffinActiveDayIndex}`]: dish,
    }));

    // Auto-advance to next day
    if (tiffinActiveDayIndex < tiffinPlanDays - 1) {
      setTiffinActiveDayIndex(tiffinActiveDayIndex + 1);
    } else if (quantity > 1 && currentEffectiveTiffinActiveSet < quantity - 1) {
      setTiffinActiveSetIndex(currentEffectiveTiffinActiveSet + 1);
      setTiffinActiveDayIndex(0);
    }
  };

  const selectedSubDishesCount = Array.from({ length: quantity }).reduce((sum: number, _, sIdx) => {
    return sum + Array.from({ length: subPlanDays }).filter((_, dIdx) => !!dayDishes[`${sIdx}-${dIdx}`]).length;
  }, 0);
  const totalSubDishesExpected = subPlanDays * quantity;

  const selectedTiffinDishesCount = Array.from({ length: quantity }).reduce((sum: number, _, sIdx) => {
    return sum + Array.from({ length: tiffinPlanDays }).filter((_, dIdx) => !!tiffinDayDishes[`${sIdx}-${dIdx}`]).length;
  }, 0);
  const totalTiffinDishesExpected = tiffinPlanDays * quantity;

  const dietLabel = mealType === 'Veg' ? 'Vegetarian' : mealType === 'Non-Veg' ? 'Non-Vegetarian' : 'Veg & Non-Veg Mix';
  const dietPrefix = mealType === 'Veg' ? 'Vegetarian' : mealType === 'Non-Veg' ? 'Non-Vegetarian' : 'Veg & Non-Veg Mix';
  const subscriptionDynamicTitle = `${subPlanDays} Days ${dietPrefix} Tiffin Plan`;
  const tiffinDynamicTitle = `${dietPrefix} Tiffin – ${currentTiffinPlan.label}`;

  const effectivePrice = isSubscriptionPlan ? subUnitPrice : isDailyTiffin ? tiffinUnitPrice : product.price;

  const handleAddToCart = () => {
    setDishValidationError(null);

    if (isSubscriptionPlan) {
      if (selectedSubDishesCount < totalSubDishesExpected) {
        const remaining = totalSubDishesExpected - selectedSubDishesCount;
        setDishValidationError(`Please select dishes for all ${totalSubDishesExpected} day${totalSubDishesExpected > 1 ? 's' : ''} (${remaining} remaining).`);
        // Find and jump to first unselected day
        for (let s = 0; s < quantity; s++) {
          for (let d = 0; d < subPlanDays; d++) {
            if (!dayDishes[`${s}-${d}`]) {
              setActiveSetIndex(s);
              setActiveDayIndex(d);
              return;
            }
          }
        }
        return;
      }

      const dishSummary = Array.from({ length: quantity }).map((_, sIdx) => {
        const packDishes = Array.from({ length: subPlanDays }).map(
          (_, dIdx) => `Day ${dIdx + 1}: ${dayDishes[`${sIdx}-${dIdx}`]}`
        ).join(', ');
        return quantity > 1 ? `[Pack ${sIdx + 1}: ${packDishes}]` : `[${packDishes}]`;
      }).join(' | ');

      const customization: CartCustomization = {
        deliveryType: deliveryMode === 'home-delivery' ? 'delivery' : 'pickup',
        breadType: breadType === 'Fresh Roti' ? '2roti' : breadType === 'Naan' ? 'naan' : '2roti',
        spiceLevel: spiceLevel === 'Mild' ? 'mild' : spiceLevel === 'Extra Spicy' ? 'hot' : 'medium',
        planDuration: subPlanDays,
        notes: `Plan: ${currentSubPlan.label} | Mode: ${deliveryMode === 'store-pick-up' ? 'Store Pickup (Free)' : 'Doorstep Delivery (1-Time Charge)'} | Date: ${deliveryDate} | Time: ${deliveryTimeSlot} | Bread: ${breadType} | Spice: ${spiceLevel} | Dishes: ${dishSummary}${specialInstructions ? ` | Notes: ${specialInstructions}` : ''}`
      };

      addToCart({
        productId: product.id,
        name: `${subscriptionDynamicTitle}`,
        slug: product.slug,
        price: effectivePrice,
        image: selectedImage || product.primaryImage,
        quantity,
        isMealPlan: true,
        customization,
      });

      activateDemoPlan(subPlanDays, `${subscriptionDynamicTitle}`);
    } else if (isDailyTiffin) {
      if (selectedTiffinDishesCount < totalTiffinDishesExpected) {
        const remaining = totalTiffinDishesExpected - selectedTiffinDishesCount;
        setDishValidationError(`Please select dishes for all ${totalTiffinDishesExpected} day${totalTiffinDishesExpected > 1 ? 's' : ''} (${remaining} remaining).`);
        // Find and jump to first unselected day
        for (let s = 0; s < quantity; s++) {
          for (let d = 0; d < tiffinPlanDays; d++) {
            if (!tiffinDayDishes[`${s}-${d}`]) {
              setTiffinActiveSetIndex(s);
              setTiffinActiveDayIndex(d);
              return;
            }
          }
        }
        return;
      }

      const dishSummary = Array.from({ length: quantity }).map((_, sIdx) => {
        const packDishes = Array.from({ length: tiffinPlanDays }).map(
          (_, dIdx) => `Day ${dIdx + 1}: ${tiffinDayDishes[`${sIdx}-${dIdx}`]}`
        ).join(', ');
        return quantity > 1 ? `[Tiffin Pack ${sIdx + 1}: ${packDishes}]` : `[${packDishes}]`;
      }).join(' | ');

      const customization: CartCustomization = {
        deliveryType: deliveryMode === 'home-delivery' ? 'delivery' : 'pickup',
        breadType: breadType === 'Fresh Roti' ? '2roti' : breadType === 'Naan' ? 'naan' : '2roti',
        spiceLevel: spiceLevel === 'Mild' ? 'mild' : spiceLevel === 'Extra Spicy' ? 'hot' : 'medium',
        planDuration: tiffinPlanDays,
        notes: `Plan: ${currentTiffinPlan.label} | Mode: ${deliveryMode === 'store-pick-up' ? 'Store Pickup (Free)' : 'Doorstep Delivery (Charged Daily: $6–$12/day)'} | Date: ${deliveryDate} | Time: ${deliveryTimeSlot} | Bread: ${breadType} | Spice: ${spiceLevel} | Dishes: ${dishSummary}${specialInstructions ? ` | Note: ${specialInstructions}` : ''}`
      };

      addToCart({
        productId: product.id,
        name: `${tiffinDynamicTitle}`,
        slug: product.slug,
        price: effectivePrice,
        image: selectedImage || product.primaryImage,
        quantity,
        isMealPlan: true,
        customization,
      });

      if (tiffinPlanDays > 1) {
        activateDemoPlan(tiffinPlanDays, `${tiffinDynamicTitle}`);
      }
    } else {
      addToCart({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.primaryImage,
        quantity,
        isMealPlan: false,
        customization: { spiceLevel: spiceLevel === 'Mild' ? 'mild' : 'medium' },
      });
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const [activeTab, setActiveTab] = useState<'description' | 'additional' | 'reviews'>('description');

  const defaultDescription = isSubscriptionPlan
    ? `🥗 TiffinWales – ${subscriptionDynamicTitle}\n\nA wholesome, home-style meal subscription made fresh every day — perfect for students, professionals, and families.\n\nIncludes:\n🫓 Choice of Bread (Fresh Roti, Naan, Tandoori Roti, Paratha) – Freshly prepared.\n🍛 Seasonal Sabzi / Paneer / Curry – Cooked with authentic spices and farm-fresh ingredients.\n🥣 Comforting Dal or Curry – Light, flavorful, and protein-rich.\n🍚 Fragrant Steamed Basmati Rice – Fluffy for a complete balanced meal.`
    : `🥗 TiffinWales – ${tiffinDynamicTitle}\n\nA wholesome, home-style meal made fresh every day — perfect for work, home, or on the go.\n\nIncludes:\n🫓 Soft Roti or Naan – Freshly made and perfectly puffed.\n🍛 Seasonal Sabzi – Cooked with authentic spices and farm-fresh vegetables.\n🥣 Dal or Curry – Light, flavorful, and protein-rich.\n🍚 Steamed Rice – Fragrant and fluffy for a complete meal.`;

  const displayDescription = product.description || defaultDescription;

  return (
    <div className={styles.productPage}>
      <div className="tw-container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href="/tiffin">
            {isSubscriptionPlan ? 'Meal Plans' : isDailyTiffin ? 'Tiffin Plans' : 'Menu'}
          </Link>
          <ChevronRight size={14} />
          <span>{cleanText(product.name)}</span>
        </nav>

        {/* Product Card Grid */}
        <div className={styles.productGrid}>
          {/* Left Column: Image & Badges */}
          <div className={styles.imageCol}>
            <div className={styles.mainImageWrapper}>
              <img
                src={selectedImage}
                alt={cleanText(product.name)}
                className={styles.mainImage}
              />
              <div className={styles.dietBadgeWrapper}>
                <span className={mealType === 'Veg' ? 'badge-veg' : 'badge-nonveg'}></span>
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className={styles.thumbRow}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumbBtn} ${selectedImage === img ? styles.thumbActive : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Customizer */}
          <div className={styles.detailsCol}>
            {/* 1. MEAL PLAN / SUBSCRIPTION CUSTOMIZER */}
            {isSubscriptionPlan ? (
              <>
                <div className={styles.headerInfo}>
                  <h1 className={styles.title}>{subscriptionDynamicTitle}</h1>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>${effectivePrice.toFixed(2)}</span>
                    <span className={styles.perMealText}>
                      (~${(effectivePrice / subPlanDays).toFixed(2)} / meal)
                    </span>
                  </div>
                  <p className={styles.productNotice}>
                    Please place your tiffin &amp; food orders at least 24 hours in advance to ensure timely preparation, delivery, or pick-up.
                  </p>
                </div>

                <div className={styles.customizerFormContainer}>
                  {/* Pickup or Delivery */}
                  <div className={styles.sectionBlock}>
                    <label className={styles.sectionLabel}>
                      Pickup Or Delivery <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.cardGrid2}>
                      <div
                        className={`${styles.selectableCard} ${deliveryMode === 'store-pick-up' ? styles.selectableCardActive : ''}`}
                        onClick={() => setDeliveryMode('store-pick-up')}
                      >
                        <div className={styles.cardTopRow}>
                          <div className={styles.cardTitleWrap}>
                            <span className={styles.cardIcon}>🏪</span>
                            <span>Store Pickup</span>
                          </div>
                          <span className={styles.cardTagFree}>FREE</span>
                        </div>
                      </div>

                      <div
                        className={`${styles.selectableCard} ${deliveryMode === 'home-delivery' ? styles.selectableCardActive : ''}`}
                        onClick={() => setDeliveryMode('home-delivery')}
                      >
                        <div className={styles.cardTopRow}>
                          <div className={styles.cardTitleWrap}>
                            <span className={styles.cardIcon}>🚚</span>
                            <span>Doorstep Delivery</span>
                          </div>
                          <span className={styles.cardTagOneTime}>1 TIME CHARGE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meal Preference */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabelRow}>
                      <label className={styles.sectionLabel}>
                        Select Meal Preference <span className={styles.requiredStar}>*</span>
                      </label>
                      <span className={styles.sectionActiveBadge}>{dietLabel}</span>
                    </div>
                    <div className={styles.cardGrid3}>
                      <div
                        className={`${styles.selectableCard} ${mealType === 'Veg' ? styles.selectableCardActive : ''}`}
                        onClick={() => {
                          setMealType('Veg');
                          if (PLAN_IMAGES[selectedSubPlanId]) {
                            setSelectedImage(PLAN_IMAGES[selectedSubPlanId]);
                          } else {
                            setSelectedImage(DIET_TIFFIN_IMAGES['Veg']);
                          }
                        }}
                      >
                        <div className={styles.cardTitleWrap}>
                          <span className={styles.cardIcon}>🌱</span>
                          <span>Pure Veg</span>
                        </div>
                      </div>

                      <div
                        className={`${styles.selectableCard} ${mealType === 'Non-Veg' ? styles.selectableCardActive : ''}`}
                        onClick={() => {
                          setMealType('Non-Veg');
                          setSelectedImage(DIET_TIFFIN_IMAGES['Non-Veg']);
                        }}
                      >
                        <div className={styles.cardTitleWrap}>
                          <span className={styles.cardIcon}>🍗</span>
                          <span>Non-Veg</span>
                        </div>
                      </div>

                      <div
                        className={`${styles.selectableCard} ${mealType === 'Veg & Non-Veg Mix' ? styles.selectableCardActive : ''}`}
                        onClick={() => {
                          setMealType('Veg & Non-Veg Mix');
                          setSelectedImage(DIET_TIFFIN_IMAGES['Veg & Non-Veg Mix']);
                        }}
                      >
                        <div className={styles.cardTitleWrap}>
                          <span className={styles.cardIcon}>🍱</span>
                          <span>Veg &amp; Mix</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Duration */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabelRow}>
                      <label className={styles.sectionLabel}>
                        Subscription Duration / Meal Plan <span className={styles.requiredStar}>*</span>
                      </label>
                      <span className={styles.sectionActiveBadge}>{currentSubPlan.label}</span>
                    </div>
                    <div className={styles.cardGridDuration}>
                      {SUBSCRIPTION_PLANS.filter((p) => p.days >= 2 && p.days <= 7).map((plan) => (
                        <div
                          key={plan.id}
                          className={`${styles.selectableCard} ${selectedSubPlanId === plan.id ? styles.selectableCardActive : ''}`}
                          onClick={() => {
                            setSelectedSubPlanId(plan.id);
                            setActiveDayIndex(0);
                            if (PLAN_IMAGES[plan.id]) {
                              setSelectedImage(PLAN_IMAGES[plan.id]);
                            }
                          }}
                        >
                          <div className={styles.cardTopRow}>
                            <span className={styles.cardTitleWrap}>{plan.label}</span>
                            <span className={styles.cardPrice}>${plan.price.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bread Type Options */}
                  <div className={styles.sectionBlock}>
                    <label className={styles.sectionLabel}>
                      Bread Type Options <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.pillSelectorRow}>
                      {BREAD_OPTIONS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          className={`${styles.pillOptionBtn} ${breadType === b ? styles.pillOptionActive : ''}`}
                          onClick={() => setBreadType(b)}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spice Level */}
                  <div className={styles.sectionBlock}>
                    <label className={styles.sectionLabel}>
                      Add Spice Level <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.pillSelectorRow}>
                      {SPICE_OPTIONS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className={`${styles.pillOptionBtn} ${spiceLevel === s.id ? styles.pillOptionActive : ''}`}
                          onClick={() => setSpiceLevel(s.id)}
                        >
                          <span>{s.label}</span>
                          <span>{s.icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Day-by-Day Dishes */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabelRow}>
                      <label className={styles.sectionLabel}>
                        Choose Your Daily Dishes ({subPlanDays} Days Plan){quantity > 1 ? ` — ${quantity} Packs` : ''} <span className={styles.requiredStar}>*</span>
                      </label>
                      <span className={styles.sectionActiveBadge}>
                        {selectedSubDishesCount} of {totalSubDishesExpected} Selected
                      </span>
                    </div>

                    <div className={styles.dayPickerContainer}>
                      {/* Pack Selector when quantity > 1 */}
                      {quantity > 1 && (
                        <div className={styles.packSelectorRow}>
                          <span className={styles.packSelectorLabel}>Configuring Pack:</span>
                          {Array.from({ length: quantity }).map((_, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              className={`${styles.packTabBtn} ${currentEffectiveActiveSet === sIdx ? styles.packTabBtnActive : ''}`}
                              onClick={() => {
                                setActiveSetIndex(sIdx);
                                setActiveDayIndex(0);
                              }}
                            >
                              <span>🍱 Meal Pack #{sIdx + 1}</span>
                              <span className={styles.packTabSub}>{subPlanDays} Days</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className={styles.dayTabsRow}>
                        {Array.from({ length: subPlanDays }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const daySuffix = dayNum === 1 ? 'st' : dayNum === 2 ? 'nd' : dayNum === 3 ? 'rd' : 'th';
                          const isCurrentActive = activeDayIndex === idx;
                          const selectedDish = dayDishes[`${currentEffectiveActiveSet}-${idx}`] || 'Select dish';

                          return (
                            <button
                              key={idx}
                              type="button"
                              className={`${styles.dayTabBtn} ${isCurrentActive ? styles.dayTabBtnActive : ''}`}
                              onClick={() => setActiveDayIndex(idx)}
                            >
                              <span>{dayNum}{daySuffix} Day</span>
                              <span className={styles.dayTabSub}>{selectedDish}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className={styles.activeDayPrompt}>
                        <span className={styles.activeDayNumber}>{activeDayIndex + 1}</span>
                        <span>
                          Select Dish for {quantity > 1 ? `Meal Pack #${currentEffectiveActiveSet + 1} - ` : ''}Day {activeDayIndex + 1}
                        </span>
                      </div>

                      <div className={styles.dishCardsGrid}>
                        {availableDishes.map((dish) => {
                          const isSelectedForActiveDay = dayDishes[`${currentEffectiveActiveSet}-${activeDayIndex}`] === dish;
                          const matched = getDaysForDishMultiSet(dish, dayDishes, subPlanDays, currentEffectiveActiveSet, quantity);
                          const isSelectedInPlan = matched.matchedAllLabels.length > 0;
                          const isVeg = VEG_DISHES.includes(dish);

                          let cardClass = styles.dishSelectCard;
                          if (isSelectedForActiveDay) {
                            cardClass += ` ${styles.dishSelectCardActive}`;
                          } else if (isSelectedInPlan) {
                            cardClass += ` ${styles.dishSelectCardInPlan}`;
                          }

                          return (
                            <div
                              key={dish}
                              className={cardClass}
                              onClick={() => handleSelectDishForDay(dish)}
                            >
                              <span className={styles.dishName}>{dish}</span>
                              <div className={styles.dishBadgesGroup}>
                                {isSelectedForActiveDay ? (
                                  <span className={styles.dishSelectedActiveTag}>
                                    ✓ {quantity > 1 ? `P${currentEffectiveActiveSet + 1}·D${activeDayIndex + 1}` : `Day ${matched.matchedCurrentSet.join(', ')}`}
                                  </span>
                                ) : isSelectedInPlan ? (
                                  <span className={styles.dishSelectedDayTag}>
                                    {matched.matchedAllLabels.slice(0, 2).join(', ')}{matched.matchedAllLabels.length > 2 ? '…' : ''}
                                  </span>
                                ) : null}
                                <span className={isVeg ? styles.dishTypeVegBadge : styles.dishTypeNonVegBadge}>
                                  {isVeg ? 'VEG' : 'NON-VEG'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className={styles.scheduleSummaryBox}>
                      <div className={styles.scheduleHeader}>
                        <span>Your Customized {subPlanDays}-Day Daily Menu Schedule{quantity > 1 ? ` (${quantity} Sets)` : ''}:</span>
                        <span className={styles.scheduleTip}>Click &ldquo;Change Dish&rdquo; to modify any day</span>
                      </div>

                      <div className={styles.schedulePackList}>
                        {Array.from({ length: quantity }).map((_, sIdx) => (
                          <div
                            key={sIdx}
                            className={`${styles.schedulePackSection} ${quantity > 1 && currentEffectiveActiveSet === sIdx ? styles.schedulePackSectionActive : ''}`}
                          >
                            {quantity > 1 && (
                              <div className={styles.schedulePackTitleRow}>
                                <span className={styles.schedulePackTitle}>🍱 Meal Pack #{sIdx + 1} Daily Schedule</span>
                                {currentEffectiveActiveSet === sIdx ? (
                                  <span className={styles.schedulePackActiveTag}>Currently Editing</span>
                                ) : (
                                  <button
                                    type="button"
                                    className={styles.changeDishBtn}
                                    onClick={() => {
                                      setActiveSetIndex(sIdx);
                                      setActiveDayIndex(0);
                                    }}
                                  >
                                    Edit Pack #{sIdx + 1} ✏️
                                  </button>
                                )}
                              </div>
                            )}

                            <div className={styles.scheduleGrid}>
                              {Array.from({ length: subPlanDays }).map((_, dIdx) => {
                                const dayNum = dIdx + 1;
                                const daySuffix = dayNum === 1 ? 'st' : dayNum === 2 ? 'nd' : dayNum === 3 ? 'rd' : 'th';
                                const assignedDish = dayDishes[`${sIdx}-${dIdx}`] || 'Select dish';
                                const isCardActive = currentEffectiveActiveSet === sIdx && activeDayIndex === dIdx;

                                return (
                                  <div
                                    key={dIdx}
                                    className={`${styles.scheduleDayCard} ${isCardActive ? styles.scheduleDayCardActive : ''}`}
                                  >
                                    <div className={styles.scheduleDayInfo}>
                                      <span className={styles.scheduleDayTitle}>{dayNum}{daySuffix} Day</span>
                                      <span className={styles.scheduleDayDish}>{assignedDish}</span>
                                    </div>
                                    <button
                                      type="button"
                                      className={styles.changeDishBtn}
                                      onClick={() => {
                                        setActiveSetIndex(sIdx);
                                        setActiveDayIndex(dIdx);
                                      }}
                                    >
                                      Change Dish ✏️
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className={styles.dateTimeGrid}>
                    <div className={styles.sectionBlock}>
                      <label className={styles.sectionLabel}>
                        Pickup/Delivery Date <span className={styles.requiredStar}>*</span>
                      </label>
                      <CustomDatePicker
                        value={deliveryDate}
                        onChange={(d) => setDeliveryDate(d)}
                      />
                    </div>

                    <div className={styles.sectionBlock}>
                      <label className={styles.sectionLabel}>
                        Pickup/Delivery Timing <span className={styles.requiredStar}>*</span>
                      </label>
                      <CustomTimeDropdown
                        value={deliveryTimeSlot}
                        onChange={(val) => setDeliveryTimeSlot(val)}
                      />
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabelRow}>
                      <label className={styles.sectionLabel}>Special Instructions</label>
                      <span className={styles.sectionSubtextTag}>Special Notes &amp; Allergies</span>
                    </div>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Tell us if you have any food allergies, dietary preferences, or delivery notes..."
                      rows={3}
                      className={styles.styledTextarea}
                    ></textarea>
                  </div>

                  {/* Price Box */}
                  <div className={styles.priceSummaryBox}>
                    <div className={styles.summaryRow}>
                      <div className={styles.summaryTitleGroup}>
                        <span className={styles.summaryLabel}>Total Product Price</span>
                        <span className={styles.summaryQtyTag}>
                          {quantity} {quantity === 1 ? 'Pack' : 'Packs'} × {subPlanDays} Days
                        </span>
                      </div>
                      <span className={styles.summaryValue}>${(effectivePrice * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : isDailyTiffin ? (
              /* 2. DAILY TIFFIN CUSTOMIZER */
              <>
                <div className={styles.headerInfo}>
                  <h1 className={styles.title}>{tiffinDynamicTitle}</h1>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>${effectivePrice.toFixed(2)}</span>
                    <span className={styles.perMealText}>
                      (~${(effectivePrice / tiffinPlanDays).toFixed(2)} / meal)
                    </span>
                  </div>
                  <p className={styles.productNotice}>
                    Please place your tiffin orders at least 24 hours in advance to ensure timely preparation, delivery, or pick-up.
                  </p>
                </div>

                <div className={styles.customizerFormContainer}>
                  {/* Pickup or Delivery */}
                  <div className={styles.sectionBlock}>
                    <label className={styles.sectionLabel}>
                      Pickup Or Delivery <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.cardGrid2}>
                      <div
                        className={`${styles.selectableCard} ${deliveryMode === 'store-pick-up' ? styles.selectableCardActive : ''}`}
                        onClick={() => setDeliveryMode('store-pick-up')}
                      >
                        <div className={styles.cardTopRow}>
                          <div className={styles.cardTitleWrap}>
                            <span className={styles.cardIcon}>🏪</span>
                            <span>Store Pickup</span>
                          </div>
                          <span className={styles.cardTagFree}>FREE</span>
                        </div>
                      </div>

                      <div
                        className={`${styles.selectableCard} ${deliveryMode === 'home-delivery' ? styles.selectableCardActive : ''}`}
                        onClick={() => setDeliveryMode('home-delivery')}
                      >
                        <div className={styles.cardTopRow}>
                          <div className={styles.cardTitleWrap}>
                            <span className={styles.cardIcon}>🚚</span>
                            <span>Doorstep Delivery</span>
                          </div>
                          <span className={styles.cardTagDaily}>DAILY CHARGE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meal Preference */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabelRow}>
                      <label className={styles.sectionLabel}>
                        Select Meal Preference <span className={styles.requiredStar}>*</span>
                      </label>
                      <span className={styles.sectionActiveBadge}>{dietLabel}</span>
                    </div>
                    <div className={styles.cardGrid3}>
                      <div
                        className={`${styles.selectableCard} ${mealType === 'Veg' ? styles.selectableCardActive : ''}`}
                        onClick={() => {
                          setMealType('Veg');
                          setSelectedImage(DIET_TIFFIN_IMAGES['Veg']);
                        }}
                      >
                        <div className={styles.cardTitleWrap}>
                          <span className={styles.cardIcon}>🌱</span>
                          <span>Pure Vegetarian</span>
                        </div>
                      </div>

                      <div
                        className={`${styles.selectableCard} ${mealType === 'Non-Veg' ? styles.selectableCardActive : ''}`}
                        onClick={() => {
                          setMealType('Non-Veg');
                          setSelectedImage(DIET_TIFFIN_IMAGES['Non-Veg']);
                        }}
                      >
                        <div className={styles.cardTitleWrap}>
                          <span className={styles.cardIcon}>🍗</span>
                          <span>Non-Vegetarian</span>
                        </div>
                      </div>

                      <div
                        className={`${styles.selectableCard} ${mealType === 'Veg & Non-Veg Mix' ? styles.selectableCardActive : ''}`}
                        onClick={() => {
                          setMealType('Veg & Non-Veg Mix');
                          setSelectedImage(DIET_TIFFIN_IMAGES['Veg & Non-Veg Mix']);
                        }}
                      >
                        <div className={styles.cardTitleWrap}>
                          <span className={styles.cardIcon}>🍱</span>
                          <span>Veg &amp; Non-Veg Mix</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tiffin Plans / Duration */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabelRow}>
                      <label className={styles.sectionLabel}>
                        Tiffin Plans / Duration <span className={styles.requiredStar}>*</span>
                      </label>
                      <span className={styles.sectionActiveBadge}>{currentTiffinPlan.label}</span>
                    </div>
                    <div className={styles.cardGridDuration}>
                      {DAILY_TIFFIN_PLANS.map((plan) => (
                        <div
                          key={plan.id}
                          className={`${styles.selectableCard} ${selectedTiffinPlanId === plan.id ? styles.selectableCardActive : ''}`}
                          onClick={() => {
                            setSelectedTiffinPlanId(plan.id);
                            setTiffinActiveDayIndex(0);
                            // In Daily Tiffin, day duration does NOT change image
                          }}
                        >
                          <div className={styles.cardTopRow}>
                            <span className={styles.cardTitleWrap}>{plan.label}</span>
                            <span className={styles.cardPrice}>${plan.price.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bread Type Options */}
                  <div className={styles.sectionBlock}>
                    <label className={styles.sectionLabel}>
                      Bread Type Options <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.pillSelectorRow}>
                      {BREAD_OPTIONS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          className={`${styles.pillOptionBtn} ${breadType === b ? styles.pillOptionActive : ''}`}
                          onClick={() => setBreadType(b)}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spice Level */}
                  <div className={styles.sectionBlock}>
                    <label className={styles.sectionLabel}>
                      Add Spice Level <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.pillSelectorRow}>
                      {SPICE_OPTIONS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className={`${styles.pillOptionBtn} ${spiceLevel === s.id ? styles.pillOptionActive : ''}`}
                          onClick={() => setSpiceLevel(s.id)}
                        >
                          <span>{s.label}</span>
                          <span>{s.icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Choose Your Dish(es) */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabelRow}>
                      <label className={styles.sectionLabel}>
                        {tiffinPlanDays === 1
                          ? `Choose Your Dish (${quantity > 1 ? `${quantity} Tiffins` : '1 Day Tiffin'})`
                          : `Choose Your Daily Dishes (${tiffinPlanDays} Days Plan)${quantity > 1 ? ` — ${quantity} Packs` : ''}`}{' '}
                        <span className={styles.requiredStar}>*</span>
                      </label>
                      <span className={styles.sectionActiveBadge}>
                        {selectedTiffinDishesCount} of {totalTiffinDishesExpected} Selected
                      </span>
                    </div>

                    <div className={styles.dayPickerContainer}>
                      {/* Pack Selector when quantity > 1 */}
                      {quantity > 1 && (
                        <div className={styles.packSelectorRow}>
                          <span className={styles.packSelectorLabel}>Configuring Tiffin:</span>
                          {Array.from({ length: quantity }).map((_, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              className={`${styles.packTabBtn} ${currentEffectiveTiffinActiveSet === sIdx ? styles.packTabBtnActive : ''}`}
                              onClick={() => {
                                setTiffinActiveSetIndex(sIdx);
                                setTiffinActiveDayIndex(0);
                              }}
                            >
                              <span>🍱 Tiffin #{sIdx + 1}</span>
                              <span className={styles.packTabSub}>{tiffinPlanDays === 1 ? '1 Day' : `${tiffinPlanDays} Days`}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {tiffinPlanDays > 1 && (
                        <div className={styles.dayTabsRow}>
                          {Array.from({ length: tiffinPlanDays }).map((_, idx) => {
                            const dayNum = idx + 1;
                            const daySuffix = dayNum === 1 ? 'st' : dayNum === 2 ? 'nd' : dayNum === 3 ? 'rd' : 'th';
                            const isCurrentActive = tiffinActiveDayIndex === idx;
                            const selectedDish = tiffinDayDishes[`${currentEffectiveTiffinActiveSet}-${idx}`] || 'Select dish';

                            return (
                              <button
                                key={idx}
                                type="button"
                                className={`${styles.dayTabBtn} ${isCurrentActive ? styles.dayTabBtnActive : ''}`}
                                onClick={() => setTiffinActiveDayIndex(idx)}
                              >
                                <span>{dayNum}{daySuffix} Day</span>
                                <span className={styles.dayTabSub}>{selectedDish}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className={styles.activeDayPrompt}>
                        <span className={styles.activeDayNumber}>
                          {tiffinPlanDays === 1 ? currentEffectiveTiffinActiveSet + 1 : tiffinActiveDayIndex + 1}
                        </span>
                        <span>
                          {tiffinPlanDays === 1
                            ? `Select Main Dish for ${quantity > 1 ? `Tiffin #${currentEffectiveTiffinActiveSet + 1}` : 'Today'}`
                            : `Select Dish for ${quantity > 1 ? `Tiffin Pack #${currentEffectiveTiffinActiveSet + 1} - ` : ''}Day ${tiffinActiveDayIndex + 1}`}
                        </span>
                      </div>

                      <div className={styles.dishCardsGrid}>
                        {availableDishes.map((dish) => {
                          const isSelectedForActiveDay =
                            tiffinDayDishes[`${currentEffectiveTiffinActiveSet}-${tiffinActiveDayIndex}`] === dish;
                          const matched = getDaysForDishMultiSet(dish, tiffinDayDishes, tiffinPlanDays, currentEffectiveTiffinActiveSet, quantity);
                          const isSelectedInPlan = matched.matchedAllLabels.length > 0;
                          const isVeg = VEG_DISHES.includes(dish);

                          let cardClass = styles.dishSelectCard;
                          if (isSelectedForActiveDay) {
                            cardClass += ` ${styles.dishSelectCardActive}`;
                          } else if (isSelectedInPlan) {
                            cardClass += ` ${styles.dishSelectCardInPlan}`;
                          }

                          return (
                            <div
                              key={dish}
                              className={cardClass}
                              onClick={() => {
                                handleSelectTiffinDishForDay(dish);
                              }}
                            >
                              <span className={styles.dishName}>{dish}</span>
                              <div className={styles.dishBadgesGroup}>
                                {isSelectedForActiveDay ? (
                                  <span className={styles.dishSelectedActiveTag}>
                                    ✓ {quantity > 1 ? `P${currentEffectiveTiffinActiveSet + 1}·D${tiffinActiveDayIndex + 1}` : `Day ${matched.matchedCurrentSet.join(', ')}`}
                                  </span>
                                ) : isSelectedInPlan ? (
                                  <span className={styles.dishSelectedDayTag}>
                                    {matched.matchedAllLabels.slice(0, 2).join(', ')}{matched.matchedAllLabels.length > 2 ? '…' : ''}
                                  </span>
                                ) : null}
                                <span className={isVeg ? styles.dishTypeVegBadge : styles.dishTypeNonVegBadge}>
                                  {isVeg ? 'VEG' : 'NON-VEG'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {tiffinPlanDays > 1 && (
                      <div className={styles.scheduleSummaryBox}>
                        <div className={styles.scheduleHeader}>
                          <span>Your Customized {tiffinPlanDays}-Day Daily Menu Schedule{quantity > 1 ? ` (${quantity} Sets)` : ''}:</span>
                          <span className={styles.scheduleTip}>Click &ldquo;Change Dish&rdquo; to modify any day</span>
                        </div>

                        <div className={styles.schedulePackList}>
                          {Array.from({ length: quantity }).map((_, sIdx) => (
                            <div
                              key={sIdx}
                              className={`${styles.schedulePackSection} ${quantity > 1 && currentEffectiveTiffinActiveSet === sIdx ? styles.schedulePackSectionActive : ''}`}
                            >
                              {quantity > 1 && (
                                <div className={styles.schedulePackTitleRow}>
                                  <span className={styles.schedulePackTitle}>🍱 Tiffin Pack #{sIdx + 1} Daily Schedule</span>
                                  {currentEffectiveTiffinActiveSet === sIdx ? (
                                    <span className={styles.schedulePackActiveTag}>Currently Editing</span>
                                  ) : (
                                    <button
                                      type="button"
                                      className={styles.changeDishBtn}
                                      onClick={() => {
                                        setTiffinActiveSetIndex(sIdx);
                                        setTiffinActiveDayIndex(0);
                                      }}
                                    >
                                      Edit Pack #{sIdx + 1} ✏️
                                    </button>
                                  )}
                                </div>
                              )}

                              <div className={styles.scheduleGrid}>
                                {Array.from({ length: tiffinPlanDays }).map((_, dIdx) => {
                                  const dayNum = dIdx + 1;
                                  const daySuffix = dayNum === 1 ? 'st' : dayNum === 2 ? 'nd' : dayNum === 3 ? 'rd' : 'th';
                                  const assignedDish = tiffinDayDishes[`${sIdx}-${dIdx}`] || 'Select dish';
                                  const isCardActive = currentEffectiveTiffinActiveSet === sIdx && tiffinActiveDayIndex === dIdx;

                                  return (
                                    <div
                                      key={dIdx}
                                      className={`${styles.scheduleDayCard} ${isCardActive ? styles.scheduleDayCardActive : ''}`}
                                    >
                                      <div className={styles.scheduleDayInfo}>
                                        <span className={styles.scheduleDayTitle}>{dayNum}{daySuffix} Day</span>
                                        <span className={styles.scheduleDayDish}>{assignedDish}</span>
                                      </div>
                                      <button
                                        type="button"
                                        className={styles.changeDishBtn}
                                        onClick={() => {
                                          setTiffinActiveSetIndex(sIdx);
                                          setTiffinActiveDayIndex(dIdx);
                                        }}
                                      >
                                        Change Dish ✏️
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Delivery Date & Time */}
                  <div className={styles.dateTimeGrid}>
                    <div className={styles.sectionBlock}>
                      <label className={styles.sectionLabel}>
                        Delivery &amp; Store Pickup Available <span className={styles.requiredStar}>*</span>
                      </label>
                      <CustomDatePicker
                        value={deliveryDate}
                        onChange={(d) => setDeliveryDate(d)}
                      />
                    </div>

                    <div className={styles.sectionBlock}>
                      <label className={styles.sectionLabel}>
                        Delivery &amp; Pickup Timing <span className={styles.requiredStar}>*</span>
                      </label>
                      <CustomTimeDropdown
                        value={deliveryTimeSlot}
                        onChange={(val) => setDeliveryTimeSlot(val)}
                      />
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabelRow}>
                      <label className={styles.sectionLabel}>Special Instructions</label>
                      <span className={styles.sectionSubtextTag}>Special Notes &amp; Allergies</span>
                    </div>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Tell us if you have any food allergies, dietary preferences, or delivery notes..."
                      rows={3}
                      className={styles.styledTextarea}
                    ></textarea>
                  </div>

                  {/* Price Box */}
                  <div className={styles.priceSummaryBox}>
                    <div className={styles.summaryRow}>
                      <div className={styles.summaryTitleGroup}>
                        <span className={styles.summaryLabel}>Total Product Price</span>
                        <span className={styles.summaryQtyTag}>
                          {quantity} {quantity === 1 ? 'Pack' : 'Packs'} × {tiffinPlanDays} {tiffinPlanDays === 1 ? 'Day' : 'Days'}
                        </span>
                      </div>
                      <span className={styles.summaryValue}>${(effectivePrice * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* 3. REGULAR STORE PRODUCT */
              <>
                <div className={styles.headerInfo}>
                  <h1 className={styles.title}>{cleanText(product.name)}</h1>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>${product.price.toFixed(2)}</span>
                  </div>
                </div>
                <p className={styles.desc}>
                  {cleanText(product.description || product.shortDescription) ||
                    'Freshly prepared homestyle authentic Indian meal, cooked daily with zero preservatives and authentic Indian spices.'}
                </p>
              </>
            )}

            {/* Validation Alert */}
            {dishValidationError && (
              <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#991b1b', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️ {dishValidationError}</span>
              </div>
            )}

            {/* Quantity and Add to Cart Action */}
            <div className={styles.actionRow}>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={16} />
                </button>
                <span className={styles.qtyNum}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                className={`btn-primary ${styles.addToCartBtn} ${isAdded ? styles.addedBtn : ''}`}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <>
                    <Check size={20} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    <span>Add to Cart (${(effectivePrice * quantity).toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>

            {/* Guarantee Box */}
            <div className={styles.guaranteeBox}>
              <ShieldCheck size={20} className={styles.guaranteeIcon} />
              <div>
                <strong>100% Satisfaction Guarantee</strong>
                <p>Hot delivery at your doorstep, freshly packed in food-grade insulated packaging.</p>
              </div>
            </div>
          </div>
        </div>

        {/* WooCommerce Style Tabbed Section */}
        <section className={styles.tabsContainer}>
          <div className={styles.tabsHeader}>
            <button
              className={`${styles.tabButton} ${activeTab === 'description' ? styles.activeTabButton : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'additional' ? styles.activeTabButton : ''}`}
              onClick={() => setActiveTab('additional')}
            >
              Additional information
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.activeTabButton : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews (0)
            </button>
          </div>

          <div className={styles.tabContentBox}>
            {activeTab === 'description' && (
              <div className={styles.descContainer}>
                <div className={styles.descHeaderCompact}>
                  <h3 className={styles.descTitleCompact}>
                    {isSubscriptionPlan ? subscriptionDynamicTitle : isDailyTiffin ? tiffinDynamicTitle : cleanText(product.name)}
                  </h3>
                  <p className={styles.descTextCompact}>
                    A wholesome, authentic home-style meal prepared fresh every day with premium ingredients and traditional Indian spices — perfect for work, home, or on the go.
                  </p>
                </div>

                <div className={styles.descTableWrapper}>
                  <table className={styles.descTable}>
                    <tbody>
                      <tr>
                        <th className={styles.descTh}>
                          <Wheat size={16} className={styles.thIconLucide} /> Fresh Breads
                        </th>
                        <td className={styles.descTd}>
                          Freshly made Soft Roti, Butter Naan, Tandoori Roti, or Paratha (cooked fresh to order)
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.descTh}>
                          <CookingPot size={16} className={styles.thIconLucide} /> Main Dish / Sabzi
                        </th>
                        <td className={styles.descTd}>
                          {mealType === 'Non-Veg' 
                            ? 'Tender Chicken & Meat curries cooked with authentic spices'
                            : 'Seasonal Sabzi, Rich Paneer, or vegetable specialties prepared daily'}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.descTh}>
                          <Soup size={16} className={styles.thIconLucide} /> Dal / Curry
                        </th>
                        <td className={styles.descTd}>
                          Slow-simmered, protein-rich Dal Tadka, Dal Makhani, or Rajma
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.descTh}>
                          <Sparkles size={16} className={styles.thIconLucide} /> Steamed Rice
                        </th>
                        <td className={styles.descTd}>
                          Fragrant, fluffy long-grain Basmati Rice
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.descTh}>
                          <Leaf size={16} className={styles.thIconLucide} /> Preparation &amp; Quality
                        </th>
                        <td className={styles.descTd}>
                          100% Homestyle, no artificial additives or frozen bases, hygienic food-grade packaging
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.descTh}>
                          <Truck size={16} className={styles.thIconLucide} /> Service Area
                        </th>
                        <td className={styles.descTd}>
                          Cambridge, Boston, Somerville &amp; surrounding areas (Doorstep Delivery or Store Pick-up)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'additional' && (
              <div>
                <h3 className={styles.tabTitle}>Additional information</h3>
                <table className={styles.attributesTable}>
                  <tbody>
                    <tr>
                      <th>Pick-up or Delivery</th>
                      <td>Delivery At Your Doorstep, Store Pick-up</td>
                    </tr>
                    <tr>
                      <th>Tiffin Plans</th>
                      <td>10 Day&apos;s Plans, 15 Day&apos;s Plans, 30 day&apos;s Plan, 5 Day&apos;s Plan, 7 Day&apos;s Plan, Daily Delight</td>
                    </tr>
                    <tr>
                      <th>Bread Type</th>
                      <td>Naan, 2 Roti</td>
                    </tr>
                    <tr>
                      <th>Spice Level</th>
                      <td>Mild, Medium, Extra Spicy</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className={styles.tabTitle}>Reviews</h3>
                <div className={styles.reviewsWrapper}>
                  <p>There are no reviews yet.</p>
                  <p style={{ fontWeight: 600, color: '#111111' }}>
                    Be the first to review &ldquo;{cleanText(product.name)}&rdquo;
                  </p>
                  <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
                    Your email address will not be published. Required fields are marked *
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Related products</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/product/${rel.slug}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relImgWrapper}>
                    <img src={rel.primaryImage} alt={rel.name} className={styles.relImg} />
                  </div>
                  <div className={styles.relInfo}>
                    <h4>{cleanText(rel.name)}</h4>
                    <span className={styles.relPrice}>${rel.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

