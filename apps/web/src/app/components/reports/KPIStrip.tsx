import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KPICard } from "./reportsData";

interface Props { kpis: KPICard[] }

export function KPIStrip({ kpis }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {kpis.map(k => (
        <div
          key={k.label}
          className="bg-card rounded-2xl p-4 border border-border relative overflow-hidden"
        >
          {/* Accent left bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: k.color }} />

          <p className="text-[10px] text-muted-foreground uppercase tracking-wider pl-1 mb-1">{k.label}</p>
          <p className="text-xl font-black pl-1" style={{ color: k.color }}>{k.value}</p>

          {/* Change badge */}
          <div className="flex items-center gap-1 mt-1 pl-1">
            {k.change > 0
              ? <TrendingUp size={11} className="text-green-600" />
              : k.change < 0
              ? <TrendingDown size={11} className="text-red-500" />
              : <Minus size={11} className="text-muted-foreground" />
            }
            <span className={`text-[10px] font-bold ${k.change > 0 ? "text-green-600" : k.change < 0 ? "text-red-500" : "text-muted-foreground"}`}>
              {k.change > 0 ? "+" : ""}{k.change}{typeof k.change === "number" && k.label.includes("Margin") ? "pp" : "%"} vs last period
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
