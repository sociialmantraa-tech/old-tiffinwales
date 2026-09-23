'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star,
  ChevronRight,
  Sparkles,
  UtensilsCrossed,
  HelpCircle
} from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={`tw-container ${styles.footerContainer}`}>
        {/* Col 1: Brand & Bio */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoGlowRing}>
              <Image
                src="/logo.png"
                alt="Tiffin Wales Logo"
                width={46}
                height={46}
                className={styles.footerLogoImg}
              />
            </div>
            <div className={styles.logoTextWrapper}>
              <span className={styles.logoText}>TIFFIN WALES</span>
              <span className={styles.logoTagline}>Homestyle Indian Meals</span>
            </div>
          </Link>

          <p className={styles.brandDesc}>
            Authentic, homestyle Indian meal delivery serving Cambridge, Harvard, MIT, Boston, and surrounding university quarters. Fresh daily cooking with zero preservatives.
          </p>

          <div className={styles.ratingBadge}>
            <div className={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={styles.starIcon} fill="#ff6413" color="#ff6413" />
              ))}
            </div>
            <span><strong>4.9/5 Rating</strong> • 500+ Happy Diners</span>
          </div>

          <div className={styles.socialRow}>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.socialBtn} ${styles.instagramBtn}`}
              aria-label="Instagram"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
              <span>Instagram</span>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.socialBtn} ${styles.facebookBtn}`}
              aria-label="Facebook"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>

        {/* Col 2: Meal Plans */}
        <div className={styles.linkCol}>
          <h4 className={styles.colTitle}>
            <span className={styles.colTitleDot}></span>
            Meal Plans
          </h4>
          <ul className={styles.linkList}>
            <li>
              <Link href="/tiffin">
                <ChevronRight size={13} className={styles.linkArrow} />
                <span>5 Days Weekly Plan (Popular)</span>
              </Link>
            </li>
            <li>
              <Link href="/tiffin">
                <ChevronRight size={13} className={styles.linkArrow} />
                <span>30 Days Monthly Subscription</span>
              </Link>
            </li>
            <li>
              <Link href="/tiffin">
                <ChevronRight size={13} className={styles.linkArrow} />
                <span>2, 3 &amp; 4 Days Flexi Packs</span>
              </Link>
            </li>
            <li>
              <Link href="/tiffin">
                <ChevronRight size={13} className={styles.linkArrow} />
                <span>Single Day Trial Tiffin</span>
              </Link>
            </li>
            <li>
              <Link href="/tiffin">
                <ChevronRight size={13} className={styles.linkArrow} />
                <span>100% Pure Veg Tiffins</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Links & Information */}
        <div className={styles.linkCol}>
          <h4 className={styles.colTitle}>
            <span className={styles.colTitleDot}></span>
            Quick Links
          </h4>
          <ul className={styles.linkList}>
            <li>
              <Link href="/#weekly-menu">
                <ChevronRight size={13} className={styles.linkArrow} />
                <span>Weekly Rotating Menu</span>
              </Link>
            </li>
            <li>
              <Link href="/menu">
                <ChevronRight size={13} className={styles.linkArrow} />
                <span>Order Extra Dishes &amp; Addons</span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <ChevronRight size={13} className={styles.linkArrow} />
                <span>About Our Homestyle Kitchen</span>
              </Link>
            </li>
            <li>
              <Link href="/#service-areas">
                <ChevronRight size={13} className={styles.linkArrow} />
                <span>Delivery Areas &amp; Zip Codes</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <ChevronRight size={13} className={styles.linkArrow} />
                <span>Contact &amp; Customer Support</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Kitchen Info */}
        <div className={styles.contactCol}>
          <h4 className={styles.colTitle}>
            <span className={styles.colTitleDot}></span>
            Kitchen &amp; Pickup
          </h4>
          
          <div className={styles.contactCard}>
            <div className={styles.contactItem}>
              <div className={styles.contactIconWrap}>
                <MapPin size={16} />
              </div>
              <div>
                <strong>Kitchen &amp; Pickup Counter</strong>
                <p>1001 Massachusetts Ave, Cambridge, MA 02138</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIconWrap}>
                <Clock size={16} />
              </div>
              <div>
                <strong>Operating Hours</strong>
                <p>Mon – Sun: 11:30 AM – 9:30 PM</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIconWrap}>
                <Phone size={16} />
              </div>
              <div>
                <strong>Order Support &amp; WhatsApp</strong>
                <p>+1 (617) 555-0199</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className={styles.bottomBar}>
        <div className={`tw-container ${styles.bottomContainer}`}>
          <div className={styles.copyrightText}>
            © {new Date().getFullYear()} <strong>Tiffin Wales</strong>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
