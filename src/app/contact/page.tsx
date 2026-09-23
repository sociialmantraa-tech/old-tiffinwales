'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { OfficialWhatsAppIcon } from '@/components/WhatsAppButton';
import styles from './contact.module.css';

export default function ContactPage() {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Meal Plan Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', phone: '', subject: 'Meal Plan Inquiry', message: '' });
    }, 4000);
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.header}>
        <div className="tw-container">
          <div className="section-tag" style={{ background: '#fff0e6', borderColor: '#fed7aa' }}>
            <MessageCircle size={13} />
            <span>We are here to help</span>
          </div>
          <h1 className="section-title">Get in Touch with Our Kitchen</h1>
          <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Have questions about customized tiffin plans, delivery schedules, student discounts, 
            or corporate orders in Cambridge &amp; Boston? Reach out anytime!
          </p>
        </div>
      </div>

      <div className="tw-container">
        <div className={styles.grid}>
          {/* Left: Contact Form */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Send Us a Message</h2>

            {formSent && (
              <div className={styles.alertSuccess}>
                <CheckCircle2 size={20} />
                <span>Thank you! Your message has been delivered to our kitchen team. We will reply promptly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (617) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={styles.select}
                  >
                    <option>5-Day Meal Plan Inquiry</option>
                    <option>Monthly Subscription Questions</option>
                    <option>Delivery Zone Check</option>
                    <option>Catering &amp; University Group Orders</option>
                    <option>General Feedback</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you need or ask any questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Right: Info Cards */}
          <div className={styles.sidebar}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Direct Contact</h3>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <MapPin size={20} className={styles.infoIcon} />
                  <div>
                    <strong>Store Address:</strong>
                    <span>1001 Massachusetts Ave, Cambridge, MA 02138</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Phone size={20} className={styles.infoIcon} />
                  <div>
                    <strong>Direct Phone:</strong>
                    <span>+1 (617) 555-0199</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Mail size={20} className={styles.infoIcon} />
                  <div>
                    <strong>Email Support:</strong>
                    <span>support@tiffinwales.com</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Clock size={20} className={styles.infoIcon} />
                  <div>
                    <strong>Hours of Operation:</strong>
                    <span>Daily: 11:30 AM – 9:30 PM (Pickup &amp; Delivery)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant WhatsApp Action Box */}
            <div className={styles.waCard}>
              <div className={styles.waHeader}>
                <OfficialWhatsAppIcon size={24} className={styles.waIcon} />
                <strong>Direct WhatsApp Support</strong>
              </div>
              <p className={styles.waDesc}>
                Need to adjust today&apos;s meal, customize ingredients, or check delivery status? Message our Cambridge kitchen on WhatsApp!
              </p>
              <a
                href="https://wa.me/16175550199"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waBtn}
              >
                Chat on WhatsApp Now 💬
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
