'use client';

import { useEffect, useState } from 'react';

function resizeImage(file, maxWidth = 1200, quality = 0.7) {
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

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ id: null, title: '', description: '', imagePreview: '', date: todayStr() });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      const sorted = (data.data || []).slice().sort(
        (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      );
      setActivities(sorted);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ id: null, title: '', description: '', imagePreview: '', date: todayStr() });
    setFormError('');
  }

  function startEdit(entry) {
    setForm({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      imagePreview: entry.image,
      date: (entry.date || entry.createdAt || '').slice(0, 10) || todayStr(),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const preview = await resizeImage(file);
    setForm((f) => ({ ...f, imagePreview: preview }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.imagePreview) {
      setFormError('Title আর image দুইটাই লাগবে');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        image: form.imagePreview,
        date: form.date ? new Date(form.date).toISOString() : undefined,
      };
      const res = form.id
        ? await fetch(`/api/data/${form.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Save failed');
      }
      resetForm();
      loadActivities();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('এই activity টা delete করবে?')) return;
    await fetch(`/api/data/${id}`, { method: 'DELETE' });
    loadActivities();
  }

  return (
    <div>
      <h1 className="admin-heading">Activities</h1>

      <div className="admin-form-card">
        <h3 className="admin-form-heading">{form.id ? 'Activity Edit করো' : 'নতুন Activity যোগ করো'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="admin-input"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="admin-input"
            style={{ minHeight: 80 }}
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="admin-input"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} className="admin-input" />
          {form.imagePreview && <img src={form.imagePreview} alt="preview" className="admin-entry-img" />}
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
        <div className="admin-activities-grid">
          {activities.map((activity) => (
            <div key={activity.id} className="admin-entry-card">
              <img src={activity.image} alt={activity.title} className="admin-entry-img" />
              <h4 className="admin-entry-title">{activity.title}</h4>
              <p className="admin-entry-desc">{activity.description}</p>
              <div>
                <button onClick={() => startEdit(activity)} className="admin-btn-edit">Edit</button>
                <button onClick={() => handleDelete(activity.id)} className="admin-btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}