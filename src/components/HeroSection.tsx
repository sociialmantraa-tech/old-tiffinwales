'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, MapPin, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Star, Flame } from 'lucide-react';
import { SERVICE_ZIP_CODES } from '@/lib/fallback-data';
import styles from './HeroSection.module.css';

export const HeroSection = () => {
  const [zipInput, setZipInput] = useState('');
  const [zipResult, setZipResult] = useState<{ match: boolean; message: string; zone?: string } | null>(null);

  const handleCheckZip = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = zipInput.trim();
    if (!clean) return;

    const found = SERVICE_ZIP_CODES.find((z) => z.zip === clean);
    if (found) {
      setZipResult({
        match: true,
        message: `Great news! We deliver to ${found.name} (${found.zip}). Mileage delivery rates apply at checkout, or choose 100% Free Store Pick-up!`,
        zone: found.zone,
      });
    } else {
      setZipResult({
        match: false,
        message: `While ${clean} is outside our direct radius, Free Store Pick-up at 1001 Massachusetts Ave is 100% available!`,
      });
    }
  };

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
          <div className={styles.badgePill}>
            <Sparkles size={14} className={styles.badgePillIcon} />
            <span>Cambridge &amp; Boston&apos;s #1 Indian Tiffin Service</span>
          </div>

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
                <Star key={i} size={14} fill="#ff6413" color="#ff6413" />
              ))}
            </div>
            <div className={styles.trustText}>
              <span>
                <strong>4.9/5 Rating</strong> • 500+ Happy Diners in Cambridge &amp; Boston
              </span>
            </div>
          </div>

          {/* Delivery Zone Checker */}
          <div className={styles.zipCheckerCard}>
            <div className={styles.zipTitle}>
              <Truck size={15} />
              <span>Check Delivery to Your Zip Code:</span>
            </div>
            <form onSubmit={handleCheckZip} className={styles.zipForm}>
              <div className={styles.zipInputWrapper}>
                <MapPin size={15} className={styles.zipPin} />
                <input
                  type="text"
                  placeholder="Enter zip (e.g. 02138)"
                  value={zipInput}
                  onChange={(e) => {
                    setZipInput(e.target.value);
                    if (zipResult) setZipResult(null);
                  }}
                  className={styles.zipInput}
                  maxLength={5}
                />
              </div>
              <button type="submit" className={styles.zipBtn}>
                Check Zone
              </button>
            </form>

            {zipResult && (
              <div className={`${styles.zipFeedback} ${zipResult.match ? styles.zipSuccess : styles.zipWarning}`}>
                {zipResult.match ? <CheckCircle2 size={15} /> : <ShieldCheck size={15} />}
                <span>{zipResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hero Food Banner Card with Floating Glass Badges */}
        <div className={styles.rightCol}>
          <div className={styles.heroImageCard}>
            <img
              src="/hero-tiffin-official.webp"
              alt="Tiffin Wales Authentic Indian Tiffin Box Meal Service Cambridge Boston"
              className={styles.heroFoodBannerImg}
            />

            {/* Floating Glassmorphism Badges */}
            <div className={styles.floatingBadgeTop}>
              <span className={styles.badgeEmoji}>⭐</span>
              <div className={styles.badgeInfo}>
                <strong>4.9 / 5 Rating</strong>
                <span>Cambridge &amp; Boston</span>
              </div>
            </div>

            <div className={styles.floatingBadgeBottom}>
              <span className={styles.badgeEmoji}>🔥</span>
              <div className={styles.badgeInfo}>
                <strong>Fresh &amp; Hot Daily</strong>
                <span>Zero Preservatives</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
