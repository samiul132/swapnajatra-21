"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    setLoading(true);
    try {
      const res = await fetch("/api/data");
      const data = await res.json();
      const sorted = (data.data || [])
        .slice()
        .sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
      setActivities(sorted);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">হোম</Link>
            <span>›</span>
            <span>কার্যক্রম</span>
          </div>
          <h1 className={styles.pageTitle}>কার্যক্রম</h1>
          <p className={styles.pageSub}>
            আমাদের সাম্প্রতিক কার্যক্রম ও উদ্যোগের একটি ঝলক।
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.timelineWrap}>
          {loading ? (
            <p className={styles.stateText}>লোড হচ্ছে...</p>
          ) : activities.length === 0 ? (
            <p className={styles.stateText}>এখনো কোনো কার্যক্রম যোগ করা হয়নি।</p>
          ) : (
            <div className={styles.timeline}>
              {activities.map((item) => (
                <div key={item.id} className={styles.timelineItem}>
                  <div className={styles.timelineDate}>{formatDate(item.date || item.createdAt)}</div>
                  <span className={styles.dot} />
                  <div className={styles.timelineContent}>
                    {item.image && (
                      <img src={item.image} alt={item.title} className={styles.timelineImage} />
                    )}
                    <h3 className={styles.timelineTitle}>{item.title}</h3>
                    {item.description && (
                      <p className={styles.timelineDesc}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}