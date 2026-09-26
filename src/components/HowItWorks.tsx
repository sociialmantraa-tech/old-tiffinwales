'use client';

import React from 'react';
import styles from './HowItWorks.module.css';

export const HowItWorks = () => {
  return (
    <section className={styles.howItWorksSection} id="how-it-works">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.heading}>
          <span className={styles.subtitle}>HOW IT WORKS</span>
          <h2 className={styles.title}>How TiffinWales Works</h2>
          <p className={styles.desc}>
            Fresh homemade Indian meals delivered in just a few simple steps.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className={styles.stepsGrid}>
          {/* STEP 1 */}
          <div className={`${styles.stepCard} ${styles.orange}`}>
            <div className={styles.icon}>📅</div>
            <div className={styles.badge}>STEP 1</div>
            <h3 className={styles.stepTitle}>Choose Your Plan</h3>
            <h4 className={styles.stepSub}>DAILY, WEEKLY OR MONTHLY</h4>
            <p className={styles.stepText}>
              Select a meal plan that fits your schedule. Daily, weekly, and monthly options available.
            </p>
          </div>

          {/* STEP 2 */}
          <div className={`${styles.stepCard} ${styles.green}`}>
            <div className={styles.icon}>🍱</div>
            <div className={styles.badge}>STEP 2</div>
            <h3 className={styles.stepTitle}>Select Your Meal</h3>
            <h4 className={styles.stepSub}>PICK YOUR FAVORITE</h4>
            <ul className={styles.stepList}>
              <li>5 Days Meal Plan</li>
              <li>Veg Tiffin</li>
              <li>Non-Veg Tiffin</li>
              <li>Taste The Twist</li>
            </ul>
          </div>

          {/* STEP 3 */}
          <div className={`${styles.stepCard} ${styles.teal}`}>
            <div className={styles.icon}>🚚</div>
            <div className={styles.badge}>STEP 3</div>
            <h3 className={styles.stepTitle}>Pickup or Delivery</h3>
            <h4 className={styles.stepSub}>WE&apos;VE GOT YOU COVERED</h4>
            <p className={styles.stepText}>
              Get fresh meals delivered to your door or pick them up at your convenience.
            </p>
          </div>

          {/* STEP 4 */}
          <div className={`${styles.stepCard} ${styles.blue}`}>
            <div className={styles.icon}>🍽️</div>
            <div className={styles.badge}>STEP 4</div>
            <h3 className={styles.stepTitle}>Enjoy Your Meal</h3>
            <h4 className={styles.stepSub}>TASTE THE DIFFERENCE</h4>
            <p className={styles.stepText}>
              Enjoy authentic homemade meals prepared fresh daily with quality ingredients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
