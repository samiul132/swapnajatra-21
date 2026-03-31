"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const ROLE_META = {
  advisor:   { label: "উপদেষ্টা",        bg: "#e6394620", color: "#e63946", gradFrom: "#e63946", gradTo: "#c77dff" },
  president: { label: "সভাপতি",          bg: "#ffd70020", color: "#ffd700", gradFrom: "#ffd700", gradTo: "#ff6584" },
  vice:      { label: "সহ-সভাপতি",       bg: "#6c63ff20", color: "#6c63ff", gradFrom: "#6c63ff", gradTo: "#8b5cf6" },
  secretary: { label: "সাধারণ সম্পাদক",  bg: "#43aa8b20", color: "#43aa8b", gradFrom: "#43aa8b", gradTo: "#2d6a4f" },
  treasurer: { label: "কোষাধ্যক্ষ",      bg: "#f4a26120", color: "#f4a261", gradFrom: "#f4a261", gradTo: "#e76f51" },
  member:    { label: "সদস্য",           bg: "#3a86ff20", color: "#3a86ff", gradFrom: "#457b9d", gradTo: "#3a86ff" },
};

const MEMBERS = [
  // Advisors
  { id: 1,  name: "মোঃ আবদুল করিম",   role: "advisor",   sub: "গণিত বিভাগ, নিশ্চিন্তপুর উচ্চ বিদ্যালয়", initial: "আ" },
  { id: 2,  name: "রহিমা বেগম",         role: "advisor",   sub: "বাংলা বিভাগ, নিশ্চিন্তপুর উচ্চ বিদ্যালয়", initial: "র" },
  { id: 3,  name: "মোঃ জাহিদ হোসেন",   role: "advisor",   sub: "ইংরেজি বিভাগ, নিশ্চিন্তপুর উচ্চ বিদ্যালয়", initial: "জ" },
  // Executive
  { id: 4,  name: "মোঃ রাফি আহমেদ",   role: "president", sub: "SSC 2021 · বিজ্ঞান বিভাগ", initial: "র" },
  { id: 5,  name: "নাফিসা ইসলাম",      role: "vice",      sub: "SSC 2021 · বিজ্ঞান বিভাগ", initial: "ন" },
  { id: 6,  name: "তানভীর হাসান",      role: "secretary", sub: "SSC 2021 · বাণিজ্য বিভাগ", initial: "ত" },
  { id: 7,  name: "সুমাইয়া খানম",     role: "treasurer", sub: "SSC 2021 · মানবিক বিভাগ", initial: "স" },
  // Members
  { id: 8,  name: "আরিফ হোসেন",        role: "member",    sub: "SSC 2021 · বিজ্ঞান বিভাগ", initial: "আ" },
  { id: 9,  name: "মিম আক্তার",        role: "member",    sub: "SSC 2021 · বাণিজ্য বিভাগ", initial: "মি" },
  { id: 10, name: "সাকিব আল হাসান",   role: "member",    sub: "SSC 2021 · বিজ্ঞান বিভাগ", initial: "স" },
  { id: 11, name: "তাসনিম জাহান",     role: "member",    sub: "SSC 2021 · মানবিক বিভাগ", initial: "তা" },
  { id: 12, name: "রনি হোসেন",         role: "member",    sub: "SSC 2021 · বিজ্ঞান বিভাগ", initial: "র" },
  { id: 13, name: "প্রিয়া দাস",       role: "member",    sub: "SSC 2021 · বিজ্ঞান বিভাগ", initial: "প" },
  { id: 14, name: "ইমরান খান",         role: "member",    sub: "SSC 2021 · বাণিজ্য বিভাগ", initial: "ই" },
  { id: 15, name: "লামিয়া হাসান",     role: "member",    sub: "SSC 2021 · মানবিক বিভাগ", initial: "ল" },
];

const FILTERS = [
  { key: "all",      label: "সকল" },
  { key: "advisor",  label: "উপদেষ্টা" },
  { key: "president",label: "সভাপতি" },
  { key: "vice",     label: "সহ-সভাপতি" },
  { key: "secretary",label: "সম্পাদক" },
  { key: "treasurer",label: "কোষাধ্যক্ষ" },
  { key: "member",   label: "সাধারণ সদস্য" },
];

const SECTIONS_ORDER = [
  { key: "advisor",   label: "উপদেষ্টা পরিষদ" },
  { key: "executive", label: "কার্যনির্বাহী পরিষদ", roles: ["president","vice","secretary","treasurer"] },
  { key: "member",    label: "সাধারণ সদস্যবৃন্দ" },
];

export default function MembersPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? MEMBERS : MEMBERS.filter((m) => m.role === filter);

  const advisors   = filtered.filter((m) => m.role === "advisor");
  const executives = filtered.filter((m) => ["president","vice","secretary","treasurer"].includes(m.role));
  const general    = filtered.filter((m) => m.role === "member");

  const renderCard = (m) => {
    const meta = ROLE_META[m.role];
    return (
      <div key={m.id} className={styles.card} data-role={m.role}>
        <div
          className={styles.avatar}
          style={{ background: `linear-gradient(135deg, ${meta.gradFrom}, ${meta.gradTo})` }}
        >
          {m.initial}
        </div>
        <div
          className={styles.roleBadge}
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.label}
        </div>
        <div className={styles.memberName}>{m.name}</div>
        <div className={styles.memberSub}>{m.sub}</div>
      </div>
    );
  };

  return (
    <>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">হোম</Link>
            <span>›</span>
            <span>সদস্যবৃন্দ</span>
          </div>
          <h1 className={styles.pageTitle}>সদস্যবৃন্দ</h1>
          <p className={styles.pageSub}>
            স্বপ্নযাত্রা-২১ এর উপদেষ্টা পরিষদ, কার্যনির্বাহী পরিষদ ও সাধারণ সদস্যবৃন্দের তালিকা।
          </p>
        </div>
      </div>

      <div className="container">
        {/* Filter bar */}
        <div className={styles.filterBar}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${filter === f.key ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Stats strip */}
        <div className={styles.statsStrip}>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>{MEMBERS.filter(m=>m.role==="advisor").length}</div>
            <div className={styles.stripLabel}>উপদেষ্টা</div>
          </div>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>{MEMBERS.filter(m=>["president","vice","secretary","treasurer"].includes(m.role)).length}</div>
            <div className={styles.stripLabel}>কার্যনির্বাহী</div>
          </div>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>{MEMBERS.filter(m=>m.role==="member").length}</div>
            <div className={styles.stripLabel}>সাধারণ সদস্য</div>
          </div>
        </div>

        {/* Cards grouped by section */}
        <div className={styles.body}>
          {advisors.length > 0 && (
            <>
              <div className={styles.sectionLabel}>উপদেষ্টা পরিষদ</div>
              <div className={styles.grid}>{advisors.map(renderCard)}</div>
            </>
          )}
          {executives.length > 0 && (
            <>
              <div className={styles.sectionLabel}>কার্যনির্বাহী পরিষদ</div>
              <div className={styles.grid}>{executives.map(renderCard)}</div>
            </>
          )}
          {general.length > 0 && (
            <>
              <div className={styles.sectionLabel}>সাধারণ সদস্যবৃন্দ</div>
              <div className={styles.grid}>{general.map(renderCard)}</div>
            </>
          )}
          {filtered.length === 0 && (
            <p style={{ color: "var(--muted)", textAlign: "center", padding: "3rem 0", fontFamily: "var(--font-bn)" }}>
              কোনো সদস্য পাওয়া যায়নি।
            </p>
          )}
        </div>
      </div>
    </>
  );
}