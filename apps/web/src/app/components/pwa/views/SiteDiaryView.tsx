import { useState } from "react";
import { Camera, X, CheckCircle2, Image, AlertTriangle, Cloud, CloudOff, ChevronDown } from "lucide-react";
import { diaryPhotos, type SitePhoto, type SyncItem } from "../pwaData";

const WEATHER = [
  { id: "sunny",   icon: "☀️",  label: "Sunny"       },
  { id: "partly",  icon: "⛅",  label: "Partly Cloudy"},
  { id: "cloudy",  icon: "☁️",  label: "Cloudy"      },
  { id: "rain",    icon: "🌧️", label: "Rainy"       },
] as const;

const WORK_TAGS = ["RCC Slab","Brick Work","Plaster","MEP","Shuttering","Excavation","Curing","Steel Fixing","Flooring","Painting"];
const PHOTO_PALETTE = ["#1B3A6B","#C9922A","#7C3AED","#0D9488","#EF4444","#16A34A","#F97316","#EC4899"];

interface Props {
  isOffline: boolean;
  addPending: (item: Omit<SyncItem, "id">) => void;
}

export function SiteDiaryView({ isOffline, addPending }: Props) {
  const [weather, setWeather] = useState<string>("sunny");
  const [manpower, setManpower] = useState("87");
  const [workDone, setWorkDone] = useState("");
  const [issues, setIssues]   = useState("");
  const [notes, setNotes]     = useState("");
  const [tags, setTags]       = useState(["RCC Slab", "Curing"]);
  const [photos, setPhotos]   = useState<SitePhoto[]>(diaryPhotos.map(p => ({ ...p })));
  const [camera, setCamera]   = useState(false);
  const [shutter, setShutter] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [equipShow, setEquipShow] = useState(false);

  const EQUIPMENT = ["Tower Crane ×1", "Concrete Pump ×1", "Transit Mixer ×2", "Bar Bending ×2", "Vibrator ×3"];

  function toggleTag(t: string) {
    setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  }

  function capture() {
    setShutter(true);
    setTimeout(() => {
      setShutter(false);
      setPhotos(p => [...p, {
        id: `ph-${Date.now()}`,
        color: PHOTO_PALETTE[p.length % PHOTO_PALETTE.length],
        label: "Site photo",
        size: `${(Math.random() * 3 + 1.2).toFixed(1)} MB`,
        synced: false,
      }]);
      setCamera(false);
    }, 180);
  }

  function save() {
    setSaved(true);
    addPending({
      entity: "diary",
      title: "Site Diary — 19 May",
      sub: `Tower A · ${photos.filter(p=>!p.synced).length} photos pending`,
      size: `${(2.8 + photos.filter(p=>!p.synced).length * 2.1).toFixed(1)} MB`,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
      status: "pending",
    });
    setTimeout(() => setSaved(false), 2500);
  }

  const wx = WEATHER.find(w => w.id === weather)!;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div style={{ padding: "4px 12px 14px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Header card */}
          <div style={{ background: "linear-gradient(135deg,#0F1C2E,#1B3A6B)", borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>19 May 2026</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginTop: 2 }}>Rajiv Mehta · Site Engineer · Tower A</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 28, lineHeight: 1 }}>{wx.icon}</span>
              {isOffline
                ? <CloudOff size={14} color="rgba(255,255,255,0.35)" style={{ marginTop: 4, marginLeft: "auto" }} />
                : <Cloud    size={14} color="#34D399"                  style={{ marginTop: 4, marginLeft: "auto" }} />
              }
            </div>
          </div>

          {/* Weather pills */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Weather</p>
            <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
              {WEATHER.map(w => (
                <button
                  key={w.id}
                  onClick={() => setWeather(w.id)}
                  className="shrink-0 active:scale-95 transition-transform"
                  style={{
                    height: 40, paddingInline: 14, borderRadius: 99,
                    border: `2px solid ${weather === w.id ? "#1B3A6B" : "#E2E8F0"}`,
                    background: weather === w.id ? "#EFF6FF" : "#fff",
                    fontSize: 11, fontWeight: 800,
                    color: weather === w.id ? "#1B3A6B" : "#94A3B8",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{w.icon}</span> {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manpower */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Manpower on Site</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "#fff", border: "2px solid #1B3A6B", borderRadius: 14, height: 52, display: "flex", alignItems: "center", paddingInline: 14, gap: 8, width: 130 }}>
                <span style={{ fontSize: 20 }}>👷</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={manpower}
                  onChange={e => setManpower(e.target.value)}
                  className="bg-transparent outline-none w-full"
                  style={{ fontSize: 22, fontWeight: 900, color: "#0F172A" }}
                />
              </div>
              <span style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>workers today</span>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <button
              onClick={() => setEquipShow(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: equipShow ? 8 : 0 }}
            >
              <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Equipment on Site</p>
              <ChevronDown size={12} color="#94A3B8" style={{ transform: equipShow ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {equipShow && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {EQUIPMENT.map(e => (
                  <span key={e} style={{ background: "#F1F5F9", color: "#475569", fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 99 }}>{e}</span>
                ))}
              </div>
            )}
          </div>

          {/* Work tags */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Work Activities</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {WORK_TAGS.map(t => {
                const active = tags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className="active:scale-95 transition-transform"
                    style={{
                      height: 32, paddingInline: 12, borderRadius: 99,
                      background: active ? "#1B3A6B" : "#fff",
                      color: active ? "#fff" : "#64748B",
                      border: `1.5px solid ${active ? "#1B3A6B" : "#E2E8F0"}`,
                      fontSize: 11, fontWeight: 700,
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Work details */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Work Details</p>
            <textarea
              value={workDone}
              onChange={e => setWorkDone(e.target.value)}
              placeholder="Describe work completed today…"
              rows={3}
              className="w-full outline-none resize-none"
              style={{ background: "#fff", border: "2px solid #E2E8F0", borderRadius: 14, padding: "11px 14px", fontSize: 13, color: "#0F172A", fontFamily: "inherit", lineHeight: 1.5 }}
            />
          </div>

          {/* Issues */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Issues / Safety</p>
            <div style={{ position: "relative" }}>
              <textarea
                value={issues}
                onChange={e => setIssues(e.target.value)}
                placeholder="Any issues or observations…"
                rows={2}
                className="w-full outline-none resize-none"
                style={{ background: issues ? "#FFFBEB" : "#fff", border: `2px solid ${issues ? "#F59E0B" : "#E2E8F0"}`, borderRadius: 14, padding: "11px 14px", fontSize: 13, color: "#0F172A", fontFamily: "inherit", lineHeight: 1.5, transition: "border-color 0.2s, background 0.2s" }}
              />
              {issues && <AlertTriangle size={14} color="#F59E0B" style={{ position: "absolute", top: 12, right: 12 }} />}
            </div>
          </div>

          {/* Engineer notes — dark panel */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Engineer's Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Technical notes, quality checks, next-day plan…"
              rows={3}
              className="w-full outline-none resize-none"
              style={{ background: "linear-gradient(135deg,#0F1C2E,#1B3A6B)", border: "none", borderRadius: 14, padding: "12px 14px", fontSize: 13, color: "#fff", fontFamily: "inherit", lineHeight: 1.5 }}
            />
          </div>

          {/* Site photos */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Site Photos</p>
              <div style={{ display: "flex", gap: 8 }}>
                {photos.filter(p => !p.synced).length > 0 && <span style={{ fontSize: 9, color: "#F59E0B", fontWeight: 700 }}>⏳ {photos.filter(p=>!p.synced).length} pending</span>}
                {photos.filter(p => p.synced).length > 0  && <span style={{ fontSize: 9, color: "#16A34A", fontWeight: 700 }}>✓ {photos.filter(p=>p.synced).length} synced</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {photos.map(ph => (
                <div key={ph.id} style={{ position: "relative", width: 72, height: 72, borderRadius: 14, background: ph.color, overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <Image size={16} color="rgba(255,255,255,0.45)" />
                    <span style={{ fontSize: 7, color: "rgba(255,255,255,0.45)", textAlign: "center", padding: "0 3px", lineHeight: 1.2 }}>{ph.label}</span>
                  </div>
                  {/* Sync dot */}
                  <span style={{ position: "absolute", bottom: 5, right: 5, width: 8, height: 8, borderRadius: 99, background: ph.synced ? "#22C55E" : "#FBBF24", border: "1.5px solid rgba(255,255,255,0.6)" }} />
                  <button onClick={() => setPhotos(p => p.filter(x => x.id !== ph.id))} style={{ position: "absolute", top: 4, left: 4, width: 18, height: 18, borderRadius: 99, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X size={9} color="#fff" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setCamera(true)}
                className="active:scale-95 transition-transform"
                style={{ width: 72, height: 72, borderRadius: 14, border: "2px dashed #CBD5E1", background: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, flexShrink: 0 }}
              >
                <Camera size={19} color="#94A3B8" />
                <span style={{ fontSize: 8, color: "#94A3B8", fontWeight: 700 }}>Capture</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div style={{ flexShrink: 0, padding: "10px 12px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        {saved ? (
          <div style={{ height: 52, borderRadius: 16, background: "#F0FDF4", border: "1.5px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <CheckCircle2 size={17} color="#16A34A" />
            <span style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>
              {isOffline ? "Diary saved offline · will sync" : "Site diary saved!"}
            </span>
          </div>
        ) : (
          <button
            onClick={save}
            className="w-full active:scale-[0.98] transition-transform"
            style={{ height: 52, borderRadius: 16, background: "linear-gradient(135deg,#1B3A6B,#2563EB)", color: "#fff", fontWeight: 900, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {isOffline && <span style={{ fontSize: 14 }}>📡</span>}
            {wx.icon} Save Diary
          </button>
        )}
      </div>

      {/* Camera overlay */}
      {camera && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#000", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, position: "relative", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {shutter && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.75, zIndex: 5 }} />}
            {/* Corner brackets */}
            {([0,1,2,3]).map(i => (
              <div key={i} style={{ position: "absolute", top: ["8px","8px","auto","auto"][i], right: ["auto","8px","auto","8px"][i], bottom: ["auto","auto","8px","8px"][i], left: ["8px","auto","8px","auto"][i], width: 28, height: 28, borderTop: i < 2 ? "2px solid rgba(255,255,255,0.45)" : undefined, borderBottom: i >= 2 ? "2px solid rgba(255,255,255,0.45)" : undefined, borderLeft: i % 2 === 0 ? "2px solid rgba(255,255,255,0.45)" : undefined, borderRight: i % 2 === 1 ? "2px solid rgba(255,255,255,0.45)" : undefined }} />
            ))}
            {/* Reticle */}
            <div style={{ width: 48, height: 48, border: "1px solid rgba(255,255,255,0.35)", borderRadius: 99 }} />
            {/* Label */}
            <div style={{ position: "absolute", top: 14, left: 0, right: 0, textAlign: "center" }}>
              <span style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 99 }}>Site Documentation</span>
            </div>
            <button onClick={() => setCamera(false)} style={{ position: "absolute", top: 12, left: 14, width: 38, height: 38, borderRadius: 99, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={18} color="#fff" />
            </button>
          </div>
          <div style={{ flexShrink: 0, background: "#111", padding: "18px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", border: "2px solid rgba(255,255,255,0.12)" }}>
              {photos.length > 0
                ? <div style={{ width: "100%", height: "100%", background: photos[photos.length-1].color }} />
                : <div style={{ width: "100%", height: "100%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}><Image size={14} color="rgba(255,255,255,0.2)" /></div>
              }
            </div>
            <button onClick={capture} className="active:scale-90 transition-transform" style={{ width: 72, height: 72, borderRadius: 99, border: "4px solid rgba(255,255,255,0.75)", padding: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 99, background: "#fff" }} />
            </button>
            <div style={{ width: 48, height: 48 }} />
          </div>
        </div>
      )}
    </div>
  );
}
