'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Home, UtensilsCrossed, BookOpen, User, ShoppingBag } from 'lucide-react';
import styles from './BottomNav.module.css';

export const BottomNav = () => {
  const pathname = usePathname();
  const { cartCount, isCartOpen, setIsCartOpen, subscription } = useCart();

  return (
    <nav className={styles.bottomNav} aria-label="Mobile Navigation">
      <div className={styles.navContainer}>
        {/* 1. Home */}
        <Link
          href="/"
          className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}
        >
          <div className={styles.iconWrapper}>
            <Home size={20} />
          </div>
          <span className={styles.navLabel}>Home</span>
        </Link>

        {/* 2. Tiffin Plans */}
        <Link
          href="/tiffin"
          className={`${styles.navItem} ${pathname === '/tiffin' ? styles.active : ''}`}
        >
          <div className={styles.iconWrapper}>
            <UtensilsCrossed size={20} />
          </div>
          <span className={styles.navLabel}>Tiffin Plans</span>
        </Link>

        {/* 3. Menu */}
        <Link
          href="/menu"
          className={`${styles.navItem} ${pathname === '/menu' ? styles.active : ''}`}
        >
          <div className={styles.iconWrapper}>
            <BookOpen size={20} />
          </div>
          <span className={styles.navLabel}>Menu</span>
        </Link>

        {/* 4. Cart Action Button */}
        <button
          type="button"
          onClick={() => setIsCartOpen(!isCartOpen)}
          className={`${styles.navItem} ${styles.cartItem} ${isCartOpen || pathname === '/cart' ? styles.active : ''}`}
          aria-label="View Cart"
        >
          <div className={styles.iconWrapper}>
            <ShoppingBag size={20} />
            {cartCount > 0 ? (
              <span className={styles.cartBadge}>{cartCount}</span>
            ) : (
              <span className={styles.cartBadgeZero}>0</span>
            )}
          </div>
          <span className={styles.navLabel}>Cart</span>
        </button>

        {/* 5. Account (After Cart) */}
        <Link
          href="/account"
          className={`${styles.navItem} ${pathname === '/account' ? styles.active : ''}`}
        >
          <div className={styles.iconWrapper}>
            <User size={20} />
            {subscription && subscription.status === 'active' && (
              <span className={styles.activeDot} />
            )}
          </div>
          <span className={styles.navLabel}>Account</span>
        </Link>
      </div>
    </nav>
  );
};
