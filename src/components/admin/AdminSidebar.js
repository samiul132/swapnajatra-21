'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/custom-pad', label: 'Custom Pad', icon: '📝' },
  { href: '/admin/activities', label: 'Activities', icon: '🖼️' },
  { href: '/admin/members', label: 'Members', icon: '👥' },
];

export default function AdminSidebar({ open, onNavigate }) {
  const pathname = usePathname();

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-logo">
        <span>🏡</span>
        <span>Swapnajatra 21 Admin</span>
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
    </aside>
  );
}