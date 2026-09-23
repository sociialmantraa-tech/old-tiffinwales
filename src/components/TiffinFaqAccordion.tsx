'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import styles from './TiffinFaqAccordion.module.css';

interface FAQ {
  q: string;
  a: string;
}

interface TiffinFaqAccordionProps {
  faqs: FAQ[];
}

export const TiffinFaqAccordion: React.FC<TiffinFaqAccordionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="tw-section" style={{ background: 'linear-gradient(180deg, #fffaf5 0%, #fff2e6 100%)', borderTop: '1.5px solid #f0e1d2' }}>
      <div className="tw-container" style={{ maxWidth: '820px' }}>
        <div className="section-header">
          <div className="section-tag">
            <HelpCircle size={13} />
            <span>Questions &amp; Answers</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Tap on any question below to see details regarding delivery, meal plans, and diet customization.
          </p>
        </div>

        <div className={styles.faqContainer}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
              >
                <button
                  type="button"
                  className={styles.faqQuestionBtn}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.faqQuestionText}>{faq.q}</span>
                  <div className={styles.iconCircle}>
                    <ChevronDown size={17} />
                  </div>
                </button>

                {isOpen && (
                  <div className={styles.faqAnswerPanel}>
                    <p className={styles.faqAnswerText}>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
