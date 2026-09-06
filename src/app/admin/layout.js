'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import './admin.css';

export default function AdminLayout({ children }) {
  const [authed, setAuthed] = useState(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/check')
      .then((r) => r.json())
      .then((d) => setAuthed(d.authed))
      .catch(() => setAuthed(false));
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      const d = await res.json();
      setLoginError(d.error || 'Login failed');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
    setPassword('');
  }

  if (authed === null) {
    return <div className="admin-loading-screen">লোড হচ্ছে...</div>;
  }

  if (!authed) {
    return (
      <div className="admin-login-wrap">
        <form onSubmit={handleLogin} className="admin-login-card">
          <h2 className="admin-login-title">Admin Login</h2>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
          />
          {loginError && <p className="admin-error-text">{loginError}</p>}
          <button type="submit" className="admin-btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className={`admin-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <AdminSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar onMenuClick={() => setSidebarOpen((v) => !v)} onLogout={handleLogout} />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}