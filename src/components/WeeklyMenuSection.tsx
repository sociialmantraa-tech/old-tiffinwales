'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { WEEKLY_ROTATION_DATA } from '@/lib/weekly-rotation-data';
import styles from './WeeklyMenuSection.module.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WeeklyMenuSection = () => {
  const [activeCategory, setActiveCategory] = useState<'veg' | 'nonveg' | 'mix'>('veg');
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    name: string;
    image: string;
    x: number;
    y: number;
  }>({
    visible: false,
    name: '',
    image: '',
    x: 0,
    y: 0,
  });

  const handleMouseEnterDish = (e: React.MouseEvent, name: string, image: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      name,
      image,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeaveDish = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const currentWeeks = WEEKLY_ROTATION_DATA[activeCategory] || [];

  return (
    <section className={styles.menuSection} id="weekly-menu">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.heading}>
          <span className={styles.subtitle}>WEEKLY ROTATION</span>
          <h2 className={styles.title}>Explore Our Daily Menus</h2>
          <p className={styles.desc}>Hover over any dish name to see a live preview image!</p>
        </div>

        {/* Category Tabs */}
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabBtn} ${activeCategory === 'veg' ? styles.activeTab : ''}`}
            onClick={() => setActiveCategory('veg')}
          >
            🥦 Veg Menu
          </button>
          <button
            className={`${styles.tabBtn} ${activeCategory === 'nonveg' ? styles.activeTab : ''}`}
            onClick={() => setActiveCategory('nonveg')}
          >
            🍗 Non-Veg Menu
          </button>
          <button
            className={`${styles.tabBtn} ${activeCategory === 'mix' ? styles.activeTab : ''}`}
            onClick={() => setActiveCategory('mix')}
          >
            🍽️ Veg &amp; Non-Veg Mix
          </button>
        </div>

        {/* 4 Weeks Grid */}
        <div className={styles.weeksGrid}>
          {currentWeeks.map((w) => {
            const badgeClass =
              activeCategory === 'veg'
                ? styles.vegBadge
                : activeCategory === 'nonveg'
                ? styles.nonvegBadge
                : styles.mixBadge;

            return (
              <div key={w.week} className={styles.weekCard}>
                <div className={`${styles.weekBadge} ${badgeClass}`}>
                  WEEK {w.week}
                </div>
                <div className={styles.includesText}>
                  Each Tiffin Includes: Roti / Naan, Dal, Sabji, Rice &amp; Salad
                </div>

                <ul className={styles.dayList}>
                  {w.dishes.map(([dishName, dishImg], idx) => (
                    <li key={idx}>
                      <span className={styles.dayName}>{DAY_SHORT[idx]}</span>
                      <span
                        className={styles.dishName}
                        onMouseEnter={(e) => handleMouseEnterDish(e, dishName, dishImg)}
                        onMouseLeave={handleMouseLeaveDish}
                      >
                        {dishName}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Tooltip Component */}
      {tooltip.visible && tooltip.image && (
        <div
          className={styles.tooltip}
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <div className={styles.tooltipImgWrap}>
            <img
              src={tooltip.image}
              alt={tooltip.name}
              className={styles.tooltipImg}
            />
          </div>
          <div className={styles.tooltipLabel}>{tooltip.name}</div>
        </div>
      )}
    </section>
  );
};
