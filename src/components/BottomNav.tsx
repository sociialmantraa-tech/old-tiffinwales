'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Home, UtensilsCrossed, BookOpen, User, ShoppingBag } from 'lucide-react';
import styles from './BottomNav.module.css';

export const BottomNav = () => {
  const pathname = usePathname() || '';
  const { cartCount, isCartOpen, setIsCartOpen, subscription } = useCart();

  // Close cart drawer whenever user changes page/route
  useEffect(() => {
    setIsCartOpen(false);
  }, [pathname, setIsCartOpen]);

  // Normalize path without trailing slash for exact matching
  const cleanPath = pathname ? pathname.replace(/\/$/, '') || '/' : '/';

  const isHomeActive = cleanPath === '/' && !isCartOpen;
  const isTiffinActive = (cleanPath === '/tiffin' || cleanPath.startsWith('/tiffin')) && !isCartOpen;
  const isMenuActive = (cleanPath === '/menu' || cleanPath.startsWith('/menu')) && !isCartOpen;
  const isCartActive = isCartOpen || cleanPath === '/cart';
  const isAccountActive = (cleanPath === '/account' || cleanPath.startsWith('/account')) && !isCartOpen;

  return (
    <nav className={styles.bottomNav} aria-label="Mobile Navigation">
      <div className={styles.navContainer}>
        {/* 1. Home */}
        <Link
          href="/"
          className={`${styles.navItem} ${isHomeActive ? styles.active : ''}`}
          onClick={() => setIsCartOpen(false)}
        >
          <div className={styles.iconWrapper}>
            <Home size={20} />
          </div>
          <span className={styles.navLabel}>Home</span>
        </Link>

        {/* 2. Tiffin Plans */}
        <Link
          href="/tiffin"
          className={`${styles.navItem} ${isTiffinActive ? styles.active : ''}`}
          onClick={() => setIsCartOpen(false)}
        >
          <div className={styles.iconWrapper}>
            <UtensilsCrossed size={20} />
          </div>
          <span className={styles.navLabel}>Tiffin Plans</span>
        </Link>

        {/* 3. Menu */}
        <Link
          href="/menu"
          className={`${styles.navItem} ${isMenuActive ? styles.active : ''}`}
          onClick={() => setIsCartOpen(false)}
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
          className={`${styles.navItem} ${styles.cartItem} ${isCartActive ? styles.active : ''}`}
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

        {/* 5. Account */}
        <Link
          href="/account"
          className={`${styles.navItem} ${isAccountActive ? styles.active : ''}`}
          onClick={() => setIsCartOpen(false)}
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
