"use client";
import { useState } from "react";
import Link from "next/link";
const NAV_LINKS = [
  { href: "/",             label: "হোম" },
  { href: "/activities",   label: "কার্যক্রম" },
  { href: "/gothontontro", label: "গঠনতন্ত্র" },
  { href: "/members",      label: "সদস্যবৃন্দ" },
  { href: "/contact",      label: "যোগাযোগ" },
];
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/ssc-2021_organization.pdf";
    a.download = "ssc-2021_organization.pdf";
    a.click();
  };

  const handleDownloadPad = () => {
    const a = document.createElement("a");
    a.href = "/images/pad.png";
    a.download = "swapnajatra-21-pad.png";
    a.click();
  };

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link href="/" className="logo">
            <span className="logo-main">স্বপ্নযাত্রা-২১</span>
            <span className="logo-sub">SSC 2021 · নিশ্চিন্তপুর</span>
          </Link>
          <nav className="nav-links" aria-label="Main navigation">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-3 flex-wrap">
            <button className="download-btn" onClick={handleDownload}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              গঠনতন্ত্র
            </button>

            <button className="download-btn" onClick={handleDownloadPad}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              প্যাড
            </button>
          </div>

          <button
            className="hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </header>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="mobile-link"
            onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        <button className="mobile-dl" onClick={handleDownloadPad}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          প্যাড ডাউনলোড
        </button>
        <button className="mobile-dl" onClick={handleDownload}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          গঠনতন্ত্র ডাউনলোড
        </button>
      </div>
    </>
  );
}