import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { KPIStrip } from "../KPIStrip";
import { labourMonthly, labourByTrade, labourKPIs, fmtINR } from "../reportsData";

export function LabourReportView() {
  return (
    <div className="space-y-5">
      <KPIStrip kpis={labourKPIs} />

      {/* Headcount trend */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-1">Headcount & Payroll Trend</p>
        <p className="text-[10px] text-muted-foreground mb-4">Nov 2025 – May 2026 (MTD)</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={labourMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradHead" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B3A6B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1B3A6B" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
            <Area type="monotone" dataKey="headcount" stroke="#1B3A6B" fill="url(#gradHead)" strokeWidth={2.5} name="Headcount" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Payroll + Overtime bar */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-4">Payroll vs Overtime Cost</p>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={labourMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number) => [fmtINR(v), ""]}
            />
            <Bar dataKey="payroll"   fill="#1B3A6B" radius={[4, 4, 0, 0]} name="Base Payroll" stackId="a" />
            <Bar dataKey="overtime"  fill="#C9922A" radius={[4, 4, 0, 0]} name="Overtime"     stackId="a" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          {[["#1B3A6B","Base Payroll"],["#C9922A","Overtime"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ background: c as string }} />
              <span className="text-[10px] text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trade-wise breakdown */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-black text-foreground">Trade-wise Breakdown</p>
        </div>
        <div className="divide-y divide-border">
          {labourByTrade.map(t => {
            const pct = Math.round((t.headcount / labourByTrade.reduce((s, x) => s + x.headcount, 0)) * 100);
            return (
              <div key={t.trade} className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.fill }} />
                    <p className="text-sm font-bold text-foreground">{t.trade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-foreground">{fmtINR(t.payroll)}</p>
                    <p className="text-[10px] text-muted-foreground">{t.headcount} workers</p>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div style={{ width: `${pct}%`, background: t.fill }} className="h-full rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Man-days */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-4">Man-Days per Month</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={labourMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
            <Bar dataKey="mandays" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Man-Days" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
