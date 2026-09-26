'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MEAL_PLAN_TIERS } from '@/lib/fallback-data';
import { Check, Truck, Sparkles, ShieldCheck, HeartHandshake, ChevronDown } from 'lucide-react';
import styles from './MealPlansSection.module.css';

interface MealPlansSectionProps {
  hideHeader?: boolean;
  hideSubDetails?: boolean;
  initialDisplayCount?: number;
  pageSize?: number;
  showAll?: boolean;
}

export const MealPlansSection: React.FC<MealPlansSectionProps> = ({
  hideHeader = false,
  hideSubDetails = false,
  initialDisplayCount = 3,
  pageSize = 3,
  showAll = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'veg' | 'non-veg' | 'mix' | 'meal-plans' | 'daily'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(showAll ? 999 : initialDisplayCount);

  const handleFilterChange = (filter: 'all' | 'veg' | 'non-veg' | 'mix' | 'meal-plans' | 'daily') => {
    setActiveFilter(filter);
    setVisibleCount(showAll ? 999 : initialDisplayCount);
  };

  const filteredPlans = MEAL_PLAN_TIERS.filter((plan) => {
    if (activeFilter === 'veg') return plan.dietType === 'veg' || plan.dietType === 'both';
    if (activeFilter === 'non-veg') return plan.dietType === 'non-veg' || plan.dietType === 'both';
    if (activeFilter === 'mix') return plan.dietType === 'mix' || plan.dietType === 'both';
    if (activeFilter === 'meal-plans') return plan.days >= 2 && plan.days <= 7;
    if (activeFilter === 'daily') return plan.days === 1;
    return true;
  });

  const displayedPlans = showAll ? filteredPlans : filteredPlans.slice(0, visibleCount);
  const hasMore = !showAll && visibleCount < filteredPlans.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + pageSize);
  };

  return (
    <section id="meal-plans" className={`tw-section ${styles.section}`}>
      <div className="tw-container">
        {/* Section Header */}
        {!hideHeader && (
          <div className="section-header">
            <div className="section-tag">
              <span>🍱 POPULAR MEAL PLANS</span>
            </div>
            <h2 className="section-title">Meal Plans</h2>
            <p className="section-subtitle">
              Fresh homemade Indian food delivery in Boston, Cambridge &amp; Massachusetts.
            </p>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className={styles.filterTabs}>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'all' ? styles.activeTab : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            <span>All Plans</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'veg' ? styles.activeTab : ''}`}
            onClick={() => handleFilterChange('veg')}
          >
            <span className="badge-veg"></span>
            <span>Veg Plans</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'non-veg' ? styles.activeTab : ''}`}
            onClick={() => handleFilterChange('non-veg')}
          >
            <span className="badge-nonveg"></span>
            <span>Non-Veg Plans</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'mix' ? styles.activeTab : ''}`}
            onClick={() => handleFilterChange('mix')}
          >
            <span className={styles.mixDotIcon}></span>
            <span>Veg &amp; Non-Veg Mix</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'meal-plans' ? styles.activeTab : ''}`}
            onClick={() => handleFilterChange('meal-plans')}
          >
            <span>🍱 2–7 Days Packs</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'daily' ? styles.activeTab : ''}`}
            onClick={() => handleFilterChange('daily')}
          >
            <span>🥗 Single Day</span>
          </button>
        </div>

        {/* User-Friendly Subscription & Plan Guide */}
        <div className={styles.planExplainerBanner}>
          <div className={styles.explainerItem}>
            <span className={styles.explainerIcon}>🍱</span>
            <div>
              <strong>Complete Balanced Thali</strong>
              <p>1 Curry + 1 Dal + 2 Fresh Rotis (or Naan) + Basmati Rice + Salad</p>
            </div>
          </div>
          <div className={styles.explainerDivider}></div>
          <div className={styles.explainerItem}>
            <span className={styles.explainerIcon}>⭐</span>
            <div>
              <strong>Flagship 5-Day Plan ($74.95)</strong>
              <p>Delivered Mon–Fri • Cambridge &amp; Boston Favorite</p>
            </div>
          </div>
          <div className={styles.explainerDivider}></div>
          <div className={styles.explainerItem}>
            <span className={styles.explainerIcon}>📅</span>
            <div>
              <strong>Live Remaining Days Tracking</strong>
              <p>Track remaining days on top of page • Skip or pause anytime</p>
            </div>
          </div>
        </div>

        {/* Cards Grid with Authentic Photos */}
        <div className={styles.cardsGrid}>
          {displayedPlans.map((plan) => {
            const isFlagship = plan.days === 5;

            return (
              <div
                key={plan.id}
                className={`${styles.card} ${isFlagship ? styles.flagshipCard : ''}`}
              >
                {/* Photo on Top */}
                <div className={styles.imageBox}>
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className={styles.cardImg}
                    loading="lazy"
                  />
                  {plan.popular && (
                    <div className={styles.badgeRibbon}>
                      {plan.badge}
                    </div>
                  )}
                  <div className={styles.durationTag}>
                    {plan.days} {plan.days > 1 ? 'Days Meal' : 'Day Meal'}
                  </div>
                </div>

                {/* Card Body */}
                <div className={styles.cardBody}>
                  {/* Dietary Badge */}
                  <div className={styles.dietaryRow}>
                    {plan.dietType === 'veg' && (
                      <span className={styles.dietBadgeVeg}>
                        <span className="badge-veg"></span>
                        <span>100% Pure Veg</span>
                      </span>
                    )}
                    {plan.dietType === 'non-veg' && (
                      <span className={styles.dietBadgeNonVeg}>
                        <span className="badge-nonveg"></span>
                        <span>Authentic Non-Veg</span>
                      </span>
                    )}
                    {plan.dietType === 'mix' && (
                      <span className={styles.dietBadgeMix}>
                        <span className={styles.mixDotIcon}></span>
                        <span>Veg &amp; Non-Veg Combo</span>
                      </span>
                    )}
                    {plan.dietType === 'both' && (
                      <span className={styles.dietBadgeBoth}>
                        <span className="badge-veg"></span>
                        <span className="badge-nonveg"></span>
                        <span>Veg, Non-Veg &amp; Mix</span>
                      </span>
                    )}
                  </div>

                  <div className={styles.priceRow}>
                    <span className={styles.pricePrefix}>From</span>
                    <span className={styles.priceNumber}>${plan.price.toFixed(2)}</span>
                    <span className={styles.pricePerMeal}>
                      (~${(plan.price / plan.days).toFixed(2)} / meal)
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{plan.name}</h3>

                  {/* Quick Inclusions */}
                  <ul className={styles.miniInclusionList}>
                    {plan.inclusions.slice(0, 2).map((inc, i) => (
                      <li key={i}>
                        <Check size={14} className={styles.checkIcon} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Order Button linking to single product page */}
                  <Link
                    href={`/product/${plan.slug}`}
                    className={`btn-primary ${styles.orderButton}`}
                  >
                    <span>
                      {plan.days > 1 ? 'Select & Customize Plan →' : 'Select Tiffin & Order →'}
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button & Status */}
        {filteredPlans.length > 0 && (
          <div className={styles.loadMoreWrapper}>
            {hasMore ? (
              <div className={styles.loadMoreAction}>
                <button
                  type="button"
                  className={styles.loadMoreBtn}
                  onClick={handleLoadMore}
                >
                  <span>Load More Plans</span>
                  <ChevronDown size={17} className={styles.loadMoreIcon} />
                </button>
                <span className={styles.loadMoreCount}>
                  Showing {displayedPlans.length} of {filteredPlans.length} meal plans
                </span>
              </div>
            ) : filteredPlans.length > initialDisplayCount ? (
              <div className={styles.allLoadedNotice}>
                <span className={styles.allLoadedBadge}>✓ You've viewed all {filteredPlans.length} meal plans</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Value Trust Features */}
        <div className={styles.trustGrid}>
          <div className={styles.trustCard}>
            <HeartHandshake size={28} className={styles.trustIcon} />
            <div>
              <h4>Real Homestyle Taste</h4>
              <p>Cooked fresh each day using authentic ground spices and zero artificial additives.</p>
            </div>
          </div>
          <div className={styles.trustCard}>
            <ShieldCheck size={28} className={styles.trustIcon} />
            <div>
              <h4>Remaining Days Tracker</h4>
              <p>Easily track your remaining subscription days, skip meals, or pause anytime.</p>
            </div>
          </div>
          <div className={styles.trustCard}>
            <Truck size={28} className={styles.trustIcon} />
            <div>
              <h4>Cambridge &amp; Boston Delivery</h4>
              <p>Free pickup at 1001 Massachusetts Ave or on-time delivery to dorms and apartments.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
