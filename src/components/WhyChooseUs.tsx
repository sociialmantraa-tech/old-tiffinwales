'use client';

import React from 'react';
import styles from './WhyChooseUs.module.css';

interface WhyFeature {
  id: string;
  icon: string;
  title: string;
  text: string;
}

const WHY_FEATURES: WhyFeature[] = [
  {
    id: 'home-cooked',
    icon: '🍲',
    title: 'Home-Cooked Taste',
    text: 'Authentic Indian recipes prepared fresh daily, delivering the comfort and flavor of home-cooked meals.',
  },
  {
    id: 'affordable',
    icon: '💰',
    title: 'Affordable Pricing',
    text: 'Enjoy delicious homemade meals at prices that are often lower than restaurant takeout.',
  },
  {
    id: 'fresh-ingredients',
    icon: '🌱',
    title: 'Fresh Ingredients',
    text: 'Prepared with fresh ingredients every day. No frozen meals, no compromises on quality.',
  },
  {
    id: 'reliable-delivery',
    icon: '🚴',
    title: 'Reliable Delivery',
    text: 'Consistent and on-time delivery throughout Boston, Cambridge, and surrounding areas.',
  },
  {
    id: 'menu-rotation',
    icon: '📅',
    title: 'Weekly Menu Rotation',
    text: 'Enjoy a rotating menu every week so your meals remain exciting and varied.',
  },
  {
    id: 'student-friendly',
    icon: '🎓',
    title: 'Student Friendly',
    text: 'Perfect for students at BU, Harvard, MIT, Northeastern and other universities across Massachusetts.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className={styles.whySection} id="why-choose-us">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.heading}>
          <span className={styles.subtitle}>WHY CHOOSE TIFFINWALES</span>
          <h2 className={styles.title}>Why TiffinWales ??</h2>
          <p className={styles.desc}>
            Fresh homemade Indian meals delivered daily across Boston, Cambridge Massachusetts.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className={styles.grid}>
          {WHY_FEATURES.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.icon}>{item.icon}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
