import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell,
} from "recharts";
import { KPIStrip } from "../KPIStrip";
import { materialMonthly, materialByCategory, materialKPIs, fmtINR } from "../reportsData";

export function MaterialReportView() {
  return (
    <div className="space-y-5">
      <KPIStrip kpis={materialKPIs} />

      {/* Ordered vs Delivered vs Consumed */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-1">Ordered vs Delivered vs Consumed</p>
        <p className="text-[10px] text-muted-foreground mb-4">Monthly material flow — Nov 2025 to May 2026</p>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={materialMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number) => [fmtINR(v), ""]}
            />
            <Bar dataKey="ordered"   fill="#1B3A6B" radius={[4, 4, 0, 0]} name="Ordered" />
            <Bar dataKey="delivered" fill="#C9922A" radius={[4, 4, 0, 0]} name="Delivered" />
            <Bar dataKey="consumed"  fill="#16A34A" radius={[4, 4, 0, 0]} name="Consumed" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          {[["#1B3A6B","Ordered"],["#C9922A","Delivered"],["#16A34A","Consumed"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ background: c as string }} />
              <span className="text-[10px] text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-black text-foreground">Category-wise Consumption & Waste</p>
        </div>
        <div className="divide-y divide-border">
          {materialByCategory.map(c => {
            const wastePct = Math.round((c.waste / c.ordered) * 100);
            const consumedPct = Math.round((c.consumed / c.ordered) * 100);
            return (
              <div key={c.category} className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-8 rounded-full" style={{ background: c.fill }} />
                    <div>
                      <p className="text-sm font-bold text-foreground">{c.category}</p>
                      <p className="text-[10px] text-muted-foreground">{fmtINR(c.ordered)} ordered</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-foreground">{fmtINR(c.consumed)}</p>
                    <span className={`text-[9px] font-bold ${wastePct > 8 ? "text-red-500" : "text-green-600"}`}>
                      {wastePct}% waste
                    </span>
                  </div>
                </div>
                {/* Stacked progress */}
                <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                  <div style={{ width: `${consumedPct}%`, background: c.fill }} className="h-full" />
                  <div style={{ width: `${wastePct}%`, background: "#EF4444" }} className="h-full opacity-60" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category bar chart */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-4">Category Spend Comparison</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={materialByCategory} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={70} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number) => [fmtINR(v), ""]}
            />
            <Bar dataKey="consumed" radius={[0, 6, 6, 0]} name="Consumed">
              {materialByCategory.map((c, i) => <Cell key={i} fill={c.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
