import { useState } from "react";
import { getOverallProgress, milestones, getDelayedMilestones } from "./constructionData";
import { OverviewView }     from "./views/OverviewView";
import { BOQView }          from "./views/BOQView";
import { MilestoneView }    from "./views/MilestoneView";
import { GanttView }        from "./views/GanttView";
import { SiteDiaryView }    from "./views/SiteDiaryView";
import { DailyUpdatesView } from "./views/DailyUpdatesView";

type Tab = "overview" | "boq" | "milestones" | "gantt" | "diary" | "updates";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview",   label: "Overview",   icon: "📊" },
  { id: "boq",        label: "BOQ",        icon: "📋" },
  { id: "milestones", label: "Milestones", icon: "🏁" },
  { id: "gantt",      label: "Gantt",      icon: "📅" },
  { id: "diary",      label: "Site Diary", icon: "📓" },
  { id: "updates",    label: "Updates",    icon: "📷" },
];

interface Props {
  isDark: boolean;
  onDarkToggle: () => void;
}

export function ConstructionProgressModule({ isDark, onDarkToggle }: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  const bg          = isDark ? "#0F172A" : "#F1F5F9";
  const card        = isDark ? "#1E293B" : "#FFFFFF";
  const border      = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const sub         = isDark ? "#94A3B8" : "#64748B";
  const overall     = getOverallProgress();
  const delayed     = getDelayedMilestones();
  const inProgress  = milestones.filter(m => m.status === "in-progress").length;

  function renderTab() {
    switch (tab) {
      case "overview":   return <OverviewView    isDark={isDark} onNavigate={t => setTab(t as Tab)} />;
      case "boq":        return <BOQView          isDark={isDark} />;
      case "milestones": return <MilestoneView    isDark={isDark} onGanttClick={() => setTab("gantt")} />;
      case "gantt":      return <GanttView        isDark={isDark} />;
      case "diary":      return <SiteDiaryView    isDark={isDark} />;
      case "updates":    return <DailyUpdatesView isDark={isDark} />;
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: bg }}>

      {/* Header */}
      <div style={{ flexShrink: 0, background: "linear-gradient(135deg, #0F1C2E 0%, #1B3A6B 100%)", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
              Construction Progress Tracker
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Shri Hari Residency</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Tower A · 16 Floors · RERA: MH/RERA/A12345</div>
          </div>
          <button
            onClick={onDarkToggle}
            style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* KPI Strip */}
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{overall}%</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>OVERALL</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#22C55E" }}>{milestones.filter(m => m.status === "completed").length}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>DONE</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#3B82F6" }}>{inProgress}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>ACTIVE</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: delayed.length > 0 ? "#EF4444" : "#22C55E" }}>{delayed.length}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>DELAYED</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>Jan 2025</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>Dec 2026</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${overall}%`, height: "100%", background: "linear-gradient(90deg, #C9922A, #F59E0B)", borderRadius: 4 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar in header */}
        <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {TABS.map(t => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: isActive ? "#C9922A" : "rgba(255,255,255,0.08)",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                  fontSize: 11, fontWeight: isActive ? 700 : 400,
                  display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Delayed alert banner */}
      {delayed.length > 0 && tab !== "milestones" && (
        <div style={{
          flexShrink: 0, padding: "8px 20px",
          background: isDark ? "rgba(239,68,68,0.1)" : "#FEF2F2",
          borderBottom: `1px solid #FECACA`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600 }}>
            {delayed.length} milestone{delayed.length > 1 ? "s" : ""} delayed —{" "}
            {delayed.map(m => `${m.shortName} (+${m.daysDelayed}d)`).join(", ")}
          </span>
          <button
            onClick={() => setTab("milestones")}
            style={{ marginLeft: "auto", fontSize: 11, color: "#EF4444", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            View details →
          </button>
        </div>
      )}

      {/* Tab content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {renderTab()}
      </div>
    </div>
  );
}
