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

function Lightbox({ images, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex ?? 0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    setIndex(initialIndex ?? 0);
  }, [initialIndex]);

  if (initialIndex === null || initialIndex === undefined || !images || images.length === 0) {
    return null;
  }

  function goPrev(e) {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function goNext(e) {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    touchEndX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    e.stopPropagation();
    const diff = touchStartX.current - touchEndX.current;
    const SWIPE_THRESHOLD = 40;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        setIndex((i) => (i + 1) % images.length);
      } else {
        setIndex((i) => (i - 1 + images.length) % images.length);
      }
    }
  }

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <img
        src={images[index]}
        alt="zoomed"
        className={styles.lightboxImage}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
            onClick={goPrev}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
            onClick={goNext}
            aria-label="Next image"
          >
            ›
          </button>

          <div
            className={styles.lightboxDots}
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, i) => (
              <span
                key={i}
                className={`${styles.galleryDot} ${i === index ? styles.galleryDotActive : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}

      <span className={styles.lightboxClose} onClick={onClose}>×</span>
    </div>
  );
}

function Gallery({ images, title }) {
  const [active, setActive] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  function resetTimer() {
    clearInterval(timerRef.current);
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % images.length);
      }, SLIDE_INTERVAL);
    }
  }

  useEffect(() => {
    if (images.length <= 1) return;
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [images.length]);

  if (images.length === 0) return null;

  function goTo(i) {
    setActive(i);
    resetTimer();
  }

  function goPrev(e) {
    e.stopPropagation();
    goTo((active - 1 + images.length) % images.length);
  }

  function goNext(e) {
    e.stopPropagation();
    goTo((active + 1) % images.length);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    touchEndX.current = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const diff = touchStartX.current - touchEndX.current;
    const SWIPE_THRESHOLD = 40;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        goTo((active + 1) % images.length);
      } else {
        goTo((active - 1 + images.length) % images.length);
      }
    }
  }

  return (
    <>
      <div
        className={styles.galleryWrap}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.galleryFrame}>
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${title}-${i}`}
              className={`${styles.galleryImage} ${i === active ? styles.galleryImageActive : ""}`}
              onClick={i === active ? () => setZoomIndex(active) : undefined}
            />
          ))}

          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
                onClick={goPrev}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                onClick={goNext}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
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

      <Lightbox
        images={images}
        initialIndex={zoomIndex}
        onClose={() => setZoomIndex(null)}
      />
    </>
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
        .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
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
              {activities.map((item, idx) => {
                const images = getImages(item);
                const sideClass = idx % 2 === 0 ? styles.timelineLeft : styles.timelineRight;
                return (
                  <div key={item.id} className={`${styles.timelineItem} ${sideClass}`}>
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