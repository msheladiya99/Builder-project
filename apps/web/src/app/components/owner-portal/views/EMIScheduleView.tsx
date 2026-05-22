import { emiSchedule, fmtINR, EMI_STATUS } from "../ownerPortalData";
import { CheckCircle2, Clock, AlertCircle, Circle, Download } from "lucide-react";

const PAID_COUNT = emiSchedule.filter(e => e.status === "paid").length;
const TOTAL_PAID = emiSchedule.filter(e => e.status === "paid").reduce((s, e) => s + e.amount, 0);
const OVERDUE    = emiSchedule.filter(e => e.status === "overdue");

const STATUS_ICON = {
  paid:     <CheckCircle2 size={16} color="#22C55E" />,
  upcoming: <Clock size={16} color="#1B3A6B" />,
  overdue:  <AlertCircle size={16} color="#EF4444" />,
  pending:  <Circle size={16} color="#CBD5E1" />,
};

export function EMIScheduleView() {
  return (
    <div className="flex-1 overflow-y-auto">

      {/* Summary card */}
      <div style={{ margin: "12px 16px 0", background: "linear-gradient(135deg, #1B3A6B 0%, #2563EB 100%)", borderRadius: 20, padding: "18px 18px 16px", boxShadow: "0 4px 16px rgba(27,58,107,0.2)" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Payment Summary</p>
        <div style={{ display: "flex", gap: 0 }}>
          {[
            { label: "Installments Paid", value: `${PAID_COUNT}/${emiSchedule.length}` },
            { label: "Total Paid",         value: fmtINR(TOTAL_PAID)                   },
            { label: "Overdue",            value: OVERDUE.length > 0 ? `${OVERDUE.length} due` : "None" },
          ].map((kpi, i) => (
            <div key={kpi.label} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : undefined }}>
              <p style={{ color: i === 2 && OVERDUE.length > 0 ? "#F87171" : "#fff", fontSize: 20, fontWeight: 900, lineHeight: 1.1 }}>{kpi.value}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: 700, marginTop: 4, textTransform: "uppercase" }}>{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 14, height: 5, background: "rgba(255,255,255,0.12)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${(PAID_COUNT / emiSchedule.length) * 100}%`, height: "100%", background: "#C9922A", borderRadius: 99 }} />
        </div>
      </div>

      {/* Overdue alert */}
      {OVERDUE.length > 0 && (
        <div style={{ margin: "10px 16px 0", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 14, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#991B1B" }}>Payment Overdue</p>
            <p style={{ fontSize: 11, color: "#EF4444", marginTop: 2, lineHeight: 1.4 }}>
              {fmtINR(OVERDUE.reduce((s, e) => s + e.amount, 0))} overdue for {OVERDUE[0].label}. Please make payment to avoid penalties.
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div style={{ padding: "12px 16px 16px" }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Schedule · {emiSchedule.length} Installments
        </p>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 15, top: 8, bottom: 8, width: 2, background: "#F1F5F9", zIndex: 0 }} />

          {emiSchedule.map((entry, idx) => {
            const cfg     = EMI_STATUS[entry.status];
            const isLast  = idx === emiSchedule.length - 1;

            return (
              <div key={entry.id} style={{ display: "flex", gap: 14, marginBottom: isLast ? 0 : 10, position: "relative", zIndex: 1 }}>
                {/* Icon dot */}
                <div style={{
                  width: 32, height: 32, borderRadius: 99, flexShrink: 0,
                  background: entry.status === "paid" ? "#F0FDF4" : entry.status === "overdue" ? "#FEF2F2" : entry.status === "upcoming" ? "#EFF6FF" : "#F8FAFC",
                  border: `2px solid ${entry.status === "paid" ? "#86EFAC" : entry.status === "overdue" ? "#FECACA" : entry.status === "upcoming" ? "#BFDBFE" : "#E2E8F0"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {STATUS_ICON[entry.status]}
                </div>

                {/* Card */}
                <div style={{
                  flex: 1, background: "#fff", border: `1.5px solid ${entry.status === "overdue" ? "#FECACA" : entry.status === "upcoming" ? "#BFDBFE" : "#F1F5F9"}`,
                  borderRadius: 16, padding: "11px 14px",
                  boxShadow: entry.status === "overdue" ? "0 2px 8px rgba(239,68,68,0.08)" : entry.status === "upcoming" ? "0 2px 8px rgba(27,58,107,0.06)" : "0 1px 3px rgba(0,0,0,0.03)",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: "#94A3B8" }}>#{entry.installmentNo}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "2px 7px", borderRadius: 99 }}>
                          {cfg.label}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{entry.label}</p>
                      <p style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                        Due: {entry.dueDate}
                        {entry.paidDate && ` · Paid: ${entry.paidDate}`}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 900, color: entry.status === "paid" ? "#22C55E" : entry.status === "overdue" ? "#EF4444" : "#0F172A" }}>
                        {fmtINR(entry.amount)}
                      </p>
                      {entry.receiptNo && (
                        <button
                          style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 4, marginLeft: "auto", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "3px 8px" }}
                          className="active:opacity-60 transition-opacity"
                        >
                          <Download size={10} color="#64748B" />
                          <span style={{ fontSize: 9, color: "#64748B", fontWeight: 700 }}>Receipt</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Overdue CTA */}
                  {entry.status === "overdue" && (
                    <button
                      className="active:scale-98 transition-transform"
                      style={{ marginTop: 10, width: "100%", height: 36, borderRadius: 10, background: "linear-gradient(135deg, #EF4444, #DC2626)", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                    >
                      Pay Now · {fmtINR(entry.amount)}
                    </button>
                  )}
                  {entry.status === "upcoming" && (
                    <button
                      className="active:scale-98 transition-transform"
                      style={{ marginTop: 10, width: "100%", height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1B3A6B, #2563EB)", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                    >
                      Pay Now · {fmtINR(entry.amount)}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
