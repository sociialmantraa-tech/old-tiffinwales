import React from 'react';
import styles from './productLoading.module.css';

export default function ProductDetailLoading() {
  return (
    <div className={styles.productLoadingPage}>
      <div className="tw-container">
        {/* Breadcrumb Skeleton */}
        <div className={styles.skeletonBreadcrumb}></div>

        {/* Product Grid Skeleton */}
        <div className={styles.skeletonGrid}>
          {/* Left: Image Skeleton */}
          <div className={styles.skeletonImageCol}>
            <div className={styles.skeletonMainImage}>
              <div className={styles.shimmerEffect}></div>
              <div className={styles.centerBadge}>
                <div className={styles.spinner}></div>
                <span>Loading Tiffin Details...</span>
              </div>
            </div>
          </div>

          {/* Right: Details Skeleton */}
          <div className={styles.skeletonDetailsCol}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonPrice}></div>
            
            {/* Top Box Skeleton */}
            <div className={styles.skeletonTopBox}>
              <div className={styles.skeletonSelect}></div>
              <div className={styles.skeletonSelect}></div>
            </div>

            {/* Banner Skeleton */}
            <div className={styles.skeletonBanner}></div>

            {/* Form Stack Skeleton */}
            <div className={styles.skeletonFormStack}>
              <div className={styles.skeletonField}></div>
              <div className={styles.skeletonField}></div>
              <div className={styles.skeletonField}></div>
              <div className={styles.skeletonGridBoxes}></div>
            </div>

            <div className={styles.skeletonButton}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
