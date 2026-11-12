'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './HeroSection.module.css';

export const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      {/* Decorative Floating Culinary Elements */}
      <img
        src="/elements/coriander-clean.png"
        alt="Fresh Coriander Herb"
        className={`${styles.bgElement} ${styles.bgCorianderTop}`}
        aria-hidden="true"
      />
      <img
        src="/elements/cardamom-clean.png"
        alt="Cardamom and Black Pepper Spices"
        className={`${styles.bgElement} ${styles.bgCardamomTop}`}
        aria-hidden="true"
      />
      <img
        src="/elements/red-chili-clean.png"
        alt="Indian Red Chili Spice"
        className={`${styles.bgElement} ${styles.bgChiliBottom}`}
        aria-hidden="true"
      />
      <img
        src="/elements/star-anise-clean.png"
        alt="Aromatic Star Anise Spice"
        className={`${styles.bgElement} ${styles.bgStarAnise}`}
        aria-hidden="true"
      />

      <div className={styles.heroContainer}>
        <div className={styles.heroGrid}>
          {/* Left Column: Heading, Subtitle, CTAs & Live Trust Badge */}
          <div className={styles.leftCol}>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleLine}>Indian Tiffin Service in Cambridge</span>
              <span className={`${styles.titleLine} ${styles.highlightCity}`}>Boston, Massachusetts</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Fresh Homemade Indian Meals Delivered Daily across Harvard, MIT, Cambridge &amp; Boston.
            </p>

            {/* Action Buttons */}
            <div className={styles.ctaRow}>
              <Link href="/tiffin" className={styles.heroBtnPrimary}>
                <span>Order Now</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/food-menu" className={styles.heroBtnSecondary}>
                <span>Explore Weekly Menu</span>
              </Link>
            </div>

            {/* Authentic Live Site Trust Badge */}
            <div className={styles.trustBadgeWrapper}>
              <img
                src="/live-trust-badge.png"
                alt="500+ Happy Customers | Daily Delivery | Fresh Homemade Meals | Veg & Non-Veg Options"
                className={styles.trustBadgeImg}
                width={315}
                height={59}
              />
            </div>
          </div>

          {/* Right Column: 100% Uncropped Authentic Tiffin Food Graphic */}
          <div className={styles.rightCol}>
            <div className={styles.heroImageCard}>
              <img
                src="/hero-food-authentic.webp"
                alt="Tiffin Wales Authentic Indian Tiffin Box Meal Service Cambridge Boston"
                className={styles.heroFoodBannerImg}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
