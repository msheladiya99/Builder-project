import { useRef } from "react";
import { milestones, GANTT_MONTHS, GANTT_TODAY_INDEX, GANTT_COL_WIDTH, STATUS_CFG } from "../constructionData";

interface Props { isDark: boolean; }

const ROW_H    = 44;
const TASK_W   = 180;
const HEADER_H = 48;

export function GanttView({ isDark }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const bg      = isDark ? "#0F172A" : "#F1F5F9";
  const card    = isDark ? "#1E293B" : "#FFFFFF";
  const border  = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const txt     = isDark ? "#F1F5F9" : "#0F172A";
  const sub     = isDark ? "#64748B" : "#94A3B8";
  const gridLine = isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9";

  const totalW  = GANTT_MONTHS.length * GANTT_COL_WIDTH;
  const todayX  = GANTT_TODAY_INDEX * GANTT_COL_WIDTH + GANTT_COL_WIDTH / 2;

  function barColor(m: typeof milestones[0]) {
    if (m.criticalPath) return "#C9922A";
    return STATUS_CFG[m.status].color;
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: bg }}>

      {/* Legend */}
      <div style={{ padding: "10px 20px", background: card, borderBottom: `1px solid ${border}`, flexShrink: 0, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: sub }}>LEGEND</span>
        {[
          { color: "#C9922A", label: "Critical Path" },
          { color: STATUS_CFG["completed"].color,   label: "Completed"   },
          { color: STATUS_CFG["in-progress"].color, label: "In Progress" },
          { color: STATUS_CFG["delayed"].color,     label: "Delayed"     },
          { color: STATUS_CFG["upcoming"].color,    label: "Upcoming"    },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 14, height: 7, borderRadius: 4, background: l.color }} />
            <span style={{ fontSize: 11, color: sub }}>{l.label}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 2, height: 14, background: "#EF4444" }} />
          <span style={{ fontSize: 11, color: sub }}>Today (May 2026)</span>
        </div>
      </div>

      {/* Gantt body — synchronized scroll */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left task names column */}
        <div style={{
          width: TASK_W, flexShrink: 0,
          borderRight: `1px solid ${border}`,
          display: "flex", flexDirection: "column",
          background: card, overflow: "hidden",
        }}>
          {/* Header placeholder */}
          <div style={{
            height: HEADER_H, borderBottom: `1px solid ${border}`,
            display: "flex", alignItems: "center", padding: "0 14px",
            fontSize: 11, fontWeight: 700, color: sub,
          }}>
            MILESTONE
          </div>

          {/* Task rows */}
          <div style={{ flex: 1, overflowY: "hidden" }}>
            {milestones.map((m, i) => {
              const cfg = STATUS_CFG[m.status];
              const isEven = i % 2 === 0;
              return (
                <div
                  key={m.id}
                  style={{
                    height: ROW_H, padding: "0 14px", display: "flex", alignItems: "center",
                    background: isEven ? card : (isDark ? "#172033" : "#FAFBFC"),
                    borderBottom: `1px solid ${gridLine}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: txt, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.shortName}</div>
                      <div style={{ fontSize: 9, color: sub }}>{m.tower}</div>
                    </div>
                    {m.criticalPath && (
                      <div style={{ width: 6, height: 6, background: "#C9922A", borderRadius: "50%", flexShrink: 0 }} title="Critical Path" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable chart area */}
        <div
          ref={scrollRef}
          style={{ flex: 1, overflowX: "auto", overflowY: "hidden", display: "flex", flexDirection: "column" }}
        >
          <div style={{ width: totalW, display: "flex", flexDirection: "column" }}>

            {/* Month header */}
            <div style={{
              height: HEADER_H, borderBottom: `1px solid ${border}`,
              display: "flex", flexShrink: 0, position: "relative",
              background: card,
            }}>
              {GANTT_MONTHS.map((label, i) => (
                <div
                  key={i}
                  style={{
                    width: GANTT_COL_WIDTH, flexShrink: 0,
                    borderRight: `1px solid ${border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: i === GANTT_TODAY_INDEX ? 800 : 400,
                    color: i === GANTT_TODAY_INDEX ? "#EF4444" : sub,
                    background: i === GANTT_TODAY_INDEX ? (isDark ? "rgba(239,68,68,0.08)" : "#FFF5F5") : "transparent",
                  }}
                >
                  {label}
                </div>
              ))}
              {/* Year labels */}
              <div style={{ position: "absolute", top: 2, left: 0, width: 12 * GANTT_COL_WIDTH, textAlign: "center", fontSize: 9, color: sub, fontWeight: 700, pointerEvents: "none" }}>
                2025
              </div>
              <div style={{ position: "absolute", top: 2, left: 12 * GANTT_COL_WIDTH, width: 12 * GANTT_COL_WIDTH, textAlign: "center", fontSize: 9, color: sub, fontWeight: 700, pointerEvents: "none" }}>
                2026
              </div>
            </div>

            {/* Rows + bars */}
            <div style={{ position: "relative" }}>
              {/* Today line */}
              <div style={{
                position: "absolute", top: 0, bottom: 0,
                left: todayX, width: 2,
                background: "#EF4444", zIndex: 10,
                opacity: 0.7,
              }} />

              {milestones.map((m, i) => {
                const cfg    = STATUS_CFG[m.status];
                const barX   = m.ganttStartMonth * GANTT_COL_WIDTH;
                const barW   = m.ganttDuration  * GANTT_COL_WIDTH - 4;
                const barColor_ = barColor(m);
                const isEven = i % 2 === 0;

                const completedW = m.status === "completed" ? barW : (barW * m.progress / 100);

                return (
                  <div
                    key={m.id}
                    style={{
                      height: ROW_H, position: "relative",
                      background: isEven ? (isDark ? card : "#FFFFFF") : (isDark ? "#172033" : "#FAFBFC"),
                      borderBottom: `1px solid ${gridLine}`,
                      display: "flex", alignItems: "center",
                    }}
                  >
                    {/* Grid columns */}
                    {GANTT_MONTHS.map((_, ci) => (
                      <div
                        key={ci}
                        style={{
                          position: "absolute", left: ci * GANTT_COL_WIDTH, top: 0, bottom: 0,
                          width: GANTT_COL_WIDTH,
                          borderRight: `1px solid ${gridLine}`,
                          background: ci === GANTT_TODAY_INDEX ? (isDark ? "rgba(239,68,68,0.05)" : "rgba(239,68,68,0.03)") : "transparent",
                        }}
                      />
                    ))}

                    {/* Gantt bar background */}
                    <div
                      style={{
                        position: "absolute",
                        left: barX + 2, width: barW,
                        height: 22, borderRadius: 5,
                        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                        border: `1px solid ${barColor_}40`,
                        zIndex: 2,
                        overflow: "hidden",
                      }}
                    >
                      {/* Fill */}
                      <div style={{
                        width: completedW - 2, height: "100%",
                        background: `${barColor_}CC`,
                        borderRadius: 4,
                      }} />

                      {/* Label inside bar */}
                      {barW > 80 && (
                        <div style={{
                          position: "absolute", inset: 0,
                          display: "flex", alignItems: "center", padding: "0 8px",
                          fontSize: 9, fontWeight: 700,
                          color: m.status === "upcoming" ? sub : "#fff",
                          overflow: "hidden", whiteSpace: "nowrap",
                        }}>
                          {m.status !== "upcoming" && `${m.progress}% `}{m.shortName}
                          {m.daysDelayed ? <span style={{ marginLeft: 4, color: "#FFD1D1" }}>+{m.daysDelayed}d</span> : null}
                        </div>
                      )}
                    </div>

                    {/* Progress triangle marker */}
                    {m.status === "in-progress" || m.status === "delayed" ? (
                      <div style={{
                        position: "absolute",
                        left: barX + 2 + completedW - 6,
                        zIndex: 3,
                        width: 0, height: 0,
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderTop: `8px solid ${barColor_}`,
                        transform: "translateY(7px)",
                      }} />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Summary footer */}
      <div style={{ padding: "10px 20px", background: card, borderTop: `1px solid ${border}`, flexShrink: 0, display: "flex", gap: 20, flexWrap: "wrap" }}>
        {milestones.reduce((acc, m) => {
          acc[m.status] = (acc[m.status] ?? 0) + 1;
          return acc;
        }, {} as Record<string, number>) && (["completed","in-progress","delayed","upcoming"] as const).map(s => {
          const cfg   = STATUS_CFG[s];
          const count = milestones.filter(m => m.status === s).length;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: cfg.color }} />
              <span style={{ fontSize: 11, color: sub }}>{cfg.label}:</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: txt }}>{count}</span>
            </div>
          );
        })}
        <div style={{ marginLeft: "auto", fontSize: 11, color: sub }}>
          Project: Jan 2025 → Dec 2026 · {GANTT_MONTHS.length} months
        </div>
      </div>
    </div>
  );
}
