import { useState, useRef, useEffect } from "react";

const SITES = [
  { name: "ksarsghir.com", label: "الرئيسية", icon: "🏠", url: "https://www.ksarsghir.com", github: "https://github.com/bilal8910/ksarsghir.com", color: "#00b4d8", pages: ["index.html","about.html","advertise.html","privacy.html"] },
  { name: "tourism.ksarsghir.com", label: "السياحة", icon: "🗺️", url: "https://tourism.ksarsghir.com", github: "https://github.com/bilal8910/tourism", color: "#00b4d8", pages: ["index.html","plage.html","port.html","dalia.html","belyounech.html","tangermed.html","ouedelmarsa.html","sidikankouch.html","ksarsghir.html"] },
  { name: "gallery.ksarsghir.com", label: "المعرض", icon: "📸", url: "https://gallery.ksarsghir.com", github: "https://github.com/bilal8910/gallery", color: "#7c3aed", pages: ["index.html"] },
  { name: "store.ksarsghir.com", label: "المتجر", icon: "🛒", url: "https://store.ksarsghir.com", github: "https://github.com/bilal8910/store", color: "#059669", pages: ["index.html"] },
  { name: "meteo.ksarsghir.com", label: "الطقس", icon: "🌤️", url: "https://meteo.ksarsghir.com", github: "https://github.com/bilal8910/meteo", color: "#0891b2", pages: ["index.html"] },
  { name: "salat.ksarsghir.com", label: "الصلاة", icon: "🕌", url: "https://salat.ksarsghir.com", github: "https://github.com/bilal8910/salat", color: "#c29b62", pages: ["index.html"] },
  { name: "blog.ksarsghir.com", label: "المدونة", icon: "✍️", url: "https://blog.ksarsghir.com", github: null, color: "#e97316", pages: ["Blogger"] },
  { name: "taminauto.com", label: "قريباً", icon: "🚗", url: null, github: null, color: "#6b7280", pages: ["قيد الإنشاء"] },
];

const STATS = [
  { label: "متابع فيسبوك", value: "77K", icon: "👥", color: "#1877f2" },
  { label: "مواقع رقمية", value: "8", icon: "🌐", color: "#00b4d8" },
  { label: "صورة احترافية", value: "141+", icon: "📸", color: "#7c3aed" },
  { label: "مقال سياحي", value: "9", icon: "📝", color: "#059669" },
];

const FONTS = [
  { id: "tajawal", label: "Tajawal", family: "'Tajawal', sans-serif", import: "Tajawal:wght@400;500;700;900" },
  { id: "cairo", label: "Cairo", family: "'Cairo', sans-serif", import: "Cairo:wght@400;600;700;900" },
  { id: "almarai", label: "Almarai", family: "'Almarai', sans-serif", import: "Almarai:wght@300;400;700;800" },
  { id: "rubik", label: "Rubik", family: "'Rubik', sans-serif", import: "Rubik:wght@400;500;700;900" },
  { id: "ibm", label: "IBM Plex Arabic", family: "'IBM Plex Sans Arabic', sans-serif", import: "IBM+Plex+Sans+Arabic:wght@400;500;700" },
  { id: "noto", label: "Noto Kufi", family: "'Noto Kufi Arabic', sans-serif", import: "Noto+Kufi+Arabic:wght@400;600;700;900" },
];

const TOPIC_TEMPLATES = [
  { id: "tourism", label: "🏖️ مقال سياحي" },
  { id: "news", label: "📰 خبر محلي" },
  { id: "history", label: "🏛️ مقال تاريخي" },
  { id: "photo", label: "📸 تعليق صورة" },
  { id: "tips", label: "💡 نصائح سفر" },
  { id: "custom", label: "✏️ نصي الخاص" },
];

function CopyBtn({ text, small }) {
  const [done, setDone] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }
  return (
    <button onClick={copy} style={{
      background: done ? "#059669" : "rgba(255,255,255,0.08)",
      border: "none", color: "#fff",
      fontSize: small ? 10 : 11,
      padding: small ? "2px 8px" : "4px 12px",
      borderRadius: 6, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s"
    }}>{done ? "✓ تم" : "📋 نسخ"}</button>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [font, setFont] = useState(FONTS[0]);
  const [showFontPicker, setShowFontPicker] = useState(false);

  // AI Chat
  const [messages, setMessages] = useState([
    { role: "assistant", content: "مرحباً بلال! 👋\nأنا مساعدك لتعديل مواقع القصر الصغير.\n\nمثال: \"عدل لون الهيدر\" أو \"أضف قسم جديد\"" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState(SITES[0]);
  const messagesEnd = useRef(null);
  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Writer
  const [writerMode, setWriterMode] = useState("choose"); // choose | form | generating | result
  const [selectedTemplate, setSelectedTemplate] = useState("tourism");
  const [writerLang, setWriterLang] = useState("ar");
  const [ownText, setOwnText] = useState("");
  const [writerTitle, setWriterTitle] = useState("");
  const [writerKeywords, setWriterKeywords] = useState("");
  const [writerNotes, setWriterNotes] = useState("");
  const [writerImages, setWriterImages] = useState([{ url: "", alt: "" }]);
  const [cards, setCards] = useState([]);
  const [generating, setGenerating] = useState(false);

  async function callClaude(sys, userMsg) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: sys,
        messages: [{ role: "user", content: userMsg }]
      })
    });
    const data = await res.json();
    return data.content?.map(c => c.text || "").join("") || "";
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);
    try {
      const sys = `أنت مساعد متخصص في تعديل مواقع ksarsghir.com. الموقع المختار: ${selectedSite.name}. الصفحات: ${selectedSite.pages.join(", ")}. عند طلب تعديل أعط كود جاهز واذكر مكانه. الرد بالعربية.`;
      const allMsgs = messages.filter((m,i) => i > 0).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: sys,
          messages: [...allMsgs, { role: "user", content: msg }]
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content?.map(c => c.text||"").join("") || "خطأ" }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "⚠️ خطأ في الاتصال" }]); }
    setChatLoading(false);
  }

  async function generateArticle() {
    setGenerating(true);
    setWriterMode("generating");
    try {
      const isOwn = selectedTemplate === "custom";
      const sys = `أنت كاتب محتوى SEO متخصص لموقع ksarsghir.com عن القصر الصغير المغرب. الخط المستخدم في الموقع: ${font.label}. اللغة: ${writerLang === "ar" ? "العربية" : writerLang === "fr" ? "الفرنسية" : "الإنجليزية"}. أجب بالتنسيق المطلوب بدقة.`;

      const imgsDesc = writerImages.filter(i => i.url).map((img, j) => `صورة ${j+1}: ${img.url} | وصف بديل: ${img.alt || "صورة من القصر الصغير"}`).join("\n");

      const prompt = isOwn
        ? `حسّن وطوّر هذا النص لمقال SEO محترف:
---
${ownText}
---
الكلمات المفتاحية: ${writerKeywords || "القصر الصغير، شمال المغرب"}
الملاحظات: ${writerNotes || "لا توجد"}
${imgsDesc ? `الصور:\n${imgsDesc}` : ""}

أجب بهذا التنسيق بالضبط:
[TITLE]العنوان المحسّن هنا[/TITLE]
[META]وصف الميتا هنا (150 حرف)[/META]
[INTRO]مقدمة جذابة (100 كلمة)[/INTRO]
[BODY]النص الكامل مع عناوين فرعية[/BODY]
[IMAGES]نص لوضع الصور: ${imgsDesc || "لا توجد صور"}[/IMAGES]
[TAGS]كلمة1، كلمة2، كلمة3، كلمة4، كلمة5[/TAGS]
[NOTES]ملاحظات للنشر على Blogger أو GitHub[/NOTES]`
        : `اكتب ${TOPIC_TEMPLATES.find(t=>t.id===selectedTemplate)?.label} بعنوان: "${writerTitle}"
الكلمات المفتاحية: ${writerKeywords || "القصر الصغير"}
الملاحظات: ${writerNotes || "لا توجد"}
${imgsDesc ? `الصور:\n${imgsDesc}` : ""}

أجب بهذا التنسيق بالضبط:
[TITLE]العنوان المحسّن هنا[/TITLE]
[META]وصف الميتا هنا (150 حرف)[/META]
[INTRO]مقدمة جذابة (100 كلمة)[/INTRO]
[BODY]النص الكامل مع عناوين فرعية (400-500 كلمة)[/BODY]
[IMAGES]أين توضع الصور في المقال[/IMAGES]
[TAGS]كلمة1، كلمة2، كلمة3، كلمة4، كلمة5[/TAGS]
[NOTES]ملاحظات للنشر على Blogger أو GitHub[/NOTES]`;

      const result = await callClaude(sys, prompt);

      function extract(tag) {
        const m = result.match(new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/${tag}\\]`));
        return m ? m[1].trim() : "";
      }

      setCards([
        { id: "title", label: "📌 العنوان", color: "#00b4d8", content: extract("TITLE"), note: "ضعه في <title> و <h1> و og:title", editable: true },
        { id: "meta", label: "🔍 Meta Description", color: "#7c3aed", content: extract("META"), note: "ضعه في <meta name='description'>", editable: true },
        { id: "intro", label: "✨ المقدمة", color: "#0891b2", content: extract("INTRO"), note: "أول فقرة في المقال — مهمة للـ SEO", editable: true },
        { id: "body", label: "📄 نص المقال", color: "#059669", content: extract("BODY"), note: "المحتوى الرئيسي — انسخه في Blogger أو HTML", editable: true },
        { id: "images", label: "🖼️ الصور", color: "#e97316", content: extract("IMAGES") || (imgsDesc || "لم تُضف صور"), note: "مواضع الصور في المقال", editable: false },
        { id: "tags", label: "🏷️ كلمات دلالية", color: "#ec4899", content: extract("TAGS"), note: "استخدمها كـ labels في Blogger أو tags في HTML", editable: true },
        { id: "notes", label: "💡 ملاحظات النشر", color: "#f59e0b", content: extract("NOTES"), note: "خطوات النشر على Blogger أو GitHub", editable: false },
      ]);
      setWriterMode("result");
    } catch {
      setWriterMode("form");
      alert("خطأ في التوليد");
    }
    setGenerating(false);
  }

  function updateCard(id, val) {
    setCards(prev => prev.map(c => c.id === id ? { ...c, content: val } : c));
  }

  function addImage() {
    setWriterImages(prev => [...prev, { url: "", alt: "" }]);
  }

  function updateImage(i, field, val) {
    setWriterImages(prev => prev.map((img, j) => j === i ? { ...img, [field]: val } : img));
  }

  function removeImage(i) {
    setWriterImages(prev => prev.filter((_, j) => j !== i));
  }

  const inp = (val, onChange, placeholder, rows) => ({
    value: val, onChange: e => onChange(e.target.value),
    placeholder,
    style: {
      width: "100%", background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13,
      fontFamily: font.family, outline: "none", boxSizing: "border-box",
      direction: writerLang === "ar" ? "rtl" : "ltr",
      resize: rows ? "vertical" : "none",
      ...(rows ? { minHeight: rows * 24 + 20 } : {})
    }
  });

  const activeTab = (t) => tab === t;
  const tabBtn = (t, l) => (
    <button key={t} onClick={() => setTab(t)} style={{
      background: activeTab(t) ? "#00b4d8" : "transparent",
      border: `1px solid ${activeTab(t) ? "#00b4d8" : "rgba(0,180,216,0.3)"}`,
      color: activeTab(t) ? "#fff" : "#94a3b8",
      fontSize: 11, fontWeight: 700, padding: "5px 11px", borderRadius: 20,
      cursor: "pointer", fontFamily: font.family, transition: "all 0.2s"
    }}>{l}</button>
  );

  return (
    <div style={{ fontFamily: font.family, background: "#0a0f1a", minHeight: "100vh", color: "#e2e8f0", direction: "rtl" }}>
      <link href={`https://fonts.googleapis.com/css2?family=${font.import}&display=swap`} rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)", borderBottom: "2px solid #00b4d8", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏔️</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#00b4d8" }}>Ksar Sghir</div>
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: 2 }}>DASHBOARD</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {[["overview","📊 الرئيسية"],["sites","🌐 المواقع"],["writer","✍️ كتابة"],["ai","🤖 AI"]].map(([t,l]) => tabBtn(t,l))}
          {/* Font Picker */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowFontPicker(p => !p)} style={{
              background: showFontPicker ? "#1e293b" : "transparent",
              border: "1px solid rgba(0,180,216,0.3)", color: "#94a3b8",
              fontSize: 11, padding: "5px 11px", borderRadius: 20, cursor: "pointer", fontFamily: font.family
            }}>🔤 {font.label}</button>
            {showFontPicker && (
              <div style={{ position: "absolute", top: 38, left: 0, background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 8, zIndex: 200, minWidth: 180 }}>
                {FONTS.map(f => (
                  <div key={f.id} onClick={() => { setFont(f); setShowFontPicker(false); }}
                    style={{ padding: "8px 12px", cursor: "pointer", borderRadius: 8, fontSize: 13, fontFamily: f.family, color: font.id === f.id ? "#00b4d8" : "#e2e8f0", background: font.id === f.id ? "rgba(0,180,216,0.1)" : "transparent" }}>
                    {f.label} — <span style={{ fontSize: 11, color: "#64748b" }}>مرحباً بلال</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>

        {/* ===== OVERVIEW ===== */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {STATS.map((s,i) => (
                <div key={i} style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
              {SITES.map((site,i) => (
                <div key={i} onClick={() => site.url && window.open(site.url,"_blank")} style={{
                  background: "#16213e", border: `1px solid ${site.url ? "rgba(0,180,216,0.15)" : "rgba(255,255,255,0.04)"}`,
                  borderRadius: 12, padding: "13px", cursor: site.url ? "pointer" : "default"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{site.icon}</span>
                    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 700, background: site.url ? "rgba(5,150,105,0.2)" : "rgba(107,114,128,0.2)", color: site.url ? "#34d399" : "#9ca3af" }}>{site.url ? "● مباشر" : "● قريباً"}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: site.color }}>{site.label}</div>
                  <div style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>{site.name}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[["🔍","Google Search Console","https://search.google.com/search-console"],["📈","Google Analytics","https://analytics.google.com"],["💻","GitHub bilal8910","https://github.com/bilal8910"],["📘","Facebook Ksarsghircity","https://facebook.com/ksarsghircity"],["📸","Ksar Sghir Lens","https://facebook.com/ksarsghirlens"],["💬","WhatsApp","https://wa.me/212708053745"]].map(([icon,label,url],i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#e2e8f0" }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ===== SITES ===== */}
        {tab === "sites" && SITES.filter(s => s.url).map((site,i) => (
          <div key={i} style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 18px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{site.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: site.color }}>{site.label}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{site.name}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                <a href={site.url} target="_blank" rel="noreferrer" style={{ background: site.color, color: "#fff", padding: "5px 14px", borderRadius: 20, textDecoration: "none", fontSize: 12, fontWeight: 700 }}>🌐 زيارة</a>
                {site.github && <a href={site.github} target="_blank" rel="noreferrer" style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", padding: "5px 14px", borderRadius: 20, textDecoration: "none", fontSize: 12 }}>💻 GitHub</a>}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {site.pages.map((p,j) => <span key={j} style={{ background: "rgba(0,180,216,0.08)", border: "1px solid rgba(0,180,216,0.15)", color: "#90e0ef", fontSize: 10, padding: "2px 9px", borderRadius: 10 }}>{p}</span>)}
            </div>
          </div>
        ))}

        {/* ===== WRITER ===== */}
        {tab === "writer" && (
          <div>
            {/* Choose mode */}
            {writerMode === "choose" && (
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 5 }}>✍️ كتابة موضوع جديد</div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>يمكنك إما كتابة نصك الخاص أو طلب من AI كتابة مقال</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  {TOPIC_TEMPLATES.map(t => (
                    <div key={t.id} onClick={() => { setSelectedTemplate(t.id); setWriterMode("form"); }}
                      style={{ background: "#16213e", border: "1px solid rgba(0,180,216,0.15)", borderRadius: 14, padding: "20px", cursor: "pointer", textAlign: "center" }}>
                      <div style={{ fontSize: 26, marginBottom: 8 }}>{t.label.split(" ")[0]}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{t.label.split(" ").slice(1).join(" ")}</div>
                      {t.id === "custom" && <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>ألصق نصك وأنا أحسّنه</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            {writerMode === "form" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <button onClick={() => setWriterMode("choose")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "5px 12px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: font.family }}>← رجوع</button>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#00b4d8" }}>
                    {TOPIC_TEMPLATES.find(t=>t.id===selectedTemplate)?.label}
                  </div>
                </div>
                <div style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 22 }}>
                  {/* Language */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 7 }}>🌍 لغة المقال</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[["ar","🇲🇦 العربية"],["fr","🇫🇷 الفرنسية"],["en","🇬🇧 الإنجليزية"]].map(([l,lbl]) => (
                        <button key={l} onClick={() => setWriterLang(l)} style={{
                          background: writerLang===l ? "#00b4d8" : "#0f172a",
                          border: `1px solid ${writerLang===l ? "#00b4d8" : "rgba(255,255,255,0.1)"}`,
                          color: writerLang===l ? "#fff" : "#94a3b8", padding: "6px 14px",
                          borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: font.family
                        }}>{lbl}</button>
                      ))}
                    </div>
                  </div>

                  {/* Own text */}
                  {selectedTemplate === "custom" ? (
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 7 }}>📝 نصك الخاص *</label>
                      <textarea {...inp(ownText, setOwnText, "ألصق نصك هنا... AI سيحسّنه ويضيف SEO", 8)} />
                    </div>
                  ) : (
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 7 }}>عنوان الموضوع *</label>
                      <input {...inp(writerTitle, setWriterTitle, "مثال: شاطئ بليونش — جوهرة شمال المغرب")} />
                    </div>
                  )}

                  {/* Keywords */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 7 }}>🔑 كلمات مفتاحية</label>
                    <input {...inp(writerKeywords, setWriterKeywords, "مثال: بليونش، جبل موسى، غوص، شمال المغرب")} />
                  </div>

                  {/* Notes */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 7 }}>💬 ملاحظات وتعليمات للـ AI</label>
                    <textarea {...inp(writerNotes, setWriterNotes, "مثال: ركّز على الغوص والطبيعة، لا تذكر الأسعار، الأسلوب جذاب للشباب...", 3)} />
                  </div>

                  {/* Images */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <label style={{ fontSize: 12, color: "#94a3b8" }}>🖼️ الصور (اختياري)</label>
                      <button onClick={addImage} style={{ background: "rgba(0,180,216,0.15)", border: "1px solid rgba(0,180,216,0.3)", color: "#00b4d8", fontSize: 11, padding: "3px 10px", borderRadius: 8, cursor: "pointer", fontFamily: font.family }}>+ إضافة صورة</button>
                    </div>
                    {writerImages.map((img,i) => (
                      <div key={i} style={{ background: "#0f172a", borderRadius: 10, padding: "10px 12px", marginBottom: 8, display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "center" }}>
                        <input value={img.url} onChange={e => updateImage(i,"url",e.target.value)} placeholder="رابط الصورة URL"
                          style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", color: "#e2e8f0", fontSize: 12, fontFamily: font.family, outline: "none" }} />
                        <input value={img.alt} onChange={e => updateImage(i,"alt",e.target.value)} placeholder="وصف بديل (alt)"
                          style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", color: "#e2e8f0", fontSize: 12, fontFamily: font.family, outline: "none" }} />
                        {img.url && <img src={img.url} alt="" style={{ width: 40, height: 32, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)" }} onError={e => e.target.style.display="none"} />}
                        {i > 0 && <button onClick={() => removeImage(i)} style={{ background: "rgba(239,68,68,0.15)", border: "none", color: "#f87171", fontSize: 14, width: 28, height: 28, borderRadius: 6, cursor: "pointer" }}>✕</button>}
                      </div>
                    ))}
                  </div>

                  <button onClick={generateArticle} disabled={selectedTemplate==="custom" ? !ownText.trim() : !writerTitle.trim()}
                    style={{
                      background: (selectedTemplate==="custom" ? ownText.trim() : writerTitle.trim()) ? "linear-gradient(135deg,#0096c7,#00b4d8)" : "#334155",
                      border: "none", color: "#fff", padding: "12px", borderRadius: 12,
                      cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: font.family, width: "100%"
                    }}>🚀 توليد المحتوى الآن</button>
                </div>
              </div>
            )}

            {/* Generating */}
            {writerMode === "generating" && (
              <div style={{ textAlign: "center", padding: "70px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#00b4d8", marginBottom: 8 }}>AI يكتب المحتوى...</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>تحسين SEO + بطاقات جاهزة + ملاحظات النشر</div>
              </div>
            )}

            {/* Result — Cards */}
            {writerMode === "result" && cards.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => { setWriterMode("form"); setCards([]); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "5px 12px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: font.family }}>← تعديل</button>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#34d399" }}>✅ المحتوى جاهز — {cards.length} بطاقات</div>
                  </div>
                  <CopyBtn text={cards.map(c => `## ${c.label}\n${c.content}`).join("\n\n")} />
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  {cards.map(card => (
                    <div key={card.id} style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
                      {/* Card Header */}
                      <div style={{ background: `rgba(${card.color==="rgb(0,180,216)"||card.color==="#00b4d8"?"0,180,216":card.color==="#7c3aed"?"124,58,237":card.color==="#059669"?"5,150,105":card.color==="#0891b2"?"8,145,178":card.color==="#e97316"?"233,115,22":card.color==="#ec4899"?"236,72,153":"245,158,11"},0.12)`, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: card.color }}>{card.label}</span>
                          <span style={{ fontSize: 10, color: "#475569", marginRight: 8 }}>— {card.note}</span>
                        </div>
                        <CopyBtn text={card.content} small />
                      </div>
                      {/* Card Body */}
                      {card.editable ? (
                        <textarea value={card.content} onChange={e => updateCard(card.id, e.target.value)}
                          style={{ width: "100%", background: "transparent", border: "none", color: "#cbd5e1", fontSize: 13, lineHeight: 1.7, padding: "14px 16px", fontFamily: font.family, outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", direction: writerLang==="ar"?"rtl":"ltr" }} />
                      ) : (
                        <div style={{ padding: "12px 16px", fontSize: 13, color: "#cbd5e1", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{card.content}</div>
                      )}
                      {/* Images preview inside card */}
                      {card.id === "images" && writerImages.filter(i=>i.url).length > 0 && (
                        <div style={{ padding: "0 16px 14px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {writerImages.filter(i=>i.url).map((img,j) => (
                            <img key={j} src={img.url} alt={img.alt} style={{ height: 60, width: 80, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }} onError={e=>e.target.style.display="none"} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, background: "rgba(0,180,216,0.08)", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 12, padding: "12px 16px", fontSize: 12, color: "#90e0ef" }}>
                  💡 البطاقات قابلة للتعديل مباشرة — عدّل ثم انسخ. لنشر على Blogger انسخ نص المقال وألصقه في محرر HTML.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== AI CHAT ===== */}
        {tab === "ai" && (
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, height: "calc(100vh - 130px)" }}>
            <div>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>اختر الموقع</div>
              {SITES.filter(s=>s.url).map((site,i) => (
                <div key={i} onClick={() => setSelectedSite(site)} style={{
                  background: selectedSite.name===site.name ? "rgba(0,180,216,0.15)" : "#16213e",
                  border: `1px solid ${selectedSite.name===site.name ? "#00b4d8" : "rgba(255,255,255,0.05)"}`,
                  borderRadius: 10, padding: "9px 11px", cursor: "pointer", marginBottom: 5, display: "flex", alignItems: "center", gap: 7
                }}>
                  <span style={{ fontSize: 15 }}>{site.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: selectedSite.name===site.name ? "#00b4d8" : "#e2e8f0" }}>{site.label}</div>
                    <div style={{ fontSize: 9, color: "#64748b" }}>{site.pages.length} صفحات</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                <span>🤖</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#00b4d8" }}>AI مساعد — {selectedSite.name}</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>اطلب تعديل كود أو شرح</div>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column" }}>
                {messages.map((msg,i) => {
                  const parts = msg.content.split(/(```[\s\S]*?```)/g);
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role==="user"?"flex-end":"flex-start", marginBottom: 10 }}>
                      <div style={{ maxWidth: "85%", padding: "9px 13px", borderRadius: msg.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background: msg.role==="user"?"#00b4d8":"#1e293b", color: "#fff", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {parts.map((part,j) => part.startsWith("```") ? (
                          <div key={j} style={{ margin:"6px 0", background:"#0f172a", borderRadius:8, padding:"9px 11px", position:"relative" }}>
                            <CopyBtn text={part.replace(/```[\w]*\n?/,"").replace(/```$/,"")} small />
                            <pre style={{ margin:"18px 0 0", overflow:"auto", color:"#7dd3fc", fontSize:11, fontFamily:"monospace" }}>{part.replace(/```[\w]*\n?/,"").replace(/```$/,"")}</pre>
                          </div>
                        ) : <span key={j}>{part}</span>)}
                      </div>
                    </div>
                  );
                })}
                {chatLoading && <div style={{ color:"#64748b", fontSize:12 }}>⏳ جاري التحليل...</div>}
                <div ref={messagesEnd} />
              </div>
              <div style={{ padding:"10px 14px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:8 }}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}
                  placeholder="مثال: عدل لون الهيدر أو أضف قسم جديد..."
                  style={{ flex:1, background:"#0f172a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 12px", color:"#e2e8f0", fontSize:13, fontFamily:font.family, outline:"none", direction:"rtl" }} />
                <button onClick={sendChat} disabled={chatLoading||!chatInput.trim()} style={{ background:chatLoading||!chatInput.trim()?"#1e293b":"#00b4d8", border:"none", color:"#fff", padding:"8px 14px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:font.family }}>إرسال</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
