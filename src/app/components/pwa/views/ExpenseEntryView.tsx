import { useState } from "react";
import { Camera, X, CheckCircle2, Image, ZapOff, Zap, Focus } from "lucide-react";
import { expenses, EXP_CATS, fmtINR, type ExpCat, type SyncItem } from "../pwaData";

interface CapturedPhoto { id: string; color: string; label: string; }

interface Props {
  isOffline: boolean;
  addPending: (item: Omit<SyncItem, "id">) => void;
}

const PALETTE = ["#1B3A6B","#C9922A","#7C3AED","#0D9488","#EF4444","#F97316","#16A34A","#EC4899"];

export function ExpenseEntryView({ isOffline, addPending }: Props) {
  const [cat, setCat]         = useState<ExpCat | "">("");
  const [amount, setAmount]   = useState("");
  const [desc, setDesc]       = useState("");
  const [photos, setPhotos]   = useState<CapturedPhoto[]>([]);
  const [camera, setCamera]   = useState(false);
  const [flash, setFlash]     = useState(false);
  const [done, setDone]       = useState(false);
  const [shutter, setShutter] = useState(false);

  const catDef = EXP_CATS.find(c => c.id === cat);

  function capture() {
    setShutter(true);
    setTimeout(() => {
      setShutter(false);
      setPhotos(p => [...p, {
        id: `ph-${Date.now()}`,
        color: PALETTE[p.length % PALETTE.length],
        label: catDef ? `${catDef.id} receipt` : "Photo",
      }]);
      setCamera(false);
    }, 200);
  }

  function submit() {
    if (!cat || !amount) return;
    setDone(true);
    addPending({
      entity: "expense",
      title: `Expense — ${fmtINR(Number(amount))}`,
      sub: `${cat} · ${desc || "No description"}`,
      size: photos.length > 0 ? `${(photos.length * 1.8).toFixed(1)} MB` : "0.9 KB",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
      status: "pending",
    });
    setTimeout(() => {
      setDone(false); setCat(""); setAmount(""); setDesc(""); setPhotos([]);
    }, 2500);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div style={{ padding: "4px 12px 12px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Category grid */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Category</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {EXP_CATS.map(c => {
                const active = cat === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    className="active:scale-95 transition-transform"
                    style={{
                      height: 68, borderRadius: 16, display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 4,
                      border: `2px solid ${active ? c.color : "#E2E8F0"}`,
                      background: active ? c.bg : "#fff",
                    }}
                  >
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{c.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: active ? c.color : "#94A3B8" }}>{c.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Amount</p>
            <div style={{ background: "#fff", border: `2px solid ${amount ? "#1B3A6B" : "#E2E8F0"}`, borderRadius: 16, height: 64, display: "flex", alignItems: "center", paddingInline: 16, gap: 8, transition: "border-color 0.2s" }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#CBD5E1" }}>₹</span>
              <input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}
              />
              {amount && catDef && (
                <span style={{ fontSize: 10, color: catDef.color, fontWeight: 800, background: catDef.bg, padding: "3px 8px", borderRadius: 99 }}>{catDef.icon} {catDef.id}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Description</p>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Brief description…"
              rows={2}
              className="w-full outline-none resize-none"
              style={{ background: "#fff", border: "2px solid #E2E8F0", borderRadius: 16, padding: "12px 14px", fontSize: 13, color: "#0F172A", fontFamily: "inherit" }}
            />
          </div>

          {/* Receipt photos */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Receipt Photos</p>
              {photos.length > 0 && (
                <span style={{ fontSize: 9, color: "#F59E0B", fontWeight: 700 }}>⏳ {photos.length} pending upload</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {photos.map(ph => (
                <div key={ph.id} style={{ position: "relative", width: 72, height: 72, borderRadius: 14, background: ph.color, flexShrink: 0, overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <Image size={18} color="rgba(255,255,255,0.5)" />
                    <span style={{ fontSize: 7, color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "0 4px", lineHeight: 1.2 }}>{ph.label}</span>
                  </div>
                  {/* Pending dot */}
                  <span style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderRadius: 99, background: "#FBBF24", border: "1.5px solid #fff" }} />
                  <button
                    onClick={() => setPhotos(p => p.filter(x => x.id !== ph.id))}
                    style={{ position: "absolute", top: 4, left: 4, width: 18, height: 18, borderRadius: 99, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <X size={9} color="#fff" />
                  </button>
                </div>
              ))}
              {/* Add photo button */}
              <button
                onClick={() => setCamera(true)}
                className="active:scale-95 transition-transform"
                style={{ width: 72, height: 72, borderRadius: 14, border: "2px dashed #CBD5E1", background: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}
              >
                <Camera size={20} color="#94A3B8" />
                <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700 }}>Add</span>
              </button>
            </div>
          </div>

          {/* Recent entries */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Recent</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {expenses.slice(0, 4).map(e => {
                const c = EXP_CATS.find(x => x.id === e.cat)!;
                const dotColor = e.status === "synced" ? "#16A34A" : e.status === "failed" ? "#EF4444" : "#F59E0B";
                return (
                  <div key={e.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "9px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.desc}</p>
                      <p style={{ fontSize: 9, color: "#94A3B8" }}>{e.tower} · {e.by}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 900, color: "#0F172A" }}>{fmtINR(e.amount)}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: 99, background: dotColor }} />
                        <span style={{ fontSize: 9, color: "#94A3B8", textTransform: "capitalize" }}>{e.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div style={{ flexShrink: 0, padding: "10px 12px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        {done ? (
          <div style={{ height: 52, borderRadius: 16, background: "#F0FDF4", border: "1.5px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <CheckCircle2 size={17} color="#16A34A" />
            <span style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>
              {isOffline ? "Saved offline · queued for sync" : "Expense submitted!"}
            </span>
          </div>
        ) : (
          <button
            onClick={submit}
            disabled={!cat || !amount}
            className="w-full active:scale-[0.98] transition-transform"
            style={{
              height: 52, borderRadius: 16, fontWeight: 900, fontSize: 15,
              background: cat && amount ? "linear-gradient(135deg,#1B3A6B,#2563EB)" : "#E2E8F0",
              color: cat && amount ? "#fff" : "#94A3B8",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {isOffline && cat && amount && <span style={{ fontSize: 14 }}>📡</span>}
            {catDef?.icon}
            Submit{amount ? ` · ${fmtINR(Number(amount))}` : " Expense"}
          </button>
        )}
      </div>

      {/* ── Camera overlay ── */}
      {camera && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#000", display: "flex", flexDirection: "column" }}>
          {/* Viewfinder */}
          <div style={{ flex: 1, position: "relative", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Flash effect */}
            {shutter && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.8, zIndex: 10 }} />}

            {/* Corner brackets */}
            {[["top-8 left-8","border-t-2 border-l-2"],["top-8 right-8","border-t-2 border-r-2"],["bottom-8 left-8","border-b-2 border-l-2"],["bottom-8 right-8","border-b-2 border-r-2"]].map(([pos, cls], i) => (
              <div key={i} className={`absolute ${pos} ${cls} border-white/50`} style={{ width: 32, height: 32, borderRadius: 4 }} />
            ))}

            {/* Focus reticle */}
            <div style={{ width: 56, height: 56, border: "1px solid rgba(255,255,255,0.4)", borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 4, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.6)" }} />
            </div>

            {/* Top bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" }}>
              <button onClick={() => setCamera(false)} className="active:opacity-60 transition-opacity">
                <X size={22} color="#fff" />
              </button>
              <span style={{ background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99 }}>
                {catDef ? `${catDef.icon} ${catDef.id} Receipt` : "Receipt Photo"}
              </span>
              <button onClick={() => setFlash(f => !f)} className="active:opacity-60 transition-opacity">
                {flash ? <Zap size={20} color="#FBBF24" /> : <ZapOff size={20} color="rgba(255,255,255,0.4)" />}
              </button>
            </div>

            {/* Grid overlay */}
            <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", pointerEvents: "none" }}>
              {[0,1,2,3,4,5,6,7,8].map(i => (
                <div key={i} style={{ border: "0.5px solid rgba(255,255,255,0.06)" }} />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div style={{ flexShrink: 0, background: "#111", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Thumbnail of last photo */}
            <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", border: "2px solid rgba(255,255,255,0.15)" }}>
              {photos.length > 0
                ? <div style={{ width: "100%", height: "100%", background: photos[photos.length-1].color }} />
                : <div style={{ width: "100%", height: "100%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}><Image size={16} color="rgba(255,255,255,0.2)" /></div>
              }
            </div>

            {/* Shutter */}
            <button
              onClick={capture}
              className="active:scale-90 transition-transform"
              style={{ width: 72, height: 72, borderRadius: 99, border: "4px solid rgba(255,255,255,0.8)", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ width: "100%", height: "100%", borderRadius: 99, background: "#fff" }} />
            </button>

            {/* Focus icon */}
            <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Focus size={20} color="rgba(255,255,255,0.4)" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
