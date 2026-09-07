'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STAT_COLORS = {
  blue: '#2563eb',
  purple: '#8b5cf6',
  orange: '#f97316',
};

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/data').then((r) => r.json()),
      fetch('/api/members').then((r) => r.json()),
    ])
      .then(([dataRes, membersRes]) => {
        setEntries(dataRes.data || []);
        setMembers(membersRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = entries.length;
  const totalMembers = members.length;

  const stats = [
    { label: 'Total Entries', value: total, color: STAT_COLORS.blue, icon: '📦' },
    { label: 'Total Members', value: totalMembers, color: STAT_COLORS.orange, icon: '👥' },
    {
      label: 'Latest Activities',
      value: entries[0]?.title || '—',
      color: STAT_COLORS.purple,
      icon: '🆕',
      href: '/admin/activities',
    },
  ];

  return (
    <div>
      <h1 className="admin-heading">Dashboard</h1>
      {loading ? (
        <p style={{ color: 'var(--admin-text-muted)' }}>লোড হচ্ছে...</p>
      ) : (
        <div className="admin-stat-grid">
          {stats.map((s) => {
            const content = (
              <>
                <div className="admin-stat-icon" style={{ background: s.color }}>{s.icon}</div>
                <div className="admin-stat-label">{s.label}</div>
                <div className="admin-stat-value">{s.value}</div>
              </>
            );

            return s.href ? (
              <Link key={s.label} href={s.href} className="admin-stat-card">
                {content}
              </Link>
            ) : (
              <div key={s.label} className="admin-stat-card">
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}