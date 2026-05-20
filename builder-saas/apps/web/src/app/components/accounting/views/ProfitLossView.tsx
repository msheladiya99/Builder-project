import { useState } from "react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Download, ChevronDown, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { plData, monthlyChartData, fmtINR, FinancialYear } from "../accountingData";

interface Props { fy: FinancialYear; }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold text-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-foreground">{fmtINR(p.value, true)}</span>
        </div>
      ))}
    </div>
  );
}

function PLRow({ label, amount, indent, isSubtotal, isTotal, isNegative, expanded, onToggle, hasChildren }: {
  label: string; amount: number; indent?: number; isSubtotal?: boolean; isTotal?: boolean;
  isNegative?: boolean; expanded?: boolean; onToggle?: () => void; hasChildren?: boolean;
}) {
  const base = `flex items-center justify-between px-4 py-2.5 text-xs`;
  const cls = isTotal
    ? `${base} bg-primary/10 border-t-2 border-primary/30 font-black text-foreground`
    : isSubtotal
    ? `${base} bg-muted/40 border-t border-border font-bold text-foreground`
    : `${base} hover:bg-muted/20 transition-colors text-foreground`;
  const amtColor = isNegative ? "text-destructive" : isTotal || isSubtotal ? "text-foreground" : "text-muted-foreground";
  return (
    <div className={cls} style={{ paddingLeft: indent ? `${16 + indent * 16}px` : undefined }}>
      <div className="flex items-center gap-2">
        {hasChildren && (
          <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        )}
        <span>{label}</span>
      </div>
      <span className={`font-semibold tabular-nums ${amtColor}`}>
        {isNegative && amount > 0 ? `-${fmtINR(amount)}` : fmtINR(Math.abs(amount))}
      </span>
    </div>
  );
}

export function ProfitLossView({ fy }: Props) {
  const [showRevDetails, setShowRevDetails] = useState(true);
  const [showCogsDetails, setShowCogsDetails] = useState(true);
  const [showOpexDetails, setShowOpexDetails] = useState(true);
  const [showFinDetails, setShowFinDetails] = useState(false);
  const [showTaxDetails, setShowTaxDetails] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<"full" | "h1" | "h2">("full");

  const totalRevenue = plData.revenue.reduce((s, i) => s + i.amount, 0);
  const totalCOGS = plData.cogs.reduce((s, i) => s + i.amount, 0);
  const grossProfit = totalRevenue - totalCOGS;
  const grossMargin = ((grossProfit / totalRevenue) * 100).toFixed(1);
  const totalOpex = plData.opex.reduce((s, i) => s + i.amount, 0);
  const ebitda = grossProfit - plData.opex.filter(i => i.label !== "Depreciation").reduce((s, i) => s + i.amount, 0);
  const ebit = grossProfit - totalOpex;
  const totalFinCosts = plData.finCosts.reduce((s, i) => s + i.amount, 0);
  const pbt = ebit - totalFinCosts;
  const totalTax = plData.tax.reduce((s, i) => s + i.amount, 0);
  const pat = pbt - totalTax;

  const chartData = chartPeriod === "h1"
    ? monthlyChartData.slice(0, 6)
    : chartPeriod === "h2"
    ? monthlyChartData.slice(6)
    : monthlyChartData;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: fmtINR(totalRevenue, true), trend: "+18.4%", positive: true },
          { label: "Gross Profit", value: fmtINR(grossProfit, true), trend: `${grossMargin}% margin`, positive: true },
          { label: "EBITDA", value: fmtINR(ebitda, true), trend: `${((ebitda / totalRevenue) * 100).toFixed(1)}% margin`, positive: true },
          { label: "PAT (Net Profit)", value: fmtINR(pat, true), trend: `${((pat / totalRevenue) * 100).toFixed(1)}% margin`, positive: true },
        ].map(k => (
          <div key={k.label} className="bg-card border border-border rounded-2xl p-4">
            <p className="text-[11px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {k.positive ? <TrendingUp size={11} className="text-success" /> : <TrendingDown size={11} className="text-destructive" />}
              <span className={`text-[10px] font-semibold ${k.positive ? "text-success" : "text-destructive"}`}>{k.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue vs Expense */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-foreground">Revenue vs Expense</p>
              <p className="text-[11px] text-muted-foreground">Monthly comparison — FY {fy}</p>
            </div>
            <div className="flex gap-1">
              {(["full", "h1", "h2"] as const).map(p => (
                <button key={p} onClick={() => setChartPeriod(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${chartPeriod === p ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {p === "full" ? "Full Year" : p === "h1" ? "H1" : "H2"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={2} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => fmtINR(v, true)} width={52} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
              <Bar dataKey="revenue" name="Revenue" fill="#1B3A6B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Collections */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-foreground">Monthly Collections</p>
              <p className="text-[11px] text-muted-foreground">Cash inflows & outstanding — FY {fy}</p>
            </div>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-[10px] font-semibold hover:bg-muted">
              <Download size={11} /> Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B3A6B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B3A6B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9922A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C9922A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => fmtINR(v, true)} width={52} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
              <Area type="monotone" dataKey="collections" name="Collections" stroke="#1B3A6B" strokeWidth={2} fill="url(#colGrad)" />
              <Area type="monotone" dataKey="outstanding" name="Outstanding" stroke="#C9922A" strokeWidth={2} fill="url(#outGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* P&L Statement */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border bg-muted/30 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Statement of Profit & Loss</p>
            <p className="text-[11px] text-muted-foreground">For the year ended 31 March 2026 (FY {fy})</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted">
            <Download size={13} /> Export
          </button>
        </div>

        <div className="divide-y divide-border">
          {/* Revenue */}
          <PLRow label="I. Revenue from Operations" amount={totalRevenue} isSubtotal hasChildren expanded={showRevDetails} onToggle={() => setShowRevDetails(v => !v)} />
          {showRevDetails && plData.revenue.map(i => <PLRow key={i.label} label={i.label} amount={i.amount} indent={1} />)}

          {/* COGS */}
          <PLRow label="II. Cost of Revenue (Direct Costs)" amount={totalCOGS} isSubtotal isNegative hasChildren expanded={showCogsDetails} onToggle={() => setShowCogsDetails(v => !v)} />
          {showCogsDetails && plData.cogs.map(i => <PLRow key={i.label} label={i.label} amount={i.amount} indent={1} isNegative />)}

          <PLRow label="III. Gross Profit (I - II)" amount={grossProfit} isTotal />

          {/* Opex */}
          <PLRow label="IV. Operating Expenses" amount={totalOpex} isSubtotal isNegative hasChildren expanded={showOpexDetails} onToggle={() => setShowOpexDetails(v => !v)} />
          {showOpexDetails && plData.opex.map(i => <PLRow key={i.label} label={i.label} amount={i.amount} indent={1} isNegative />)}

          <PLRow label="V. EBITDA (III - Opex excl. Depreciation)" amount={ebitda} isSubtotal />
          <PLRow label="VI. EBIT / Operating Profit (III - IV)" amount={ebit} isTotal />

          {/* Finance costs */}
          <PLRow label="VII. Finance Costs" amount={totalFinCosts} isSubtotal isNegative hasChildren expanded={showFinDetails} onToggle={() => setShowFinDetails(v => !v)} />
          {showFinDetails && plData.finCosts.map(i => <PLRow key={i.label} label={i.label} amount={i.amount} indent={1} isNegative />)}

          <PLRow label="VIII. Profit Before Tax (VI - VII)" amount={pbt} isTotal />

          {/* Tax */}
          <PLRow label="IX. Tax Expense" amount={totalTax} isSubtotal isNegative hasChildren expanded={showTaxDetails} onToggle={() => setShowTaxDetails(v => !v)} />
          {showTaxDetails && plData.tax.map(i => <PLRow key={i.label} label={i.label} amount={i.amount} indent={1} isNegative />)}

          <div className="bg-primary text-white">
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-sm font-black">X. Profit After Tax (PAT) — VIII - IX</span>
              <span className="text-xl font-black tabular-nums">{fmtINR(pat, true)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
