import React from 'react';
import { Star, Quote, MessageSquareHeart } from 'lucide-react';
import styles from './TestimonialsSection.module.css';

export const TestimonialsSection = () => {
  const reviews = [
    {
      name: 'Priya S.',
      role: 'Boston Resident',
      initials: 'PS',
      text: "The food tastes exactly like home. Being a student, finding authentic flavors that don't break the bank was tough until I discovered TiffinWales.",
      rating: 5,
    },
    {
      name: 'Rahul P.',
      role: 'MIT Student',
      initials: 'RP',
      text: "Best Indian tiffin service in Boston. The menu changes every week so it never gets boring, and the seasoning is always perfectly balanced.",
      rating: 5,
    },
    {
      name: 'Meera K.',
      role: 'Working Professional',
      initials: 'MK',
      text: "Reliable delivery every week. The containers arrive clean, on time, and completely fresh. It has saved me hours of cooking and grocery shopping.",
      rating: 5,
    }
  ];

  return (
    <section className={`tw-section ${styles.section}`}>
      <div className="tw-container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <MessageSquareHeart size={13} />
            <span>TESTIMONIALS</span>
          </div>
          <h2 className={styles.sectionTitle}>What Community Says</h2>
          <p className={styles.sectionSubtitle}>
            Hear from the local families and students who rely on us for their daily meals.
          </p>
        </div>

        <div className={styles.reviewsGrid}>
          {reviews.map((r, i) => (
            <div key={i} className={styles.reviewCard}>
              <div className={styles.cardTop}>
                <div className={styles.stars}>
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} size={14} fill="#ff6413" color="#ff6413" />
                  ))}
                </div>
                <Quote size={18} className={styles.quoteIcon} />
              </div>

              <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>

              <div className={styles.reviewerInfo}>
                <div className={styles.avatarCircle}>{r.initials}</div>
                <div>
                  <h4 className={styles.reviewerName}>{r.name}</h4>
                  <span className={styles.reviewerRole}>{r.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
