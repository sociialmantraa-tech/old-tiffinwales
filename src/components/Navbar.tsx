'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Search, 
  Home, 
  UtensilsCrossed, 
  Sparkles, 
  CalendarDays, 
  Heart, 
  PhoneCall, 
  ChevronRight, 
  ChevronDown, 
  LayoutDashboard,
  Utensils,
  Flame,
  Receipt
} from 'lucide-react';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, subscription } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'HOME', href: '/', icon: Home },
    { name: 'TIFFIN', href: '/tiffin', icon: UtensilsCrossed },
    { 
      name: 'ORDER EXTRAS', 
      href: '/menu', 
      icon: Sparkles,
      children: [
        { name: 'VEG', href: '/menu?category=Veg', icon: Utensils },
        { name: 'NON-VEG', href: '/menu?category=Non-Veg', icon: Flame },
        { name: 'BREADS', href: '/menu?category=Breads', icon: UtensilsCrossed },
        { name: 'SAMOSA', href: '/menu?category=Samosa', icon: Sparkles },
        { name: 'MANGO LASSI', href: '/menu?category=Mango+Lassi', icon: Heart },
      ]
    },
    { name: 'WEEKLY MENU', href: '/#weekly-menu', icon: CalendarDays },
    { 
      name: 'ACCOUNT', 
      href: '/account', 
      icon: User,
      children: [
        { name: 'My Account', href: '/account', icon: LayoutDashboard },
        { name: 'Order History', href: '/account', icon: Receipt },
        { name: 'Contact Us', href: '/contact', icon: PhoneCall },
      ]
    },
    { name: 'ABOUT', href: '/about', icon: Heart },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`tw-container ${styles.navbar}`}>
        {/* Authentic Brand Logo matching uploaded WordPress media */}
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.png"
            alt="Tiffin Wales Logo"
            width={52}
            height={52}
            className={styles.logoImage}
            priority
          />
          <span className={styles.logoTitle}>TIFFIN WALES</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={styles.navMenu}>
          {navLinks.map((link) => {
            if (link.children) {
              const isChildActive = link.children.some((child) => pathname === child.href) || pathname === link.href;
              return (
                <div key={link.name} className={styles.navDropdownWrap}>
                  <Link
                    href={link.href}
                    className={`${styles.navLink} ${styles.dropdownTrigger} ${isChildActive ? styles.active : ''}`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown size={14} className={styles.dropdownChevron} />
                  </Link>
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownInner}>
                      {link.children.map((child) => {
                        const ChildIcon = child.icon;
                        const isCurrent = pathname === child.href;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`${styles.dropdownItem} ${isCurrent ? styles.dropdownItemActive : ''}`}
                          >
                            <ChildIcon size={15} className={styles.dropdownItemIcon} />
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className={styles.headerActions}>
          <Link href="/menu" className={styles.iconBtn} aria-label="Search Menu" title="Search Dishes">
            <Search size={19} />
          </Link>

          <Link href="/account" className={`${styles.iconBtn} ${styles.desktopAccountBtn}`} aria-label="Account" title="My Account">
            <User size={19} />
            {subscription && subscription.status === 'active' && (
              <span className={styles.accountBadge}>
                {subscription.remainingDays}d
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className={styles.cartBtn}
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 ? (
              <span className={styles.cartBadge}>{cartCount}</span>
            ) : (
              <span className={styles.cartBadgeZero}>0</span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.hamburgerBtn}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Floating Compact Half-Height Card */}
      {mobileMenuOpen && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className={styles.mobileDrawer}>
            <div className={styles.drawerHeader}>
              <div className={styles.headerTitleWrap}>
                <span className={styles.headerDot} />
                <span className={styles.drawerTitle}>Quick Navigation</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={styles.closeDrawerBtn}
                aria-label="Close Menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.mobileNavLinks}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isDirectActive = pathname === link.href;
                const isAnyActive = link.children ? link.children.some(c => pathname === c.href) || isDirectActive : isDirectActive;

                if (link.children) {
                  return (
                    <div key={link.name} className={styles.mobileDropdownGroup}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`${styles.mobileNavLink} ${isAnyActive ? styles.mobileActive : ''}`}
                      >
                        <div className={styles.navLinkContent}>
                          <Icon size={17} className={styles.navLinkIcon} />
                          <span>{link.name}</span>
                        </div>
                        {subscription && subscription.status === 'active' ? (
                          <span className={styles.mobileSubBadge}>
                            {subscription.remainingDays}d
                          </span>
                        ) : (
                          <ChevronRight size={15} className={styles.arrowIcon} />
                        )}
                      </Link>
                      <div className={styles.mobileSubLinks}>
                        {link.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`${styles.mobileSubLink} ${isChildActive ? styles.mobileSubActive : ''}`}
                            >
                              <ChildIcon size={13} className={styles.mobileSubIcon} />
                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${styles.mobileNavLink} ${isDirectActive ? styles.mobileActive : ''}`}
                  >
                    <div className={styles.navLinkContent}>
                      <Icon size={17} className={styles.navLinkIcon} />
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight size={15} className={styles.arrowIcon} />
                  </Link>
                );
              })}
            </div>

            <div className={styles.drawerFooter}>
              <div className={styles.footerContact}>
                <p>📍 Cambridge &amp; Boston, MA</p>
                <p>📞 +1 (617) 555-0199</p>
              </div>
              <Link
                href="/tiffin"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{ width: '100%', padding: '10px 14px', fontSize: '0.86rem', marginTop: '6px' }}
              >
                Order Tiffin Now →
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
