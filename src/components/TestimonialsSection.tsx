'use client';

import React from 'react';
import { Star, Quote, MessageSquareHeart } from 'lucide-react';
import styles from './TestimonialsSection.module.css';

interface Review {
  name: string;
  role: string;
  initials: string;
  text: string;
  rating: number;
  date: string;
}

export const TestimonialsSection: React.FC = () => {
  const reviews: Review[] = [
    {
      name: 'Priya S.',
      role: 'Boston Resident',
      initials: 'PS',
      text: "The food tastes exactly like home. Being a student, finding authentic flavors that don't break the bank was tough until I discovered TiffinWales.",
      rating: 5.0,
      date: 'Verified Order',
    },
    {
      name: 'Rahul P.',
      role: 'MIT Student',
      initials: 'RP',
      text: "Best Indian tiffin service in Boston. The menu changes every week so it never gets boring, and the seasoning is always perfectly balanced.",
      rating: 4.5,
      date: 'Verified Order',
    },
    {
      name: 'Meera K.',
      role: 'Working Professional',
      initials: 'MK',
      text: "Reliable delivery every week. The containers arrive clean, on time, and completely fresh. It has saved me hours of cooking and grocery shopping.",
      rating: 4.0,
      date: 'Verified Order',
    },
  ];

  const renderStarRating = (rating: number) => {
    return (
      <div className={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFull = rating >= starIndex;
          const isHalf = !isFull && rating >= starIndex - 0.5;

          if (isFull) {
            return (
              <Star
                key={starIndex}
                size={14}
                className={styles.starFull}
                fill="#ff6413"
                color="#ff6413"
              />
            );
          }

          if (isHalf) {
            return (
              <span key={starIndex} className={styles.halfStarWrapper}>
                <Star size={14} className={styles.starEmpty} fill="#e5e7eb" color="#e5e7eb" />
                <span className={styles.halfStarOverlay}>
                  <Star size={14} className={styles.starFull} fill="#ff6413" color="#ff6413" />
                </span>
              </span>
            );
          }

          return (
            <Star
              key={starIndex}
              size={14}
              className={styles.starEmpty}
              fill="#e5e7eb"
              color="#e5e7eb"
            />
          );
        })}
        <span className={styles.ratingBadgeNumber}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <section className={`tw-section ${styles.section}`} id="testimonials">
      <div className="tw-container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <MessageSquareHeart size={13} />
            <span>TESTIMONIALS</span>
          </div>
          <h2 className={styles.sectionTitle}>What Community Says</h2>
          <p className={styles.sectionSubtitle}>
            Hear from local families and students who rely on us for their daily meals.
          </p>
        </div>

        {/* 1-Line Reviews Layout for Desktop & Mobile */}
        <div className={styles.reviewsRow}>
          {reviews.map((r, i) => (
            <div key={i} className={styles.reviewCard}>
              <div className={styles.cardTop}>
                {renderStarRating(r.rating)}
                <Quote size={16} className={styles.quoteIcon} />
              </div>

              <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>

              <div className={styles.reviewerInfo}>
                <div className={styles.avatarCircle}>{r.initials}</div>
                <div className={styles.authorMeta}>
                  <h4 className={styles.reviewerName}>{r.name}</h4>
                  <div className={styles.roleRow}>
                    <span className={styles.reviewerRole}>{r.role}</span>
                    <span className={styles.dotSeparator}>•</span>
                    <span className={styles.verifiedTag}>{r.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
