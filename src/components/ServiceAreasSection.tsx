import React from 'react';
import { MapPin, Truck, Store, Clock } from 'lucide-react';
import styles from './ServiceAreasSection.module.css';

export const ServiceAreasSection = () => {
  const zones = [
    {
      title: 'Cambridge (Core Service Radius)',
      zips: '02138, 02139, 02140, 02141, 02142',
      neighborhoods: 'Harvard Sq, MIT, Central Sq, Kendall Sq, Porter Sq, Inman Sq',
      badge: 'Daily Delivery'
    },
    {
      title: 'Somerville & Davis Sq',
      zips: '02143, 02144, 02145',
      neighborhoods: 'Davis Square, Union Square, Spring Hill, East Somerville',
      badge: 'Low Flat Fee'
    },
    {
      title: 'Boston & University Quarters',
      zips: '02215, 02115, 02116, 02114, 02111',
      neighborhoods: 'Boston University, Fenway, Northeastern, Back Bay, Downtown',
      badge: 'Daily Express'
    },
    {
      title: 'Allston & Brighton',
      zips: '02134, 02135',
      neighborhoods: 'Harvard Ave, Commonwealth Ave, Cleveland Circle, Oak Square',
      badge: 'Daily Express'
    }
  ];

  return (
    <section className={styles.section} id="service-areas">
      <div className={styles.bgOverlay}></div>
      <div className={`tw-container ${styles.container}`}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <Truck size={14} />
            <span>Delivery Coverage</span>
          </div>
          <h2 className={styles.sectionTitle}>Areas We Proudly Serve</h2>
          <p className={styles.sectionSubtitle}>
            Hot and fresh delivery across Greater Boston and Cambridge, plus convenient in-store pickup.
          </p>
        </div>

        <div className={styles.zonesGrid}>
          {zones.map((zone, idx) => (
            <div key={idx} className={styles.zoneCard}>
              <div className={styles.zoneTop}>
                <MapPin size={20} className={styles.pinIcon} />
                <span className={styles.zoneBadge}>{zone.badge}</span>
              </div>
              <h3 className={styles.zoneTitle}>{zone.title}</h3>
              <p className={styles.zoneNeighborhoods}>{zone.neighborhoods}</p>
              <div className={styles.zipPills}>
                <strong>Zip Codes:</strong> {zone.zips}
              </div>
            </div>
          ))}
        </div>

        {/* Store Pickup Highlight Box */}
        <div className={styles.storePickupCard}>
          <div className={styles.pickupLeft}>
            <div className={styles.storeIconWrapper}>
              <Store size={32} />
            </div>
            <div>
              <span className={styles.pickupTag}>Store Pick-up Available</span>
              <h3 className={styles.pickupAddress}>1001 Massachusetts Ave, Cambridge, MA 02138</h3>
              <p className={styles.pickupHours}>
                <Clock size={16} /> Open: Monday to Sunday • Morning: 11:00 AM – 03:00 PM | Evening: 5:00 PM – 10:00 PM
              </p>
            </div>
          </div>
          <div className={styles.pickupRight}>
            <a
              href="https://maps.google.com/?q=1001+Massachusetts+Ave+Cambridge+MA"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Get Directions ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
