'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './NavigationProgressBar.module.css';

export const NavigationProgressBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Finish loading animation when path changes
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept internal link clicks to trigger top loading progress bar immediately
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href && target.href.startsWith(window.location.origin)) {
        const url = new URL(target.href);
        if (url.pathname !== window.location.pathname) {
          setIsLoading(true);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className={styles.topProgressTrack}>
      <div className={styles.topProgressBar}></div>
    </div>
  );
};
