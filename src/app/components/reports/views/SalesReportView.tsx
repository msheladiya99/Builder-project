import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { KPIStrip } from "../KPIStrip";
import { salesMonthly, salesByTower, salesByType, salesKPIs, fmtINR } from "../reportsData";

export function SalesReportView() {
  return (
    <div className="space-y-5">
      <KPIStrip kpis={salesKPIs} />

      {/* Revenue area chart */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-black text-foreground mb-1">Booking Value vs Collection</p>
        <p className="text-[10px] text-muted-foreground mb-4">Monthly trend — Nov 2025 to May 2026</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={salesMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B3A6B" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1B3A6B" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
              formatter={(v: number) => [fmtINR(v), ""]}
            />
            <Area type="monotone" dataKey="value"     fill="url(#gradValue)"     stroke="#1B3A6B" strokeWidth={2.5} name="Booking Value"  />
            <Area type="monotone" dataKey="collected" fill="url(#gradCollected)" stroke="#16A34A" strokeWidth={2.5} name="Collected"       />
            <Area type="monotone" dataKey="target"    fill="none"                stroke="#C9922A" strokeWidth={1.5} strokeDasharray="4 4" name="Target" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          {[["#1B3A6B","Booking Value"],["#16A34A","Collected"],["#C9922A","Target"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded-full" style={{ background: c as string }} />
              <span className="text-[10px] text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings bar + unit mix pie side by side */}
      <div className="grid grid-cols-1 gap-4">
        {/* Monthly bookings bar */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm font-black text-foreground mb-4">Monthly Bookings (Units)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={salesMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
              <Bar dataKey="bookings" fill="#1B3A6B" radius={[6, 6, 0, 0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Unit type mix */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm font-black text-foreground mb-3">Unit Type Mix</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={salesByType} dataKey="value" cx="50%" cy="50%" innerRadius={36} outerRadius={58} paddingAngle={3}>
                  {salesByType.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {salesByType.map(t => (
                <div key={t.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: t.fill }} />
                    <span className="text-xs text-foreground">{t.name}</span>
                  </div>
                  <span className="text-xs font-black text-foreground">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tower-wise table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-black text-foreground">Tower-wise Breakdown</p>
        </div>
        <div className="divide-y divide-border">
          {salesByTower.map(t => (
            <div key={t.tower} className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: "#1B3A6B" }}>
                    {t.tower.split(" ")[1]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.tower}</p>
                    <p className="text-[10px] text-muted-foreground">{t.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-foreground">{fmtINR(t.value)}</p>
                  <p className="text-[10px] text-muted-foreground">{t.pct}% of total</p>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#1B3A6B]" style={{ width: `${t.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
