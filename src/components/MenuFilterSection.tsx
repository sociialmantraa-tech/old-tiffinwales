'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Plus, Sparkles, Check, ChevronDown } from 'lucide-react';
import styles from './MenuFilterSection.module.css';

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

interface MenuFilterSectionProps {
  initialProducts: Product[];
  hideHeader?: boolean;
  initialDisplayCount?: number;
  pageSize?: number;
}

export const MenuFilterSection: React.FC<MenuFilterSectionProps> = ({
  initialProducts,
  hideHeader = false,
  initialDisplayCount = 4,
  pageSize = 4,
}) => {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const paramCategory = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedItemIds, setAddedItemIds] = useState<Record<number, boolean>>({});
  const [visibleCount, setVisibleCount] = useState<number>(initialDisplayCount);

  useEffect(() => {
    if (paramCategory) {
      setSelectedCategory(paramCategory);
    }
  }, [paramCategory]);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCount(initialDisplayCount);
  }, [selectedCategory, searchQuery, initialDisplayCount]);

  // Filter out the pure subscription packages from a la carte extras
  const aLaCarteProducts = initialProducts.filter((p) => !p.slug.includes('days-meal'));

  const categories = [
    'All',
    'Veg',
    'Non-Veg',
    'Breads',
    'Samosa',
    'Mango Lassi',
    'Desserts'
  ];

  const filteredProducts = aLaCarteProducts.filter((product) => {
    // Category match
    let matchesCategory = true;
    if (selectedCategory === 'Veg') {
      matchesCategory = product.isVeg;
    } else if (selectedCategory === 'Non-Veg') {
      matchesCategory = !product.isVeg;
    } else if (selectedCategory === 'Breads') {
      matchesCategory = product.categories.some(c => c.toLowerCase().includes('bread')) || 
                        product.name.toLowerCase().includes('roti') || 
                        product.name.toLowerCase().includes('naan') || 
                        product.name.toLowerCase().includes('paratha');
    } else if (selectedCategory === 'Samosa') {
      matchesCategory = product.name.toLowerCase().includes('samosa');
    } else if (selectedCategory === 'Mango Lassi') {
      matchesCategory = product.name.toLowerCase().includes('lassi');
    } else if (selectedCategory === 'Desserts') {
      matchesCategory = product.categories.some(c => c.toLowerCase().includes('dessert'));
    }

    // Search query match
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch = product.name.toLowerCase().includes(q) || 
                      product.description.toLowerCase().includes(q) ||
                      product.categories.some(c => c.toLowerCase().includes(q));
    }

    return matchesCategory && matchesSearch;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + pageSize);
  };

  const handleQuickAdd = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.primaryImage,
      isMealPlan: false,
    });

    // Temporary added state for button
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="menu-extras" className={`tw-section ${styles.section}`}>
      <div className="tw-container">
        {/* Header (optional) */}
        {!hideHeader && (
          <div className="section-header">
            <div className="section-tag">
              <Sparkles size={14} />
              <span>Order Extras</span>
            </div>
            <h2 className="section-title">Order Extras, Breads &amp; Curries</h2>
            <p className="section-subtitle">
              Complement your tiffin with fresh tandoori breads, crispy samosas, rich slow-cooked curries, 
              and chilled Alphonso mango lassi.
            </p>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search curries, breads, appetizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.categoryPills}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.catPill} ${selectedCategory === cat ? styles.activeCatPill : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className={styles.productsGrid}>
          {filteredProducts.length === 0 ? (
            <div className={styles.noResults}>
              <p>No dishes found matching your selection.</p>
              <button
                className="btn-outline btn-sm"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            displayedProducts.map((product) => {
              const isAdded = addedItemIds[product.id];

              return (
                <div key={product.id} className={styles.productCard}>
                  {/* Image & Diet Badge */}
                  <div className={styles.imageContainer}>
                    <img
                      src={product.primaryImage}
                      alt={product.name}
                      className={styles.productImg}
                      loading="lazy"
                    />
                    <div className={styles.dietBadgeWrapper}>
                      <span className={product.isVeg ? 'badge-veg' : 'badge-nonveg'}></span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className={styles.productInfo}>
                    <div className={styles.titlePriceRow}>
                      <h3 className={styles.productTitle}>
                        <Link href={`/product/${product.slug}`}>{cleanText(product.name)}</Link>
                      </h3>
                      <span className={styles.priceTag}>${product.price.toFixed(2)}</span>
                    </div>

                    <p className={styles.productDesc}>
                      {cleanText(product.shortDescription || product.description) || 'Authentic homestyle preparation with rich Indian spices.'}
                    </p>

                    <div className={styles.cardBottomRow}>
                      <span className={styles.categoryLabel}>
                        {cleanText(product.categories[0]) || 'Speciality'}
                      </span>
                      <button
                        className={`${styles.addBtn} ${isAdded ? styles.addedBtn : ''}`}
                        onClick={() => handleQuickAdd(product)}
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More Button & Status */}
        {filteredProducts.length > 0 && (
          <div className={styles.loadMoreWrapper}>
            {hasMore ? (
              <div className={styles.loadMoreAction}>
                <button
                  type="button"
                  className={styles.loadMoreBtn}
                  onClick={handleLoadMore}
                >
                  <span>Load More Products</span>
                  <ChevronDown size={17} className={styles.loadMoreIcon} />
                </button>
                <span className={styles.loadMoreCount}>
                  Showing {displayedProducts.length} of {filteredProducts.length} products
                </span>
              </div>
            ) : filteredProducts.length > initialDisplayCount ? (
              <div className={styles.allLoadedNotice}>
                <span className={styles.allLoadedBadge}>✓ You've viewed all {filteredProducts.length} products</span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
};
