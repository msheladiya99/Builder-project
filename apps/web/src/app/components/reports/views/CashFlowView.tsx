import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { KPIStrip } from "../KPIStrip";
import { cashFlowMonthly, cashSources, cashKPIs, fmtINR } from "../reportsData";

export function CashFlowView() {
  return (
    <div className="space-y-5">
      <KPIStrip kpis={cashKPIs} />

      {/* Inflow vs Outflow bars + Balance line */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-1">Cash Inflow vs Outflow + Running Balance</p>
        <p className="text-[10px] text-muted-foreground mb-4">Nov 2025 – May 2026</p>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={cashFlowMonthly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number) => [fmtINR(v), ""]}
            />
            <Bar yAxisId="left" dataKey="inflow"  fill="#16A34A" radius={[4, 4, 0, 0]} name="Inflow"  opacity={0.9} />
            <Bar yAxisId="left" dataKey="outflow" fill="#EF4444" radius={[4, 4, 0, 0]} name="Outflow" opacity={0.8} />
            <Line yAxisId="right" type="monotone" dataKey="balance" stroke="#1B3A6B" strokeWidth={2.5} dot={{ fill: "#1B3A6B", r: 4, stroke: "#fff", strokeWidth: 1.5 }} name="Balance" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          {[["#16A34A","Inflow"],["#EF4444","Outflow"],["#1B3A6B","Balance"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ background: c as string }} />
              <span className="text-[10px] text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Net cash flow area */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-4">Net Cash Flow per Month</p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={cashFlowMonthly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B3A6B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1B3A6B" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number) => [fmtINR(v), "Net Flow"]}
            />
            <Area type="monotone" dataKey="net" stroke="#1B3A6B" strokeWidth={2.5} fill="url(#gradNet)" dot={{ fill: "#1B3A6B", r: 3 }} name="Net Flow" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cash sources donut */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-4">Cash Inflow Sources</p>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={cashSources} dataKey="amount" cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={2}>
                {cashSources.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2.5">
            {cashSources.map(s => (
              <div key={s.source}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.fill }} />
                    <span className="text-[10px] text-foreground leading-tight">{s.source}</span>
                  </div>
                  <span className="text-xs font-black text-foreground">{s.pct}%</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.fill }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly summary table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-black text-foreground">Monthly Cash Flow Statement</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase">Month</th>
                <th className="text-right px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase">Inflow</th>
                <th className="text-right px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase">Outflow</th>
                <th className="text-right px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase">Net</th>
                <th className="text-right px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cashFlowMonthly.map(m => (
                <tr key={m.month} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-foreground">{m.month}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-green-600">{fmtINR(m.inflow)}</td>
                  <td className="px-4 py-2.5 text-right text-red-500">{fmtINR(m.outflow)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`font-black ${m.net >= 0 ? "text-green-600" : "text-red-500"}`}>{fmtINR(m.net)}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-black text-[#1B3A6B]">{fmtINR(m.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
