import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { KPIStrip } from "../KPIStrip";
import { gstMonthly, gstByRate, gstKPIs, fmtINR } from "../reportsData";

export function GSTReportView() {
  return (
    <div className="space-y-5">
      <KPIStrip kpis={gstKPIs} />

      {/* GST Collected vs ITC bar + Net line */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-1">GST Collected vs ITC vs Net Liability</p>
        <p className="text-[10px] text-muted-foreground mb-4">Nov 2025 – May 2026</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={gstMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number) => [fmtINR(v), ""]}
            />
            <Bar dataKey="gstCollected" fill="#1B3A6B" radius={[4, 4, 0, 0]} name="GST Collected" />
            <Bar dataKey="itc"          fill="#7C3AED" radius={[4, 4, 0, 0]} name="ITC Credit" />
            <Bar dataKey="netLiability" fill="#C9922A" radius={[4, 4, 0, 0]} name="Net Liability" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          {[["#1B3A6B","GST Collected"],["#7C3AED","ITC Credit"],["#C9922A","Net Liability"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ background: c as string }} />
              <span className="text-[10px] text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* GST by rate slab */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-4">GST by Rate Slab</p>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={130} height={130}>
            <PieChart>
              <Pie data={gstByRate} dataKey="gst" cx="50%" cy="50%" innerRadius={36} outerRadius={58} paddingAngle={3}>
                {gstByRate.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {gstByRate.map(r => (
              <div key={r.rate} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: r.fill }} />
                  <span className="text-xs text-foreground">{r.rate}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-foreground">{fmtINR(r.gst)}</p>
                  <p className="text-[9px] text-muted-foreground">on {fmtINR(r.taxable)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Net liability line chart */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-4">Net GST Liability Trend</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={gstMonthly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number) => [fmtINR(v), ""]}
            />
            <Line type="monotone" dataKey="netLiability" stroke="#C9922A" strokeWidth={2.5} dot={{ fill: "#C9922A", r: 4 }} name="Net Liability" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filing status */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-black text-foreground">GSTR Filing Status</p>
        </div>
        <div className="divide-y divide-border">
          {["GSTR-1", "GSTR-3B", "GSTR-2B"].map((form, i) => (
            <div key={form} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-bold text-foreground">{form}</p>
                <p className="text-[10px] text-muted-foreground">April 2026 filing</p>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${i < 2 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                {i < 2 ? "Filed" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
