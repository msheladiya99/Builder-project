import { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, IndianRupee } from "lucide-react";
import {
  mockWorkers, mockContractors, mockAttendance, calcWage,
  fmtINR, contractorColor, workerInitials, tradeColor,
  PREV_WEEK, CURR_WEEK, AttendanceStatus,
} from "../labourData";

type Week = "prev" | "curr";

const STATUS_BADGE: Record<AttendanceStatus, { label: string; cls: string }> = {
  P:   { label: "P", cls: "bg-green-500 text-white" },
  A:   { label: "A", cls: "bg-red-500 text-white"   },
  H:   { label: "½", cls: "bg-amber-400 text-white"  },
  S:   { label: "S", cls: "bg-slate-200 dark:bg-slate-700 text-muted-foreground" },
  "—": { label: "·", cls: "bg-muted/40 text-muted-foreground" },
};

export function WageCalculationsView() {
  const [week, setWeek]         = useState<Week>("prev");
  const [expandedId, setExpanded] = useState<string | null>(null);
  const [cFilter, setCFilter]   = useState("All");

  const dates = week === "prev" ? PREV_WEEK : CURR_WEEK;
  const weekLabel = week === "prev" ? "11–17 May 2026" : "18–19 May 2026 (running)";

  const workers = mockWorkers.filter(w =>
    w.status === "Active" && (cFilter === "All" || w.contractorId === cFilter)
  );

  // Grand totals
  let grandGross = 0, grandAdv = 0, grandNet = 0;
  workers.forEach(w => {
    const dayMap = Object.fromEntries(dates.map(d => [d.date, mockAttendance[w.id]?.[d.date] ?? "—"]));
    const wg = calcWage(w, dayMap);
    grandGross += wg.gross;
    grandAdv   += wg.advance;
    grandNet   += wg.net;
  });

  return (
    <div className="p-4 pb-6 space-y-4 max-w-2xl mx-auto">

      {/* Week toggle */}
      <div className="flex bg-muted rounded-2xl p-1 gap-1">
        {([["prev", "11–17 May (Last Week)"], ["curr", "18–19 May (This Week)"]] as [Week, string][]).map(([w, lbl]) => (
          <button
            key={w}
            onClick={() => { setWeek(w); setExpanded(null); }}
            className="flex-1 py-3 rounded-xl font-black text-sm transition-all"
            style={week === w ? { background: "#1B3A6B", color: "#fff" } : { color: "var(--muted-foreground)" }}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Grand summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Gross Wages",  value: fmtINR(grandGross), color: "#1B3A6B" },
          { label: "Advance Deducted", value: fmtINR(grandAdv), color: "#D97706" },
          { label: "Net Payable",  value: fmtINR(grandNet),  color: "#16A34A" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Contractor filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {[{ id: "All", name: "All" }, ...mockContractors.map(c => ({ id: c.id, name: c.name.split(" ")[0] }))].map(c => {
          const isAct = cFilter === c.id;
          const hex = c.id === "All" ? "#1B3A6B" : (contractorColor[c.id]?.hex ?? "#1B3A6B");
          return (
            <button
              key={c.id}
              onClick={() => setCFilter(c.id)}
              className="shrink-0 h-10 px-4 rounded-full border font-bold text-sm transition-all"
              style={isAct
                ? { background: hex, color: "#fff", borderColor: hex }
                : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Worker wage cards */}
      <div className="space-y-3">
        {workers.map(w => {
          const dayMap = Object.fromEntries(dates.map(d => [d.date, mockAttendance[w.id]?.[d.date] ?? "—"]));
          const wg = calcWage(w, dayMap);
          const isExpanded = expandedId === w.id;
          const { hex } = contractorColor[w.contractorId] ?? { hex: "#1B3A6B" };

          return (
            <div key={w.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(isExpanded ? null : w.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shrink-0 text-sm" style={{ background: hex }}>
                  {workerInitials(w.name)}
                </div>

                {/* Name + trade */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-foreground leading-tight">{w.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tradeColor[w.trade]}`}>{w.trade}</span>
                </div>

                {/* Net wage */}
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-foreground">{fmtINR(wg.net)}</p>
                  <p className="text-[10px] text-muted-foreground">net pay</p>
                </div>

                {isExpanded ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-border bg-muted/10 p-4 space-y-4">

                  {/* Day-by-day attendance badges */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Attendance — {weekLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dates.map(d => {
                        const s = mockAttendance[w.id]?.[d.date] ?? "—";
                        const sb = STATUS_BADGE[s as AttendanceStatus];
                        return (
                          <div key={d.date} className="flex flex-col items-center gap-1">
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${sb.cls}`}>
                              {sb.label}
                            </span>
                            <span className="text-[8px] text-muted-foreground">{d.label.split(" ")[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Wage breakdown */}
                  <div className="bg-card rounded-xl p-3 space-y-2 border border-border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Wage Breakdown</p>
                    <WageRow label={`${wg.present} full days × ${fmtINR(w.dailyWage)}`}
                              value={fmtINR(wg.present * w.dailyWage)} />
                    {wg.half > 0 && (
                      <WageRow label={`${wg.half} half days × ${fmtINR(w.dailyWage * 0.5)}`}
                                value={fmtINR(Math.round(wg.half * w.dailyWage * 0.5))} />
                    )}
                    <div className="h-px bg-border" />
                    <WageRow label="Gross Wages" value={fmtINR(wg.gross)} bold />
                    {wg.advance > 0 && (
                      <WageRow label="Advance Deduction" value={`− ${fmtINR(wg.advance)}`} red />
                    )}
                    <div className="h-px bg-border" />
                    <WageRow label="Net Payable" value={fmtINR(wg.net)} bold green />
                  </div>

                  {/* Outstanding advance warning */}
                  {w.advanceBalance > wg.advance && (
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2">
                      <AlertCircle size={14} className="text-amber-600 shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Outstanding advance balance: {fmtINR(w.advanceBalance - wg.advance)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grand total footer */}
      <div className="rounded-2xl p-4 text-white" style={{ background: "#0F1C2E" }}>
        <div className="flex items-center gap-2 mb-3">
          <IndianRupee size={16} className="text-[#C9922A]" />
          <p className="font-black text-white">Week Total — {weekLabel}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-black text-white">{fmtINR(grandGross)}</p>
            <p className="text-[10px] text-white/50">Gross</p>
          </div>
          <div>
            <p className="text-lg font-black text-amber-400">{fmtINR(grandAdv)}</p>
            <p className="text-[10px] text-white/50">Advance</p>
          </div>
          <div>
            <p className="text-lg font-black text-green-400">{fmtINR(grandNet)}</p>
            <p className="text-[10px] text-white/50">Net Pay</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WageRow({ label, value, bold, red, green }: { label: string; value: string; bold?: boolean; red?: boolean; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-xs ${bold ? "font-black text-foreground" : "text-muted-foreground"}`}>{label}</span>
      <span className={`text-sm font-black ${red ? "text-red-600" : green ? "text-green-600" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
