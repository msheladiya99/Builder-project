import { milestones, dailyUpdates, engineerNotes, getDelayedMilestones, getOverallProgress, getBOQSummary, fmtINR, STATUS_CFG, WEATHER_CFG, NOTE_CATEGORY_CFG } from "../constructionData";

interface Props { isDark: boolean; onNavigate: (tab: string) => void; }

const CATEGORY_PROGRESS = [
  { label: "Civil & Structure", pct: 72, color: "#1B3A6B", items: 6  },
  { label: "Masonry",           pct: 50, color: "#C9922A", items: 3  },
  { label: "Plastering",        pct: 35, color: "#0D9488", items: 4  },
  { label: "Flooring",          pct: 0,  color: "#7C3AED", items: 4  },
  { label: "MEP",               pct: 14, color: "#EF4444", items: 6  },
  { label: "Finishing",         pct: 12, color: "#F97316", items: 5  },
];

export function OverviewView({ isDark, onNavigate }: Props) {
  const bg       = isDark ? "#0F172A" : "#F1F5F9";
  const card     = isDark ? "#1E293B" : "#FFFFFF";
  const border   = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const txt      = isDark ? "#F1F5F9" : "#0F172A";
  const sub      = isDark ? "#94A3B8" : "#64748B";
  const delayed  = getDelayedMilestones();
  const overall  = getOverallProgress();
  const boq      = getBOQSummary();
  const latest   = dailyUpdates[0];
  const critNotes = engineerNotes.filter(n => n.priority === "critical" || n.status === "open").slice(0, 3);

  const KPI_DATA = [
    { label: "Overall Progress", value: `${overall}%`, sub: "As of today", color: "#1B3A6B", icon: "📊" },
    { label: "BOQ Executed",     value: fmtINR(boq.executedAmt), sub: `of ${fmtINR(boq.totalAmt)}`, color: "#22C55E", icon: "💰" },
    { label: "Active Milestones", value: `${milestones.filter(m => m.status === "in-progress").length}`, sub: `${delayed.length} delayed`, color: delayed.length > 0 ? "#EF4444" : "#22C55E", icon: "🚩" },
    { label: "Today's Workers",  value: `${latest.workerCount}`, sub: `${WEATHER_CFG[latest.weather].icon} ${latest.weather}`, color: "#C9922A", icon: "👷" },
  ];

  return (
    <div style={{ height: "100%", overflowY: "auto", background: bg, padding: "20px" }}>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        {KPI_DATA.map(k => (
          <div key={k.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{k.icon}</span>
              <span style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k.label}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: sub, marginTop: 3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: txt }}>Project Overall Progress</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#1B3A6B" }}>{overall}%</span>
        </div>
        <div style={{ height: 14, background: isDark ? "#334155" : "#E2E8F0", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ width: `${overall}%`, height: "100%", background: "linear-gradient(90deg, #1B3A6B, #2563EB)", borderRadius: 8, transition: "width 0.6s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: sub }}>Project start: Jan 2025</span>
          <span style={{ fontSize: 11, color: sub }}>Possession: Dec 2026</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Delayed Milestones Alert */}
        <div style={{ background: card, border: `1px solid ${delayed.length > 0 ? "#FECACA" : border}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: delayed.length > 0 ? "#EF4444" : txt }}>
              Delayed Milestones ({delayed.length})
            </span>
            <button
              onClick={() => onNavigate("milestones")}
              style={{ marginLeft: "auto", fontSize: 10, color: "#1B3A6B", fontWeight: 600, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              View all →
            </button>
          </div>
          {delayed.length === 0 ? (
            <p style={{ fontSize: 12, color: sub }}>All milestones on track 🎉</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {delayed.map(m => (
                <div key={m.id} style={{ padding: "10px 12px", background: "#FEF2F2", borderRadius: 8, borderLeft: "3px solid #EF4444" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#B91C1C" }}>{m.shortName}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: "#EF4444" }}>+{m.daysDelayed}d delay</span>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>{m.progress}% done</span>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>{m.tower}</span>
                  </div>
                  {m.criticalPath && (
                    <span style={{ fontSize: 10, background: "#C9922A", color: "#fff", borderRadius: 4, padding: "1px 6px", marginTop: 4, display: "inline-block" }}>CRITICAL PATH</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Progress */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>📋</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: txt }}>Work Categories</span>
            <button
              onClick={() => onNavigate("boq")}
              style={{ marginLeft: "auto", fontSize: 10, color: "#1B3A6B", fontWeight: 600, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              View BOQ →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CATEGORY_PROGRESS.map(c => (
              <div key={c.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: txt }}>{c.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.pct}%</span>
                </div>
                <div style={{ height: 6, background: isDark ? "#334155" : "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${c.pct}%`, height: "100%", background: c.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Today's Update */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>📅</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: txt }}>Today's Update</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#22C55E", fontWeight: 700, background: "#F0FDF4", borderRadius: 10, padding: "2px 8px" }}>+{latest.delta}%</span>
          </div>
          <p style={{ fontSize: 12, color: txt, marginBottom: 8, lineHeight: 1.5 }}>{latest.headline}</p>
          <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: sub }}>👷 {latest.workerCount} workers</span>
            <span style={{ fontSize: 11, color: sub }}>{WEATHER_CFG[latest.weather].icon} {latest.weather}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {latest.completed.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, color: "#22C55E", marginTop: 2 }}>✓</span>
                <span style={{ fontSize: 11, color: sub }}>{t}</span>
              </div>
            ))}
          </div>
          {latest.issues.length > 0 && (
            <div style={{ marginTop: 8, padding: "8px 10px", background: "#FEF2F2", borderRadius: 6 }}>
              {latest.issues.map((issue, i) => (
                <div key={i} style={{ fontSize: 11, color: "#EF4444" }}>⚠ {issue}</div>
              ))}
            </div>
          )}
        </div>

        {/* Open Engineer Notes */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>📝</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: txt }}>Engineer Notes</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#EF4444", fontWeight: 700, background: "#FEF2F2", borderRadius: 10, padding: "2px 8px" }}>
              {engineerNotes.filter(n => n.status === "open").length} open
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {critNotes.map(note => {
              const catCfg = NOTE_CATEGORY_CFG[note.category];
              const prioColor = note.priority === "critical" ? "#EF4444" : note.priority === "high" ? "#F97316" : "#94A3B8";
              return (
                <div key={note.id} style={{ padding: "10px 12px", background: isDark ? "#0F172A" : "#F8FAFC", borderRadius: 8, borderLeft: `3px solid ${prioColor}` }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: catCfg.color, background: catCfg.bg, borderRadius: 4, padding: "1px 6px" }}>{catCfg.label.toUpperCase()}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: prioColor, textTransform: "uppercase" }}>{note.priority}</span>
                  </div>
                  <p style={{ fontSize: 11, color: txt, lineHeight: 1.4, margin: 0 }}>{note.content.slice(0, 90)}…</p>
                  <div style={{ fontSize: 10, color: sub, marginTop: 4 }}>{note.author} · {note.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestone Status Summary */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>🏁</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: txt }}>Milestone Summary</span>
          <button
            onClick={() => onNavigate("gantt")}
            style={{ marginLeft: "auto", fontSize: 10, color: "#1B3A6B", fontWeight: 600, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
          >
            View Gantt →
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {(["completed","in-progress","delayed","upcoming"] as const).map(s => {
            const cfg   = STATUS_CFG[s];
            const count = milestones.filter(m => m.status === s).length;
            return (
              <div key={s} style={{ textAlign: "center", padding: "12px 8px", background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: cfg.color }}>{count}</div>
                <div style={{ fontSize: 11, color: cfg.color, marginTop: 2 }}>{cfg.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12 }}>
          {milestones.filter(m => m.status !== "upcoming").map(m => {
            const cfg = STATUS_CFG[m.status];
            return (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: txt, flex: 1 }}>{m.name}</span>
                <div style={{ width: 80, height: 5, background: isDark ? "#334155" : "#E2E8F0", borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ width: `${m.progress}%`, height: "100%", background: cfg.color }} />
                </div>
                <span style={{ fontSize: 10, color: sub, width: 32, textAlign: "right", flexShrink: 0 }}>{m.progress}%</span>
                {m.daysDelayed && <span style={{ fontSize: 9, color: "#EF4444", fontWeight: 700 }}>+{m.daysDelayed}d</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
