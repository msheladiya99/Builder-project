import { useState } from "react";
import { Download, CheckCircle2, FileSpreadsheet, IndianRupee } from "lucide-react";
import {
  mockWorkers, mockContractors, mockAttendance, calcWage,
  fmtINR, contractorColor, workerInitials,
  PREV_WEEK, CURR_WEEK, AttendanceStatus,
} from "../labourData";

type Week = "prev" | "curr";

const STATUS_BADGE: Record<AttendanceStatus, { s: string; cls: string }> = {
  P:   { s: "P", cls: "bg-green-500 text-white" },
  A:   { s: "A", cls: "bg-red-500 text-white"   },
  H:   { s: "½", cls: "bg-amber-400 text-white"  },
  S:   { s: "S", cls: "bg-slate-200 dark:bg-slate-700 text-muted-foreground" },
  "—": { s: "·", cls: "bg-muted/30 text-muted-foreground" },
};

export function PayrollSheetsView() {
  const [week, setWeek]   = useState<Week>("prev");
  const [paid, setPaid]   = useState<Set<string>>(new Set());
  const [cFilter, setCFilter] = useState("All");

  const dates     = week === "prev" ? PREV_WEEK : CURR_WEEK;
  const weekLabel = week === "prev" ? "11–17 May 2026" : "18–19 May 2026";

  const contractors = cFilter === "All"
    ? mockContractors.filter(c => c.status === "Active")
    : mockContractors.filter(c => c.id === cFilter && c.status === "Active");

  // Grand totals
  const allWorkers = mockWorkers.filter(w => w.status === "Active" && (cFilter === "All" || w.contractorId === cFilter));
  let grandGross = 0, grandAdv = 0, grandNet = 0, totalDaysWorked = 0;
  allWorkers.forEach(w => {
    const dm = Object.fromEntries(dates.map(d => [d.date, mockAttendance[w.id]?.[d.date] ?? "—"]));
    const wg = calcWage(w, dm);
    grandGross += wg.gross;
    grandAdv   += wg.advance;
    grandNet   += wg.net;
    totalDaysWorked += wg.present + wg.half * 0.5;
  });

  function togglePaid(workerId: string) {
    setPaid(prev => {
      const next = new Set(prev);
      next.has(workerId) ? next.delete(workerId) : next.add(workerId);
      return next;
    });
  }

  return (
    <div className="p-4 pb-6 space-y-4 max-w-2xl mx-auto">

      {/* Week toggle */}
      <div className="flex bg-muted rounded-2xl p-1 gap-1">
        {([["prev", "11–17 May (Last Week)"], ["curr", "18–19 May (This Week)"]] as [Week, string][]).map(([w, lbl]) => (
          <button
            key={w}
            onClick={() => setWeek(w)}
            className="flex-1 py-3 rounded-xl font-black text-sm transition-all"
            style={week === w ? { background: "#1B3A6B", color: "#fff" } : { color: "var(--muted-foreground)" }}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Grand summary */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Gross Payroll",   value: fmtINR(grandGross),  color: "#1B3A6B" },
          { label: "Net Payable",     value: fmtINR(grandNet),    color: "#16A34A" },
          { label: "Workers",         value: allWorkers.length,   color: "#1B3A6B" },
          { label: "Days Worked",     value: totalDaysWorked,     color: "#C9922A" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-black mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Contractor filter + export */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-none pb-1">
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
        <button className="shrink-0 w-10 h-10 rounded-2xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[#1B3A6B] transition-all">
          <Download size={16} />
        </button>
      </div>

      {/* Payroll grouped by contractor */}
      {contractors.map(c => {
        const { hex } = contractorColor[c.id] ?? { hex: "#1B3A6B" };
        const workers = mockWorkers.filter(w => w.contractorId === c.id && w.status === "Active");

        let ctotalGross = 0, ctotalNet = 0;
        workers.forEach(w => {
          const dm = Object.fromEntries(dates.map(d => [d.date, mockAttendance[w.id]?.[d.date] ?? "—"]));
          const wg = calcWage(w, dm);
          ctotalGross += wg.gross;
          ctotalNet   += wg.net;
        });

        return (
          <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden">

            {/* Contractor header */}
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: hex }}>
              <div>
                <p className="text-white font-black text-base leading-tight">{c.name}</p>
                <p className="text-white/60 text-xs">{workers.length} workers · {c.speciality}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-black">{fmtINR(ctotalNet)}</p>
                <p className="text-white/60 text-[10px]">net payable</p>
              </div>
            </div>

            {/* Worker rows */}
            <div className="divide-y divide-border">
              {workers.map(w => {
                const dm = Object.fromEntries(dates.map(d => [d.date, mockAttendance[w.id]?.[d.date] ?? "—"]));
                const wg = calcWage(w, dm);
                const isPaid = paid.has(w.id);

                return (
                  <div key={w.id} className="p-4">
                    {/* Worker name row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0" style={{ background: hex }}>
                        {workerInitials(w.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-foreground leading-tight">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.code} · {fmtINR(w.dailyWage)}/day</p>
                      </div>
                      {/* Pay toggle */}
                      <button
                        onClick={() => togglePaid(w.id)}
                        className="h-10 px-4 rounded-xl font-black text-sm flex items-center gap-1.5 shrink-0 active:scale-95 transition-all border-2"
                        style={isPaid
                          ? { background: "#DCFCE7", color: "#16A34A", borderColor: "#86EFAC" }
                          : { background: "#1B3A6B", color: "#fff", borderColor: "#1B3A6B" }}
                      >
                        {isPaid ? <><CheckCircle2 size={14} /> Paid</> : `Pay ${fmtINR(wg.net)}`}
                      </button>
                    </div>

                    {/* Day badges — scrollable row */}
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none mb-2">
                      {dates.map(d => {
                        const s = (mockAttendance[w.id]?.[d.date] ?? "—") as AttendanceStatus;
                        const sb = STATUS_BADGE[s];
                        return (
                          <div key={d.date} className="flex flex-col items-center gap-0.5 shrink-0">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${sb.cls}`}>
                              {sb.s}
                            </span>
                            <span className="text-[8px] text-muted-foreground leading-none">
                              {d.label.replace(" ", "\n")}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Wage line */}
                    <div className="flex items-center justify-between bg-muted/30 rounded-xl px-3 py-2">
                      <span className="text-xs text-muted-foreground">
                        {wg.present}P{wg.half > 0 ? ` + ${wg.half}½` : ""} = {fmtINR(wg.gross)}
                        {wg.advance > 0 && <span className="text-amber-600"> − {fmtINR(wg.advance)} adv</span>}
                      </span>
                      <span className="text-sm font-black text-foreground">{fmtINR(wg.net)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contractor subtotal */}
            <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/10">
              <span className="text-sm font-black text-foreground">{c.name.split(" ")[0]} Subtotal</span>
              <div className="text-right">
                <p className="text-base font-black text-foreground">{fmtINR(ctotalNet)}</p>
                <p className="text-[10px] text-muted-foreground">Gross: {fmtINR(ctotalGross)}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Grand total */}
      <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg,#0F1C2E 0%,#1B3A6B 100%)" }}>
        <div className="flex items-center gap-2 mb-4">
          <FileSpreadsheet size={18} className="text-[#C9922A]" />
          <p className="font-black text-white">Weekly Payroll — {weekLabel}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-black text-white">{fmtINR(grandGross)}</p>
            <p className="text-[10px] text-white/50 mt-0.5">Gross Wages</p>
          </div>
          <div>
            <p className="text-xl font-black text-amber-400">{fmtINR(grandAdv)}</p>
            <p className="text-[10px] text-white/50 mt-0.5">Advance Deducted</p>
          </div>
          <div>
            <p className="text-xl font-black text-green-400">{fmtINR(grandNet)}</p>
            <p className="text-[10px] text-white/50 mt-0.5">Net Payable</p>
          </div>
        </div>
        <button className="mt-4 w-full h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all border border-white/10">
          <Download size={16} /> Export PDF / Excel
        </button>
      </div>
    </div>
  );
}
