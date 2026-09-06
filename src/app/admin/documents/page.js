'use client';

import { useEffect, useState, useRef } from 'react';

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mimeType) {
  return mimeType && mimeType.startsWith('image/');
}

function fileIconFor(mimeType, name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (mimeType === 'application/pdf' || ext === 'pdf') return '📕';
  if (ext === 'doc' || ext === 'docx') return '📘';
  if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return '📗';
  if (ext === 'zip' || ext === 'rar' || ext === '7z') return '🗜️';
  if (ext === 'ai') return '🎨';
  if (ext === 'psd') return '🖌️';
  if (ext === 'ppt' || ext === 'pptx') return '📙';
  return '📄';
}

const UNCATEGORIZED = 'Uncategorized';

export default function AdminDocumentsPage() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [rootDragOver, setRootDragOver] = useState(false);
  const [rootUploading, setRootUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState('');
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const rootFileInputRef = useRef(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setFolders(data.folders || []);
      setFiles(data.files || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateFolder(e) {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      if (!res.ok) throw new Error('Failed');
      setNewFolderName('');
      setShowNewFolder(false);
      loadAll();
    } catch (err) {
      alert('ফোল্ডার তৈরি করা যায়নি');
    }
  }

  async function handleDeleteFolder(folder) {
    if (!confirm(`"${folder.name}" ফোল্ডার এবং এর সব ফাইল ডিলিট হয়ে যাবে। নিশ্চিত?`)) return;
    try {
      await fetch(`/api/documents/${folder.id}`, { method: 'DELETE' });
      if (activeFolderId === folder.id) setActiveFolderId(null);
      loadAll();
    } catch (err) {
      alert('ফোল্ডার ডিলিট করা যায়নি');
    }
  }

  async function uploadFiles(fileList) {
    if (!activeFolderId) return;
    const selected = Array.from(fileList || []);
    if (!selected.length) return;

    setUploading(true);
    for (const file of selected) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        await fetch(`/api/documents/${activeFolderId}/files`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            mimeType: file.type,
            size: file.size,
            data: dataUrl,
          }),
        });
      } catch (err) {
        console.error('Upload failed for', file.name, err);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    loadAll();
  }

  function handleFileInputChange(e) {
    uploadFiles(e.target.files);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }

  // --- Root-level সরাসরি upload (কোনো folder এ না ঢুকেই) — "Uncategorized" এ জমা হবে ---

  async function getOrCreateUncategorizedFolderId() {
    // আগে থেকেই আছে কিনা দেখো (state থেকে)
    const existing = folders.find((f) => f.name === UNCATEGORIZED);
    if (existing) return existing.id;

    // না থাকলে নতুন বানাও
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: UNCATEGORIZED }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Folder create failed');
    return data.folder.id;
  }

  async function uploadRootFiles(fileList) {
    const selected = Array.from(fileList || []);
    if (!selected.length) return;

    setRootUploading(true);
    try {
      const folderId = await getOrCreateUncategorizedFolderId();
      for (const file of selected) {
        try {
          const dataUrl = await readFileAsDataURL(file);
          await fetch(`/api/documents/${folderId}/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              mimeType: file.type,
              size: file.size,
              data: dataUrl,
            }),
          });
        } catch (err) {
          console.error('Root upload failed for', file.name, err);
        }
      }
    } catch (err) {
      alert('আপলোড করা যায়নি: ' + err.message);
    } finally {
      setRootUploading(false);
      if (rootFileInputRef.current) rootFileInputRef.current.value = '';
      loadAll();
    }
  }

  function handleRootFileInputChange(e) {
    uploadRootFiles(e.target.files);
  }

  function handleRootDrop(e) {
    e.preventDefault();
    setRootDragOver(false);
    uploadRootFiles(e.dataTransfer.files);
  }

  async function handleDeleteFile(file) {
    if (!confirm(`"${file.name}" ডিলিট করবে?`)) return;
    try {
      await fetch(`/api/documents/${activeFolderId}/files/${file.id}`, { method: 'DELETE' });
      if (previewFile?.id === file.id) setPreviewFile(null);
      loadAll();
    } catch (err) {
      alert('ফাইল ডিলিট করা যায়নি');
    }
  }

  function downloadFile(file) {
    const a = document.createElement('a');
    a.href = file.data;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleFileClick(file) {
    if (isImage(file.mimeType)) {
      setPreviewFile(file);
    } else {
      downloadFile(file);
    }
  }

  // --- Bulk folder upload (পুরো লোকাল ফোল্ডার একবারে) ---
  async function handleBulkFolderUpload(e) {
    const fileList = Array.from(e.target.files || []);
    console.log('Total files picked:', fileList.length);
    if (!fileList.length) return;

    const groups = {};

    for (const file of fileList) {
      const relPath = file.webkitRelativePath || file.name;
      const parts = relPath.split('/');

      let folderName;
      if (parts.length >= 3) {
        folderName = parts[1];
      } else {
        folderName = UNCATEGORIZED;
      }

      if (!groups[folderName]) groups[folderName] = [];
      groups[folderName].push(file);
    }

    const folderNames = Object.keys(groups);
    if (!folderNames.length) {
      alert('কোনো ফাইল পাওয়া যায়নি।');
      if (folderInputRef.current) folderInputRef.current.value = '';
      return;
    }

    setBulkUploading(true);
    try {
      for (const folderName of folderNames) {
        setBulkProgress(`"${folderName}" ফোল্ডার তৈরি হচ্ছে...`);

        let newFolderId;
        if (folderName === UNCATEGORIZED) {
          try {
            newFolderId = await getOrCreateUncategorizedFolderId();
          } catch (err) {
            console.error('Uncategorized folder create failed', err);
            continue;
          }
        } else {
          const folderRes = await fetch('/api/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: folderName }),
          });
          const folderData = await folderRes.json();
          if (!folderRes.ok) {
            console.error(`Folder "${folderName}" create failed`, folderData.error);
            continue;
          }
          newFolderId = folderData.folder.id;
        }

        const filesForThisFolder = groups[folderName];
        for (let i = 0; i < filesForThisFolder.length; i++) {
          const file = filesForThisFolder[i];
          setBulkProgress(`"${folderName}" → ফাইল ${i + 1}/${filesForThisFolder.length}: ${file.name}`);
          try {
            const dataUrl = await readFileAsDataURL(file);
            await fetch(`/api/documents/${newFolderId}/files`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: file.name,
                mimeType: file.type,
                size: file.size,
                data: dataUrl,
              }),
            });
          } catch (err) {
            console.error(`Upload failed: ${folderName}/${file.name}`, err);
          }
        }
      }
      setBulkProgress('সম্পূর্ণ হয়েছে ✅');
    } finally {
      setBulkUploading(false);
      if (folderInputRef.current) folderInputRef.current.value = '';
      loadAll();
      setTimeout(() => setBulkProgress(''), 3000);
    }
  }

  const activeFolder = folders.find((f) => f.id === activeFolderId);
  const filesInActiveFolder = files.filter((f) => f.folderId === activeFolderId);

  return (
    <div>
      <h1 className="admin-heading">All Documents</h1>

      {!activeFolderId ? (
        <>
          <div style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="admin-btn-primary" onClick={() => setShowNewFolder((s) => !s)}>
              + নতুন ফোল্ডার
            </button>

            <button
              className="admin-btn-edit"
              onClick={() => folderInputRef.current?.click()}
              disabled={bulkUploading}
            >
              📂 ফোল্ডার আপলোড করো (bulk)
            </button>
            <input
              type="file"
              ref={folderInputRef}
              onChange={handleBulkFolderUpload}
              webkitdirectory="true"
              directory=""
              multiple
              style={{ display: 'none' }}
            />

            {bulkProgress && (
              <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>{bulkProgress}</span>
            )}
          </div>

          {showNewFolder && (
            <form onSubmit={handleCreateFolder} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="ফোল্ডারের নাম"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="admin-input"
                autoFocus
              />
              <button type="submit" className="admin-btn-primary">তৈরি করো</button>
            </form>
          )}

          {/* --- সরাসরি রুট-লেভেল upload বক্স (কোনো ফোল্ডারে না ঢুকেই) --- */}
          <div
            onDragOver={(e) => { e.preventDefault(); setRootDragOver(true); }}
            onDragLeave={() => setRootDragOver(false)}
            onDrop={handleRootDrop}
            onClick={() => rootFileInputRef.current?.click()}
            style={{
              border: `2px dashed ${rootDragOver ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
              borderRadius: 10,
              padding: '1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: 20,
              background: rootDragOver ? 'var(--admin-primary-soft)' : 'transparent',
              color: 'var(--admin-text-muted)',
            }}
          >
            {rootUploading
              ? 'আপলোড হচ্ছে...'
              : 'ছবি, PDF, Word, Excel — যেকোনো ফাইল সরাসরি এখানে ড্র্যাগ-ড্রপ করো (Uncategorized ফোল্ডারে জমা হবে)'}
            <input
              type="file"
              multiple
              ref={rootFileInputRef}
              onChange={handleRootFileInputChange}
              style={{ display: 'none' }}
            />
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)' }}>লোড হচ্ছে...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
              {folders.map((folder) => {
                const count = files.filter((f) => f.folderId === folder.id).length;
                return (
                  <div key={folder.id} style={{ textAlign: 'center', position: 'relative' }}>
                    <div
                      onClick={() => setActiveFolderId(folder.id)}
                      style={{ cursor: 'pointer', padding: 10, borderRadius: 10 }}
                    >
                      <div style={{ fontSize: 48, lineHeight: 1 }}>📁</div>
                      <p style={{ margin: '8px 0 2px', fontSize: 13.5, wordBreak: 'break-word' }}>{folder.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--admin-text-muted)' }}>{count} টি ফাইল</p>
                    </div>
                    <button
                      onClick={() => handleDeleteFolder(folder)}
                      title="Delete folder"
                      style={{
                        position: 'absolute', top: 4, right: 4, border: 'none', background: 'rgba(0,0,0,0.05)',
                        borderRadius: 6, cursor: 'pointer', fontSize: 12, padding: '2px 6px',
                      }}
                    >
                      🗑
                    </button>
                  </div>
                );
              })}
              {folders.length === 0 && <p style={{ color: 'var(--admin-text-muted)' }}>কোনো ফোল্ডার নেই</p>}
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button className="admin-btn-edit" onClick={() => setActiveFolderId(null)}>← ফিরে যাও</button>
            <h3 style={{ margin: 0 }}>{activeFolder?.name}</h3>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
              borderRadius: 10,
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: 20,
              background: dragOver ? 'var(--admin-primary-soft)' : 'transparent',
              color: 'var(--admin-text-muted)',
            }}
          >
            {uploading ? 'আপলোড হচ্ছে...' : 'ফাইল এখানে ড্র্যাগ-ড্রপ করো, অথবা ক্লিক করে সিলেক্ট করো'}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)' }}>লোড হচ্ছে...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
              {filesInActiveFolder.map((file) => (
                <div key={file.id} style={{ textAlign: 'center', position: 'relative' }}>
                  <div
                    onClick={() => handleFileClick(file)}
                    style={{ cursor: 'pointer', padding: 8, borderRadius: 10 }}
                  >
                    {isImage(file.mimeType) ? (
                      <div
                        style={{
                          width: '100%', aspectRatio: '1 / 1.15', borderRadius: 8, overflow: 'hidden',
                          border: '1px solid var(--admin-border)', background: '#f5f5f5',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <img
                          src={file.data}
                          alt={file.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '100%', aspectRatio: '1 / 1.15', borderRadius: 8,
                          border: '1px solid var(--admin-border)', background: '#f5f5f5',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44,
                        }}
                      >
                        {fileIconFor(file.mimeType, file.name)}
                      </div>
                    )}
                    <p style={{ margin: '8px 0 2px', fontSize: 12.5, wordBreak: 'break-word' }}>{file.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--admin-text-muted)' }}>{formatSize(file.size)}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 4 }}>
                    <button
                      onClick={() => downloadFile(file)}
                      title="Download"
                      style={{ border: 'none', background: 'rgba(0,0,0,0.05)', borderRadius: 6, cursor: 'pointer', fontSize: 12, padding: '2px 8px' }}
                    >
                      ⬇
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file)}
                      title="Delete"
                      style={{ border: 'none', background: 'rgba(0,0,0,0.05)', borderRadius: 6, cursor: 'pointer', fontSize: 12, padding: '2px 8px' }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
              {filesInActiveFolder.length === 0 && (
                <p style={{ color: 'var(--admin-text-muted)' }}>এই ফোল্ডারে কোনো ফাইল নেই</p>
              )}
            </div>
          )}
        </>
      )}

      {previewFile && (
        <div
          onClick={() => setPreviewFile(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'zoom-out',
          }}
        >
          <img
            src={previewFile.data}
            alt={previewFile.name}
            style={{ maxWidth: '90%', maxHeight: '85%', objectFit: 'contain', borderRadius: 6 }}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setPreviewFile(null); }}
            style={{
              position: 'absolute', top: 20, right: 24, background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}