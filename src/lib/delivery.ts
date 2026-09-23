import { CartItem } from './types';

/**
 * TIFFIN WALES - SMART DELIVERY PRICE CALCULATION
 * 
 * Implements the exact business logic from the Tiffin Wales WooCommerce engine:
 * 
 * 1. STORE PICKUP:
 *    Always FREE ($0.00).
 * 
 * 2. DAILY DELIGHT (1 Day Tiffin):
 *    Quantity does NOT multiply delivery.
 *    Daily Delight x 1 = 1 delivery ($8.00)
 *    Daily Delight x 3 = 1 delivery ($8.00)
 * 
 * 3. TIFFIN PLANS (5, 7, 10, 15, 30 Day Plans):
 *    Delivery charge is multiplied by plan days × quantity.
 *    5 Day Plan x 1 = 5 × $8.00 = $40.00
 *    5 Day Plan x 2 = 10 × $8.00 = $80.00
 *    10 Day Plan x 1 = 10 × $8.00 = $80.00
 *    30 Day Plan x 1 = 30 × $8.00 = $240.00
 * 
 * 4. MEAL PLANS (2, 3, 4, 5, 7 Day Meal Plans):
 *    Single flat delivery charge ($8.00) per meal plan item, ignoring quantity.
 * 
 * 5. REGULAR STORE PRODUCTS:
 *    Standard single delivery ($8.00).
 */

export const BASE_DAILY_DELIVERY_RATE = 8.00;

export function calculateDeliveryFee(
  cart: CartItem[],
  deliveryMode: 'pickup' | 'delivery'
): { deliveryFee: number; totalDeliveryDays: number; breakdownText: string } {
  if (deliveryMode === 'pickup') {
    return {
      deliveryFee: 0.00,
      totalDeliveryDays: 0,
      breakdownText: 'Store Pick-up (Free)',
    };
  }

  if (!cart || cart.length === 0) {
    return {
      deliveryFee: 0.00,
      totalDeliveryDays: 0,
      breakdownText: '$0.00',
    };
  }

  let totalDeliveryDays = 0;
  let hasDailyDelight = false;
  let hasRegularItems = false;
  const breakdownParts: string[] = [];

  for (const item of cart) {
    const itemQty = Math.max(1, item.quantity || 1);
    const nameLower = (item.name || '').toLowerCase();
    const slugLower = (item.slug || '').toLowerCase();
    const notesLower = (item.customization?.notes || '').toLowerCase();
    const searchData = `${nameLower} ${slugLower} ${notesLower}`;

    // Check if this product is a Meal Plan (e.g., 2 Days Meal, 3 Days Meal, 4 Days Meal, 5 Days Meal, 7 Days Meal)
    const isMealPlan =
      slugLower.includes('days-meal') ||
      slugLower.includes('meal-plan') ||
      searchData.includes('days meal') ||
      searchData.includes('day meal') ||
      (item.isMealPlan && searchData.includes('subscription') && !slugLower.includes('tiffin'));

    // Detect plan days
    let days = item.customization?.planDuration || 0;

    if (!days) {
      if (searchData.includes('daily-delight') || searchData.includes('daily delight')) {
        days = 1;
      } else if (/30[\s\-_]*day/.test(searchData)) {
        days = 30;
      } else if (/15[\s\-_]*day/.test(searchData)) {
        days = 15;
      } else if (/10[\s\-_]*day/.test(searchData)) {
        days = 10;
      } else if (/7[\s\-_]*day/.test(searchData)) {
        days = 7;
      } else if (/5[\s\-_]*day/.test(searchData)) {
        days = 5;
      } else if (/4[\s\-_]*day/.test(searchData)) {
        days = 4;
      } else if (/3[\s\-_]*day/.test(searchData)) {
        days = 3;
      } else if (/2[\s\-_]*day/.test(searchData)) {
        days = 2;
      }
    }

    // Daily Delight check
    if (searchData.includes('daily-delight') || searchData.includes('daily delight') || (days === 1 && !isMealPlan)) {
      hasDailyDelight = true;
      breakdownParts.push(`Daily Delight (1 Delivery: $${BASE_DAILY_DELIVERY_RATE.toFixed(2)})`);
    } else if (days > 0) {
      if (isMealPlan) {
        // MEAL PLANS: Charge exactly ONCE per item, completely ignoring the quantity
        totalDeliveryDays += 1;
        breakdownParts.push(`${days} Days Meal Plan (1-Time Charge: $${BASE_DAILY_DELIVERY_RATE.toFixed(2)})`);
      } else {
        // TIFFIN PLANS: Delivery charge multiplied by the number of plan days AND quantity
        const planDaysTotal = days * itemQty;
        totalDeliveryDays += planDaysTotal;
        breakdownParts.push(`${days} Days Tiffin (${planDaysTotal} Deliveries @ $${BASE_DAILY_DELIVERY_RATE}/day = $${(planDaysTotal * BASE_DAILY_DELIVERY_RATE).toFixed(2)})`);
      }
    } else {
      hasRegularItems = true;
    }
  }

  // Daily Delight = Only 1 delivery charge regardless of quantity
  if (hasDailyDelight) {
    totalDeliveryDays += 1;
  }

  // Regular single store items (if no tiffin plan in cart)
  if (totalDeliveryDays === 0 && hasRegularItems) {
    totalDeliveryDays = 1;
    breakdownParts.push(`Standard Delivery ($${BASE_DAILY_DELIVERY_RATE.toFixed(2)})`);
  }

  const finalCost = totalDeliveryDays * BASE_DAILY_DELIVERY_RATE;

  return {
    deliveryFee: finalCost,
    totalDeliveryDays,
    breakdownText: breakdownParts.join(' + ') || `$${finalCost.toFixed(2)}`,
  };
}
