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

// Exact WooCommerce product order for Tiffins & Meal Plans
const EXACT_WC_ORDER = [
  '2-days-meal',
  '3-days-meal',
  '4-days-meal',
  '5-days-meal',
  '7-days-meal',
  'veg-tiffin',
  'non-veg',
  'veg-non-veg-tiffin',
];

export const TiffinShopCatalog: React.FC<TiffinShopCatalogProps> = ({ initialProducts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [displayCount, setDisplayCount] = useState<number>(12);

  // Categories list tailored strictly for Tiffins & Meal Plans (no extra order products)
  const categories = [
    { id: 'all', label: 'All Tiffins & Plans' },
    { id: 'meal-plans', label: '🍱 2–7 Days Packs' },
    { id: 'daily-tiffin', label: '🥗 Single Day' },
    { id: 'veg', label: '🟢 Veg' },
    { id: 'non-veg', label: '🔴 Non-Veg' },
    { id: 'mix', label: '🟠 Veg & Non-Veg Mix' },
  ];

  // Exclude extra order products (curries, breads, appetizers, desserts) - strictly show Tiffins & Meal Plans
  const tiffinProductsOnly = useMemo(() => {
    return initialProducts.filter(
      (p) =>
        p.isMealPlan ||
        p.categories.includes('Tiffin') ||
        p.categories.includes('Meal') ||
        p.slug.includes('days-meal') ||
        p.slug.includes('tiffin') ||
        p.slug === 'non-veg'
    );
  }, [initialProducts]);

  // Sort initially by the exact WooCommerce product order from tiffinwales.com
  const sortedInitial = useMemo(() => {
    const list = [...tiffinProductsOnly];
    return list.sort((a, b) => {
      const idxA = EXACT_WC_ORDER.indexOf(a.slug);
      const idxB = EXACT_WC_ORDER.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }, [tiffinProductsOnly]);

  // Filtering
  const filtered = useMemo(() => {
    return sortedInitial.filter((p) => {
      // Category Match
      let catMatch = true;
      if (selectedCategory === 'meal-plans') {
        catMatch = p.slug.includes('days-meal');
      } else if (selectedCategory === 'daily-tiffin') {
        catMatch = !p.slug.includes('days-meal');
      } else if (selectedCategory === 'veg') {
        catMatch = p.slug === 'veg-tiffin';
      } else if (selectedCategory === 'non-veg') {
        catMatch = p.slug === 'non-veg';
      } else if (selectedCategory === 'mix') {
        catMatch = p.slug === 'veg-non-veg-tiffin';
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
            {displayed.map((product, index) => {
              const isVariable =
                product.isMealPlan ||
                product.slug.includes('days-meal') ||
                product.slug.includes('tiffin') ||
                product.slug === 'non-veg' ||
                (product.variations && product.variations.length > 0);

              return (
                <div key={product.id} className={styles.wooSingleItemWrapper}>
                  <div className={styles.productItem}>
                    {/* Image Box */}
                    <div className={styles.productImg}>
                      <Link href={`/product/${product.slug}`} className={styles.imgLink}>
                        <img
                          src={product.primaryImage || '/products/5-day-meal-1.webp'}
                          alt={cleanText(product.name)}
                          loading={index < 4 ? 'eager' : 'lazy'}
                          decoding="async"
                          className={styles.wpPostImage}
                        />
                      </Link>
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
