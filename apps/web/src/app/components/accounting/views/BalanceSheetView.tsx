import { useState } from "react";
import { ChevronDown, ChevronRight, Download, CheckCircle2 } from "lucide-react";
import { bsData, fmtINR, FinancialYear } from "../accountingData";

interface Props { fy: FinancialYear; }

function BSSection({ title, items, color, indent }: {
  title: string; items: { label: string; amount: number }[];
  color: string; indent?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const total = items.reduce((s, i) => s + i.amount, 0);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronDown size={13} className="text-muted-foreground" /> : <ChevronRight size={13} className="text-muted-foreground" />}
          <span className={`text-xs font-bold ${color}`}>{title}</span>
        </div>
        <span className="text-xs font-bold text-foreground">{fmtINR(total)}</span>
      </button>
      {open && (
        <div className="divide-y divide-border/50">
          {items.map(item => (
            <div key={item.label} className={`flex items-center justify-between py-2 hover:bg-muted/10 ${indent ? "px-10" : "px-8"}`}>
              <span className="text-xs text-foreground">{item.label}</span>
              <span className="text-xs font-semibold text-foreground">{fmtINR(item.amount)}</span>
            </div>
          ))}
          <div className={`flex items-center justify-between py-2.5 bg-muted/30 ${indent ? "px-10" : "px-8"}`}>
            <span className="text-xs font-bold text-foreground">Sub-total</span>
            <span className="text-xs font-bold text-foreground">{fmtINR(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function BalanceSheetView({ fy }: Props) {
  const totalFixed = bsData.assets.fixed.reduce((s, i) => s + i.amount, 0);
  const totalCurrent = bsData.assets.current.reduce((s, i) => s + i.amount, 0);
  const totalAssets = totalFixed + totalCurrent;

  const totalEquity = bsData.liabilities.equity.reduce((s, i) => s + i.amount, 0);
  const totalLT = bsData.liabilities.longTerm.reduce((s, i) => s + i.amount, 0);
  const totalCurrentL = bsData.liabilities.current.reduce((s, i) => s + i.amount, 0);
  const totalLiabilities = totalEquity + totalLT + totalCurrentL;

  const balanced = Math.abs(totalAssets - totalLiabilities) < 100;

  // Key ratios
  const currentRatio = (totalCurrent / totalCurrentL).toFixed(2);
  const debtEquity = ((totalLT) / totalEquity).toFixed(2);
  const debtorDays = Math.round((bsData.assets.current[1].amount / (128700000)) * 365);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">Balance Sheet</p>
          <p className="text-[11px] text-muted-foreground">As at 31 March 2026 (FY {fy}) · Shri Hari Group</p>
        </div>
        <div className="flex items-center gap-3">
          {balanced && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <CheckCircle2 size={12} className="text-success" />
              <span className="text-[11px] font-bold text-success">Balanced ✓</span>
            </div>
          )}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Ratios */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Assets", value: fmtINR(totalAssets, true), sub: "Fixed + Current", color: "border-l-primary" },
          { label: "Current Ratio", value: currentRatio, sub: "Current Assets / Current Liab.", color: Number(currentRatio) >= 1.5 ? "border-l-success" : "border-l-warning" },
          { label: "Debt-Equity Ratio", value: debtEquity, sub: "Long-term Debt / Equity", color: Number(debtEquity) <= 1 ? "border-l-success" : "border-l-warning" },
          { label: "Debtor Days", value: `${debtorDays} days`, sub: "Avg. collection period", color: "border-l-info" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[11px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Two-column balance sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ASSETS */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-primary/5">
            <p className="text-xs font-black text-primary uppercase tracking-wider">Assets</p>
          </div>

          <div className="divide-y divide-border">
            {/* Fixed */}
            <div className="px-4 py-2 bg-muted/20">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">I. Non-Current Assets (Fixed)</p>
            </div>
            <BSSection title="Tangible Fixed Assets" items={bsData.assets.fixed} color="text-primary" />

            {/* Current */}
            <div className="px-4 py-2 bg-muted/20 border-t border-border">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">II. Current Assets</p>
            </div>
            <BSSection title="Current Assets" items={bsData.assets.current} color="text-info" />

            {/* Total */}
            <div className="flex items-center justify-between px-4 py-4 bg-primary text-white">
              <span className="text-sm font-black">TOTAL ASSETS</span>
              <span className="text-lg font-black">{fmtINR(totalAssets, true)}</span>
            </div>
          </div>
        </div>

        {/* LIABILITIES */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-destructive/5">
            <p className="text-xs font-black text-destructive uppercase tracking-wider">Equity & Liabilities</p>
          </div>

          <div className="divide-y divide-border">
            {/* Equity */}
            <div className="px-4 py-2 bg-muted/20">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">I. Shareholders' Equity</p>
            </div>
            <BSSection title="Equity & Reserves" items={bsData.liabilities.equity} color="text-success" />

            {/* Long-term */}
            <div className="px-4 py-2 bg-muted/20 border-t border-border">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">II. Non-Current Liabilities</p>
            </div>
            <BSSection title="Long-term Borrowings & Liabilities" items={bsData.liabilities.longTerm} color="text-warning" />

            {/* Current */}
            <div className="px-4 py-2 bg-muted/20 border-t border-border">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">III. Current Liabilities</p>
            </div>
            <BSSection title="Current Liabilities & Provisions" items={bsData.liabilities.current} color="text-destructive" />

            {/* Total */}
            <div className="flex items-center justify-between px-4 py-4 bg-destructive text-white">
              <span className="text-sm font-black">TOTAL EQUITY & LIABILITIES</span>
              <span className="text-lg font-black">{fmtINR(totalLiabilities, true)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance check */}
      <div className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${balanced ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}`}>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className={balanced ? "text-success" : "text-destructive"} />
          <span className="text-sm font-bold text-foreground">
            {balanced ? "Balance Sheet is balanced — Total Assets = Total Liabilities + Equity" : "⚠ Balance Sheet is NOT balanced!"}
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs font-semibold">
          <span>Assets: <span className="font-bold text-foreground">{fmtINR(totalAssets, true)}</span></span>
          <span>Liabilities: <span className="font-bold text-foreground">{fmtINR(totalLiabilities, true)}</span></span>
          <span>Difference: <span className={`font-bold ${balanced ? "text-success" : "text-destructive"}`}>{fmtINR(Math.abs(totalAssets - totalLiabilities))}</span></span>
        </div>
      </div>
    </div>
  );
}
