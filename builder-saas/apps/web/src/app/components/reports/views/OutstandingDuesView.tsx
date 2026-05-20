import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { AlertTriangle, Phone, MessageSquare } from "lucide-react";
import { KPIStrip } from "../KPIStrip";
import { outstandingBrackets, outstandingTopDebtors, outstandingKPIs, fmtINR } from "../reportsData";

const TOWER_COLOR: Record<string, string> = { TA: "#1B3A6B", TB: "#C9922A", TC: "#7C3AED" };

export function OutstandingDuesView() {
  const total = outstandingBrackets.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-5">
      <KPIStrip kpis={outstandingKPIs} />

      {/* Ageing bar */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-1">Dues Ageing Analysis</p>
        <p className="text-[10px] text-muted-foreground mb-4">Outstanding amount by age bracket</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={outstandingBrackets} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="bracket" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number, name) => [fmtINR(v), "Due Amount"]}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]} name="Due Amount">
              {outstandingBrackets.map((b, i) => <Cell key={i} fill={b.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bracket summary tiles */}
      <div className="grid grid-cols-2 gap-3">
        {outstandingBrackets.map(b => {
          const pct = Math.round((b.amount / total) * 100);
          return (
            <div key={b.bracket} className="bg-card border border-border rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-muted-foreground">{b.bracket}</span>
                <div className="w-2 h-2 rounded-full" style={{ background: b.fill }} />
              </div>
              <p className="text-lg font-black text-foreground">{fmtINR(b.amount)}</p>
              <p className="text-[10px] text-muted-foreground">{b.count} owners · {pct}% of total</p>
            </div>
          );
        })}
      </div>

      {/* Top debtors */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-sm font-black text-foreground">Top Outstanding</p>
          <span className="text-[10px] text-muted-foreground">{outstandingTopDebtors.length} owners</span>
        </div>
        <div className="divide-y divide-border">
          {outstandingTopDebtors.map(d => (
            <div key={d.flat} className="p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: TOWER_COLOR[d.tower] }}>
                    {d.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d.flat}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-foreground">{fmtINR(d.due)}</p>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${d.days > 60 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                    {d.days}d overdue {d.days > 60 && "⚠️"}
                  </span>
                </div>
              </div>
              {/* Progress bar showing % of total */}
              <div className="flex gap-2 mt-1">
                <a href={`tel:+919999999999`} className="flex-1 h-8 rounded-xl border border-border flex items-center justify-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-all">
                  <Phone size={11} /> Call
                </a>
                <button className="flex-1 h-8 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center justify-center gap-1.5 text-[10px] font-bold text-green-700 dark:text-green-400 hover:bg-green-100 transition-all">
                  <MessageSquare size={11} /> WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
