import { CartItem } from './types';

/**
 * TIFFIN WALES - SMART DISTANCE-BASED DELIVERY PRICE ENGINE
 * Configured from WooCommerce WooReer Settings:
 * Hub Location: 1001 Massachusetts Ave, Cambridge, MA 02138
 * Coordinates: 42.3705° N, 71.1165° W
 * 
 * WooReer Distance Brackets (Maximum Distance = 15 Miles):
 * 1. 0 - 3 Miles: $5.00 / delivery
 * 2. 3 - 5 Miles: $8.00 / delivery
 * 3. 5 - 10 Miles: $12.00 / delivery
 * 4. 10 - 15 Miles: $16.00 / delivery
 * 5. > 15 Miles: OUT OF SERVICE RANGE (Customer prompted to choose Store Pick-up)
 * 
 * STORE PICKUP: Always 100% FREE ($0.00)
 */

export const KITCHEN_LOCATION = {
  address: '1001 Massachusetts Ave, Cambridge, MA 02138',
  lat: 42.3705,
  lon: -71.1165
};

export const MAX_DELIVERY_DISTANCE_MILES = 15.0;
export const BASE_DAILY_DELIVERY_RATE = 8.00;

export interface DeliveryLocation {
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface DistanceResult {
  distanceMiles: number;
  dailyRate: number;
  zoneName: string;
  matchedArea: string;
  isOutOfRange: boolean;
  maxDistance: number;
}

export interface DeliveryCalculationResult {
  deliveryFee: number;
  totalDeliveryDays: number;
  breakdownText: string;
  dailyRate: number;
  distanceMiles: number;
  zoneName: string;
  matchedArea: string;
  isOutOfRange: boolean;
  maxDistance: number;
}

// Greater Boston & Massachusetts Zip Code Coordinates
const ZIP_COORDINATES: Record<string, { city: string; name: string; lat: number; lon: number }> = {
  // Cambridge (Core)
  '02138': { city: 'Cambridge', name: 'Harvard Sq / West Cambridge', lat: 42.3770, lon: -71.1256 },
  '02139': { city: 'Cambridge', name: 'Central Sq / MIT', lat: 42.3647, lon: -71.1042 },
  '02140': { city: 'Cambridge', name: 'Porter Sq / North Cambridge', lat: 42.3912, lon: -71.1298 },
  '02141': { city: 'Cambridge', name: 'East Cambridge / Lechmere', lat: 42.3698, lon: -71.0858 },
  '02142': { city: 'Cambridge', name: 'Kendall Sq / MIT East', lat: 42.3625, lon: -71.0861 },

  // Somerville
  '02143': { city: 'Somerville', name: 'Union Sq / Spring Hill', lat: 42.3831, lon: -71.0963 },
  '02144': { city: 'Somerville', name: 'Davis Sq / West Somerville', lat: 42.4005, lon: -71.1232 },
  '02145': { city: 'Somerville', name: 'East Somerville / Assembly', lat: 42.3920, lon: -71.0875 },

  // Allston & Brighton
  '02134': { city: 'Allston', name: 'Allston / Harvard Ave', lat: 42.3550, lon: -71.1325 },
  '02135': { city: 'Brighton', name: 'Brighton / Oak Sq / Comm Ave', lat: 42.3486, lon: -71.1554 },

  // Boston Neighborhoods
  '02215': { city: 'Boston', name: 'Fenway / Kenmore / BU', lat: 42.3475, lon: -71.1017 },
  '02115': { city: 'Boston', name: 'Back Bay / Northeastern / Longwood', lat: 42.3418, lon: -71.0903 },
  '02116': { city: 'Boston', name: 'Copley / South End / Bay Village', lat: 42.3496, lon: -71.0746 },
  '02114': { city: 'Boston', name: 'Beacon Hill / West End / MGH', lat: 42.3619, lon: -71.0678 },
  '02111': { city: 'Boston', name: 'Downtown / Chinatown / Theatre', lat: 42.3512, lon: -71.0617 },
  '02108': { city: 'Boston', name: 'Beacon Hill East / State House', lat: 42.3585, lon: -71.0637 },
  '02109': { city: 'Boston', name: 'North End / Waterfront / Faneuil', lat: 42.3605, lon: -71.0537 },
  '02110': { city: 'Boston', name: 'Financial District / Fort Point', lat: 42.3547, lon: -71.0522 },
  '02113': { city: 'Boston', name: 'North End Historic', lat: 42.3654, lon: -71.0543 },
  '02118': { city: 'Boston', name: 'South End / Harrison Ave', lat: 42.3385, lon: -71.0705 },
  '02119': { city: 'Boston', name: 'Roxbury / Fort Hill', lat: 42.3245, lon: -71.0885 },
  '02120': { city: 'Boston', name: 'Mission Hill / Brigham Circle', lat: 42.3332, lon: -71.1002 },
  '02121': { city: 'Boston', name: 'Dorchester / Grove Hall', lat: 42.3085, lon: -71.0825 },
  '02122': { city: 'Boston', name: 'Dorchester / Fields Corner', lat: 42.2985, lon: -71.0605 },
  '02124': { city: 'Boston', name: 'Dorchester / Ashmont', lat: 42.2855, lon: -71.0715 },
  '02125': { city: 'Boston', name: 'Dorchester / Columbia Point / UMass', lat: 42.3155, lon: -71.0545 },
  '02127': { city: 'Boston', name: 'South Boston / Broadway', lat: 42.3355, lon: -71.0415 },
  '02128': { city: 'Boston', name: 'East Boston / Logan Airport', lat: 42.3705, lon: -71.0345 },
  '02129': { city: 'Boston', name: 'Charlestown / Navy Yard', lat: 42.3785, lon: -71.0625 },
  '02130': { city: 'Boston', name: 'Jamaica Plain / Centre St', lat: 42.3115, lon: -71.1145 },
  '02131': { city: 'Boston', name: 'Roslindale / Village', lat: 42.2855, lon: -71.1295 },
  '02132': { city: 'Boston', name: 'West Roxbury', lat: 42.2795, lon: -71.1615 },
  '02210': { city: 'Boston', name: 'Seaport Innovation District', lat: 42.3488, lon: -71.0425 },

  // Brookline, Watertown, Belmont, Arlington
  '02446': { city: 'Brookline', name: 'Coolidge Corner', lat: 42.3414, lon: -71.1219 },
  '02445': { city: 'Brookline', name: 'Brookline Village / Washington Sq', lat: 42.3318, lon: -71.1312 },
  '02472': { city: 'Watertown', name: 'Watertown / Arsenal St', lat: 42.3695, lon: -71.1782 },
  '02478': { city: 'Belmont', name: 'Belmont Center / Cushing Sq', lat: 42.3985, lon: -71.1762 },
  '02474': { city: 'Arlington', name: 'East Arlington / Capitol Sq', lat: 42.4145, lon: -71.1445 },
  '02476': { city: 'Arlington', name: 'Arlington Heights / Center', lat: 42.4225, lon: -71.1735 },

  // Medford, Malden, Everett, Chelsea
  '02155': { city: 'Medford', name: 'Tufts University / Medford Sq', lat: 42.4237, lon: -71.1118 },
  '02148': { city: 'Malden', name: 'Malden Center / Oak Grove', lat: 42.4298, lon: -71.0664 },
  '02149': { city: 'Everett', name: 'Everett / Glendale', lat: 42.4085, lon: -71.0535 },
  '02150': { city: 'Chelsea', name: 'Chelsea / Bellingham Sq', lat: 42.3918, lon: -71.0328 },

  // Newton, Waltham
  '02458': { city: 'Newton', name: 'Newton Corner / Nonantum', lat: 42.3575, lon: -71.1895 },
  '02459': { city: 'Newton', name: 'Newton Centre / Chestnut Hill', lat: 42.3275, lon: -71.1965 },
  '02460': { city: 'Newton', name: 'Newtonville', lat: 42.3495, lon: -71.2067 },
  '02461': { city: 'Newton', name: 'Newton Highlands', lat: 42.3215, lon: -71.2085 },
  '02462': { city: 'Newton', name: 'Newton Lower Falls', lat: 42.3245, lon: -71.2525 },
  '02464': { city: 'Newton', name: 'Newton Upper Falls', lat: 42.3125, lon: -71.2155 },
  '02465': { city: 'Newton', name: 'West Newton', lat: 42.3515, lon: -71.2285 },
  '02466': { city: 'Newton', name: 'Auburndale', lat: 42.3485, lon: -71.2485 },
  '02467': { city: 'Newton', name: 'Chestnut Hill', lat: 42.3285, lon: -71.1685 },
  '02468': { city: 'Newton', name: 'Waban', lat: 42.3285, lon: -71.2315 },
  '02451': { city: 'Waltham', name: 'Waltham / Brandeis / Moody St', lat: 42.3855, lon: -71.2482 },
  '02452': { city: 'Waltham', name: 'North Waltham', lat: 42.4035, lon: -71.2335 },
  '02453': { city: 'Waltham', name: 'South Waltham / Highlands', lat: 42.3685, lon: -71.2415 },

  // South Shore / Quincy
  '02169': { city: 'Quincy', name: 'Quincy Center / Wollaston', lat: 42.2478, lon: -71.0022 },
  '02170': { city: 'Quincy', name: 'North Quincy / Marina Bay', lat: 42.2815, lon: -71.0265 },
  '02171': { city: 'Quincy', name: 'East Milton / Quincy Shore', lat: 42.2745, lon: -71.0015 },
  '02184': { city: 'Braintree', name: 'Braintree / South Shore Plaza', lat: 42.2045, lon: -71.0015 },
  '02186': { city: 'Milton', name: 'Milton / East Milton Sq', lat: 42.2535, lon: -71.0715 },

  // North Suburbs
  '01801': { city: 'Woburn', name: 'Woburn Center / Horn Pond', lat: 42.4815, lon: -71.1525 },
  '01803': { city: 'Burlington', name: 'Burlington / Mall Area', lat: 42.5050, lon: -71.1956 },
  '02420': { city: 'Lexington', name: 'Lexington Center', lat: 42.4475, lon: -71.2265 },
  '02421': { city: 'Lexington', name: 'East Lexington', lat: 42.4355, lon: -71.2015 },
  '02176': { city: 'Melrose', name: 'Melrose', lat: 42.4575, lon: -71.0635 },
  '01890': { city: 'Winchester', name: 'Winchester Center', lat: 42.4525, lon: -71.1375 },

  // MetroWest (Within 15 Miles)
  '02492': { city: 'Needham', name: 'Needham / Highland', lat: 42.2815, lon: -71.2355 },
  '02494': { city: 'Needham', name: 'Needham Heights', lat: 42.2985, lon: -71.2255 },
  '02481': { city: 'Wellesley', name: 'Wellesley Hills / Babson', lat: 42.3025, lon: -71.2885 },
  '02482': { city: 'Wellesley', name: 'Wellesley Center / College', lat: 42.2985, lon: -71.3015 },
  '01760': { city: 'Natick', name: 'Natick Center / Mall', lat: 42.2835, lon: -71.3485 },

  // Beyond 15 Miles (for accurate out-of-range detection)
  '01701': { city: 'Framingham', name: 'North Framingham / Saxonville', lat: 42.3168, lon: -71.4367 },
  '01702': { city: 'Framingham', name: 'Framingham Downtown', lat: 42.2785, lon: -71.4175 },
  '01901': { city: 'Lynn', name: 'Lynn Downtown', lat: 42.4668, lon: -70.9495 },
  '01902': { city: 'Lynn', name: 'Lynn / Diamond District', lat: 42.4618, lon: -70.9325 }
};

// City-level distance fallbacks if exact zip code is not found in table
const CITY_FALLBACKS: Record<string, { dist: number; name: string }> = {
  cambridge: { dist: 0.8, name: 'Cambridge Core' },
  somerville: { dist: 2.2, name: 'Somerville' },
  allston: { dist: 1.8, name: 'Allston' },
  brighton: { dist: 3.1, name: 'Brighton' },
  boston: { dist: 3.5, name: 'Boston Metro' },
  brookline: { dist: 2.8, name: 'Brookline' },
  watertown: { dist: 3.8, name: 'Watertown' },
  belmont: { dist: 3.8, name: 'Belmont' },
  medford: { dist: 4.6, name: 'Medford' },
  arlington: { dist: 4.8, name: 'Arlington' },
  malden: { dist: 6.0, name: 'Malden' },
  everett: { dist: 5.5, name: 'Everett' },
  chelsea: { dist: 6.2, name: 'Chelsea' },
  newton: { dist: 6.5, name: 'Newton' },
  waltham: { dist: 8.5, name: 'Waltham' },
  winchester: { dist: 6.5, name: 'Winchester' },
  melrose: { dist: 7.0, name: 'Melrose' },
  lexington: { dist: 9.5, name: 'Lexington' },
  quincy: { dist: 12.5, name: 'Quincy' },
  woburn: { dist: 11.5, name: 'Woburn' },
  burlington: { dist: 12.8, name: 'Burlington' },
  needham: { dist: 11.0, name: 'Needham' },
  wellesley: { dist: 12.5, name: 'Wellesley' },
  natick: { dist: 14.5, name: 'Natick' },
  framingham: { dist: 21.0, name: 'Framingham' }
};

/**
 * Calculates road driving distance using Haversine formula with 1.25 urban curvature factor
 */
function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const roadMiles = R * c * 1.25;
  return Math.round(roadMiles * 10) / 10;
}

/**
 * Resolves address/city/zip to driving distance and tiered delivery rate
 * Strictly enforces maximum 15-mile delivery radius from 1001 Mass Ave, Cambridge
 */
export function getDistanceAndRate(location?: DeliveryLocation): DistanceResult {
  const rawZip = String(location?.zipCode || '').trim();
  const rawCity = String(location?.city || '').toLowerCase().trim();
  const rawAddr = String(location?.address || '').toLowerCase();

  // Extract 5-digit zip code from zipCode or address field
  const zipMatch = rawZip.match(/\d{5}/) || rawAddr.match(/\b\d{5}\b/);
  const zip = zipMatch ? zipMatch[0] : rawZip;

  let distanceMiles = 0.8;
  let matchedArea = 'Cambridge';

  if (zip && ZIP_COORDINATES[zip]) {
    const data = ZIP_COORDINATES[zip];
    distanceMiles = haversineMiles(KITCHEN_LOCATION.lat, KITCHEN_LOCATION.lon, data.lat, data.lon);
    matchedArea = `${data.city} (${data.name})`;
  } else if (rawCity || rawAddr) {
    let matched = null;
    for (const [key, val] of Object.entries(CITY_FALLBACKS)) {
      if (rawCity.includes(key) || rawAddr.includes(key)) {
        matched = val;
        break;
      }
    }
    if (matched) {
      distanceMiles = matched.dist;
      matchedArea = matched.name;
    } else if (zip.startsWith('021') || zip.startsWith('022')) {
      distanceMiles = 3.5;
      matchedArea = 'Greater Boston (021xx)';
    } else if (zip.startsWith('024')) {
      distanceMiles = 7.5;
      matchedArea = 'MetroWest / Suburbs (024xx)';
    } else if (zip.startsWith('018') || zip.startsWith('019') || zip.startsWith('017') || zip.startsWith('020')) {
      distanceMiles = 13.5;
      matchedArea = 'Outer Massachusetts Region';
    } else if (zip && zip.length === 5) {
      distanceMiles = 22.0;
      matchedArea = 'Extended Regional Radius';
    } else {
      distanceMiles = 0.8;
      matchedArea = 'Cambridge Core';
    }
  }

  const isOutOfRange = distanceMiles > MAX_DELIVERY_DISTANCE_MILES;

  // Determine Daily Rate and Zone based on WooReer table distance tiers
  let dailyRate = 5.00;
  let zoneName = 'Core Radius (0–3 mi)';

  if (distanceMiles <= 3.0) {
    dailyRate = 5.00;
    zoneName = 'Core Radius (0–3 mi)';
  } else if (distanceMiles <= 5.0) {
    dailyRate = 8.00;
    zoneName = 'Inner Metro (3–5 mi)';
  } else if (distanceMiles <= 10.0) {
    dailyRate = 12.00;
    zoneName = 'Outer Metro (5–10 mi)';
  } else if (distanceMiles <= 15.0) {
    dailyRate = 16.00;
    zoneName = 'Suburban Ring (10–15 mi)';
  } else {
    // Beyond 15 Miles -> Not deliverable
    dailyRate = 0.00;
    zoneName = 'Beyond 15-Mile Delivery Limit';
  }

  return {
    distanceMiles,
    dailyRate,
    zoneName,
    matchedArea,
    isOutOfRange,
    maxDistance: MAX_DELIVERY_DISTANCE_MILES
  };
}

/**
 * Calculates total delivery fee based on cart items, delivery mode, and customer address/distance
 */
export function calculateDeliveryFee(
  cart: CartItem[],
  deliveryMode: 'pickup' | 'delivery',
  location?: DeliveryLocation
): DeliveryCalculationResult {
  if (deliveryMode === 'pickup') {
    return {
      deliveryFee: 0.00,
      totalDeliveryDays: 0,
      breakdownText: 'Store Pick-up (Free)',
      dailyRate: 0.00,
      distanceMiles: 0.0,
      zoneName: 'Store Pick-up (1001 Mass Ave, Cambridge)',
      matchedArea: 'Kitchen Counter',
      isOutOfRange: false,
      maxDistance: MAX_DELIVERY_DISTANCE_MILES
    };
  }

  const { distanceMiles, dailyRate, zoneName, matchedArea, isOutOfRange } = getDistanceAndRate(location);

  if (isOutOfRange) {
    return {
      deliveryFee: 0.00,
      totalDeliveryDays: 0,
      breakdownText: `Outside 15-Mile Delivery Limit (${distanceMiles} mi from Cambridge kitchen)`,
      dailyRate: 0.00,
      distanceMiles,
      zoneName,
      matchedArea,
      isOutOfRange: true,
      maxDistance: MAX_DELIVERY_DISTANCE_MILES
    };
  }

  if (!cart || cart.length === 0) {
    return {
      deliveryFee: 0.00,
      totalDeliveryDays: 0,
      breakdownText: '$0.00',
      dailyRate,
      distanceMiles,
      zoneName,
      matchedArea,
      isOutOfRange: false,
      maxDistance: MAX_DELIVERY_DISTANCE_MILES
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

    // Check if this product is a Meal Plan (e.g., 2, 3, 4, 5, 7 Days Meal)
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
      breakdownParts.push(`Daily Delight (1 Delivery: $${dailyRate.toFixed(2)})`);
    } else if (days > 0) {
      if (isMealPlan) {
        // MEAL PLANS: 1 scheduled delivery charge per meal plan package based on distance tier
        totalDeliveryDays += 1;
        breakdownParts.push(`${days} Days Meal Plan (1 Scheduled Delivery: $${dailyRate.toFixed(2)})`);
      } else {
        // TIFFIN SUBSCRIPTIONS: Delivery charge multiplied by plan days × quantity
        const planDaysTotal = days * itemQty;
        totalDeliveryDays += planDaysTotal;
        breakdownParts.push(
          `${days} Days Tiffin (${planDaysTotal} Deliveries @ $${dailyRate.toFixed(2)}/day = $${(
            planDaysTotal * dailyRate
          ).toFixed(2)})`
        );
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
    breakdownParts.push(`Standard Delivery ($${dailyRate.toFixed(2)})`);
  }

  const finalCost = totalDeliveryDays * dailyRate;

  return {
    deliveryFee: finalCost,
    totalDeliveryDays,
    breakdownText: breakdownParts.join(' + ') || `$${finalCost.toFixed(2)}`,
    dailyRate,
    distanceMiles,
    zoneName,
    matchedArea,
    isOutOfRange: false,
    maxDistance: MAX_DELIVERY_DISTANCE_MILES
  };
}
