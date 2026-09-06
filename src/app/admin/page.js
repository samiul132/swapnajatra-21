'use client';

import { useEffect, useState } from 'react';

const STAT_COLORS = {
  blue: '#2563eb',
  purple: '#8b5cf6',
  green: '#22c55e',
  orange: '#f97316',
};

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then((r) => r.json())
      .then((d) => setEntries(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const total = entries.length;
  const thisMonth = entries.filter((e) => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: 'Total Entries', value: total, color: STAT_COLORS.blue, icon: '📦' },
    { label: 'This Month', value: thisMonth, color: STAT_COLORS.green, icon: '📅' },
    { label: 'Latest Entry', value: entries[0]?.title || '—', color: STAT_COLORS.purple, icon: '🆕' },
    { label: 'Total Members', value: '—', color: STAT_COLORS.orange, icon: '👥' },
  ];

  return (
    <div>
      <h1 className="admin-heading">Dashboard</h1>
      {loading ? (
        <p style={{ color: 'var(--admin-text-muted)' }}>লোড হচ্ছে...</p>
      ) : (
        <div className="admin-stat-grid">
          {stats.map((s) => (
            <div key={s.label} className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: s.color }}>{s.icon}</div>
              <div className="admin-stat-label">{s.label}</div>
              <div className="admin-stat-value">{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}