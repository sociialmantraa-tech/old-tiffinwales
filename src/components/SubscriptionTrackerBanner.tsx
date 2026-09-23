'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { MapPin, Phone, Calendar, ArrowRight } from 'lucide-react';
import styles from './SubscriptionTrackerBanner.module.css';

export const SubscriptionTrackerBanner = () => {
  const { subscription } = useCart();

  return (
    <div className={styles.topBanner}>
      <div className={`tw-container ${styles.container}`}>
        <div className={styles.location}>
          <MapPin size={13} className={styles.icon} />
          <span className={styles.desktopAddress}>1001 Massachusetts Ave, Cambridge, MA 02138, United States</span>
          <span className={styles.mobileAddress}>Cambridge &amp; Boston, MA • Authentic Indian Tiffin</span>
        </div>

        <div className={styles.rightSection}>
          {subscription && subscription.status === 'active' ? (
            <Link href="/account" className={styles.subTrackerPill}>
              {subscription.dietType === 'veg' ? (
                <span className="badge-veg" style={{ width: 13, height: 13, transform: 'scale(0.85)' }}></span>
              ) : subscription.dietType === 'non-veg' ? (
                <span className="badge-nonveg" style={{ width: 13, height: 13, transform: 'scale(0.85)' }}></span>
              ) : (
                <span className={styles.greenDot}></span>
              )}
              <span className={styles.planName}>
                {subscription.dietType === 'veg' 
                  ? 'Pure Veg Plan' 
                  : subscription.dietType === 'non-veg' 
                    ? 'Non-Veg Plan' 
                    : 'Veg & Non-Veg Plan'}:
              </span>
              <span className={styles.daysHighlight}>
                {subscription.remainingDays} of {subscription.totalDays} Days Left
              </span>
              <span className={styles.manageText}>Account Dashboard →</span>
            </Link>
          ) : (
            <div className={styles.contactInfo}>
              <Phone size={13} className={styles.icon} />
              <span>Orders &amp; Inquiries: <strong>+1 (617) 555-0199</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
