"use client";

import { useEffect, useState } from "react";
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

const FILTERS = [
  { key: "all",      label: "সকল" },
  { key: "advisor",  label: "উপদেষ্টা" },
  { key: "president",label: "সভাপতি" },
  { key: "vice",     label: "সহ-সভাপতি" },
  { key: "secretary",label: "সম্পাদক" },
  { key: "treasurer",label: "কোষাধ্যক্ষ" },
  { key: "member",   label: "সাধারণ সদস্য" },
];

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((d) => setMembers(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? members : members.filter((m) => m.role === filter);

  const advisors   = filtered.filter((m) => m.role === "advisor");
  const executives = filtered.filter((m) => ["president","vice","secretary","treasurer"].includes(m.role));
  const general    = filtered.filter((m) => m.role === "member");

    const renderCard = (m) => {
    const meta = ROLE_META[m.role] || ROLE_META.member;
    return (
      <div key={m.id} className={styles.card} data-role={m.role}>
        {m.image ? (
          <img
            src={m.image}
            alt={m.name}
            className={styles.avatar}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            className={styles.avatar}
            style={{ background: `linear-gradient(135deg, ${meta.gradFrom}, ${meta.gradTo})` }}
          >
            {m.initial}
          </div>
        )}
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

        <div className={styles.statsStrip}>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>{members.filter(m=>m.role==="advisor").length}</div>
            <div className={styles.stripLabel}>উপদেষ্টা</div>
          </div>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>{members.filter(m=>["president","vice","secretary","treasurer"].includes(m.role)).length}</div>
            <div className={styles.stripLabel}>কার্যনির্বাহী</div>
          </div>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>{members.filter(m=>m.role==="member").length}</div>
            <div className={styles.stripLabel}>সাধারণ সদস্য</div>
          </div>
        </div>

        <div className={styles.body}>
          {loading && (
            <p style={{ color: "var(--muted)", textAlign: "center", padding: "3rem 0", fontFamily: "var(--font-bn)" }}>
              লোড হচ্ছে...
            </p>
          )}

          {!loading && advisors.length > 0 && (
            <>
              <div className={styles.sectionLabel}>উপদেষ্টা পরিষদ</div>
              <div className={styles.grid}>{advisors.map(renderCard)}</div>
            </>
          )}
          {!loading && executives.length > 0 && (
            <>
              <div className={styles.sectionLabel}>কার্যনির্বাহী পরিষদ</div>
              <div className={styles.grid}>{executives.map(renderCard)}</div>
            </>
          )}
          {!loading && general.length > 0 && (
            <>
              <div className={styles.sectionLabel}>সাধারণ সদস্যবৃন্দ</div>
              <div className={styles.grid}>{general.map(renderCard)}</div>
            </>
          )}
          {!loading && filtered.length === 0 && (
            <p style={{ color: "var(--muted)", textAlign: "center", padding: "3rem 0", fontFamily: "var(--font-bn)" }}>
              কোনো সদস্য পাওয়া যায়নি।
            </p>
          )}
        </div>
      </div>
    </>
  );
}