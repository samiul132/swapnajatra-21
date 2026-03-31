import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">

          {/* Brand */}
          <div className="footer-brand">
            <span className="footer-brand-name">স্বপ্নযাত্রা-২১</span>
            <p className="footer-brand-desc">
              নিশ্চিন্তপুর উচ্চ বিদ্যালয়ের ২০২১ সালের এসএসসি পরীক্ষার্থীদের
              একটি অরাজনৈতিক ও কল্যাণমূলক সংগঠন।
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="footer-col-title">লিংকসমূহ</p>
            <ul className="footer-link-list">
              <li><Link href="/">হোম</Link></li>
              <li><Link href="/gothontontro">গঠনতন্ত্র</Link></li>
              <li><Link href="/members">সদস্যবৃন্দ</Link></li>
              <li><Link href="/contact">যোগাযোগ</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="footer-col-title">তথ্য</p>

            <div className="footer-info-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>নিশ্চিন্তপুর উচ্চ বিদ্যালয়, বাংলাদেশ</span>
            </div>

            <div className="footer-info-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>প্রতিষ্ঠা: ২০২৬</span>
            </div>

            <div className="footer-info-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>অরাজনৈতিক, অলাভজনক সংগঠন</span>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} <strong>স্বপ্নযাত্রা SSC 2021</strong> · সর্বস্বত্ব সংরক্ষিত
          </p>
          <div className="footer-badge">
            <span className="footer-dot" />
            সক্রিয় সংগঠন
          </div>
        </div>
      </div>
    </footer>
  );
}