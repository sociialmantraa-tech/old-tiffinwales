'use client';

import React from 'react';
import Image from 'next/image';
import styles from './HomeKitchenGallery.module.css';

interface GalleryItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  alt: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'mango-lassi',
    title: 'Mango Lassi',
    desc: 'A wholesome traditional assortment of curries, daal, flatbread, and sides.',
    image: '/gallery/mango-lassi.webp',
    alt: 'Mango Lassi and Traditional Gujarati Thali spread with assorted curries, bread, and rice',
  },
  {
    id: 'paratha',
    title: 'Paratha',
    desc: 'The ultimate comfort food—slow-simmered lentils served with aromatic steamed rice.',
    image: '/gallery/paratha.webp',
    alt: 'Comforting Indian Dal served alongside fluffy white rice',
  },
  {
    id: 'naan',
    title: 'Naan',
    desc: 'Soft cottage cheese cubes folded into rich, perfectly spiced tomato and onion gravy.',
    image: '/gallery/naan.webp',
    alt: 'Rich paneer cottage cheese curry cooked with aromatic spices',
  },
  {
    id: 'samosa',
    title: 'Samosa',
    desc: 'Tender meat slow-cooked in a robust, classic blend of homestyle Indian spices.',
    image: '/gallery/samosa.webp',
    alt: 'Tender chicken pieces cooked in an authentic thick homestyle gravy',
  },
  {
    id: 'fresh-rotis',
    title: 'Fresh Rotis',
    desc: 'Soft, handmade whole wheat flatbreads rolled out daily and served hot.',
    image: '/gallery/rotis.jpg',
    alt: 'Freshly tossed soft and fluffy Indian rotis flatbread',
  },
  {
    id: 'weekly-meal-box',
    title: 'Weekly Meal Box',
    desc: 'Convenient, safely packaged tiffin boxes structured to keep meals fresh for delivery.',
    image: '/gallery/meal-box.jpg',
    alt: 'Neatly packed multi-tier Indian tiffin lunch box container',
  },
];

export const HomeKitchenGallery: React.FC = () => {
  return (
    <section className={styles.gallerySection} id="kitchen-gallery">
      <div className={styles.container}>
        {/* Heading */}
        <div className={styles.heading}>
          <span className={styles.subtitle}>OUR DAILY MENU</span>
          <h2 className={styles.title}>A Glimpse of Our Home Kitchen</h2>
          <p className={styles.desc}>
            Freshly prepared, balanced, and comforting meals crafted daily with authentic recipes.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className={styles.galleryGrid}>
          {GALLERY_ITEMS.map((item) => (
            <div key={item.id} className={styles.galleryItem}>
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={styles.itemImg}
              />
              <div className={styles.overlay}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
