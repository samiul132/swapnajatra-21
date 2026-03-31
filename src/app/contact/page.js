"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const INFO_CARDS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    iconBg: "rgba(108,99,255,0.15)", iconColor: "#6c63ff",
    label: "ঠিকানা",
    value: "নিশ্চিন্তপুর উচ্চ বিদ্যালয়",
    sub: "নিশ্চিন্তপুর, বাংলাদেশ",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    iconBg: "rgba(67,170,139,0.15)", iconColor: "#43aa8b",
    label: "ফোন",
    value: "+880 1XXX-XXXXXX",
    sub: "সোম-শুক্র, সকাল ৯টা – বিকাল ৫টা",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    iconBg: "rgba(255,101,132,0.15)", iconColor: "#ff6584",
    label: "ইমেইল",
    value: "swapnajatra2021@gmail.com",
    sub: "সর্বদা উপলব্ধ",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    iconBg: "rgba(58,134,255,0.15)", iconColor: "#3a86ff",
    label: "সোশ্যাল মিডিয়া",
    value: "আমাদের ফেসবুকে যুক্ত থাকুন",
    social: true,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  return (
    <>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">হোম</Link>
            <span>›</span>
            <span>যোগাযোগ</span>
          </div>
          <h1 className={styles.pageTitle}>যোগাযোগ</h1>
          <p className={styles.pageSub}>
            আমাদের সাথে যোগাযোগ করুন। যেকোনো প্রশ্ন, পরামর্শ বা সদস্যপদ সংক্রান্ত
            তথ্যের জন্য নির্দ্বিধায় বার্তা পাঠান।
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="container">
        <div className={styles.body}>

          {/* Info cards */}
          <div className={styles.infoStack}>
            {INFO_CARDS.map((card, i) => (
              <div key={i} className={styles.infoCard}>
                <div className={styles.infoIcon}
                  style={{ background: card.iconBg, color: card.iconColor }}>
                  {card.icon}
                </div>
                <div className={styles.infoText}>
                  <div className={styles.infoLabel}>{card.label}</div>
                  <div className={styles.infoValue}>{card.value}</div>
                  {card.sub && <div className={styles.infoSub}>{card.sub}</div>}
                  {card.social && (
                    <div className={styles.socialRow}>
                      <button className={styles.socialBtn}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                        Facebook
                      </button>
                      <button className={styles.socialBtn}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                        WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className={styles.mapBox}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              নিশ্চিন্তপুর উচ্চ বিদ্যালয়, বাংলাদেশ
            </div>
          </div>

          {/* Contact form */}
          <div className={styles.formCard}>
            {sent ? (
              <div className={styles.successMsg}>
                <div className={styles.successIcon}>✓</div>
                <div>বার্তা পাঠানো হয়েছে!</div>
                <div className={styles.successSub}>আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</div>
              </div>
            ) : (
              <>
                <div className={styles.formTitle}>বার্তা পাঠান</div>
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>আপনার নাম *</label>
                    <input
                      className={styles.input}
                      name="name" value={form.name}
                      onChange={handleChange}
                      placeholder="মোঃ রাফিকুল ইসলাম"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>ইমেইল</label>
                    <input
                      className={styles.input}
                      type="email" name="email" value={form.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>বার্তা *</label>
                    <textarea
                      className={styles.textarea}
                      name="message" value={form.message}
                      onChange={handleChange}
                      placeholder="আপনার বার্তা লিখুন..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    {loading ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান →"}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}