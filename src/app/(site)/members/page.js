"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const ROLE_META = {
  president:                    { label: "সভাপতি",                 bg: "#ffd70020", color: "#ffd700", gradFrom: "#ffd700", gradTo: "#ff6584" },
  vice:                         { label: "সহ-সভাপতি",              bg: "#6c63ff20", color: "#6c63ff", gradFrom: "#6c63ff", gradTo: "#8b5cf6" },
  secretary:                    { label: "সেক্রেটারি",              bg: "#43aa8b20", color: "#43aa8b", gradFrom: "#43aa8b", gradTo: "#2d6a4f" },
  advisor:                      { label: "উপদেষ্টা",                bg: "#e6394620", color: "#e63946", gradFrom: "#e63946", gradTo: "#c77dff" },
  student_advisor:              { label: "ছাত্র-উপদেষ্টা",          bg: "#ff9f1c20", color: "#ff9f1c", gradFrom: "#ff9f1c", gradTo: "#ffbf69" },
  education_secretary:          { label: "শিক্ষা বিষয়ক সম্পাদক",    bg: "#2a9d8f20", color: "#2a9d8f", gradFrom: "#2a9d8f", gradTo: "#264653" },
  organizing_secretary:         { label: "সাংগঠনিক সম্পাদক",        bg: "#9d4edd20", color: "#9d4edd", gradFrom: "#9d4edd", gradTo: "#7b2cbf" },
  health_secretary:             { label: "স্বাস্থ্য বিষয়ক সম্পাদক", bg: "#06d6a020", color: "#06d6a0", gradFrom: "#06d6a0", gradTo: "#1b9aaa" },
  religious_secretary:          { label: "ধর্ম বিষয়ক সম্পাদক",      bg: "#118ab220", color: "#118ab2", gradFrom: "#118ab2", gradTo: "#073b4c" },
  social_welfare_secretary:     { label: "সমাজকল্যাণ সম্পাদক",      bg: "#ef476f20", color: "#ef476f", gradFrom: "#ef476f", gradTo: "#d90429" },
  women_affairs_secretary:      { label: "নারী বিষয়ক সম্পাদক",      bg: "#ff6b9d20", color: "#ff6b9d", gradFrom: "#ff6b9d", gradTo: "#c9184a" },
  publicity_secretary:          { label: "প্রচার সম্পাদক",          bg: "#ffb70320", color: "#ffb703", gradFrom: "#ffb703", gradTo: "#fb8500" },
  finance_secretary:            { label: "অর্থ সম্পাদক",            bg: "#f4a26120", color: "#f4a261", gradFrom: "#f4a261", gradTo: "#e76f51" },
  expatriate_welfare_secretary: { label: "প্রবাসী কল্যাণ সম্পাদক",  bg: "#219ebc20", color: "#219ebc", gradFrom: "#219ebc", gradTo: "#023047" },
  office_secretary:             { label: "দপ্তর সম্পাদক",           bg: "#757bc820", color: "#757bc8", gradFrom: "#757bc8", gradTo: "#5a4fcf" },
  joint_office_secretary:       { label: "যুগ্ম সাধারণ সম্পাদক",           bg: "#757bc820", color: "#757bc8", gradFrom: "#757bc8", gradTo: "#5a4fcf" },
  member:                       { label: "সদস্যবৃন্দ",              bg: "#3a86ff20", color: "#3a86ff", gradFrom: "#457b9d", gradTo: "#3a86ff" },
};

const EXEC_KEYS = [
  "president", "vice", "secretary",
  "education_secretary", "organizing_secretary", "health_secretary",
  "religious_secretary", "social_welfare_secretary", "women_affairs_secretary",
  "publicity_secretary", "finance_secretary", "expatriate_welfare_secretary",
  "office_secretary", "joint_office_secretary",
];
const ADVISOR_KEYS = ["advisor", "student_advisor"];

const FILTERS = [
  { key: "all", label: "সকল" },
  ...Object.entries(ROLE_META).map(([key, meta]) => ({ key, label: meta.label })),
];

const rolePriority = (roles, orderList) => {
  const idx = orderList.findIndex((k) => roles.includes(k));
  return idx === -1 ? orderList.length : idx;
};

// পুরনো single-role data এর জন্য fallback
function normalizeRoles(m) {
  if (Array.isArray(m.roles) && m.roles.length) return m.roles;
  if (m.role) return [m.role];
  return ["member"];
}

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

  const withRoles = members.map((m) => ({ ...m, _roles: normalizeRoles(m) }));
  const filtered = filter === "all" ? withRoles : withRoles.filter((m) => m._roles.includes(filter));

  const advisors = filtered
    .filter((m) => m._roles.some((r) => ADVISOR_KEYS.includes(r)))
    .sort((a, b) => rolePriority(a._roles, ADVISOR_KEYS) - rolePriority(b._roles, ADVISOR_KEYS));

  const executives = filtered
    .filter((m) => m._roles.some((r) => EXEC_KEYS.includes(r)))
    .sort((a, b) => rolePriority(a._roles, EXEC_KEYS) - rolePriority(b._roles, EXEC_KEYS));

  const general = filtered.filter((m) => m._roles.includes("member"));

  const renderCard = (m) => {
    const roles = m._roles;
    const primary = ROLE_META[roles[0]] || ROLE_META.member;
    return (
      <div key={m.id} className={styles.card} data-role={roles[0]}>
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
            style={{ background: `linear-gradient(135deg, ${primary.gradFrom}, ${primary.gradTo})` }}
          >
            {m.initial}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          {roles.map((rk) => {
            const meta = ROLE_META[rk] || ROLE_META.member;
            return (
              <div
                key={rk}
                className={styles.roleBadge}
                style={{ background: meta.bg, color: meta.color }}
              >
                {meta.label}
              </div>
            );
          })}
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
            <div className={styles.stripNum}>{withRoles.filter(m => m._roles.some(r => ADVISOR_KEYS.includes(r))).length}</div>
            <div className={styles.stripLabel}>উপদেষ্টা</div>
          </div>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>{withRoles.filter(m => m._roles.some(r => EXEC_KEYS.includes(r))).length}</div>
            <div className={styles.stripLabel}>কার্যনির্বাহী</div>
          </div>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>{withRoles.filter(m => m._roles.includes("member")).length}</div>
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