"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, Color, FontFamily, FontSize } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { useRef, useCallback, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./page.module.css";

// ─────────────────────────────────────────────────────────────────────
// A4 at 96 dpi = 794 × 1123 px  (210mm × 297mm)
// We render a FIXED 794×1123 canvas and CSS-scale it to fit the viewport.
// All image coords are stored in px relative to this fixed canvas,
// so print output is 1-to-1 identical to what you see on screen.
// ─────────────────────────────────────────────────────────────────────
const A4_W = 794;   // px
const A4_H = 1123;  // px

// pad.png content zone (adjust these to match your image)
const PAD_TOP    = 0.19 * A4_H;  // ~213px
const PAD_BOTTOM = 0.875 * A4_H; // ~983px  (so bottom 12.5% = footer)
const PAD_LEFT   = 0.05 * A4_W;  // ~40px
const PAD_RIGHT  = 0.96 * A4_W;  // ~762px

// ── Floating Image ────────────────────────────────────────────────────
function FloatingImage({ img, onUpdate, onDelete, onSelect, isSelected, scale }) {
  const { id, src, px, py, pw } = img;
  const wrapRef = useRef(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const startData = useRef({});

  // Mouse-down on body → drag to move
  const onBodyMouseDown = useCallback((e) => {
    if (resizing.current) return;
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect(id);
    dragging.current = true;

    startData.current = {
      mx: e.clientX, my: e.clientY,
      ox: px, oy: py,
      scale,
    };

    const onMove = (ev) => {
      if (!dragging.current) return;
      const d = startData.current;
      // Convert screen pixels → canvas pixels by dividing by scale
      const nx = Math.max(0, Math.min(A4_W - pw, d.ox + (ev.clientX - d.mx) / d.scale));
      const ny = Math.max(0, Math.min(A4_H - 20, d.oy + (ev.clientY - d.my) / d.scale));
      onUpdate(id, { px: nx, py: ny });
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [id, px, py, pw, scale, onUpdate, onSelect]);

  // Mouse-down on resize handle
  const onResizeMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;

    startData.current = {
      mx: e.clientX,
      startW: pw,
      scale,
    };

    const onMove = (ev) => {
      if (!resizing.current) return;
      const d = startData.current;
      const newW = Math.max(30, Math.min(A4_W - px, d.startW + (ev.clientX - d.mx) / d.scale));
      onUpdate(id, { pw: newW });
    };
    const onUp = () => {
      resizing.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [id, px, pw, scale, onUpdate]);

  return (
    <div
      ref={wrapRef}
      data-floatimg="1"
      className={styles.floatImg}
      style={{
        left: px,
        top: py,
        width: pw,
        zIndex: isSelected ? 30 : 20,
        outline: isSelected ? "2px solid #1a56db" : "2px solid transparent",
        cursor: "grab",
      }}
      onMouseDown={onBodyMouseDown}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: 3,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {isSelected && (
        <>
          <button
            className={styles.floatImgDelete}
            onMouseDown={(e) => { e.stopPropagation(); onDelete(id); }}
            title="মুছুন"
          >✕</button>
          <div
            className={styles.floatImgResize}
            onMouseDown={onResizeMouseDown}
            title="সাইজ পরিবর্তন"
          />
          <div className={styles.floatImgLabel}>↔ টেনে সরান</div>
        </>
      )}
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────
const FONT_SIZES = ["10","11","12","13","14","16","18","20","22","24","28","32","36","48","60","72"];
const FONTS = [
  { label: "Noto Serif Bengali", value: "'Noto Serif Bengali', serif" },
  { label: "Hind Siliguri",      value: "'Hind Siliguri', sans-serif" },
  { label: "Times New Roman",    value: "'Times New Roman', serif" },
  { label: "Georgia",            value: "Georgia, serif" },
  { label: "Arial",              value: "Arial, sans-serif" },
];

function Btn({ title, active, onClick, children }) {
  return (
    <button title={title} onClick={onClick}
      className={`${styles.toolBtn} ${active ? styles.toolBtnActive : ""}`} type="button">
      {children}
    </button>
  );
}

const icons = {
  bold:      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/></svg>,
  italic:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
  underline: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>,
  strike:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="4" y1="12" x2="20" y2="12"/><path d="M17.5 6.5C17.5 4 15 3 12 3s-5 1-5 3.5c0 5 10 5 10 9 0 2.5-2.5 4-5 4s-5.5-1-5.5-4"/></svg>,
  alignL:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>,
  alignC:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
  alignR:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>,
  alignJ:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  ul:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>,
  ol:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4" strokeLinecap="round"/><path d="M4 10h2" strokeLinecap="round"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" strokeLinecap="round"/></svg>,
  image:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21"/></svg>,
  imgurl:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21"/><path d="M19 3l2 2-2 2M21 5H14" strokeWidth="1.8"/></svg>,
  link:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  undo:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  redo:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  h1:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M4 12h8M4 6v12M12 6v12M17 12l3-3v9"/></svg>,
  h2:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M4 12h8M4 6v12M12 6v12M21 18h-4c0-4 4-3 4-6 0-1.5-1-2.5-2-2.5s-2 1-2 2"/></svg>,
  quote:     <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  highlight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>,
  clear:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  print:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  pdf:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6M9 11h6M9 18h4"/></svg>,
};

// ── Main Component ────────────────────────────────────────────────────
export default function CustomPadPage() {
  const printRef = useRef(null);   // wraps the fixed 794×1123 canvas
  const outerRef = useRef(null);   // outer container for measuring available width
  const imgInputRef = useRef(null);

  const [savedMsg, setSavedMsg] = useState("");
  const [fontSize, setFontSize] = useState("14");
  const [font, setFont] = useState(FONTS[0].value);
  const [floatImgs, setFloatImgs] = useState([]);
  const [selectedImgId, setSelectedImgId] = useState(null);

  // scale = outerWidth / A4_W  so the fixed canvas fills available space
  const [scale, setScale] = useState(1);

  const [pdfMsg, setPdfMsg] = useState("");
  const [imgMsg, setImgMsg] = useState("");

  useEffect(() => {
    if (!outerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setScale(Math.min(1, w / A4_W)); // never upscale beyond 100%
    });
    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Editor ────────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle, Color, FontFamily, FontSize, Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
    ],
    immediatelyRender: false,
    content: "",
    editorProps: { attributes: { class: styles.tiptap, spellcheck: "false" } },
  });

  // deselect image on outside click
  useEffect(() => {
    const h = (e) => { if (!e.target.closest("[data-floatimg]")) setSelectedImgId(null); };
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, []);

  // ── Print ─────────────────────────────────────────────────────────
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "স্বপ্নযাত্রা-২১ প্যাড",
    pageStyle: `
      @page { margin: 0; size: 210mm 297mm portrait; }
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; width: 210mm !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `,
  });

  // ── PDF ───────────────────────────────────────────────────────────
  const handleSavePDF = useCallback(async () => {
    if (!printRef.current) return;
    setSelectedImgId(null);
    setPdfMsg("⏳ তৈরি হচ্ছে...");
    await new Promise(r => setTimeout(r, 100));
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf().set({
        margin: 0,
        filename: "swapnajatra-21-pad.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff", width: A4_W, height: A4_H },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(printRef.current).save();
      setPdfMsg("✓ PDF সংরক্ষিত!");
    } catch (err) {
      console.error(err);
      setPdfMsg("❌ ব্যর্থ হয়েছে");
    }
    setTimeout(() => setPdfMsg(""), 3000);
  }, []);

  // ── Image (PNG/JPG) ─────────────────────────────────────────────
  const handleSaveImage = useCallback(async (format = "png") => {
    if (!printRef.current) return;
    setSelectedImgId(null);
    setImgMsg("⏳ তৈরি হচ্ছে...");
    await new Promise(r => setTimeout(r, 100));
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(printRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: A4_W,
        height: A4_H,
      });

      const mime = format === "jpg" ? "image/jpeg" : "image/png";
      const quality = format === "jpg" ? 0.95 : 1;
      const dataUrl = canvas.toDataURL(mime, quality);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `swapnajatra-21-pad.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setImgMsg("✓ ছবি সংরক্ষিত!");
    } catch (err) {
      console.error(err);
      setImgMsg("❌ ব্যর্থ হয়েছে");
    }
    setTimeout(() => setImgMsg(""), 3000);
  }, []);

  // ── Floating image helpers ────────────────────────────────────────
  const addFloatImage = useCallback((src) => {
    const id = `img_${Date.now()}`;
    // default: place in text content zone, 200px wide
    setFloatImgs(prev => [...prev, {
      id, src,
      px: PAD_LEFT,
      py: PAD_TOP + 10,
      pw: 200,
    }]);
    setSelectedImgId(id);
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => addFloatImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [addFloatImage]);

  const insertImageUrl = useCallback(() => {
    const url = window.prompt("ছবির URL দিন:");
    if (url) addFloatImage(url);
  }, [addFloatImage]);

  const updateFloatImg = useCallback((id, patch) => {
    setFloatImgs(prev => prev.map(img => img.id === id ? { ...img, ...patch } : img));
  }, []);

  const deleteFloatImg = useCallback((id) => {
    setFloatImgs(prev => prev.filter(img => img.id !== id));
    setSelectedImgId(null);
  }, []);

  // ── Link ──────────────────────────────────────────────────────────
  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("লিংক URL:", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  // The fixed canvas is 794×1123; we scale-transform it to fit the outer container.
  // outerRef height must be set to A4_H * scale so page doesn't overlap.
  const scaledH = A4_H * scale;

  return (
    <div className={styles.wrapper}>
      {/* ── Toolbar ──────────────────────────────────── */}
      <div className={styles.toolbar}>
        <select className={styles.select} value={font}
          onChange={(e) => { setFont(e.target.value); editor.chain().focus().setFontFamily(e.target.value).run(); }}>
          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <select className={styles.selectSm} value={fontSize}
          onChange={(e) => { setFontSize(e.target.value); editor.chain().focus().setFontSize(e.target.value + "px").run(); }}>
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className={styles.sep} />
        <Btn title="Bold"        active={editor.isActive("bold")}      onClick={() => editor.chain().focus().toggleBold().run()}>{icons.bold}</Btn>
        <Btn title="Italic"      active={editor.isActive("italic")}    onClick={() => editor.chain().focus().toggleItalic().run()}>{icons.italic}</Btn>
        <Btn title="Underline"   active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>{icons.underline}</Btn>
        <Btn title="Strike"      active={editor.isActive("strike")}    onClick={() => editor.chain().focus().toggleStrike().run()}>{icons.strike}</Btn>

        <div className={styles.sep} />
        <Btn title="H1"    active={editor.isActive("heading",{level:1})} onClick={() => editor.chain().focus().toggleHeading({level:1}).run()}>{icons.h1}</Btn>
        <Btn title="H2"    active={editor.isActive("heading",{level:2})} onClick={() => editor.chain().focus().toggleHeading({level:2}).run()}>{icons.h2}</Btn>
        <Btn title="Quote" active={editor.isActive("blockquote")}         onClick={() => editor.chain().focus().toggleBlockquote().run()}>{icons.quote}</Btn>

        <div className={styles.sep} />
        <Btn title="বামে"    active={editor.isActive({textAlign:"left"})}    onClick={() => editor.chain().focus().setTextAlign("left").run()}>{icons.alignL}</Btn>
        <Btn title="মাঝে"   active={editor.isActive({textAlign:"center"})}  onClick={() => editor.chain().focus().setTextAlign("center").run()}>{icons.alignC}</Btn>
        <Btn title="ডানে"   active={editor.isActive({textAlign:"right"})}   onClick={() => editor.chain().focus().setTextAlign("right").run()}>{icons.alignR}</Btn>
        <Btn title="Justify" active={editor.isActive({textAlign:"justify"})} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>{icons.alignJ}</Btn>

        <div className={styles.sep} />
        <Btn title="বুলেট" active={editor.isActive("bulletList")}  onClick={() => editor.chain().focus().toggleBulletList().run()}>{icons.ul}</Btn>
        <Btn title="নম্বর"  active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>{icons.ol}</Btn>

        <div className={styles.sep} />
        <label className={styles.colorWrap} title="লেখার রঙ">
          <span className={styles.colorIcon}>A</span>
          <input type="color" defaultValue="#1a1a2e" className={styles.colorInput}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />
        </label>
        <label className={styles.colorWrap} title="হাইলাইট রঙ">
          <span className={styles.hlIcon}>{icons.highlight}</span>
          <input type="color" defaultValue="#ffd700" className={styles.colorInput}
            onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()} />
        </label>

        <div className={styles.sep} />
        <Btn title="ছবি আপলোড" onClick={() => imgInputRef.current?.click()}>{icons.image}</Btn>
        <input ref={imgInputRef} type="file" accept="image/*" className={styles.hidden} onChange={handleImageUpload} />
        <Btn title="ছবি URL"   onClick={insertImageUrl}>{icons.imgurl}</Btn>
        <Btn title="লিংক"      active={editor.isActive("link")} onClick={setLink}>{icons.link}</Btn>

        <div className={styles.sep} />
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}>{icons.undo}</Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}>{icons.redo}</Btn>

        <div className={styles.spacer} />
        <Btn title="সব মুছুন" onClick={() => {editor.chain().focus().clearContent().run();setFloatImgs([]);}}>
        {icons.clear}
        </Btn>
        <button className={styles.saveActionBtn} onClick={() => handleSaveImage("png")} type="button">
          <span className={styles.actionLabel}>{icons.image} {imgMsg || "PNG সংরক্ষণ"}</span>
        </button>
        <button className={styles.saveActionBtn} onClick={handleSavePDF} type="button">
          <span className={styles.actionLabel}>{icons.pdf} {pdfMsg || "PDF সংরক্ষণ"}</span>
        </button>
        <button className={styles.printActionBtn} onClick={handlePrint} type="button">
          <span className={styles.actionLabel}>{icons.print} প্রিন্ট</span>
        </button>
      </div>

      {/* <div className={styles.hint}>
        🖼️ ছবি যোগ করলে <strong>মাউস দিয়ে ধরে যেকোনো জায়গায় সরাতে পারবেন</strong> — কোণার নীল handle দিয়ে সাইজ পরিবর্তন, ✕ দিয়ে মুছুন। যেখানে রাখবেন Print/PDF-এ হুবহু সেখানেই থাকবে।
      </div> */}

      {/* ── Pad outer: sets the visible height based on scale ─────── */}
      <div
        ref={outerRef}
        className={styles.padOuter}
        style={{ height: scaledH }}
      >
        {/*
          Fixed 794×1123 canvas scaled to fit.
          transform-origin: top left  →  scales from top-left corner.
          This means left/top pixel positions of children are 1-to-1
          with print coordinates — no conversion needed.
        */}
        <div
          ref={printRef}
          className={styles.padSheet}
          style={{
            width: A4_W,
            height: A4_H,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
          data-pad="1"
        >
          {/* Background pad image */}
          <div className={styles.padBg} aria-hidden="true" />

          {/* Text editor — lives in the content zone */}
          <div className={styles.editorWrap}>
            <EditorContent editor={editor} />
          </div>

          {/* Floating images — absolute px coords on the 794×1123 canvas */}
          {floatImgs.map(img => (
            <FloatingImage
              key={img.id}
              img={img}
              isSelected={selectedImgId === img.id}
              onSelect={setSelectedImgId}
              onUpdate={updateFloatImg}
              onDelete={deleteFloatImg}
              scale={scale}
            />
          ))}
        </div>
      </div>
    </div>
  );
}