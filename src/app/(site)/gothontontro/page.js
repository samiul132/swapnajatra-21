"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const SECTIONS = [
  { id: 1, color: "#e63946", title: "ধারা ১: নাম, বৈশিষ্ট্য, লোগো ও কার্যালয়", items: [{ sub: "ক) নাম", body: 'এই সংগঠনের নাম হবে বাংলায় "স্বপ্নযাত্রা-২১"।' }, { sub: "খ) বৈশিষ্ট্য", body: "১) একটি অরাজনৈতিক, অলাভজনক এবং কল্যাণ ও সেবামূলক সংগঠন হিসেবে পরিচালিত হবে।\n২) সংগঠনের একটি সীলমোহর ও লোগো থাকবে।\n৩) দাপ্তরিক ভাষা হবে বাংলা ও ইংরেজি।" }, { sub: "গ) লোগো", body: "সংগঠনের নিজস্ব লোগো থাকবে।" }, { sub: "ঘ) কার্যালয়", body: "সংগঠনের প্রাথমিক সফলতার উপর নির্ভর করে কার্যালয়ের ঠিকানা নির্ধারণ করা হবে।" }] },
  { id: 2, color: "#457b9d", title: "ধারা ২: সংজ্ঞা ও ব্যাখ্যা", items: [{ sub: "ক) সংগঠন", body: '"নিশ্চিন্তপুর উচ্চ বিদ্যালয়ের ২০২১ সালের এসএসসি পরীক্ষার্থী শিক্ষার্থীদের একত্রে বুঝাবে"।' }, { sub: "খ) গঠনতন্ত্র", body: "সাধারণ পরিষদ কর্তৃক অনুমোদিত এবং সময়ে সময়ে সংশোধিত সংগঠনের গঠনতন্ত্রকে বুঝাবে।" }, { sub: "গ) ধারা ও বিধি", body: "গঠনতন্ত্রের ধারা এবং অধীনে প্রণীত বিধি ও উপ বিধিসমূহকে বুঝাবে।" }, { sub: "ঘ) উপদেষ্টা পরিষদ", body: "ধারা-৭ কে বুঝাবে।" }, { sub: "ঙ) কার্যনির্বাহী পরিষদ", body: "সংগঠনের সদস্যদের মধ্যে হতে মনোনীত নির্বাচিত প্রয়োজনীয় সংখ্যক সদস্য নিয়ে গঠিত পরিষদকে বুঝাবে।" }] },
  { id: 3, color: "#2d6a4f", title: "ধারা ৩: লক্ষ্য ও উদ্দেশ্য", items: [{ sub: "", body: "১) স্কুলের শিক্ষার্থীদের সমস্যাগুলির দ্রুত সমাধানের জন্য একটি কার্যকর যোগাযোগ প্ল্যাটফর্ম তৈরি।\n২) সামাজিক কল্যাণমূলক কাজে অংশগ্রহণ করা।\n৩) সংগঠনের সদস্যদের আর্থসামাজিক উন্নয়নে সাহায্য করা।\n৪) নিশ্চিন্তপুর উচ্চ বিদ্যালয়ের ২০২১ সালের এসএসসি সকল শিক্ষার্থীদের একত্রিত করা ও নেটওয়াকিং তৈরি করা।" }] },
  { id: 4, color: "#7b2d8b", title: "ধারা ৪: সাধারণ সদস্য", items: [{ sub: "", body: "সাধারণ সদস্য কেবলমাত্র ২ (ক) ধারাতে সংজ্ঞায়িত নিশ্চিন্তপুর উচ্চ বিদ্যালয়ের ২০২১ সালের এসএসসি পরীক্ষার্থী শিক্ষার্থীদের জন্য নির্ধারিত থাকবে। যে কোন শিক্ষার্থী নামমাত্র রেজিস্ট্রেশন ফি বা সর্বনিম্ন ১০০ টাকা প্রদানপূর্বক সাধারণ সদস্য হতে পারিবেন।" }, { sub: "ধারা ৪.১: সদস্যদের অধিকার ও সুবিধা", body: "ক. বিধি মোতাবেক কার্যনির্বাহী কমিটির কর্মকাণ্ডের ব্যাখ্যা দাবি করা এবং আয়-ব্যয়ের হিসাব চাওয়া।\nখ. সংগঠনের যে কোন কমিটিতে নির্বাচনে অংশগ্রহণ করা।\nগ. ভোট প্রদান করা।\nঘ. সংগঠনের উন্নয়নের স্বার্থে পরামর্শদান বা নির্বাচন কমিশনে কাজ করা।" }] },
  { id: 5, color: "#c77dff", title: "ধারা ৫: চাঁদা সম্পর্কিত", items: [{ sub: "", body: "১. সংগঠনে প্রদত্ত টাকা ব্যক্তিস্বার্থে ব্যবহার করা যাবে না।\n২. মাসিক চাঁদা প্রতি মাসের ১-১০ তারিখের মধ্যে পরিশোধ করা লাগবে।\n৩. বার্ষিক চাঁদা ক্যাশিয়ারের সাথে আলোচনা করে নির্দিষ্ট সময়ের মধ্যে পরিশোধ করা লাগবে।" }] },
  { id: 6, color: "#f4a261", title: "ধারা ৬: সাংগঠনিক কাঠামো", items: [{ sub: "", body: "সংগঠনের সাংগঠনিক কাঠামো হবে নিম্নরূপ:\nক) উপদেষ্টা পরিষদ\nখ) কার্যনির্বাহী পরিষদ" }] },
  { id: 7, color: "#e76f51", title: "ধারা ৭: উপদেষ্টা পরিষদ", items: [{ sub: "", body: "ক) নিশ্চিন্তপুর উচ্চ বিদ্যালয়ের ৩ জন শিক্ষক উপদেষ্টা পরিষদের সদস্য মনোনীত হবেন।\nখ) পদাধিকার বলে সভাপতি, সহ-সভাপতি উপদেষ্টা পরিষদে যুক্ত হবেন।" }, { sub: "ধারা ৭.১: উপদেষ্টা পরিষদ দায়িত্ব", body: "ক) বছরে অন্তত দুইবার যৌথসভা অনুষ্ঠিত হবে।\nখ) কার্যনির্বাহী পরিষদকে যে কোন সমস্যা সমাধানে সর্বোচ্চ সাহায্য প্রদান করবেন।\nগ) নির্বাচন কমিশনের দায়িত্বে উপদেষ্টা পরিষদ থাকবেন।" }] },
  { id: 8, color: "#2196f3", title: "ধারা ৮: কার্যনির্বাহী পরিষদ", items: [{ sub: "", body: "ক) সংগঠনের সদস্যদের কর্তৃক মনোনিত শিক্ষার্থীদের নিয়ে কার্যনির্বাহী পরিষদ গঠিত হবে।\nখ) বছরে কমপক্ষে ৩টি সভা করবে।\nগ) কমপক্ষে এক তৃতীয়াংশ সদস্যের উপস্থিতিতে সভা পরিচালিত হবে।\nঘ) সকল সিদ্ধান্ত সংখ্যাগরিষ্ঠ সদস্যদের ভোট বা সমর্থনে গৃহীত হবে।\nঙ) কোনো ব্যক্তি তিনবারের বেশি সভাপতিত্ব বা সহ সভাপতিত্ব করতে পারবে না।" }] },
  { id: 9, color: "#43aa8b", title: "ধারা ৯: কার্যনির্বাহী পরিষদের নির্বাচন", items: [{ sub: "", body: "১। প্রতি এক বছর পর পর নির্বাচন অনুষ্ঠিত হবে।\n২। নির্বাচন কমিশন ভোটার তালিকা প্রণয়ন করে সকলের অবগতির জন্য প্রকাশ করবেন।\n৩। নির্বাচন কমিশনের দায়িত্বে উপদেষ্টা পরিষদ থাকবেন।\n৪। নির্বাচন সংক্রান্ত বিষয়ে নির্বাচন কমিশনের রায়ই চূড়ান্ত।\n৫। মেয়াদ উত্তীর্ণ হওয়ার কমপক্ষে ১৫ দিন পূর্বে ফলাফল ঘোষনা করতে হবে।" }] },
  { id: 10, color: "#e63946", title: "ধারা ১০: অনাস্থা প্রস্তাব", items: [{ sub: "ক. প্রক্রিয়া", body: "কার্যনির্বাহী কমিটির বিরুদ্ধে অনাস্থা প্রস্তাব আনার জন্য কমপক্ষে দুই-তৃতীয় সাধারণ সদস্যকে লিখিতভাবে প্রস্তাব দিতে হবে।" }, { sub: "খ. পাসের শর্ত", body: "সাধারণ সভায় মোট সদস্য সংখ্যার তিন-চতুর্থাংশ সদস্য উপস্থিত থাকতে হবে এবং দুই-তৃতীয়াংশ ভোটে পাস হবে।" }, { sub: "গ. পরবর্তী ব্যবস্থা", body: "অনাস্থা প্রস্তাব পাস হলে ৩০ দিনের মধ্যে নতুন কমিটির নির্বাচন অথবা শূন্যপদ পূরণের ব্যবস্থা নিতে হবে।" }] },
  { id: 11, color: "#6d6875", title: "ধারা ১১: সদস্য পদ বাতিল/স্থগিতের নিয়মাবলী", items: [{ sub: "", body: "ক) স্বেচ্ছায় লিখিত পদত্যাগ করলে।\nখ) গঠনতন্ত্র ও স্বার্থের পরিপন্থী কোন কাজ করলে।\nগ) মৃত্যু বা মস্তিষ্ক বিকৃত ঘটলে।\nঘ) দায়িত্ব যথাযথ পালন না করলে কার্য নির্বাহী পরিষদ থেকে বাদ দেওয়া হবে।\nঙ) শিক্ষা প্রতিষ্ঠান ও রাষ্ট্র বিরোধী কার্যকলাপে লিপ্ত হলে।\nচ) টানা তিন বার সভায় অনুপস্থিত থাকলে বাদ দেওয়া হবে।\nছ) আদালত কর্তৃক সাজাপ্রাপ্ত হলে।" }] },
  { id: 12, color: "#3a86ff", title: "ধারা ১২: সংগঠনের গ্রুপ এবং ফেসবুক পেজ", items: [{ sub: "", body: "১. সংগঠনের গ্রুপে কোন ধরনের দুষ্টামি বা মজা করা যাবে না।\n২. যেকোন ধরনের মতামত প্রদান করা যাবে সংগঠন সম্পর্কিত।\n৩. গ্রুপে কোন ধরনের অশালীন ভাষা ব্যবহার করা যাবে না।" }] },
  { id: 13, color: "#ff6b6b", title: "ধারা ১৩: গঠনতন্ত্র পরিবর্তন, সংযোজন ও বিয়োজন", items: [{ sub: "", body: "সময়ের প্রয়োজনে যদি গঠনতন্ত্র পরিবর্তন, সংযোজন ও বিয়োজন এর প্রয়োজন হয়, তবে কার্যনির্বাহী পরিষদের মতামতের ভিত্তিতে তা করা যাবে। প্রয়োজনে সাধারণ সদস্যদের মতামত নেওয়া যেতে পারে।" }] },
];

export default function GothontontroPage() {
  const [active, setActive] = useState(null);
  const [activeToc, setActiveToc] = useState(null);
  const cardRefs = useRef({});

  const toggle = (id) => setActive((p) => (p === id ? null : id));

  const scrollTo = (id) => {
    setActiveToc(id);
    setActive(id);
    cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/ssc-2021_organization.pdf";
    a.download = "ssc-2021_organization.pdf";
    a.click();
  };

  return (
    <>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">হোম</Link>
            <span>›</span>
            <span>গঠনতন্ত্র</span>
          </div>
          <h1 className={styles.pageTitle}>গঠনতন্ত্র</h1>
          <p className={styles.pageSub}>
            স্বপ্নযাত্রা-২১ সংগঠনের পূর্ণাঙ্গ গঠনতন্ত্র। মোট ১৩টি ধারায় সংগঠনের
            নিয়মকানুন, কাঠামো ও পরিচালনা পদ্ধতি বিস্তারিত বর্ণিত আছে।
          </p>
          <button className={styles.downloadBar} onClick={handleDownload}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            PDF ডাউনলোড করুন
          </button>
        </div>
      </div>

      {/* Body: TOC + Cards */}
      <div className="container">
        <div className={styles.body}>

          {/* Sidebar TOC */}
          <aside className={styles.toc}>
            <p className={styles.tocTitle}>সূচিপত্র</p>
            <ul className={styles.tocList}>
              {SECTIONS.map((s) => (
                <li
                  key={s.id}
                  className={`${styles.tocItem} ${activeToc === s.id ? styles.active : ""}`}
                  onClick={() => scrollTo(s.id)}
                >
                  ধারা {s.id}
                </li>
              ))}
            </ul>
          </aside>

          {/* Accordion cards */}
          <div className={styles.content}>
            {SECTIONS.map((sec) => {
              const isOpen = active === sec.id;
              return (
                <div
                  key={sec.id}
                  id={`section-${sec.id}`}
                  ref={(el) => (cardRefs.current[sec.id] = el)}
                  className={`${styles.card} ${isOpen ? styles.cardActive : ""}`}
                  onClick={() => toggle(sec.id)}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardNum}
                      style={{ background: `${sec.color}22`, color: sec.color }}>
                      {sec.id}
                    </div>
                    <div className={styles.cardTitle}>{sec.title}</div>
                    <div className={styles.colorDot} style={{ background: sec.color }} />
                    <svg className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  <div className={`${styles.cardBody} ${isOpen ? styles.cardBodyOpen : ""}`}>
                    <div className={styles.cardInner}>
                      {sec.items.map((item, i) => (
                        <div key={i} className={styles.item}>
                          {item.sub && (
                            <div className={styles.itemSub} style={{ color: sec.color }}>
                              {item.sub}
                            </div>
                          )}
                          <p className={styles.itemBody}>{item.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}