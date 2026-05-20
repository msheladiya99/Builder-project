import { useState } from "react";
import { diaryEntries, WEATHER_CFG, NOTE_CATEGORY_CFG, engineerNotes } from "../constructionData";
import type { WeatherType } from "../constructionData";

interface Props { isDark: boolean; }

const QUALITY_COLORS = {
  pass:    { icon: "✓", color: "#22C55E", bg: "#F0FDF4" },
  fail:    { icon: "✗", color: "#EF4444", bg: "#FEF2F2" },
  pending: { icon: "?", color: "#F59E0B", bg: "#FFFBEB" },
};

const PRIORITY_COLOR: Record<string, string> = {
  critical: "#EF4444", high: "#F97316", medium: "#F59E0B", low: "#94A3B8",
};

export function SiteDiaryView({ isDark }: Props) {
  const [selectedId, setSelectedId] = useState(diaryEntries[0].id);
  const [newMode, setNewMode]       = useState(false);
  const [newWeather, setNewWeather] = useState<WeatherType>("sunny");
  const [submitted, setSubmitted]   = useState(false);

  const bg     = isDark ? "#0F172A" : "#F1F5F9";
  const card   = isDark ? "#1E293B" : "#FFFFFF";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const txt    = isDark ? "#F1F5F9" : "#0F172A";
  const sub    = isDark ? "#94A3B8" : "#64748B";

  const selected = diaryEntries.find(d => d.id === selectedId) ?? diaryEntries[0];

  if (newMode) {
    return (
      <div style={{ height: "100%", overflowY: "auto", background: bg, padding: 20 }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button onClick={() => { setNewMode(false); setSubmitted(false); }} style={{ fontSize: 12, color: "#1B3A6B", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>← Back</button>
            <span style={{ fontSize: 15, fontWeight: 800, color: txt }}>New Site Diary Entry</span>
            <span style={{ fontSize: 11, color: sub }}>Today, 19 May 2026</span>
          </div>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#22C55E", marginBottom: 8 }}>Diary Entry Saved!</div>
              <p style={{ fontSize: 13, color: sub, marginBottom: 20 }}>Site diary for today has been recorded successfully.</p>
              <button
                onClick={() => { setNewMode(false); setSubmitted(false); }}
                style={{ padding: "10px 24px", background: "#1B3A6B", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13 }}
              >
                Back to Diary
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Weather */}
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 10 }}>Weather Conditions</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {(Object.entries(WEATHER_CFG) as [WeatherType, typeof WEATHER_CFG[WeatherType]][]).map(([k, cfg]) => (
                    <button
                      key={k} onClick={() => setNewWeather(k)}
                      style={{
                        padding: "10px 6px", borderRadius: 8, border: `2px solid ${newWeather === k ? cfg.color : border}`,
                        background: newWeather === k ? (isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC") : "transparent",
                        cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                      <span style={{ fontSize: 10, color: newWeather === k ? cfg.color : sub }}>{cfg.label}</span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontSize: 11, color: sub, display: "block", marginBottom: 4 }}>Temperature (°C)</label>
                  <input type="number" placeholder="e.g. 34" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${border}`, background: isDark ? "#0F172A" : "#F8FAFC", color: txt, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Workers */}
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 10 }}>Workforce Count</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 8, alignItems: "center" }}>
                  {["Mason", "Carpenter", "Helper", "Electrician", "Plumber", "Painter"].map(trade => (
                    [
                      <div key={`${trade}-l`} style={{ fontSize: 12, color: txt }}>{trade}</div>,
                      <input key={`${trade}-i`} type="number" min={0} placeholder="0" style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${border}`, background: isDark ? "#0F172A" : "#F8FAFC", color: txt, fontSize: 12, outline: "none", textAlign: "center", width: "100%", boxSizing: "border-box" }} />,
                    ]
                  ))}
                </div>
              </div>

              {/* Work Done */}
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 8 }}>Work Completed Today</div>
                <textarea rows={4} placeholder="List each task on a new line..." style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${border}`, background: isDark ? "#0F172A" : "#F8FAFC", color: txt, fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>

              {/* Materials */}
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 8 }}>Materials Received</div>
                <textarea rows={3} placeholder="e.g. TMT Steel 4.2 MT (DO: 2026-0519-01)" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${border}`, background: isDark ? "#0F172A" : "#F8FAFC", color: txt, fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>

              {/* Issues */}
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 8 }}>Issues / Delays</div>
                <textarea rows={3} placeholder="Describe any issues, equipment breakdowns, or delays..." style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${border}`, background: isDark ? "#0F172A" : "#F8FAFC", color: txt, fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>

              {/* Quality Checks */}
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 10 }}>Quality Checks</div>
                {["Column cover check", "Mortar mix ratio", "Rebar alignment", "Formwork stability"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ flex: 1, fontSize: 12, color: txt }}>{item}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {(["pass","fail","pending"] as const).map(s => (
                        <button key={s} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${QUALITY_COLORS[s].color}`, background: "transparent", cursor: "pointer", fontSize: 10, color: QUALITY_COLORS[s].color, fontWeight: 600 }}>{s}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Engineer Note */}
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 8 }}>Engineer's Note / Remarks</div>
                <textarea rows={4} placeholder="Overall assessment, next day plan, important instructions..." style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${border}`, background: isDark ? "#0F172A" : "#F8FAFC", color: txt, fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>

              <button
                onClick={() => setSubmitted(true)}
                style={{ padding: "14px 0", background: "#1B3A6B", color: "#fff", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 14 }}
              >
                Save Diary Entry
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", background: bg }}>

      {/* Diary List Sidebar */}
      <div style={{ width: 200, flexShrink: 0, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", background: card, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${border}` }}>
          <button
            onClick={() => setNewMode(true)}
            style={{ width: "100%", padding: "8px 0", background: "#1B3A6B", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700 }}
          >
            + New Entry
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {diaryEntries.map(d => {
            const isActive = d.id === selectedId;
            const wcfg = WEATHER_CFG[d.weather];
            return (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                style={{
                  width: "100%", padding: "12px 14px", border: "none", cursor: "pointer",
                  background: isActive ? (isDark ? "#0F172A" : "#EFF6FF") : "transparent",
                  borderLeft: isActive ? "3px solid #1B3A6B" : "3px solid transparent",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? "#1B3A6B" : txt }}>{d.displayDate}</div>
                <div style={{ fontSize: 10, color: sub, marginTop: 2 }}>{wcfg.icon} {wcfg.label} · {d.workers.reduce((s, w) => s + w.count, 0)} workers</div>
                <div style={{ fontSize: 10, color: sub, marginTop: 1 }}>📷 {d.photoCount} photos</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Diary Detail */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1B3A6B, #2563EB)", borderRadius: 12, padding: "16px 20px", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{selected.displayDate}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{selected.engineer} · {selected.designation}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24 }}>{WEATHER_CFG[selected.weather].icon}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>{WEATHER_CFG[selected.weather].label} · {selected.temperature}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{selected.workers.reduce((s, w) => s + w.count, 0)}</div>
              <div style={{ fontSize: 9, opacity: 0.8 }}>TOTAL WORKERS</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.2)" }} />
            {selected.workers.map(w => (
              <div key={w.trade} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{w.count}</div>
                <div style={{ fontSize: 9, opacity: 0.7 }}>{w.trade.toUpperCase()}</div>
              </div>
            ))}
            <div style={{ width: 1, background: "rgba(255,255,255,0.2)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>📷 {selected.photoCount}</div>
              <div style={{ fontSize: 9, opacity: 0.8 }}>PHOTOS</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Work Done */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 10 }}>✅ Work Completed</div>
            {selected.workDone.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, color: "#22C55E", marginTop: 1, flexShrink: 0 }}>▸</span>
                <span style={{ fontSize: 12, color: txt, lineHeight: 1.4 }}>{w}</span>
              </div>
            ))}
          </div>

          {/* Materials + Issues */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 10 }}>📦 Materials Received</div>
            {selected.materialsReceived.length > 0 ? selected.materialsReceived.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, color: "#C9922A", marginTop: 1, flexShrink: 0 }}>▸</span>
                <span style={{ fontSize: 12, color: txt, lineHeight: 1.4 }}>{m}</span>
              </div>
            )) : (
              <p style={{ fontSize: 12, color: sub, marginBottom: 0 }}>No materials received today.</p>
            )}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 6 }}>⚠️ Issues / Delays</div>
              {selected.issues.length > 0 ? selected.issues.map((issue, i) => (
                <div key={i} style={{ padding: "6px 10px", background: "#FEF2F2", borderRadius: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#EF4444" }}>! {issue}</span>
                </div>
              )) : (
                <p style={{ fontSize: 12, color: "#22C55E" }}>No issues reported. ✓</p>
              )}
            </div>
          </div>
        </div>

        {/* Quality Checks */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 10 }}>🔍 Quality Checks</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
            {selected.qualityChecks.map((q, i) => {
              const qc = QUALITY_COLORS[q.status];
              return (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", background: qc.bg, borderRadius: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: qc.color }}>{qc.icon}</span>
                  <span style={{ fontSize: 12, color: txt, flex: 1 }}>{q.item}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: qc.color, textTransform: "uppercase" }}>{q.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engineer Note */}
        <div style={{ background: "linear-gradient(135deg, rgba(27,58,107,0.08), rgba(27,58,107,0.03))", border: "1px solid rgba(27,58,107,0.2)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>📝</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: txt }}>Engineer's Note</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: sub }}>— {selected.engineer}</span>
          </div>
          <p style={{ fontSize: 13, color: txt, lineHeight: 1.7, margin: 0 }}>{selected.engineerNote}</p>
        </div>

        {/* Open Action Notes for today */}
        {engineerNotes.filter(n => n.date === selected.displayDate.split(", ")[1] || n.date === "19 May 2026").slice(0, 2).length > 0 && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 10 }}>⚡ Action Items</div>
            {engineerNotes.filter(n => n.actionRequired && n.status === "open").slice(0, 3).map(note => {
              const cc = NOTE_CATEGORY_CFG[note.category];
              const pc = PRIORITY_COLOR[note.priority];
              return (
                <div key={note.id} style={{ padding: "10px 12px", background: isDark ? "#0F172A" : "#F8FAFC", borderRadius: 8, borderLeft: `3px solid ${pc}`, marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: cc.color, background: cc.bg, borderRadius: 4, padding: "1px 5px" }}>{cc.label}</span>
                    <span style={{ fontSize: 9, color: pc, fontWeight: 700, textTransform: "uppercase" }}>{note.priority}</span>
                  </div>
                  <p style={{ fontSize: 12, color: txt, margin: 0, lineHeight: 1.4 }}>{note.content.slice(0, 120)}…</p>
                  <div style={{ fontSize: 10, color: sub, marginTop: 4 }}>{note.author}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
