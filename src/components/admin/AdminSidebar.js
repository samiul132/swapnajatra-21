'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/custom-pad', label: 'Custom Pad', icon: '📝' },
  { href: '/admin/activities', label: 'Activities', icon: '🖼️' },
  { href: '/admin/members', label: 'Members', icon: '👥' },
  { href: '/admin/documents', label: 'Documents', icon: '📄' },
];

export default function AdminSidebar({ open, onNavigate }) {
  const pathname = usePathname();

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-logo">
        <Image
          src="/images/logo.png"
          alt="Swapnajatra-21 Logo"
          width={32}
          height={32}
        />
        <span>Swapnajatra-21 Admin</span>
      </div>
      <nav className="admin-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <Link
          href="https://swapnajatra-21.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-sidebar-footer-link"
        >
          <span>🌐</span>
          <span>Visit Swapnajatra-21</span>
        </Link>
      </div>
    </aside>
  );
}