'use client';

import { useEffect, useState } from 'react';

const ROLE_OPTIONS = [
  { key: 'president', label: 'সভাপতি' },
  { key: 'vice', label: 'সহ-সভাপতি' },
  { key: 'secretary', label: 'সেক্রেটারি' },
  { key: 'advisor', label: 'উপদেষ্টা' },
  { key: 'student_advisor', label: 'ছাত্র-উপদেষ্টা' },
  { key: 'education_secretary', label: 'শিক্ষা বিষয়ক সম্পাদক' },
  { key: 'organizing_secretary', label: 'সাংগঠনিক সম্পাদক' },
  { key: 'health_secretary', label: 'স্বাস্থ্য বিষয়ক সম্পাদক' },
  { key: 'religious_secretary', label: 'ধর্ম বিষয়ক সম্পাদক' },
  { key: 'social_welfare_secretary', label: 'সমাজকল্যাণ সম্পাদক' },
  { key: 'women_affairs_secretary', label: 'নারী বিষয়ক সম্পাদক' },
  { key: 'publicity_secretary', label: 'প্রচার সম্পাদক' },
  { key: 'finance_secretary', label: 'অর্থ সম্পাদক' },
  { key: 'expatriate_welfare_secretary', label: 'প্রবাসী কল্যাণ সম্পাদক' },
  { key: 'office_secretary', label: 'দপ্তর সম্পাদক' },
  { key: 'member', label: 'সদস্যবৃন্দ' },
];

const ROLE_LABEL_MAP = Object.fromEntries(ROLE_OPTIONS.map((r) => [r.key, r.label]));

const emptyForm = { id: null, name: '', roles: ['member'], sub: '', initial: '', image: '' };

function resizeImage(file, maxWidth = 400, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// পুরনো record এ `role` (string) থাকলে সেটাকে array বানিয়ে দেয়, নতুন `roles` (array) থাকলে সেটাই ফেরত দেয়
function normalizeRoles(m) {
  if (Array.isArray(m.roles) && m.roles.length) return m.roles;
  if (m.role) return [m.role];
  return ['member'];
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      setMembers(data.data || []);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setFormError('');
  }

  function startEdit(m) {
    setForm({
      id: m.id,
      name: m.name,
      roles: normalizeRoles(m),
      sub: m.sub,
      initial: m.initial,
      image: m.image || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleRole(key) {
    setForm((f) => {
      const has = f.roles.includes(key);
      const next = has ? f.roles.filter((r) => r !== key) : [...f.roles, key];
      return { ...f, roles: next };
    });
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const preview = await resizeImage(file);
    setForm((f) => ({ ...f, image: preview }));
  }

  function removeImage() {
    setForm((f) => ({ ...f, image: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) {
      setFormError('Name লাগবে');
      return;
    }
    if (!form.roles.length) {
      setFormError('অন্তত একটা পদ select করো');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name, roles: form.roles, sub: form.sub, initial: form.initial, image: form.image };
      const res = form.id
        ? await fetch(`/api/members/${form.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Save failed');
      }
      resetForm();
      loadMembers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('এই member টা delete করবে?')) return;
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
    loadMembers();
  }

  return (
    <div>
      <h1 className="admin-heading">Members</h1>

      <div className="admin-form-card">
        <h3 className="admin-form-heading">{form.id ? 'Member Edit করো' : 'নতুন Member যোগ করো'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="নাম"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="admin-input"
          />

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13.5, color: 'var(--admin-text-muted)' }}>
            পদ (একাধিক select করা যাবে)
          </label>
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px 14px',
              padding: '10px 12px', marginBottom: '1rem',
              border: '1px solid var(--admin-border)', borderRadius: 8,
            }}
          >
            {ROLE_OPTIONS.map((r) => (
              <label key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.roles.includes(r.key)}
                  onChange={() => toggleRole(r.key)}
                />
                {r.label}
              </label>
            ))}
          </div>

          <input
            type="text"
            placeholder="Sub-title (যেমন: SSC 2021 · বিজ্ঞান বিভাগ)"
            value={form.sub}
            onChange={(e) => setForm((f) => ({ ...f, sub: e.target.value }))}
            className="admin-input"
          />
          <input
            type="text"
            placeholder="Initial (ছবি না দিলে avatar এ দেখাবে)"
            value={form.initial}
            onChange={(e) => setForm((f) => ({ ...f, initial: e.target.value }))}
            className="admin-input"
            maxLength={2}
          />

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13.5, color: 'var(--admin-text-muted)' }}>
            Profile ছবি (optional — না দিলে initial letter avatar দেখাবে)
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="admin-input" />

          {form.image && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
              <img
                src={form.image}
                alt="preview"
                style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--admin-border)' }}
              />
              <button type="button" onClick={removeImage} className="admin-btn-edit">ছবি সরাও</button>
            </div>
          )}

          {formError && <p className="admin-error-text">{formError}</p>}
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving ? 'সেভ হচ্ছে...' : form.id ? 'Update করো' : 'Add করো'}
          </button>
          {form.id && (
            <button type="button" onClick={resetForm} className="admin-btn-edit" style={{ marginLeft: 8 }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <p style={{ color: 'var(--admin-text-muted)' }}>লোড হচ্ছে...</p>
      ) : (
        <div className="admin-entries-grid">
          {members.map((m) => {
            const roles = normalizeRoles(m);
            return (
              <div key={m.id} className="admin-entry-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.name}
                      style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 50, height: 50, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--admin-primary-soft)', color: 'var(--admin-primary)',
                        fontWeight: 700, fontSize: 15,
                      }}
                    >
                      {m.initial}
                    </div>
                  )}
                  <div>
                    <h4 className="admin-entry-title" style={{ margin: 0 }}>{m.name}</h4>
                    <p className="admin-entry-desc" style={{ margin: 0 }}>
                      {roles.map((rk) => ROLE_LABEL_MAP[rk] || rk).join(' · ')}
                    </p>
                  </div>
                </div>
                <p className="admin-entry-desc">{m.sub}</p>
                <div>
                  <button onClick={() => startEdit(m)} className="admin-btn-edit">Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="admin-btn-danger">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}