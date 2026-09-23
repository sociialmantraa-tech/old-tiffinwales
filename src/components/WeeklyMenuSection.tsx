'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WEEKLY_MENU_SCHEDULE } from '@/lib/fallback-data';
import { Calendar, Utensils, Sparkles, Check, ArrowRight } from 'lucide-react';
import styles from './WeeklyMenuSection.module.css';

export const WeeklyMenuSection = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const currentDaySchedule = WEEKLY_MENU_SCHEDULE.find((d) => d.day === selectedDay) || WEEKLY_MENU_SCHEDULE[0];

  return (
    <section id="weekly-menu" className={`tw-section ${styles.section}`}>
      <div className="tw-container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag">
            <Calendar size={14} />
            <span>Fresh Daily Rotation</span>
          </div>
          <h2 className="section-title">Explore Our Weekly Menu</h2>
          <p className="section-subtitle">
            Every single day brings exciting homestyle Indian flavors. Freshly prepared with traditional recipes, 
            tender slow-cooked meats, and garden-fresh vegetables.
          </p>
        </div>

        {/* Day Pills Carousel */}
        <div className={styles.daySelector}>
          {WEEKLY_MENU_SCHEDULE.map((item) => (
            <button
              key={item.day}
              className={`${styles.dayBtn} ${selectedDay === item.day ? styles.activeDay : ''}`}
              onClick={() => setSelectedDay(item.day)}
            >
              <span className={styles.dayName}>{item.day}</span>
              <span className={styles.daySub}>Fresh Menu</span>
            </button>
          ))}
        </div>

        {/* Menu Showcase Grid */}
        <div className={styles.menuContainer}>
          {/* Veg Card */}
          <div className={styles.menuCard}>
            <div className={styles.menuCardHeader}>
              <div className={styles.cardBadgeVeg}>
                <span className="badge-veg"></span>
                <span>Vegetarian Delights</span>
              </div>
              <span className={styles.tagDay}>{selectedDay} Special</span>
            </div>

            <div className={styles.dishList}>
              <div className={styles.dishItem}>
                <div className={styles.dishBullet}>1</div>
                <div>
                  <h4 className={styles.dishName}>{currentDaySchedule.veg.dish1}</h4>
                  <p className={styles.dishDesc}>Rich homestyle preparation with fragrant whole spices</p>
                </div>
              </div>

              <div className={styles.dishItem}>
                <div className={styles.dishBullet}>2</div>
                <div>
                  <h4 className={styles.dishName}>{currentDaySchedule.veg.dish2}</h4>
                  <p className={styles.dishDesc}>Slow cooked with fresh herbs, ginger and green chilies</p>
                </div>
              </div>

              <div className={styles.inclusionsBox}>
                <span className={styles.incTitle}>Includes with Meal:</span>
                <ul className={styles.incList}>
                  <li><Check size={14} className={styles.checkIcon} /> {currentDaySchedule.veg.bread}</li>
                  <li><Check size={14} className={styles.checkIcon} /> {currentDaySchedule.veg.rice}</li>
                  <li><Check size={14} className={styles.checkIcon} /> {currentDaySchedule.veg.salad}</li>
                  <li><Check size={14} className={styles.checkIcon} /> Chef&apos;s Tangy Mint &amp; Coriander Chutney</li>
                </ul>
              </div>
            </div>

            <Link href="/tiffin" className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>
              <span>Order {selectedDay} Veg Meal</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Non-Veg Card */}
          <div className={styles.menuCard}>
            <div className={styles.menuCardHeader}>
              <div className={styles.cardBadgeNonVeg}>
                <span className="badge-nonveg"></span>
                <span>Non-Veg Specials</span>
              </div>
              <span className={styles.tagDay}>{selectedDay} Special</span>
            </div>

            <div className={styles.dishList}>
              <div className={styles.dishItem}>
                <div className={styles.dishBullet}>1</div>
                <div>
                  <h4 className={styles.dishName}>{currentDaySchedule.nonVeg.dish1}</h4>
                  <p className={styles.dishDesc}>Tender premium meat marinated in yogurt and roasted spices</p>
                </div>
              </div>

              <div className={styles.dishItem}>
                <div className={styles.dishBullet}>2</div>
                <div>
                  <h4 className={styles.dishName}>{currentDaySchedule.nonVeg.dish2}</h4>
                  <p className={styles.dishDesc}>Hearty homestyle lentils/sabzi to balance your meal</p>
                </div>
              </div>

              <div className={styles.inclusionsBox}>
                <span className={styles.incTitle}>Includes with Meal:</span>
                <ul className={styles.incList}>
                  <li><Check size={14} className={styles.checkIcon} /> {currentDaySchedule.nonVeg.bread}</li>
                  <li><Check size={14} className={styles.checkIcon} /> {currentDaySchedule.nonVeg.rice}</li>
                  <li><Check size={14} className={styles.checkIcon} /> {currentDaySchedule.nonVeg.salad}</li>
                  <li><Check size={14} className={styles.checkIcon} /> Chef&apos;s Signature Gravy &amp; Pickles</li>
                </ul>
              </div>
            </div>

            <Link href="/tiffin" className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>
              <span>Order {selectedDay} Non-Veg Meal</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
