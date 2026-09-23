'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ExtraDelightsSection.module.css';

interface AddonCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  link: string;
}

const ADDON_CARDS: AddonCard[] = [
  {
    id: 'veg-speciality',
    title: 'Veg Speciality',
    subtitle: 'Add an extra portion of fresh, home-style veg sabji to make your meal more satisfying.',
    icon: '🥗',
    image: '/addons/veg-speciality.jpg',
    link: '/menu?category=veg',
  },
  {
    id: 'non-veg-speciality',
    title: 'Non-Veg Speciality',
    subtitle: 'Add some extra flavor to your meal with a serving of freshly prepared non-veg dishes, cooked with authentic spices.',
    icon: '🍗',
    image: '/addons/non-veg-speciality.jpg',
    link: '/menu?category=non-veg',
  },
  {
    id: 'breads',
    title: 'Breads',
    subtitle: 'Add some Extra rotis, naan, parathas, and freshly prepared Indian breads served hot.',
    icon: '🫓',
    image: '/addons/breads.jpg',
    link: '/menu?category=breads',
  },
  {
    id: 'mango-lassi',
    title: 'Mango Lassi',
    subtitle: 'Add some extra refreshment to your tiffin with our rich and creamy Mango Lassi, made fresh for the perfect meal pairing.',
    icon: '🥤',
    image: '/addons/mango-lassi.webp',
    link: '/menu?category=beverages',
  },
  {
    id: 'samosa',
    title: 'Samosa',
    subtitle: 'Add some extra crunch with freshly made samosas, crispy on the outside and packed with flavorful filling.',
    icon: '😋',
    image: '/addons/samosa.webp',
    link: '/menu?category=snacks',
  },
];

export const ExtraDelightsSection: React.FC = () => {
  return (
    <section className={styles.section} id="extra-delights">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.heading}>
          <span className={styles.subtitle}>EXTRA DELIGHTS</span>
          <h2 className={styles.title}>Perfect Add-Ons for Every Meal</h2>
          <p className={styles.description}>
            Enhance your tiffin with delicious add-ons available separately. Choose from extra sabji, non-veg dishes, snacks, beverages, and more to complete your meal.
          </p>
        </div>

        {/* 5-Card Grid */}
        <div className={styles.grid}>
          {ADDON_CARDS.map((card) => (
            <Link
              key={card.id}
              href={card.link}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  className={styles.cardImage}
                />
                <div className={styles.cardOverlay}>
                  <span className={styles.icon}>{card.icon}</span>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardSubtitle}>{card.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
