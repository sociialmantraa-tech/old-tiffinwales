import React from 'react';
import styles from './loading.module.css';

export default function GlobalLoading() {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContainer}>
        {/* Animated Branded Logo Ring */}
        <div className={styles.logoWrapper}>
          <div className={styles.outerSpinRing}></div>
          <div className={styles.pulseGlow}></div>
          <img
            src="/logo.png"
            alt="Tiffin Wales Loading"
            className={styles.brandLogo}
          />
        </div>

        {/* Loading Text & Progress Bar */}
        <div className={styles.textGroup}>
          <h3 className={styles.loadingTitle}>TIFFIN WALES</h3>
          <p className={styles.loadingSubtitle}>Cooking &amp; Preparing Fresh Homestyle Meals...</p>

          <div className={styles.progressBarWrapper}>
            <div className={styles.progressBarFill}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
