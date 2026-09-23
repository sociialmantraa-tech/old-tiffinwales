import React from 'react';
import { CalendarCheck, Utensils, Truck, Heart, ArrowRight } from 'lucide-react';
import styles from './HowItWorks.module.css';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose Your Plan',
      sub: 'DAILY, WEEKLY OR MONTHLY',
      desc: 'Pick from flexible 2, 3, 4, 5, or 7-day meal packs, or our cost-saving 30-day monthly subscription.',
      icon: <CalendarCheck size={28} />
    },
    {
      num: '02',
      title: 'Customize Your Meal',
      sub: 'PICK YOUR FAVORITE',
      desc: 'Choose Vegetarian, Non-Vegetarian, or mixed options. Select your spice level and bread preference (Naan or Rotis).',
      icon: <Utensils size={28} />
    },
    {
      num: '03',
      title: 'Pickup or Delivery',
      sub: "WE'VE GOT YOU COVERED",
      desc: 'Free pickup at 1001 Massachusetts Ave, Cambridge, or guaranteed warm delivery to your door across Boston & Cambridge.',
      icon: <Truck size={28} />
    },
    {
      num: '04',
      title: 'Enjoy Fresh Homestyle Meal',
      sub: 'TASTE THE DIFFERENCE',
      desc: 'Open your hot, fresh tiffin tray. 100% homestyle nutrition, authentic spices, and zero preservative guilt.',
      icon: <Heart size={28} />
    }
  ];

  return (
    <section className={`tw-section ${styles.section}`}>
      {/* Background Floating Spices */}
      <img
        src="/elements/coriander-clean.png"
        alt="Fresh Herb"
        className={`${styles.bgElement} ${styles.bgTopRight}`}
      />
      <img
        src="/elements/red-chili-clean.png"
        alt="Spicy Chili"
        className={`${styles.bgElement} ${styles.bgBottomLeft}`}
      />

      <div className="tw-container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>Easy 4-Step Process</div>
          <h2 className={styles.sectionTitle}>How TiffinWales Works</h2>
          <p className={styles.sectionSubtitle}>
            Say goodbye to grocery shopping, chopping, and cooking chores. Wholesome Indian dining is now effortless.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.stepCard}>
              <div className={styles.stepTopRow}>
                <div className={styles.iconWrapper}>{step.icon}</div>
                <span className={styles.stepNum}>{step.num}</span>
              </div>
              <span className={styles.stepSub}>{step.sub}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
