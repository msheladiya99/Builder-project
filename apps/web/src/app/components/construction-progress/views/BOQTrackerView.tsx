import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  mockBOQ, mockProjects, fmtINR, boqExecuted, boqPlanned, boqPct,
  categoryStyle, type BOQCategory, type ProjectId,
} from "../progressData";

const CATEGORIES: BOQCategory[] = ["Civil", "MEP", "Finishing", "External"];

interface Props { projectId: ProjectId }

export function BOQTrackerView({ projectId }: Props) {
  const [activeCategory, setActiveCategory] = useState<BOQCategory>("Civil");
  const [expandedId, setExpanded]           = useState<string | null>(null);

  const project = mockProjects.find(p => p.id === projectId)!;
  const allItems = mockBOQ.filter(b => b.projectId === projectId);
  const catItems = allItems.filter(b => b.category === activeCategory);

  // Grand totals
  let totalPlanned = 0, totalExecuted = 0;
  allItems.forEach(b => { totalPlanned += boqPlanned(b); totalExecuted += boqExecuted(b); });
  const overallPct = totalPlanned > 0 ? Math.round((totalExecuted / totalPlanned) * 100) : 0;

  // Category totals
  const catStats = CATEGORIES.map(cat => {
    const items = allItems.filter(b => b.category === cat);
    let pl = 0, ex = 0;
    items.forEach(b => { pl += boqPlanned(b); ex += boqExecuted(b); });
    return { cat, items: items.length, planned: pl, executed: ex, pct: pl > 0 ? Math.round((ex / pl) * 100) : 0 };
  });

  return (
    <div className="p-4 pb-6 space-y-4 max-w-2xl mx-auto">

      {/* Grand summary */}
      <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#0F1C2E 0%,#1B3A6B 100%)" }}>
        <p className="text-white/60 text-xs mb-1">BOQ — {project.name}</p>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-2xl font-black text-white">{fmtINR(totalExecuted)}</p>
            <p className="text-xs text-white/50">of {fmtINR(totalPlanned)} planned</p>
          </div>
          <p className="text-3xl font-black text-[#C9922A]">{overallPct}%</p>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${overallPct}%`, background: "#C9922A" }} />
        </div>
      </div>

      {/* Category summary tiles */}
      <div className="grid grid-cols-2 gap-3">
        {catStats.map(({ cat, pct, executed, planned }) => {
          const cs = categoryStyle[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="text-left bg-card border-2 rounded-2xl p-3 transition-all"
              style={{ borderColor: activeCategory === cat ? "#1B3A6B" : "var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${cs.bg} ${cs.text}`}>
                  {cs.icon} {cat}
                </span>
              </div>
              <p className="text-lg font-black text-foreground">{pct}%</p>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1 mb-1">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? "#16A34A" : "#1B3A6B" }} />
              </div>
              <p className="text-[10px] text-muted-foreground">{fmtINR(executed)} / {fmtINR(planned)}</p>
            </button>
          );
        })}
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {CATEGORIES.map(cat => {
          const cs = categoryStyle[cat];
          const isAct = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 h-9 px-3 rounded-full border font-bold text-xs transition-all flex items-center gap-1"
              style={isAct
                ? { background: "#1B3A6B", color: "#fff", borderColor: "#1B3A6B" }
                : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }}
            >
              {cs.icon} {cat}
            </button>
          );
        })}
      </div>

      {/* BOQ line items */}
      <div className="space-y-2">
        {catItems.map(item => {
          const pct     = boqPct(item);
          const planned = boqPlanned(item);
          const executed = boqExecuted(item);
          const isExpanded = expandedId === item.id;
          const cs = categoryStyle[item.category];

          return (
            <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(isExpanded ? null : item.id)}
                className="w-full text-left p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-bold text-foreground leading-tight flex-1">{item.description}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-black" style={{ color: pct === 100 ? "#16A34A" : pct === 0 ? "#EF4444" : "#1B3A6B" }}>
                      {pct}%
                    </span>
                    {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: pct === 100 ? "#16A34A" : pct === 0 ? "#94A3B8" : "#1B3A6B" }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {item.executedQty.toLocaleString("en-IN")} / {item.plannedQty.toLocaleString("en-IN")} {item.unit}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{fmtINR(executed)} / {fmtINR(planned)}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border bg-muted/10 px-4 py-3 grid grid-cols-2 gap-3">
                  {[
                    { label: "Unit",           value: item.unit },
                    { label: "Rate",           value: fmtINR(item.rate) + " / " + item.unit },
                    { label: "Planned Qty",    value: item.plannedQty.toLocaleString("en-IN") + " " + item.unit },
                    { label: "Executed Qty",   value: item.executedQty.toLocaleString("en-IN") + " " + item.unit },
                    { label: "Planned Value",  value: fmtINR(planned)  },
                    { label: "Executed Value", value: fmtINR(executed) },
                    ...(item.remark ? [{ label: "Remark", value: item.remark }] : []),
                  ].map(f => (
                    <div key={f.label} className="bg-card rounded-xl p-2.5 border border-border">
                      <p className="text-[10px] text-muted-foreground">{f.label}</p>
                      <p className="text-xs font-bold text-foreground mt-0.5">{f.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {catItems.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-sm">No BOQ items for {activeCategory}</p>
          </div>
        )}
      </div>
    </div>
  );
}
