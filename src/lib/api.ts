import { Product, MealPlanTier } from './types';
import { FALLBACK_PRODUCTS, MEAL_PLAN_TIERS, WEEKLY_MENU_SCHEDULE, SERVICE_ZIP_CODES } from './fallback-data';

const WP_API_BASE = 'https://tiffinwales.com/wp-json';

/**
 * Robust fetch wrapper with timeout and fallback protection.
 * Ensures the website never throws an unhandled error or crashes.
 */
let memoryCachedProducts: Product[] | null = FALLBACK_PRODUCTS;

export async function getProducts(): Promise<Product[]> {
  if (memoryCachedProducts && memoryCachedProducts.length > 0) {
    return memoryCachedProducts;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);

    const res = await fetch(`${WP_API_BASE}/wc/store/v1/products?per_page=100`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TiffinWales-NextJS/1.0',
      },
      next: { revalidate: 3600 } // Pre-render statically with hourly background refresh
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[API] Remote endpoint responded with status ${res.status}. Using fallback catalog.`);
      memoryCachedProducts = FALLBACK_PRODUCTS;
      return FALLBACK_PRODUCTS;
    }

    const liveData = await res.json();
    if (!Array.isArray(liveData) || liveData.length === 0) {
      memoryCachedProducts = FALLBACK_PRODUCTS;
      return FALLBACK_PRODUCTS;
    }

    // Normalize live products
    const liveProducts: Product[] = liveData.map((p: any) => {
      const rawPrice = p.prices?.price ? parseFloat(p.prices.price) / 100 : 14.99;
      const regularPrice = p.prices?.regular_price ? parseFloat(p.prices.regular_price) / 100 : rawPrice;
      const cats = (p.categories || []).map((c: any) => (c.name || '').replace(/&amp;/g, '&'));
      const isMealPlan = p.slug.includes('days-meal') || p.slug.includes('tiffin') || p.slug === 'non-veg';
      const isVeg = p.slug.includes('veg-tiffin') || cats.includes('Veg') || (
        !cats.includes('Non-Veg') && 
        !p.name.toLowerCase().includes('chicken') && 
        !p.name.toLowerCase().includes('lamb') && 
        !p.name.toLowerCase().includes('goat') && 
        !p.name.toLowerCase().includes('shrimp')
      );

      return {
        id: p.id,
        name: (p.name || '').replace(/&#038;/g, '&'),
        slug: p.slug,
        price: rawPrice,
        regularPrice: regularPrice,
        formattedPrice: `$${rawPrice.toFixed(2)}`,
        description: (p.description || '').replace(/<[^>]+>/g, '').trim(),
        shortDescription: (p.short_description || '').replace(/<[^>]+>/g, '').trim(),
        images: (p.images || []).map((i: any) => i.src),
        primaryImage: p.images?.[0]?.src || 'https://tiffinwales.com/wp-content/uploads/2026/03/5-day-meal-1.webp',
        categories: cats,
        isMealPlan,
        isVeg,
        attributes: p.attributes || [],
        variations: p.variations || []
      };
    });

    // Make sure 5 Days Meal (ID 3269) is present if live list omitted it
    if (!liveProducts.some(p => p.slug === '5-days-meal' || p.id === 3269)) {
      const fallback5Day = FALLBACK_PRODUCTS.find(p => p.slug === '5-days-meal');
      if (fallback5Day) liveProducts.unshift(fallback5Day);
    }

    memoryCachedProducts = liveProducts;
    return liveProducts;
  } catch (err: any) {
    console.warn('[API] Fetch error:', err?.message || err);
    memoryCachedProducts = FALLBACK_PRODUCTS;
    return FALLBACK_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  const found = products.find(p => p.slug.toLowerCase() === slug.toLowerCase());
  return found || null;
}

export async function getProductById(id: number): Promise<Product | null> {
  const products = await getProducts();
  const found = products.find(p => p.id === id);
  return found || null;
}

export function getMealPlans(): MealPlanTier[] {
  return MEAL_PLAN_TIERS;
}

export function getWeeklySchedule() {
  return WEEKLY_MENU_SCHEDULE;
}

export function getServiceZipCodes() {
  return SERVICE_ZIP_CODES;
}
