import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { KPIStrip } from "../KPIStrip";
import { profitMonthly, costBreakdown, profitKPIs, fmtINR } from "../reportsData";

const CustomMarginDot = (props: any) => {
  const { cx, cy, value } = props;
  return (
    <circle cx={cx} cy={cy} r={4} fill={value >= 25 ? "#16A34A" : "#C9922A"} stroke="#fff" strokeWidth={1.5} />
  );
};

export function ProfitAnalysisView() {
  return (
    <div className="space-y-5">
      <KPIStrip kpis={profitKPIs} />

      {/* Revenue vs Cost vs Gross Profit — composed */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-1">Revenue vs Cost vs Gross Profit</p>
        <p className="text-[10px] text-muted-foreground mb-4">Nov 2025 – May 2026</p>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={profitMonthly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[15, 30]} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number, name) => name === "Margin %" ? [`${v}%`, name] : [fmtINR(v), name]}
            />
            <Bar yAxisId="left" dataKey="revenue" fill="#1B3A6B" opacity={0.85} radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar yAxisId="left" dataKey="costs"   fill="#C9922A" opacity={0.85} radius={[4, 4, 0, 0]} name="Costs" />
            <Bar yAxisId="left" dataKey="gross"   fill="#16A34A" opacity={0.85} radius={[4, 4, 0, 0]} name="Gross Profit" />
            <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#EF4444" strokeWidth={2.5} dot={<CustomMarginDot />} name="Margin %" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 mt-2 justify-center">
          {[["#1B3A6B","Revenue"],["#C9922A","Costs"],["#16A34A","Gross Profit"],["#EF4444","Margin %"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ background: c as string }} />
              <span className="text-[10px] text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gross margin trend area */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-4">Gross Margin % Trend</p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={profitMonthly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradMargin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[18, 28]} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number) => [`${v}%`, "Margin"]}
            />
            <Area type="monotone" dataKey="margin" stroke="#16A34A" strokeWidth={2.5} fill="url(#gradMargin)" name="Margin %" dot={{ fill: "#16A34A", r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cost structure donut */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-4">Cost Structure Breakdown</p>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={costBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={2}>
                {costBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {costBreakdown.map(c => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c.fill }} />
                  <span className="text-xs text-foreground">{c.name}</span>
                </div>
                <span className="text-xs font-black text-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly summary table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-black text-foreground">Monthly P&L Summary</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase">Month</th>
                <th className="text-right px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase">Revenue</th>
                <th className="text-right px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase">Costs</th>
                <th className="text-right px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase">Gross</th>
                <th className="text-right px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profitMonthly.map(m => (
                <tr key={m.month} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-foreground">{m.month}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">{fmtINR(m.revenue)}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{fmtINR(m.costs)}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-green-600">{fmtINR(m.gross)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`font-black text-xs ${m.margin >= 25 ? "text-green-600" : "text-amber-600"}`}>{m.margin}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
