'use client';

export default function AdminTopbar({ onMenuClick, onLogout }) {
  const handleDownloadPad = () => {
    const a = document.createElement("a");
    a.href = "/images/pad.png";
    a.download = "swapnajatra-21-pad.png";
    a.click();
  };

  return (
    <div className="admin-topbar">
      <button className="admin-hamburger" onClick={onMenuClick}>☰</button>
      <input className="admin-search" placeholder="Search..." />
      <button onClick={handleDownloadPad} className="admin-pad-btn">
        প্যাড ডাউনলোড
      </button>
      <button onClick={onLogout} className="admin-logout-btn">
        Logout
      </button>
    </div>
  );
}