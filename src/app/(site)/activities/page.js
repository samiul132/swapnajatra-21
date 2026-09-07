"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const SLIDE_INTERVAL = 3500; // ms

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getImages(item) {
  if (Array.isArray(item.images) && item.images.length) return item.images;
  if (item.image) return [item.image];
  return [];
}

function Gallery({ images, title }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [images.length]);

  if (images.length === 0) return null;

  function goTo(i) {
    setActive(i);
    // ম্যানুয়ালি ক্লিক করলে timer রিসেট করে দিচ্ছি যাতে হুট করে পরের ছবি চলে না আসে
    clearInterval(timerRef.current);
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % images.length);
      }, SLIDE_INTERVAL);
    }
  }

  return (
    <div className={styles.galleryWrap}>
      <div className={styles.galleryFrame}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`${title}-${i}`}
            className={`${styles.galleryImage} ${i === active ? styles.galleryImageActive : ""}`}
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className={styles.galleryDots}>
          {images.map((_, i) => (
            <span
              key={i}
              className={`${styles.galleryDot} ${i === active ? styles.galleryDotActive : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
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
              {activities.map((item) => {
                const images = getImages(item);
                return (
                  <div key={item.id} className={styles.timelineItem}>
                    <div className={styles.timelineDate}>{formatDate(item.date || item.createdAt)}</div>
                    <span className={styles.dot} />
                    <div className={styles.timelineContent}>
                      <Gallery images={images} title={item.title} />
                      {item.video && (
                        <video
                          src={item.video}
                          className={styles.timelineVideo}
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      )}
                      <h3 className={styles.timelineTitle}>{item.title}</h3>
                      {item.description && (
                        <p className={styles.timelineDesc}>{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}