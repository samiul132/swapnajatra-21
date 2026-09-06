'use client';

export default function AdminTopbar({ onMenuClick, onLogout }) {
  return (
    <div className="admin-topbar">
      <button className="admin-hamburger" onClick={onMenuClick}>☰</button>
      <input className="admin-search" placeholder="Search..." />
      <button onClick={onLogout} className="admin-logout-btn">
        Logout
      </button>
    </div>
  );
}