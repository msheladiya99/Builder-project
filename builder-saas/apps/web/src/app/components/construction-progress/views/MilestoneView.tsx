import { useState } from "react";
import { milestones, engineerNotes, STATUS_CFG, NOTE_CATEGORY_CFG } from "../constructionData";
import type { MilestoneStatus } from "../constructionData";

interface Props { isDark: boolean; onGanttClick: () => void; }

const STATUS_FILTERS: { id: MilestoneStatus | "all"; label: string }[] = [
  { id: "all",         label: "All Milestones" },
  { id: "in-progress", label: "In Progress"    },
  { id: "delayed",     label: "Delayed"        },
  { id: "completed",   label: "Completed"      },
  { id: "upcoming",    label: "Upcoming"       },
];

const PRIORITY_COLOR: Record<string, string> = {
  critical: "#EF4444",
  high:     "#F97316",
  medium:   "#F59E0B",
  low:      "#94A3B8",
};

export function MilestoneView({ isDark, onGanttClick }: Props) {
  const [filter, setFilter] = useState<MilestoneStatus | "all">("all");
  const [expandedNotes, setExpandedNotes] = useState(false);

  const bg     = isDark ? "#0F172A" : "#F1F5F9";
  const card   = isDark ? "#1E293B" : "#FFFFFF";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const txt    = isDark ? "#F1F5F9" : "#0F172A";
  const sub    = isDark ? "#94A3B8" : "#64748B";

  const filtered = filter === "all" ? milestones : milestones.filter(m => m.status === filter);
  const openNotes = engineerNotes.filter(n => n.status === "open" || n.actionRequired);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: bg }}>

      {/* Filter tabs */}
      <div style={{ padding: "0 20px", background: card, borderBottom: `1px solid ${border}`, flexShrink: 0, display: "flex", gap: 0, overflowX: "auto" }}>
        {STATUS_FILTERS.map(f => {
          const count = f.id === "all" ? milestones.length : milestones.filter(m => m.status === f.id).length;
          const active = filter === f.id;
          const color  = f.id === "all" ? "#1B3A6B" : STATUS_CFG[f.id as MilestoneStatus]?.color ?? "#1B3A6B";
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: "10px 14px", border: "none", cursor: "pointer", background: "transparent",
                borderBottom: active ? `2px solid ${color}` : "2px solid transparent",
                color: active ? color : sub, fontSize: 12, fontWeight: active ? 700 : 400,
                display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
              }}
            >
              {f.label}
              <span style={{ fontSize: 9, fontWeight: 700, color: active ? "#fff" : sub, background: active ? color : (isDark ? "#334155" : "#E2E8F0"), borderRadius: 8, padding: "1px 6px" }}>{count}</span>
            </button>
          );
        })}
        <button
          onClick={onGanttClick}
          style={{ marginLeft: "auto", padding: "10px 14px", border: "none", cursor: "pointer", background: "transparent", color: "#1B3A6B", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}
        >
          Gantt Chart →
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Delayed Alert Banner */}
        {(filter === "all" || filter === "delayed") && milestones.some(m => m.status === "delayed") && (
          <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#B91C1C" }}>Project Delay Alert</div>
              <div style={{ fontSize: 11, color: "#EF4444" }}>
                {milestones.filter(m => m.status === "delayed").length} milestone(s) behind schedule.
                {" "}Recovery plan required — extended working hours proposed (7AM–7PM + Saturdays).
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: isDark ? "#334155" : "#E2E8F0" }} />

          {filtered.map((m, idx) => {
            const cfg = STATUS_CFG[m.status];
            const isLast = idx === filtered.length - 1;
            const relatedNotes = engineerNotes.filter(n => n.relatedMilestone === m.id);
            return (
              <div key={m.id} style={{ display: "flex", gap: 16, marginBottom: isLast ? 0 : 20, position: "relative" }}>
                {/* Dot */}
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                  background: cfg.bg, border: `2px solid ${cfg.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, zIndex: 1,
                }}>
                  {m.status === "completed" ? "✓" : m.status === "delayed" ? "⚠" : m.status === "in-progress" ? "▶" : "○"}
                </div>

                {/* Card */}
                <div style={{
                  flex: 1, background: card, border: `1px solid ${m.status === "delayed" ? "#FECACA" : border}`,
                  borderRadius: 12, padding: "14px 16px",
                  borderLeft: `3px solid ${cfg.color}`,
                }}>
                  {/* Header */}
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: txt }}>{m.name}</span>
                        {m.criticalPath && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: "#C9922A", borderRadius: 4, padding: "2px 6px" }}>CRITICAL PATH</span>
                        )}
                        {m.daysDelayed && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: "#EF4444", borderRadius: 4, padding: "2px 6px" }}>+{m.daysDelayed} days delayed</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 12, fontSize: 11, color: sub, flexWrap: "wrap" }}>
                        <span>🏗 {m.tower}</span>
                        <span>📅 {m.plannedStart} → {m.plannedEnd}</span>
                        <span>👷 {m.assignee}</span>
                        {m.actualEnd && <span style={{ color: "#22C55E" }}>✓ Completed {m.actualEnd}</span>}
                      </div>
                    </div>
                    <div style={{
                      flexShrink: 0, fontSize: 10, fontWeight: 700, color: cfg.color,
                      background: cfg.bg, border: `1px solid ${cfg.border}`,
                      borderRadius: 10, padding: "4px 10px",
                    }}>
                      {cfg.label}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: sub }}>Progress</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color }}>{m.progress}%</span>
                    </div>
                    <div style={{ height: 6, background: isDark ? "#334155" : "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${m.progress}%`, height: "100%", background: cfg.color, borderRadius: 4 }} />
                    </div>
                  </div>

                  {/* Notes */}
                  {m.notes && (
                    <div style={{ padding: "8px 10px", background: isDark ? "#0F172A" : "#F8FAFC", borderRadius: 6, fontSize: 11, color: m.status === "delayed" ? "#EF4444" : sub, marginBottom: 8 }}>
                      {m.notes}
                    </div>
                  )}

                  {/* Dependencies */}
                  {m.dependencies && m.dependencies.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: sub }}>Depends on:</span>
                      {m.dependencies.map(dep => (
                        <span key={dep} style={{ fontSize: 10, color: "#1B3A6B", background: "#EFF6FF", borderRadius: 4, padding: "1px 6px" }}>
                          {milestones.find(x => x.id === dep)?.shortName ?? dep}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Related engineer notes */}
                  {relatedNotes.length > 0 && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${border}` }}>
                      <div style={{ fontSize: 10, color: sub, marginBottom: 6 }}>ENGINEER NOTES ({relatedNotes.length})</div>
                      {relatedNotes.map(note => {
                        const cc  = NOTE_CATEGORY_CFG[note.category];
                        const pc  = PRIORITY_COLOR[note.priority];
                        return (
                          <div key={note.id} style={{ display: "flex", gap: 8, marginBottom: 6, padding: "8px 10px", background: isDark ? "#0F172A" : "#F8FAFC", borderRadius: 6, borderLeft: `2px solid ${pc}` }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, color: cc.color, background: cc.bg, borderRadius: 3, padding: "1px 5px" }}>{cc.label}</span>
                                <span style={{ fontSize: 9, fontWeight: 700, color: pc, textTransform: "uppercase" }}>{note.priority}</span>
                                {note.actionRequired && <span style={{ fontSize: 9, color: "#EF4444", fontWeight: 700 }}>⚡ Action Required</span>}
                              </div>
                              <p style={{ fontSize: 11, color: txt, margin: 0, lineHeight: 1.4 }}>{note.content}</p>
                              <div style={{ fontSize: 10, color: sub, marginTop: 4 }}>{note.author} · {note.date}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Engineer Notes Section (standalone) */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden" }}>
          <button
            onClick={() => setExpandedNotes(n => !n)}
            style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 16 }}>📝</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: txt }}>All Engineer Notes</span>
            <span style={{ fontSize: 10, color: "#EF4444", fontWeight: 700, background: "#FEF2F2", borderRadius: 8, padding: "2px 8px" }}>{openNotes.length} open</span>
            <span style={{ marginLeft: "auto", color: sub, fontSize: 12 }}>{expandedNotes ? "▲" : "▼"}</span>
          </button>
          {expandedNotes && (
            <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {engineerNotes.map(note => {
                const cc  = NOTE_CATEGORY_CFG[note.category];
                const pc  = PRIORITY_COLOR[note.priority];
                const statusColor = note.status === "open" ? "#EF4444" : note.status === "acknowledged" ? "#F59E0B" : "#22C55E";
                return (
                  <div key={note.id} style={{ padding: "12px 14px", background: isDark ? "#0F172A" : "#F8FAFC", borderRadius: 8, borderLeft: `3px solid ${pc}` }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: cc.color, background: cc.bg, borderRadius: 4, padding: "2px 6px" }}>{cc.label.toUpperCase()}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: pc, textTransform: "uppercase" }}>{note.priority}</span>
                      <span style={{ fontSize: 9, color: statusColor, fontWeight: 700, textTransform: "capitalize" }}>● {note.status}</span>
                      {note.actionRequired && <span style={{ fontSize: 9, color: "#EF4444", fontWeight: 700 }}>⚡ Action Required</span>}
                      <span style={{ marginLeft: "auto", fontSize: 10, color: sub }}>{note.date}</span>
                    </div>
                    <p style={{ fontSize: 12, color: txt, margin: 0, lineHeight: 1.5 }}>{note.content}</p>
                    <div style={{ fontSize: 11, color: sub, marginTop: 6 }}>{note.author} · {note.designation}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
