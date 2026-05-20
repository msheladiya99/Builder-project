import { useState } from "react";
import { UserCheck, UserX, Clock, IndianRupee, HardHat, Plus, Search, Filter, CheckCircle2 } from "lucide-react";
import { workers, contractors, todayAttendance, fmtINR, type Worker, type AttendanceRecord, type Contractor } from "../saasData";
import { DataTable, StatusBadge, EmptyState, type Column } from "../components/SharedUI";

type LabourTab = "overview" | "workers" | "attendance" | "wages" | "contractors";

const TABS: { id: LabourTab; label: string }[] = [
  { id: "overview",     label: "Overview"     },
  { id: "workers",      label: "Workers"      },
  { id: "attendance",   label: "Attendance"   },
  { id: "wages",        label: "Wages"        },
  { id: "contractors",  label: "Contractors"  },
];

const WORKER_STATUS = {
  active:   { color: "#22C55E", bg: "#F0FDF4", label: "Active"    },
  inactive: { color: "#94A3B8", bg: "#F8FAFC", label: "Inactive"  },
  absent:   { color: "#EF4444", bg: "#FEF2F2", label: "Absent"    },
  present:  { color: "#22C55E", bg: "#F0FDF4", label: "Present"   },
};

const ATTEND_STATUS = {
  present:  { color: "#22C55E", bg: "#F0FDF4", label: "Present"  },
  absent:   { color: "#EF4444", bg: "#FEF2F2", label: "Absent"   },
  "half-day": { color: "#F59E0B", bg: "#FFFBEB", label: "Half Day" },
  holiday:  { color: "#94A3B8", bg: "#F8FAFC", label: "Holiday"  },
};

const TRADE_COLOR: Record<string, { color: string; bg: string }> = {
  Mason:      { color: "#1B3A6B", bg: "#EFF6FF" },
  Carpenter:  { color: "#C9922A", bg: "#FEF3C7" },
  Helper:     { color: "#0D9488", bg: "#CCFBF1" },
  Electrician:{ color: "#7C3AED", bg: "#EDE9FE" },
  Plumber:    { color: "#EF4444", bg: "#FEF2F2" },
  Welder:     { color: "#F97316", bg: "#FFF7ED" },
  Painter:    { color: "#EC4899", bg: "#FDF2F8" },
};

interface Props { isDark: boolean }

function StatBox({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string | number; color: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 12, border: `1.5px solid ${color}20` }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 900, color }}>{value}</p>
        <p style={{ fontSize: 11, fontWeight: 700, color, marginTop: 1 }}>{label}</p>
      </div>
    </div>
  );
}

function OverviewTab({ isDark }: { isDark: boolean }) {
  const presentCount  = todayAttendance.filter(a => a.status === "present").length;
  const absentCount   = todayAttendance.filter(a => a.status === "absent").length;
  const totalWage     = contractors.reduce((s, c) => s + c.totalPayable, 0);
  const paidWage      = contractors.reduce((s, c) => s + c.paid, 0);

  const card = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const bdr  = isDark ? "rgba(255,255,255,0.07)" : "#F1F5F9";
  const text = isDark ? "#F1F5F9" : "#0F172A";
  const sub  = isDark ? "rgba(255,255,255,0.4)" : "#64748B";

  const tradeCount: Record<string, number> = {};
  workers.forEach(w => { tradeCount[w.trade] = (tradeCount[w.trade] || 0) + 1; });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <StatBox icon={<HardHat size={18} color="#1B3A6B" />}    label="Total Workers"     value={workers.length}  color="#1B3A6B" bg="#EFF6FF" />
        <StatBox icon={<UserCheck size={18} color="#22C55E" />}  label="Present Today"     value={presentCount}    color="#22C55E" bg="#F0FDF4" />
        <StatBox icon={<UserX size={18} color="#EF4444" />}      label="Absent Today"      value={absentCount}     color="#EF4444" bg="#FEF2F2" />
        <StatBox icon={<IndianRupee size={18} color="#C9922A" />}label="Wages Payable"    value={fmtINR(totalWage - paidWage)} color="#C9922A" bg="#FEF3C7" />
      </div>

      {/* Attendance rate ring + breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="45" fill="none" stroke={isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9"} strokeWidth="10" />
              <circle cx="55" cy="55" r="45" fill="none" stroke="#22C55E" strokeWidth="10"
                strokeDasharray={`${(presentCount / workers.length) * 283} 283`}
                strokeLinecap="round" transform="rotate(-90 55 55)"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#22C55E" }}>{Math.round((presentCount / workers.length) * 100)}%</p>
              <p style={{ fontSize: 9, color: sub, fontWeight: 700 }}>Attendance</p>
            </div>
          </div>
          <p style={{ fontSize: 12, fontWeight: 800, color: text, marginTop: 12 }}>Today's Attendance</p>
          <p style={{ fontSize: 10, color: sub }}>19 May 2026</p>
        </div>

        <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: text, marginBottom: 14 }}>Workers by Trade</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(tradeCount).map(([trade, count]) => {
              const cfg = TRADE_COLOR[trade] || { color: "#94A3B8", bg: "#F8FAFC" };
              const pct = Math.round((count / workers.length) * 100);
              return (
                <div key={trade} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "2px 8px", borderRadius: 99, flexShrink: 0, minWidth: 80, textAlign: "center" }}>{trade}</span>
                  <div style={{ flex: 1, height: 6, background: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: cfg.color, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: text, flexShrink: 0, minWidth: 30, textAlign: "right" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contractor summary */}
      <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 900, color: text, marginBottom: 14 }}>Contractor Summary</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {contractors.map(c => {
            const paidPct = Math.round((c.paid / c.totalPayable) * 100);
            return (
              <div key={c.id} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: 14, padding: 14, border: `1px solid ${bdr}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: text }}>{c.name}</p>
                  <span style={{ fontSize: 9, color: "#22C55E", background: "#F0FDF4", padding: "2px 6px", borderRadius: 99, fontWeight: 700 }}>{c.workers} workers</span>
                </div>
                <p style={{ fontSize: 10, color: sub, marginBottom: 6 }}>{c.trade} · ₹{c.ratePerDay.toLocaleString()}/day</p>
                <div style={{ marginBottom: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 9, color: sub }}>Payment Progress</span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: text }}>{paidPct}%</span>
                  </div>
                  <div style={{ height: 5, background: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${paidPct}%`, height: "100%", background: "#1B3A6B", borderRadius: 99 }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: sub }}>Paid: {fmtINR(c.paid)}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#EF4444" }}>Due: {fmtINR(c.totalPayable - c.paid)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkersTab({ isDark }: { isDark: boolean }) {
  const [search, setSearch] = useState("");
  const filtered = workers.filter(w => !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.trade.toLowerCase().includes(search.toLowerCase()));

  const text = isDark ? "#F1F5F9" : "#0F172A";
  const sub  = isDark ? "rgba(255,255,255,0.4)" : "#64748B";
  const bdr  = isDark ? "rgba(255,255,255,0.07)" : "#F1F5F9";

  const cols: Column<Worker>[] = [
    { key: "name",       header: "Worker",          render: r => <div><p style={{ fontWeight: 800 }}>{r.name}</p><p style={{ fontSize: 9, opacity: 0.6 }}>📞 {r.phone}</p></div> },
    { key: "trade",      header: "Trade",           render: r => { const c = TRADE_COLOR[r.trade] || { color: "#94A3B8", bg: "#F8FAFC" }; return <StatusBadge label={r.trade} color={c.color} bg={c.bg} dot={false} size="sm" />; }},
    { key: "contractor", header: "Contractor",      render: r => r.contractor },
    { key: "tower",      header: "Tower",  width: "80px", render: r => r.tower },
    { key: "wage",       header: "Daily Wage", align: "right", render: r => `₹${r.dailyWage.toLocaleString()}` },
    { key: "joinDate",   header: "Since",           render: r => r.joinDate },
    { key: "status",     header: "Status",          render: r => <StatusBadge {...WORKER_STATUS[r.status]} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: isDark ? "rgba(255,255,255,0.06)" : "#fff", border: `1.5px solid ${bdr}`, borderRadius: 10, padding: "0 12px", height: 38 }}>
          <Search size={14} color={sub} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workers…" className="flex-1 bg-transparent outline-none" style={{ fontSize: 13, color: text }} />
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 16px", height: 38, background: "#1B3A6B", color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 800 }} className="active:scale-95 transition-transform">
          <Plus size={14} />Add Worker
        </button>
      </div>
      <DataTable columns={cols} data={filtered} isDark={isDark} emptyTitle="No workers found" />
    </div>
  );
}

function AttendanceTab({ isDark }: { isDark: boolean }) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(todayAttendance);
  const [saved, setSaved] = useState(false);

  const text = isDark ? "#F1F5F9" : "#0F172A";
  const sub  = isDark ? "rgba(255,255,255,0.4)" : "#64748B";
  const card = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const bdr  = isDark ? "rgba(255,255,255,0.07)" : "#F1F5F9";

  function toggleStatus(workerId: string) {
    setAttendance(prev => prev.map(a => {
      if (a.workerId !== workerId) return a;
      const cycle: AttendanceRecord["status"][] = ["present", "absent", "half-day"];
      const idx = cycle.indexOf(a.status);
      return { ...a, status: cycle[(idx + 1) % cycle.length] };
    }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const present  = attendance.filter(a => a.status === "present").length;
  const absent   = attendance.filter(a => a.status === "absent").length;
  const halfDay  = attendance.filter(a => a.status === "half-day").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: 10 }}>
        {[
          { label: "Present",  value: present,  color: "#22C55E", bg: "#F0FDF4" },
          { label: "Absent",   value: absent,   color: "#EF4444", bg: "#FEF2F2" },
          { label: "Half Day", value: halfDay,  color: "#F59E0B", bg: "#FFFBEB" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 12, padding: "10px 14px", border: `1.5px solid ${s.color}20` }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.label}</p>
          </div>
        ))}
        <button onClick={handleSave} style={{ padding: "10px 20px", background: saved ? "#22C55E" : "#1B3A6B", color: "#fff", borderRadius: 12, fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }} className="active:scale-95 transition-transform">
          {saved ? <><CheckCircle2 size={14} />Saved!</> : "Save Attendance"}
        </button>
      </div>

      {/* Attendance list */}
      <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${bdr}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: text }}>19 May 2026 — Mark Attendance</p>
          <span style={{ fontSize: 10, color: sub }}>Tap status to cycle: Present → Absent → Half Day</span>
        </div>
        {attendance.map((a, i) => {
          const cfg = ATTEND_STATUS[a.status];
          return (
            <div key={a.workerId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: i < attendance.length - 1 ? `1px solid ${bdr}` : undefined }}>
              <div style={{ width: 34, height: 34, borderRadius: 99, background: "linear-gradient(135deg, #1B3A6B, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 11 }}>{a.workerName.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: text }}>{a.workerName}</p>
                <p style={{ fontSize: 10, color: sub }}>{a.trade}{a.inTime ? ` · In: ${a.inTime}` : ""}</p>
              </div>
              <button onClick={() => toggleStatus(a.workerId)} style={{ padding: "5px 12px", borderRadius: 99, fontSize: 10, fontWeight: 800, color: cfg.color, background: cfg.bg, border: `1.5px solid ${cfg.color}40`, cursor: "pointer" }} className="active:scale-95 transition-transform">
                {cfg.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WagesTab({ isDark }: { isDark: boolean }) {
  const text = isDark ? "#F1F5F9" : "#0F172A";
  const sub  = isDark ? "rgba(255,255,255,0.4)" : "#64748B";
  const card = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const bdr  = isDark ? "rgba(255,255,255,0.07)" : "#F1F5F9";

  const wageRows = workers.map(w => {
    const daysWorked = 24;
    const gross      = w.dailyWage * daysWorked;
    const esi        = Math.round(gross * 0.0075);
    const pf         = Math.round(gross * 0.12);
    const net        = gross - esi - pf;
    return { ...w, daysWorked, gross, esi, pf, net };
  });

  const totalGross = wageRows.reduce((s, r) => s + r.gross, 0);
  const totalNet   = wageRows.reduce((s, r) => s + r.net, 0);

  const cols: Column<typeof wageRows[0]>[] = [
    { key: "name",   header: "Worker",       render: r => <div><p style={{ fontWeight: 700 }}>{r.name}</p><p style={{ fontSize: 9, opacity: 0.6 }}>{r.trade}</p></div> },
    { key: "days",   header: "Days",  align: "right", render: r => r.daysWorked },
    { key: "rate",   header: "Rate/Day", align: "right", render: r => `₹${r.dailyWage}` },
    { key: "gross",  header: "Gross",   align: "right", render: r => `₹${r.gross.toLocaleString()}` },
    { key: "pf",     header: "PF (12%)",align: "right", render: r => <span style={{ color: "#EF4444" }}>-₹{r.pf.toLocaleString()}</span> },
    { key: "esi",    header: "ESI (0.75%)", align: "right", render: r => <span style={{ color: "#EF4444" }}>-₹{r.esi.toLocaleString()}</span> },
    { key: "net",    header: "Net Payable", align: "right", render: r => <strong style={{ color: "#22C55E" }}>₹{r.net.toLocaleString()}</strong> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: "Gross Wages",  value: fmtINR(totalGross), color: "#1B3A6B", bg: "#EFF6FF" },
          { label: "Deductions",   value: fmtINR(totalGross - totalNet), color: "#EF4444", bg: "#FEF2F2" },
          { label: "Net Payable",  value: fmtINR(totalNet), color: "#22C55E", bg: "#F0FDF4" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 140, background: s.bg, borderRadius: 14, padding: "12px 16px", border: `1.5px solid ${s.color}20` }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 10, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.label}</p>
            <p style={{ fontSize: 9, color: `${s.color}80` }}>May 2026 · 24 working days</p>
          </div>
        ))}
        <button style={{ padding: "10px 18px", background: "#1B3A6B", color: "#fff", borderRadius: 12, fontSize: 12, fontWeight: 800, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }} className="active:scale-95 transition-transform">
          <IndianRupee size={14} />Process Payroll
        </button>
      </div>
      <DataTable columns={cols} data={wageRows} isDark={isDark} />
    </div>
  );
}

function ContractorsTab({ isDark }: { isDark: boolean }) {
  const cols: Column<Contractor>[] = [
    { key: "name",    header: "Contractor",  render: r => <p style={{ fontWeight: 800 }}>{r.name}</p> },
    { key: "trade",   header: "Trade",       render: r => <StatusBadge label={r.trade} color="#1B3A6B" bg="#EFF6FF" dot={false} /> },
    { key: "workers", header: "Workers", align: "right", render: r => r.workers },
    { key: "rate",    header: "Rate/Day", align: "right", render: r => `₹${r.ratePerDay.toLocaleString()}` },
    { key: "advance", header: "Advance", align: "right", render: r => fmtINR(r.advance) },
    { key: "payable", header: "Total Payable", align: "right", render: r => fmtINR(r.totalPayable) },
    { key: "paid",    header: "Paid", align: "right",    render: r => <span style={{ color: "#22C55E", fontWeight: 800 }}>{fmtINR(r.paid)}</span> },
    { key: "due",     header: "Outstanding", align: "right", render: r => <strong style={{ color: "#EF4444" }}>{fmtINR(r.totalPayable - r.paid)}</strong> },
    { key: "status",  header: "Status", render: r => <StatusBadge label={r.status === "active" ? "Active" : "Closed"} color={r.status === "active" ? "#22C55E" : "#94A3B8"} bg={r.status === "active" ? "#F0FDF4" : "#F8FAFC"} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#1B3A6B", color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 800 }} className="active:scale-95 transition-transform">
          <Plus size={14} />Add Contractor
        </button>
      </div>
      <DataTable columns={cols} data={contractors} isDark={isDark} />
    </div>
  );
}

export function LabourModule({ isDark }: Props) {
  const [tab, setTab] = useState<LabourTab>("overview");

  const bg   = isDark ? "#0F172A" : "#F1F5F9";
  const card = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const bdr  = isDark ? "rgba(255,255,255,0.07)" : "#F1F5F9";
  const text = isDark ? "#F1F5F9" : "#0F172A";
  const sub  = isDark ? "rgba(255,255,255,0.4)" : "#64748B";

  return (
    <div className="flex flex-col h-full" style={{ background: bg }}>
      {/* Module header */}
      <div style={{ flexShrink: 0, background: card, borderBottom: `1px solid ${bdr}`, padding: "14px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👷</div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 900, color: text }}>Labour Management</p>
              <p style={{ fontSize: 10, color: sub }}>{workers.length} workers · {contractors.length} contractors · All towers</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: isDark ? "rgba(255,255,255,0.08)" : "#F8FAFC", border: `1px solid ${bdr}`, color: text, borderRadius: 9, fontSize: 11, fontWeight: 700 }} className="active:opacity-70 transition-opacity">
              <Filter size={13} />Filter
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "#1B3A6B", color: "#fff", borderRadius: 9, fontSize: 11, fontWeight: 800 }} className="active:scale-95 transition-transform">
              Export Report
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, flexShrink: 0,
                background: tab === t.id ? "#C9922A" : "transparent",
                color: tab === t.id ? "#fff" : sub,
              }}
              className="active:opacity-80 transition-opacity"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 24 }}>
        {tab === "overview"    && <OverviewTab    isDark={isDark} />}
        {tab === "workers"     && <WorkersTab     isDark={isDark} />}
        {tab === "attendance"  && <AttendanceTab  isDark={isDark} />}
        {tab === "wages"       && <WagesTab       isDark={isDark} />}
        {tab === "contractors" && <ContractorsTab isDark={isDark} />}
      </div>
    </div>
  );
}
