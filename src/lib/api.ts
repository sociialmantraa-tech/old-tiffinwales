import { Product, MealPlanTier } from './types';
import { FALLBACK_PRODUCTS, MEAL_PLAN_TIERS, WEEKLY_MENU_SCHEDULE, SERVICE_ZIP_CODES } from './fallback-data';

const WP_API_BASE = 'https://tiffinwales.com/wp-json';

/**
 * Pre-optimized WebP images stored locally in public/products/ for instant 0ms CDN delivery.
 */
const KNOWN_LOCAL_IMAGES = new Set([
  '2-Days-meal.webp', '3-day-meal-plan.webp', '3a9ba618-b4a5-41dd-990a-9ace2ea14360.webp',
  '4-Days-meal.webp', '5-day-meal-1.webp', '7-day-meal-plan.webp', 'Aloo-gobi.webp',
  'aloo-jeera-1.webp', 'aloo-jeera-2.webp', 'Aloo-methi-2.webp', 'Aloo-Methi.webp',
  'Baingan-Bharta.webp', 'Bhindi-masala-1.webp', 'Butter-chicken.webp', 'chana-masala.webp',
  'Channa-Masala.webp', 'chicken-achari-curry.webp', 'chicken-dhaniwal-korma.webp',
  'chicken-kadhai.webp', 'chicken-madras-1.webp', 'chili-chicken-1.webp', 'chili-paneer.webp',
  'dal-makhani.webp', 'f145d6f6-a987-4fd0-a699-2d78a0667c35.webp', 'goat-achari-curry.webp',
  'kadhai-paneer.webp', 'lamb-achari-curry.webp', 'lamb-bhuna-gosht-1.webp', 'lamb-kadhai-1.webp',
  'malai-kofta-1.webp', 'malai-kofta-2.webp', 'mango-381.5-X-317.5.webp', 'matar-paneer-2.webp',
  'Naan-381.5-X-317.5.webp', 'Non-Veg-01.webp', 'Non-Veg-Mix.webp', 'Palak-Paneer.webp',
  'Paneer-Tikka-Masala.webp', 'Paneer-Vindaloo.webp', 'paratha-381.5-X-317.5.webp',
  'Punjabi-kadhai-pakora-1.webp', 'Punjabi-kadhai-pakora.webp', 'Samosa-381.5-X-317.5.webp',
  'shahi-paneer-1.webp', 'shahi-paneer-2.webp', 'shrimp-kadhai.webp', 'veg-1.webp',
  'Veg-Coconut-Korma.webp', 'Veg-Tikka-Masala.webp'
]);

/**
 * Maps remote WordPress product images to fast local CDN WebP assets when available.
 * If an admin updates or uploads a new image in WordPress, returns the live URL
 * which Next.js Image Optimization will process and cache on the edge.
 */
export function getOptimizedImageUrl(remoteUrl: string | undefined): string {
  if (!remoteUrl) return '/products/5-day-meal-1.webp';
  if (remoteUrl.startsWith('/')) return remoteUrl;

  try {
    const filename = remoteUrl.split('/').pop()?.replace(/\.(png|jpg|jpeg|webp)$/i, '.webp');
    if (filename && KNOWN_LOCAL_IMAGES.has(filename)) {
      return `/products/${filename}`;
    }
  } catch (e) {}

  return remoteUrl;
}

/**
 * Robust fetch wrapper with timeout, ISR revalidation, and fallback protection.
 * Ensures the website never throws an unhandled error or crashes,
 * while automatically picking up WordPress admin updates every 60 seconds.
 */
let memoryCachedProducts: Product[] | null = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60-second in-memory freshness window

export async function getProducts(): Promise<Product[]> {
  const now = Date.now();
  if (memoryCachedProducts && memoryCachedProducts.length > 0 && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return memoryCachedProducts;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${WP_API_BASE}/wc/store/v1/products?per_page=100`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TiffinWales-NextJS/1.0',
      },
      next: { revalidate: 60 } // Automatic ISR background refresh every 60 seconds
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[API] Remote endpoint responded with status ${res.status}. Using cached/fallback catalog.`);
      if (!memoryCachedProducts) memoryCachedProducts = FALLBACK_PRODUCTS;
      return memoryCachedProducts;
    }

    const liveData = await res.json();
    if (!Array.isArray(liveData) || liveData.length === 0) {
      if (!memoryCachedProducts) memoryCachedProducts = FALLBACK_PRODUCTS;
      return memoryCachedProducts;
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
        images: (p.images || []).map((i: any) => getOptimizedImageUrl(i.src)),
        primaryImage: getOptimizedImageUrl(p.images?.[0]?.src),
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
    lastCacheTimestamp = now;
    return liveProducts;
  } catch (err: any) {
    console.warn('[API] Fetch error:', err?.message || err);
    if (!memoryCachedProducts) memoryCachedProducts = FALLBACK_PRODUCTS;
    return memoryCachedProducts;
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
