import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Bell, Package, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";
import {
  kpiCards, revenueData, projectHealth, recentTransactions, alerts, activityFeed,
  fmtINR, currentTenant, currentUser, tenants
} from "./saasData";

const ALERT_TYPE_CFG = {
  overdue: { color: "#EF4444", bg: "#FEF2F2", icon: "💰" },
  stock:   { color: "#F97316", bg: "#FFF7ED", icon: "📦" },
  rera:    { color: "#7C3AED", bg: "#EDE9FE", icon: "📋" },
  diary:   { color: "#1B3A6B", bg: "#EFF6FF", icon: "📓" },
  labour:  { color: "#0D9488", bg: "#CCFBF1", icon: "👷" },
};

const STATUS_CFG = {
  active:    { color: "#22C55E", label: "Active"    },
  delayed:   { color: "#EF4444", label: "Delayed"   },
  completed: { color: "#1B3A6B", label: "Completed" },
  planning:  { color: "#F59E0B", label: "Planning"  },
};

const PIE_COLORS = ["#1B3A6B", "#C9922A", "#22C55E", "#EF4444"];
const DONUT_DATA = [
  { name: "Active",    value: 68 },
  { name: "Delayed",   value: 14 },
  { name: "Completed", value: 12 },
  { name: "Planning",  value: 6  },
];

interface Props { isDark: boolean; onNavigate: (mod: string) => void; tenantId?: string; }

function SectionHeader({ title, sub, action, onAction }: { title: string; sub?: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 900, color: "inherit" }}>{title}</p>
        {sub && <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>{sub}</p>}
      </div>
      {action && (
        <button onClick={onAction} style={{ fontSize: 11, fontWeight: 700, color: "#1B3A6B", display: "flex", alignItems: "center", gap: 3 }} className="active:opacity-70 transition-opacity">
          {action} <ArrowUpRight size={12} />
        </button>
      )}
    </div>
  );
}

export function SaasDashboard({ isDark, onNavigate, tenantId }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const activeTenant = tenants.find(t => t.id === tenantId) || currentTenant;

  const bg    = isDark ? "#0F172A"                 : "#F1F5F9";
  const card  = isDark ? "rgba(255,255,255,0.04)"  : "#fff";
  const bdr   = isDark ? "rgba(255,255,255,0.07)"  : "#F1F5F9";
  const text  = isDark ? "#F1F5F9"                 : "#0F172A";
  const sub   = isDark ? "rgba(255,255,255,0.4)"   : "#64748B";
  const grid  = isDark ? "rgba(255,255,255,0.05)"  : "#E2E8F0";

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  return (
    <div style={{ flex: 1, overflow: "hidden auto", background: bg }}>
      <div style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>

        {/* Welcome banner */}
        <div style={{ background: "linear-gradient(135deg, #0A1628 0%, #1B3A6B 60%, #2563EB 100%)", borderRadius: 20, padding: "20px 24px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 200, opacity: 0.06 }}>
            <svg viewBox="0 0 200 120" width="200" height="120" fill="white">
              <rect x="20" y="0"  width="50" height="120" /><rect x="80" y="20"  width="40" height="100" />
              <rect x="130" y="10" width="60" height="110" /><rect x="0" y="50"  width="25" height="70"  />
            </svg>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Good morning, {currentUser.name.split(" ")[0]} 👋</p>
                <p style={{ color: "#fff", fontSize: 22, fontWeight: 900, lineHeight: 1.1 }}>{activeTenant.name}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 3 }}>
                  {activeTenant.plan.charAt(0).toUpperCase() + activeTenant.plan.slice(1)} Plan · {activeTenant.city} · {activeTenant.projects} Projects
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "GSTIN",       value: activeTenant.gstin },
                  { label: "Modules",     value: "12 Active"         },
                ].map(chip => (
                  <div key={chip.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "6px 12px" }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>{chip.label}</p>
                    <p style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>{chip.value}</p>
                  </div>
                ))}
                <button onClick={handleRefresh} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }} className="active:opacity-70 transition-opacity">
                  <RefreshCw size={15} color="rgba(255,255,255,0.6)" className={refreshing ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
          {kpiCards.map(kpi => (
            <div key={kpi.id} style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: "18px 18px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer" }} className="active:scale-[0.99] transition-transform"
              onClick={() => {
                if (kpi.id === "revenue") onNavigate("accounting");
                if (kpi.id === "units") onNavigate("flats");
                if (kpi.id === "overdue") onNavigate("accounting");
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {kpi.icon}
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: kpi.delta >= 0 ? "#22C55E" : "#EF4444", background: kpi.delta >= 0 ? "#F0FDF4" : "#FEF2F2", padding: "3px 8px", borderRadius: 99, display: "flex", alignItems: "center", gap: 2 }}>
                  {kpi.delta >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {Math.abs(kpi.delta)}%
                </span>
              </div>
              {/* Sparkline */}
              <div style={{ height: 32, marginBottom: 10 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpi.sparkline.map((v, i) => ({ v, i }))}>
                    <defs>
                      <linearGradient id={`sg-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={kpi.color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={kpi.color} stopOpacity={0}  />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={kpi.color} strokeWidth={2} fill={`url(#sg-${kpi.id})`} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p style={{ fontSize: 24, fontWeight: 900, color: text, lineHeight: 1 }}>{kpi.value}</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: text, marginTop: 4 }}>{kpi.label}</p>
              <p style={{ fontSize: 10, color: sub, marginTop: 2 }}>{kpi.sub} · {kpi.deltaLabel}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>

          {/* Revenue Area Chart */}
          <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
            <SectionHeader title="Collections vs Target" sub="Last 6 months (₹ Cr)" action="View All" onAction={() => onNavigate("accounting")} />
            <div style={{ color: text }}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B3A6B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1B3A6B" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9922A" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#C9922A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: sub }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: sub }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}Cr`} />
                  <Tooltip
                    contentStyle={{ background: isDark ? "#1E293B" : "#fff", border: `1px solid ${bdr}`, borderRadius: 10, fontSize: 11 }}
                    formatter={(v: number, name: string) => [`₹${v} Cr`, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="collections" name="Collections" stroke="#1B3A6B" strokeWidth={2.5} fill="url(#colGrad)" dot={{ fill: "#1B3A6B", r: 3 }} />
                  <Area type="monotone" dataKey="target"      name="Target"      stroke="#94A3B8"  strokeWidth={1.5}  fill="none"            strokeDasharray="4 3" dot={false} />
                  <Area type="monotone" dataKey="expenses"    name="Expenses"    stroke="#C9922A"  strokeWidth={2}    fill="url(#expGrad)"   dot={{ fill: "#C9922A", r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Status Donut */}
          <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
            <SectionHeader title="Project Status" sub="By completion %" />
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={DONUT_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {DONUT_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: isDark ? "#1E293B" : "#fff", border: `1px solid ${bdr}`, borderRadius: 10, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {DONUT_DATA.map((d, i) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: sub, flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: text }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Health */}
        <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20, marginBottom: 20 }}>
          <SectionHeader title="Project Health" sub={`${projectHealth.length} active projects`} action="Manage Projects" onAction={() => onNavigate("projects")} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {projectHealth.map(p => {
              const statusCfg = STATUS_CFG[p.status];
              const soldPct   = Math.round((p.unitsSold / p.unitsTotal) * 100);
              const budgetPct = Math.round((p.spent / p.budget) * 100);
              return (
                <div key={p.name} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1.5px solid ${bdr}`, borderRadius: 14, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: text }}>{p.name}</p>
                    <span style={{ fontSize: 9, fontWeight: 800, color: statusCfg.color, background: `${statusCfg.color}18`, padding: "2px 7px", borderRadius: 99 }}>
                      {statusCfg.label}
                    </span>
                  </div>
                  {/* Construction progress */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 9, color: sub }}>Construction</span>
                      <span style={{ fontSize: 9, fontWeight: 800, color: text }}>{p.pct}%</span>
                    </div>
                    <div style={{ height: 5, background: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${p.pct}%`, height: "100%", background: `linear-gradient(90deg, #1B3A6B, #2563EB)`, borderRadius: 99 }} />
                    </div>
                  </div>
                  {/* Units sold */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 9, color: sub }}>Units Sold</span>
                      <span style={{ fontSize: 9, fontWeight: 800, color: text }}>{p.unitsSold}/{p.unitsTotal}</span>
                    </div>
                    <div style={{ height: 5, background: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${soldPct}%`, height: "100%", background: "#C9922A", borderRadius: 99 }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: sub }}>Budget: ₹{p.budget}L</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: budgetPct > 90 ? "#EF4444" : sub }}>Spent: {budgetPct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom row: Transactions + Alerts + Activity */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>

          {/* Recent Transactions */}
          <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
            <SectionHeader title="Recent Transactions" action="View All" onAction={() => onNavigate("accounting")} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recentTransactions.map(t => {
                const statusColor = t.status === "success" ? "#22C55E" : t.status === "pending" ? "#F59E0B" : "#EF4444";
                return (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: `1px solid ${bdr}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: t.type === "collection" ? "#EFF6FF" : t.type === "penalty" ? "#FFFBEB" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                      {t.type === "collection" ? "💰" : t.type === "penalty" ? "⚠️" : "↩️"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.owner}</p>
                      <p style={{ fontSize: 9, color: sub }}>{t.flat} · {t.mode}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 900, color: t.type === "refund" ? "#EF4444" : "#22C55E" }}>
                        {t.type === "refund" ? "-" : "+"}{fmtINR(t.amount)}
                      </p>
                      <span style={{ fontSize: 8, fontWeight: 800, color: statusColor }}>● {t.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerts Panel */}
          <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
            <SectionHeader title="Action Required" sub={`${alerts.filter(a => a.severity === "critical").length} critical`} action="View All" onAction={() => onNavigate("notifications")} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {alerts.map(a => {
                const cfg = ALERT_TYPE_CFG[a.type];
                const svr = a.severity === "critical" ? "#EF4444" : a.severity === "high" ? "#F97316" : "#F59E0B";
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", background: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA", borderRadius: 10, border: `1px solid ${bdr}` }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{cfg.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</p>
                      <p style={{ fontSize: 9, color: sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.sub}</p>
                    </div>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: svr, flexShrink: 0, marginTop: 4 }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Feed */}
          <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
            <SectionHeader title="Activity Feed" sub="Last 4 hours" />
            <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
              <div style={{ position: "absolute", left: 13, top: 8, bottom: 8, width: 1.5, background: bdr, zIndex: 0 }} />
              {activityFeed.map(ev => (
                <div key={ev.id} style={{ display: "flex", gap: 10, paddingBottom: 12, position: "relative", zIndex: 1 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 99, background: `${ev.color}20`, border: `1.5px solid ${ev.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>
                    {ev.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                    <p style={{ fontSize: 11, color: text, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 800 }}>{ev.actor}</span>{" "}
                      <span style={{ color: sub }}>{ev.action}</span>{" "}
                      <span style={{ fontWeight: 700 }}>{ev.target}</span>
                    </p>
                    <p style={{ fontSize: 9, color: sub, marginTop: 2 }}>{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
          <SectionHeader title="Quick Actions" />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "Add Payment",       icon: "💰", mod: "accounting", color: "#22C55E", bg: "#F0FDF4" },
              { label: "New Flat Booking",  icon: "🏠", mod: "flats",      color: "#1B3A6B", bg: "#EFF6FF" },
              { label: "KYC Pending (12)",  icon: "👤", mod: "crm",        color: "#7C3AED", bg: "#EDE9FE" },
              { label: "Raise PO",          icon: "📦", mod: "inventory",   color: "#F97316", bg: "#FFF7ED" },
              { label: "File GSTR-3B",      icon: "📋", mod: "gst",         color: "#0D9488", bg: "#CCFBF1" },
              { label: "Mark Attendance",   icon: "👷", mod: "labour",      color: "#C9922A", bg: "#FEF3C7" },
              { label: "View Reports",      icon: "📊", mod: "reports",     color: "#EF4444", bg: "#FEF2F2" },
              { label: "Send Notification", icon: "🔔", mod: "notifications", color: "#F59E0B", bg: "#FFFBEB" },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.mod)}
                className="active:scale-95 transition-transform"
                style={{ display: "flex", alignItems: "center", gap: 7, background: action.bg, borderRadius: 12, padding: "9px 14px", border: `1.5px solid ${action.color}20` }}
              >
                <span style={{ fontSize: 15 }}>{action.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: action.color }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
