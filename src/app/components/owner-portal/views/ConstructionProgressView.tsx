import { milestones } from "../ownerPortalData";
import { CheckCircle2, Circle, Zap, Camera } from "lucide-react";

const DONE_COUNT    = milestones.filter(m => m.status === "done").length;
const OVERALL_PCT   = Math.round(
  milestones.reduce((s, m) => s + m.pct, 0) / milestones.length
);

export function ConstructionProgressView() {
  return (
    <div className="flex-1 overflow-y-auto">

      {/* Overall progress card */}
      <div style={{ margin: "12px 16px 0", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
        <div style={{ background: "linear-gradient(135deg, #0A1628, #1B3A6B)", padding: "18px 18px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Overall Progress</p>
              <p style={{ color: "#fff", fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>{OVERALL_PCT}%</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Stages Done</p>
              <p style={{ color: "#C9922A", fontSize: 28, fontWeight: 900 }}>{DONE_COUNT}/{milestones.length}</p>
            </div>
          </div>

          {/* Big progress bar */}
          <div style={{ height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${OVERALL_PCT}%`, height: "100%", background: "linear-gradient(90deg, #C9922A, #F59E0B)", borderRadius: 99 }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>Started Aug 2024</span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>Possession Dec 2026</span>
          </div>
        </div>

        {/* Active stage banner */}
        {milestones.filter(m => m.status === "active").map(m => (
          <div key={m.id} style={{ background: "#FEF3C7", padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={14} color="#C9922A" />
            <p style={{ fontSize: 11, color: "#92400E", fontWeight: 700 }}>
              Currently: <span style={{ fontWeight: 900 }}>{m.label}</span> — {m.pct}% complete
            </p>
          </div>
        ))}
      </div>

      {/* Update notice */}
      <div style={{ margin: "10px 16px 0", background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <Camera size={14} color="#1B3A6B" />
        <p style={{ fontSize: 11, color: "#1E40AF", fontWeight: 600, lineHeight: 1.4 }}>
          Site photos are updated every fortnight. Last updated: 12 May 2026.
        </p>
      </div>

      {/* Milestone timeline */}
      <div style={{ padding: "12px 16px 20px" }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Construction Milestones</p>

        <div style={{ position: "relative" }}>
          {/* Vertical connector */}
          <div style={{ position: "absolute", left: 15, top: 16, bottom: 16, width: 2, background: "#F1F5F9", zIndex: 0 }} />

          {milestones.map((m, idx) => {
            const isLast = idx === milestones.length - 1;
            return (
              <div key={m.id} style={{ display: "flex", gap: 14, marginBottom: isLast ? 0 : 12, position: "relative", zIndex: 1 }}>
                {/* Status dot */}
                <div style={{
                  width: 32, height: 32, borderRadius: 99, flexShrink: 0,
                  background: m.status === "done" ? "#F0FDF4" : m.status === "active" ? "#FEF3C7" : "#F8FAFC",
                  border: `2.5px solid ${m.status === "done" ? "#86EFAC" : m.status === "active" ? "#FCD34D" : "#E2E8F0"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {m.status === "done"
                    ? <CheckCircle2 size={15} color="#22C55E" />
                    : m.status === "active"
                    ? <Zap size={14} color="#C9922A" />
                    : <Circle size={15} color="#CBD5E1" />
                  }
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    background: "#fff",
                    border: `1.5px solid ${m.status === "active" ? "#FCD34D" : m.status === "done" ? "#F1F5F9" : "#F1F5F9"}`,
                    borderRadius: 16, padding: "11px 14px",
                    opacity: m.status === "upcoming" ? 0.65 : 1,
                    boxShadow: m.status === "active" ? "0 2px 10px rgba(201,146,42,0.15)" : "0 1px 3px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: m.status === "upcoming" ? "#94A3B8" : "#0F172A" }}>{m.label}</p>
                      <span style={{
                        fontSize: 9, fontWeight: 800, flexShrink: 0,
                        color: m.status === "done" ? "#22C55E" : m.status === "active" ? "#C9922A" : "#94A3B8",
                        background: m.status === "done" ? "#F0FDF4" : m.status === "active" ? "#FEF3C7" : "#F8FAFC",
                        padding: "3px 8px", borderRadius: 99,
                      }}>
                        {m.status === "done" ? "✓ Complete" : m.status === "active" ? `⚡ In Progress` : `📅 ${m.date}`}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{m.description}</p>

                    {/* Progress bar for active */}
                    {m.status === "active" && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 9, color: "#94A3B8" }}>Progress</span>
                          <span style={{ fontSize: 9, fontWeight: 800, color: "#C9922A" }}>{m.pct}%</span>
                        </div>
                        <div style={{ height: 5, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${m.pct}%`, height: "100%", background: "linear-gradient(90deg, #C9922A, #F59E0B)", borderRadius: 99 }} />
                        </div>
                      </div>
                    )}

                    {/* Photo placeholder for done stages */}
                    {m.status === "done" && m.photoColor && (
                      <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden", height: 60, background: m.photoColor, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Camera size={14} color="rgba(255,255,255,0.5)" />
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>Site photo · {m.date}</span>
                      </div>
                    )}

                    <p style={{ fontSize: 9, color: "#CBD5E1", marginTop: 6 }}>{m.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
