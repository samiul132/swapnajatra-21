'use client';

import { useEffect, useState } from 'react';

const MAX_VIDEO_BYTES = 15 * 1024 * 1024; // 15MB

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

function readVideoAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const emptyForm = { id: null, title: '', description: '', images: [], video: '', date: todayStr() };

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

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
    setForm(emptyForm);
    setFormError('');
  }

  function startEdit(entry) {
    const images = Array.isArray(entry.images) && entry.images.length
      ? entry.images
      : (entry.image ? [entry.image] : []);
    setForm({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      images,
      video: entry.video || '',
      date: (entry.date || entry.createdAt || '').slice(0, 10) || todayStr(),
    });
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleImagesChange(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingImages(true);
    setFormError('');
    try {
      const resized = await Promise.all(files.map((f) => resizeImage(f)));
      setForm((f) => ({ ...f, images: [...f.images, ...resized] }));
    } catch {
      setFormError('ছবি প্রসেস করতে সমস্যা হয়েছে');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  }

  function removeImage(index) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  async function handleVideoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFormError('');
    if (!file.type.startsWith('video/')) {
      setFormError('অনুগ্রহ করে একটি ভিডিও ফাইল নির্বাচন করুন');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setFormError('ভিডিও সাইজ ১৫MB এর বেশি হতে পারবে না, ছোট ক্লিপ ব্যবহার করুন');
      e.target.value = '';
      return;
    }
    try {
      const dataUrl = await readVideoAsDataURL(file);
      setForm((f) => ({ ...f, video: dataUrl }));
    } catch {
      setFormError('ভিডিও লোড করতে সমস্যা হয়েছে');
    } finally {
      e.target.value = '';
    }
  }

  function removeVideo() {
    setForm((f) => ({ ...f, video: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || form.images.length === 0) {
      setFormError('Title আর কমপক্ষে একটি ছবি দুইটাই লাগবে');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        images: form.images,
        image: form.images[0], 
        video: form.video || null,
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

          <label className="admin-field-label">ছবি (একাধিক নির্বাচন করা যাবে)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="admin-input"
          />
          {uploadingImages && <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>ছবি প্রসেস হচ্ছে...</p>}
          {form.images.length > 0 && (
            <div className="admin-thumb-row">
              {form.images.map((img, i) => (
                <div key={i} className="admin-thumb">
                  <img src={img} alt={`preview-${i}`} className="admin-thumb-img" />
                  <button type="button" onClick={() => removeImage(i)} className="admin-thumb-remove">×</button>
                </div>
              ))}
            </div>
          )}

          <label className="admin-field-label">ভিডিও (ঐচ্ছিক, সর্বোচ্চ ১৫MB)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="admin-input"
          />
          {form.video && (
            <div className="admin-video-preview-wrap">
              <video src={form.video} controls className="admin-video-preview" />
              <button type="button" onClick={removeVideo} className="admin-btn-danger" style={{ marginTop: 6 }}>
                ভিডিও সরাও
              </button>
            </div>
          )}

          {formError && <p className="admin-error-text">{formError}</p>}
          <button type="submit" className="admin-btn-primary" disabled={saving || uploadingImages}>
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
          {activities.map((activity) => {
            const images = Array.isArray(activity.images) && activity.images.length
              ? activity.images
              : (activity.image ? [activity.image] : []);
            return (
              <div key={activity.id} className="admin-entry-card">
                <img src={images[0]} alt={activity.title} className="admin-entry-img" />
                {images.length > 1 && (
                  <div className="admin-entry-badge">+{images.length - 1} ছবি</div>
                )}
                {activity.video && <div className="admin-entry-badge">🎬 ভিডিও আছে</div>}
                <h4 className="admin-entry-title">{activity.title}</h4>
                <p className="admin-entry-desc">{activity.description}</p>
                <div>
                  <button onClick={() => startEdit(activity)} className="admin-btn-edit">Edit</button>
                  <button onClick={() => handleDelete(activity.id)} className="admin-btn-danger">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}