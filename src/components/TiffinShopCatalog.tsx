'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { Search, ArrowRight } from 'lucide-react';
import styles from './TiffinShopCatalog.module.css';

interface TiffinShopCatalogProps {
  initialProducts: Product[];
}

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

// Exact WooCommerce product order on tiffinwales.com/tiffin/
const EXACT_WC_ORDER = [
  '2-days-meal',
  '3-days-meal',
  '4-days-meal',
  '5-days-meal',
  '7-days-meal',
  'aloo-gobi',
  'aloo-jeera',
  'aloo-methi',
  'bhindi-masala',
  'chana-masala',
  'dal-makhani',
  'kadhai-paneer',
  'malai-kofta',
  'matar-paneer',
  'punjabi-kadhai-pakora',
  'shahi-paneer',
  'chili-paneer',
  'butter-chicken',
  'chicken-achari-curry',
  'chicken-dhaniwal-korma',
  'chicken-kadhai',
  'chicken-madras',
  'chilli-chicken',
  'goat-achari-curry',
  'lamb-achari-curry',
  'lamb-bhuna-gosht',
  'lamb-kadhai',
  'shrimp-kadhai',
  'tandoori-roti',
  'naan',
  'paratha',
  'samosa',
  'mango-lassi',
  'veg-tiffin',
  'non-veg',
  'veg-non-veg-tiffin',
];

export const TiffinShopCatalog: React.FC<TiffinShopCatalogProps> = ({ initialProducts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [displayCount, setDisplayCount] = useState<number>(12);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Tiffins & Meals' },
    { id: 'meal-plans', label: '🍱 Meal Plans (2–7 Days)' },
    { id: 'veg', label: '🥗 Veg' },
    { id: 'non-veg', label: '🍗 Non-Veg' },
    { id: 'breads', label: '🫓 Breads' },
    { id: 'extras', label: '🥤 Beverages & Snacks' },
  ];

  // Sort initially by the exact WooCommerce product order from tiffinwales.com
  const sortedInitial = useMemo(() => {
    const list = [...initialProducts];
    return list.sort((a, b) => {
      const idxA = EXACT_WC_ORDER.indexOf(a.slug);
      const idxB = EXACT_WC_ORDER.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }, [initialProducts]);

  // Filtering
  const filtered = useMemo(() => {
    return sortedInitial.filter((p) => {
      // Category Match
      let catMatch = true;
      if (selectedCategory === 'meal-plans') {
        catMatch = p.isMealPlan || p.slug.includes('days-meal') || p.slug.includes('tiffin') || p.slug === 'non-veg';
      } else if (selectedCategory === 'veg') {
        catMatch = p.isVeg;
      } else if (selectedCategory === 'non-veg') {
        catMatch = !p.isVeg;
      } else if (selectedCategory === 'breads') {
        catMatch =
          p.categories.some((c) => c.toLowerCase().includes('bread')) ||
          p.name.toLowerCase().includes('roti') ||
          p.name.toLowerCase().includes('naan') ||
          p.name.toLowerCase().includes('paratha');
      } else if (selectedCategory === 'extras') {
        catMatch =
          p.categories.some((c) => c.toLowerCase().includes('dessert') || c.toLowerCase().includes('snack')) ||
          p.name.toLowerCase().includes('lassi') ||
          p.name.toLowerCase().includes('samosa');
      }

      // Search Match
      let searchMatch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        searchMatch =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q));
      }

      return catMatch && searchMatch;
    });
  }, [sortedInitial, selectedCategory, searchQuery]);

  // Sorting
  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-az') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filtered, sortBy]);

  const displayed = sorted.slice(0, displayCount);
  const hasMore = displayCount < sorted.length;

  return (
    <div className={styles.pageWrap}>
      {/* 1. Official Breadcrumb Area (Matches Merida theme on tiffinwales.com exactly) */}
      <div className={styles.breadcroumbArea}>
        <div className={styles.container}>
          <div className={styles.breadcroumbRow}>
            <div className={styles.breadcroumbContent}>
              <h1 className={styles.breadcumbTitle}>Tiffin</h1>
            </div>
            <div className={styles.breSub}>
              <Link href="/" className={styles.breHome}>
                Tiffin Wales
              </Link>
              <span className={styles.breSep}>&gt;</span>
              <span className={styles.breCurrent}>Tiffin</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Shop Catalog Content */}
      <main className={styles.mainContainer}>
        {/* Category Filters Bar */}
        <div className={styles.categoryBar}>
          <div className={styles.categoryPills}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.catPill} ${selectedCategory === cat.id ? styles.activeCatPill : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setDisplayCount(12);
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search tiffin meals..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(12);
              }}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Controls Row: Result count & Sorting Dropdown */}
        <div className={styles.controlsRow}>
          <p className={styles.resultCount}>
            Showing 1–{displayed.length} of {sorted.length} results
          </p>

          <div className={styles.sortWrapper}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="default">Default sorting</option>
              <option value="popularity">Sort by popularity</option>
              <option value="rating">Sort by average rating</option>
              <option value="latest">Sort by latest</option>
              <option value="price-low">Sort by price: low to high</option>
              <option value="price-high">Sort by price: high to low</option>
              <option value="name-az">Sort by name: A to Z</option>
            </select>
          </div>
        </div>

        {/* 3. 4-Column Product Grid (Matches WooCommerce .products.columns-4) */}
        {displayed.length === 0 ? (
          <div className={styles.noResults}>
            <p>No tiffin meals found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className={styles.resetBtn}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {displayed.map((product) => {
              const isVariable =
                product.isMealPlan ||
                product.slug.includes('days-meal') ||
                product.slug.includes('tiffin') ||
                product.slug === 'non-veg' ||
                (product.variations && product.variations.length > 0);

              const isFlagship = product.slug === '5-days-meal';

              return (
                <div key={product.id} className={styles.wooSingleItemWrapper}>
                  <div className={styles.productItem}>
                    {/* Image Box */}
                    <div className={styles.productImg}>
                      <Link href={`/product/${product.slug}`} className={styles.imgLink}>
                        <Image
                          src={product.primaryImage || 'https://tiffinwales.com/wp-content/uploads/2026/03/5-day-meal-1.webp'}
                          alt={cleanText(product.name)}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className={styles.wpPostImage}
                        />
                      </Link>

                      {/* Floating Badges */}
                      <div className={styles.badgeWrap}>
                        {isFlagship ? (
                          <span className={styles.flagshipBadge}>⭐ Flagship</span>
                        ) : product.isVeg ? (
                          <span className={styles.vegBadge}>Veg</span>
                        ) : (
                          <span className={styles.nonVegBadge}>Non-Veg</span>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className={styles.productInfo}>
                      <div className={styles.productHolder}>
                        <h2 className={styles.woocommerceLoopProductTitle}>
                          <Link href={`/product/${product.slug}`}>
                            {cleanText(product.name)}
                          </Link>
                        </h2>

                        <div className={styles.productPrice}>
                          <span className={styles.price}>
                            {isVariable ? `From $${product.price.toFixed(2)}` : `$${product.price.toFixed(2)}`}
                          </span>
                        </div>
                      </div>

                      {/* Select Options Button */}
                      <div className={styles.productActions}>
                        <Link
                          href={`/product/${product.slug}`}
                          className={styles.buttonSelectOptions}
                        >
                          <span>Select options</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. Load More / Pagination */}
        {hasMore && (
          <div className={styles.loadMoreWrap}>
            <button
              onClick={() => setDisplayCount((prev) => prev + 12)}
              className={styles.loadMoreBtn}
            >
              Load More Products ({sorted.length - displayCount} remaining)
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
