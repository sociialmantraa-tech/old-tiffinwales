import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Sparkles, 
  Utensils, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Truck, 
  Flame, 
  Smile, 
  Award,
  Compass,
  Target
} from 'lucide-react';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import styles from './about.module.css';

export const metadata = {
  title: 'About Tiffin Wales | Authentic Indian Tiffin Service Boston & Cambridge MA',
  description: 'TiffinWales brings fresh, wholesome, homemade Indian meals to students, busy professionals, and families across Boston, Cambridge, and Massachusetts. Learn about our story, kitchen, and mission.',
};

export default function AboutPage() {
  const massachusettsCities = [
    'Boston',
    'Cambridge',
    'Somerville',
    'Brookline',
    'Quincy',
    'Newton',
    'Medford',
    'Malden',
    'Waltham',
    'Watertown',
    'Revere',
    'Arlington',
    'Everett',
    'Chelsea',
    'Milton',
    'Belmont',
    'Melrose',
    'Winthrop'
  ];

  const features = [
    {
      icon: <Utensils size={24} />,
      title: 'Fresh Homemade Meals',
      desc: 'Cooked fresh every morning using authentic ground spices and zero artificial preservatives.'
    },
    {
      icon: <Truck size={24} />,
      title: 'Daily Punctual Delivery',
      desc: 'Reliable doorstep lunch and dinner delivery right to your home, university dorm, or office desk.'
    },
    {
      icon: <Award size={24} />,
      title: 'Affordable Tiffin Plans',
      desc: 'Flexible 5-day, 7-day, 15-day, and 30-day subscription packages with full pause and skip flexibility.'
    },
    {
      icon: <Flame size={24} />,
      title: 'Authentic Indian Taste',
      desc: 'Traditional North Indian, Punjabi, and homestyle recipes crafted by seasoned Indian culinary chefs.'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: '100% Veg & Halal Non-Veg',
      desc: 'Completely dedicated separate kitchen prep and cooking areas for Pure Vegetarian and Halal Non-Veg.'
    },
    {
      icon: <ChefHat size={24} />,
      title: 'Hygienic Kitchen Standards',
      desc: 'Prepared in our certified Cambridge commercial kitchen with stringent daily quality and health checks.'
    }
  ];

  const processSteps = [
    {
      step: '01',
      icon: <Sparkles size={24} />,
      title: '1. Fresh Ingredients',
      desc: 'Hand-picked vegetables, whole wheat, and high-grade spices sourced daily.'
    },
    {
      step: '02',
      icon: <ChefHat size={24} />,
      title: '2. Daily Cooking',
      desc: 'Fresh morning preparation with authentic homestyle recipes and slow dum cooking.'
    },
    {
      step: '03',
      icon: <ShieldCheck size={24} />,
      title: '3. Quality Check',
      desc: 'Strict hygiene packaging and heat-sealed leakproof containers.'
    },
    {
      step: '04',
      icon: <Truck size={24} />,
      title: '4. Fast Delivery',
      desc: 'Punctual doorstep dispatch directly across Cambridge, Boston & surrounding cities.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Happy Active Subscribers' },
    { number: '10,000+', label: 'Fresh Meals Delivered' },
    { number: '7 Days', label: 'Continuous Weekly Service' },
    { number: '18+', label: 'Massachusetts Cities Served' }
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className="tw-container">
          <div className={styles.heroContentCentered}>
            <span className={styles.tagLabel}>ABOUT US</span>
            <h1 className={styles.heroHeading}>
              About <span className={styles.heroHighlight}>TiffinWales</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Bringing Fresh Homemade Indian Meals to Boston, Cambridge &amp; Massachusetts.
            </p>
            <div className={styles.heroBtnsRow}>
              <Link href="/tiffin" className="btn-primary">
                <span>Explore Meal Plans</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/menu" className="btn-outline">
                <span>View Full Menu</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className={styles.sectionBlock}>
        <div className="tw-container">
          <div className={styles.storyContentCentered}>
            <span className={styles.tagLabel}>OUR STORY</span>
            <h2 className={styles.storyTitle}>Authentic Indian Food That Feels Like Home</h2>
            <p className={styles.storyParagraph}>
              TiffinWales was created to help students, busy professionals, and families enjoy fresh, wholesome, homemade Indian meals while living away from home. We understand how much you miss the warmth of home-style cooking, which is why we handle the meal prep, cooking, and delivery for you.
            </p>

            <div className={styles.pillarsGrid}>
              <div className={styles.pillarCard}>
                <CheckCircle2 size={18} className={styles.pillarIcon} />
                <span>Fresh Ingredients</span>
              </div>
              <div className={styles.pillarCard}>
                <CheckCircle2 size={18} className={styles.pillarIcon} />
                <span>Traditional Recipes</span>
              </div>
              <div className={styles.pillarCard}>
                <CheckCircle2 size={18} className={styles.pillarIcon} />
                <span>Daily Morning Cooking</span>
              </div>
              <div className={styles.pillarCard}>
                <CheckCircle2 size={18} className={styles.pillarIcon} />
                <span>Home-Style Purity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION SECTION */}
      <section className={styles.sectionBlockAlt}>
        <div className="tw-container">
          <div className="section-header">
            <span className={styles.tagLabel}>CORE VALUES</span>
            <h2 className="section-title">Our Purpose &amp; Vision</h2>
            <p className="section-subtitle">
              Built with love and dedication to serve the vibrant Indian community and food lovers across Massachusetts.
            </p>
          </div>

          <div className={styles.missionVisionGrid}>
            <div className={styles.mvCard}>
              <div className={styles.mvIconWrapper}>
                <Target size={28} />
              </div>
              <h3 className={styles.mvTitle}>Our Mission</h3>
              <p className={styles.mvDesc}>
                Deliver fresh, healthy, and authentic Indian meals that bring comfort, convenience, and the irreplaceable taste of home straight to your doorstep every single day.
              </p>
            </div>

            <div className={styles.mvCard}>
              <div className={styles.mvIconWrapper}>
                <Compass size={28} />
              </div>
              <h3 className={styles.mvTitle}>Our Vision</h3>
              <p className={styles.mvDesc}>
                Become the most trusted, hygienic, and beloved Indian Tiffin Service in Greater Boston and Massachusetts, empowering people to eat nutritious, warm, home-cooked food effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE TIFFINWALES (6 FEATURE CARDS) */}
      <section className={styles.sectionOrange}>
        <div className="tw-container">
          <div className="section-header">
            <span className={styles.tagLabelWhite}>THE TIFFINWALES DIFFERENCE</span>
            <h2 className={styles.sectionTitleWhite}>Why Families, Students &amp; Professionals Choose Us</h2>
            <p className={styles.sectionSubtitleWhite}>
              We cook each meal with the same care and respect as our own family&apos;s kitchen.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((item, idx) => (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureIconBox}>
                  {item.icon}
                </div>
                <h3 className={styles.featureTitle}>{item.title}</h3>
                <p className={styles.featureDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROCESS: FROM KITCHEN TO DOORSTEP */}
      <section className={styles.sectionBlockAlt}>
        <div className="tw-container">
          <div className="section-header">
            <span className={styles.tagLabel}>OUR PROCESS</span>
            <h2 className="section-title">From Our Cambridge Kitchen To Your Doorstep</h2>
            <p className="section-subtitle">
              How we prepare, pack, and deliver hot, nourishing meals to your home every day.
            </p>
          </div>

          <div className={styles.processGrid}>
            {processSteps.map((step, idx) => (
              <div key={idx} className={styles.processCard}>
                <span className={styles.stepNumberBadge}>{step.step}</span>
                <div className={styles.processIconBox}>
                  {step.icon}
                </div>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROUDLY SERVING MASSACHUSETTS (18 CITIES GRID) */}
      <section className={styles.sectionBlock}>
        <div className="tw-container">
          <div className="section-header">
            <span className={styles.tagLabel}>COVERAGE AREA</span>
            <h2 className="section-title">Proudly Serving Massachusetts</h2>
            <p className="section-subtitle">
              We provide accurate and punctual delivery right to your preferred location across Boston and all major surrounding cities within a 12-mile radius:
            </p>
          </div>

          <div className={styles.citiesGrid}>
            {massachusettsCities.map((city, idx) => (
              <div key={idx} className={styles.cityCard}>
                <span className={styles.cityDot}></span>
                <span>{city}</span>
              </div>
            ))}
          </div>

          <div className={styles.orderNowCenter}>
            <Link href="/tiffin" className="btn-primary" style={{ padding: '14px 44px', fontSize: '1.05rem' }}>
              <span>Order Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Map Location Card */}
          <div className={styles.mapWrapper}>
            <iframe
              title="Tiffin Wales Cambridge Massachusetts Kitchen Location"
              src="https://maps.google.com/maps?q=1001%20Massachusetts%20Ave,%20Cambridge,%20MA%2002138&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className={styles.mapRadiusBadge}>
              <span className="badge-veg"></span>
              <span>12-Mile Delivery Radius Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. IMPACT COUNTERS & KEY METRICS */}
      <section className={styles.statsSection}>
        <div className="tw-container">
          <div className={styles.statsGrid}>
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS (Same 1-Line Component as Home Page) */}
      <TestimonialsSection />

      {/* 9. BOTTOM CTA BANNER */}
      <section className={styles.ctaBanner}>
        <div className="tw-container">
          <h2 className={styles.ctaHeading}>Ready To Enjoy Homemade Indian Food?</h2>
          <p className={styles.ctaSub}>
            Fresh Indian meals delivered daily across Boston, Cambridge, and Massachusetts.
          </p>
          <div className={styles.ctaBtns}>
            <Link href="/tiffin" className={styles.ctaBtnWhite}>
              <span>Order Tiffin Plan</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/menu" className={styles.ctaBtnOutline}>
              <span>View Full Menu</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
