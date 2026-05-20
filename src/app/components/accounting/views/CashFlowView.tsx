import { Download, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cfData, fmtINR, FinancialYear } from "../accountingData";

interface Props { fy: FinancialYear; }

function CFSection({ title, items, color, bgColor, icon }: {
  title: string;
  items: { label: string; amount: number }[];
  color: string; bgColor: string;
  icon: typeof TrendingUp;
}) {
  const Icon = icon;
  const net = items.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className={`px-4 py-3.5 border-b border-border ${bgColor} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
            <Icon size={14} className="text-white" />
          </div>
          <p className={`text-xs font-bold`}>{title}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-black ${net >= 0 ? "text-success" : "text-destructive"}`}>
            {net >= 0 ? "+" : ""}{fmtINR(net, true)}
          </p>
          <p className="text-[10px] text-muted-foreground">Net flow</p>
        </div>
      </div>
      <div className="divide-y divide-border/60">
        {items.map(item => (
          <div key={item.label} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors">
            <span className="text-xs text-foreground">{item.label}</span>
            <div className="flex items-center gap-2">
              {item.amount < 0
                ? <TrendingDown size={11} className="text-destructive" />
                : <TrendingUp size={11} className="text-success" />
              }
              <span className={`text-xs font-semibold tabular-nums ${item.amount < 0 ? "text-destructive" : "text-success"}`}>
                {item.amount >= 0 ? "+" : ""}{fmtINR(item.amount)}
              </span>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
          <span className="text-xs font-bold text-foreground">Net Cash from {title.replace(/[A-Z]\./g, "").trim()}</span>
          <span className={`text-sm font-black tabular-nums ${net >= 0 ? "text-success" : "text-destructive"}`}>
            {net >= 0 ? "+" : ""}{fmtINR(net)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CashFlowView({ fy }: Props) {
  const netOperating = cfData.operating.reduce((s, i) => s + i.amount, 0);
  const netInvesting = cfData.investing.reduce((s, i) => s + i.amount, 0);
  const netFinancing = cfData.financing.reduce((s, i) => s + i.amount, 0);
  const netChange = netOperating + netInvesting + netFinancing;
  const closingBalance = cfData.openingBalance + netChange;

  const waterfall = [
    { label: "Opening Balance", value: cfData.openingBalance, cumulative: cfData.openingBalance, type: "start" },
    { label: "Operating Activities", value: netOperating, cumulative: cfData.openingBalance + netOperating, type: netOperating >= 0 ? "positive" : "negative" },
    { label: "Investing Activities", value: netInvesting, cumulative: cfData.openingBalance + netOperating + netInvesting, type: netInvesting >= 0 ? "positive" : "negative" },
    { label: "Financing Activities", value: netFinancing, cumulative: closingBalance, type: netFinancing >= 0 ? "positive" : "negative" },
    { label: "Closing Balance", value: closingBalance, cumulative: closingBalance, type: "end" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Opening Cash Balance", value: fmtINR(cfData.openingBalance, true), sub: `01 Apr ${fy.split("-")[0]}`, color: "border-l-primary" },
          { label: "Net Operating Cash Flow", value: (netOperating >= 0 ? "+" : "") + fmtINR(netOperating, true), sub: "Core business activity", color: netOperating >= 0 ? "border-l-success" : "border-l-destructive" },
          { label: "Net Change in Cash", value: (netChange >= 0 ? "+" : "") + fmtINR(netChange, true), sub: "Operating + Investing + Financing", color: netChange >= 0 ? "border-l-success" : "border-l-destructive" },
          { label: "Closing Cash Balance", value: fmtINR(closingBalance, true), sub: `31 Mar 20${fy.split("-")[1]}`, color: "border-l-secondary" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[11px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Waterfall visual */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-foreground">Cash Flow Waterfall — FY {fy}</p>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted">
            <Download size={13} /> Export
          </button>
        </div>
        <div className="flex items-end gap-2 h-48">
          {waterfall.map((bar, idx) => {
            const maxVal = Math.max(...waterfall.map(b => Math.abs(b.value))) * 1.2;
            const pct = (Math.abs(bar.value) / maxVal) * 100;
            const isPos = bar.type === "positive" || bar.type === "start" || bar.type === "end";
            return (
              <div key={bar.label} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                <div className="text-[9px] font-bold text-foreground text-center">{fmtINR(bar.value, true)}</div>
                <div className="w-full flex items-end justify-center" style={{ height: `${Math.max(pct, 5)}%` }}>
                  <div className={`w-full rounded-t-lg ${
                    bar.type === "start" ? "bg-primary" :
                    bar.type === "end" ? "bg-secondary" :
                    bar.type === "positive" ? "bg-success" : "bg-destructive"
                  }`} style={{ height: "100%" }} />
                </div>
                <div className="text-[9px] text-muted-foreground text-center leading-tight">{bar.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Three sections */}
      <CFSection
        title="A. Cash Flow from Operating Activities"
        items={cfData.operating}
        color="bg-primary"
        bgColor="bg-primary/5"
        icon={TrendingUp}
      />
      <CFSection
        title="B. Cash Flow from Investing Activities"
        items={cfData.investing}
        color="bg-warning"
        bgColor="bg-warning/5"
        icon={netInvesting >= 0 ? TrendingUp : TrendingDown}
      />
      <CFSection
        title="C. Cash Flow from Financing Activities"
        items={cfData.financing}
        color="bg-success"
        bgColor="bg-success/5"
        icon={TrendingUp}
      />

      {/* Final summary */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="divide-y divide-border text-sm">
          {[
            { label: "A. Net Cash from Operating Activities", value: netOperating },
            { label: "B. Net Cash from Investing Activities", value: netInvesting },
            { label: "C. Net Cash from Financing Activities", value: netFinancing },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20">
              <span className="text-xs font-semibold text-foreground">{r.label}</span>
              <span className={`text-xs font-bold tabular-nums ${r.value >= 0 ? "text-success" : "text-destructive"}`}>
                {r.value >= 0 ? "+" : ""}{fmtINR(r.value)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-3 bg-muted/30">
            <span className="text-xs font-bold text-foreground">Net Increase / (Decrease) in Cash (A+B+C)</span>
            <span className={`text-sm font-black tabular-nums ${netChange >= 0 ? "text-success" : "text-destructive"}`}>
              {netChange >= 0 ? "+" : ""}{fmtINR(netChange)}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs font-semibold text-muted-foreground">Add: Opening Cash & Cash Equivalents (01 Apr {fy.split("-")[0]})</span>
            <span className="text-xs font-semibold text-foreground">{fmtINR(cfData.openingBalance)}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 bg-primary text-white">
            <span className="text-sm font-black">Closing Cash & Cash Equivalents (31 Mar 20{fy.split("-")[1]})</span>
            <span className="text-xl font-black tabular-nums">{fmtINR(closingBalance, true)}</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        Prepared as per Ind AS-7 (Cash Flow Statement) · FY {fy} · Indirect Method (Operating Activities)
      </p>
    </div>
  );
}
