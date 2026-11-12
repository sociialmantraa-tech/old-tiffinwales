'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import styles from './HeroSection.module.css';

export const HeroSection = () => {

  return (
    <section className={styles.heroSection}>
      {/* Decorative Floating Culinary Elements */}
      <img
        src="/elements/coriander-clean.png"
        alt="Fresh Coriander Herb"
        className={`${styles.bgElement} ${styles.bgCorianderTop}`}
      />
      <img
        src="/elements/cardamom-clean.png"
        alt="Cardamom and Black Pepper Spices"
        className={`${styles.bgElement} ${styles.bgCardamomTop}`}
      />
      <img
        src="/elements/red-chili-clean.png"
        alt="Indian Red Chili Spice"
        className={`${styles.bgElement} ${styles.bgChiliBottom}`}
      />
      <img
        src="/elements/star-anise-clean.png"
        alt="Aromatic Star Anise Spice"
        className={`${styles.bgElement} ${styles.bgStarAnise}`}
      />

      <div className={styles.heroGrid}>
        {/* Left Column: Text, CTAs & Delivery Check */}
        <div className={styles.leftCol}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine}>Indian Tiffin Service in</span>
            <span className={`${styles.titleLine} ${styles.highlightCity}`}>Cambridge &amp; Boston</span>
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
            <Link href="/#weekly-menu" className={styles.heroBtnSecondary}>
              <span>Explore Weekly Menu</span>
            </Link>
          </div>

          {/* Social Proof Bar */}
          <div className={styles.trustRow}>
            <div className={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#ff6413" color="#ff6413" />
              ))}
            </div>
            <div className={styles.trustText}>
              <span>
                <strong>4.9/5 Rating</strong> • 500+ Happy Diners
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Food Banner Card */}
        <div className={styles.rightCol}>
          <div className={styles.heroImageCard}>
            <picture className={styles.heroPicture}>
              <source media="(max-width: 768px)" srcSet="/hero-mobile-tiffin.jpg" />
              <img
                src="/hero-tiffin-official.webp"
                alt="Tiffin Wales Authentic Indian Tiffin Box Meal Service Cambridge Boston"
                className={styles.heroFoodBannerImg}
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};
