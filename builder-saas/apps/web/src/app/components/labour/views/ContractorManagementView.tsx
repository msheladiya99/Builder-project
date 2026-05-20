import { useState } from "react";
import { Phone, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import {
  mockContractors, mockWorkers,
  fmtINR, contractorColor, workerInitials, tradeColor,
} from "../labourData";

export function ContractorManagementView() {
  const [expandedId, setExpanded] = useState<string | null>("C01");

  const totalBilled  = mockContractors.reduce((s, c) => s + c.totalBilled, 0);
  const totalPaid    = mockContractors.reduce((s, c) => s + c.totalPaid, 0);
  const totalPending = totalBilled - totalPaid;
  const totalWorkers = mockContractors.reduce((s, c) => s + c.workerCount, 0);

  return (
    <div className="p-4 pb-6 space-y-4 max-w-2xl mx-auto">

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Contractors", value: mockContractors.filter(c => c.status === "Active").length, color: "#1B3A6B", sub: "Active on site" },
          { label: "Workers Deployed",  value: totalWorkers, color: "#1B3A6B", sub: "Across all contracts" },
          { label: "Total Billed",      value: fmtINR(totalBilled),  color: "#1B3A6B", sub: "Project to date" },
          { label: "Amount Pending",    value: fmtINR(totalPending), color: "#D97706", sub: "Awaiting payment" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-black mt-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Add contractor */}
      <button className="w-full h-14 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-all font-semibold">
        <UserPlus size={18} /> Add Contractor
      </button>

      {/* Contractor cards */}
      <div className="space-y-3">
        {mockContractors.map(c => {
          const { hex } = contractorColor[c.id] ?? { hex: "#1B3A6B" };
          const isExpanded = expandedId === c.id;
          const pending = c.totalBilled - c.totalPaid;
          const paidPct = c.totalBilled > 0 ? Math.round((c.totalPaid / c.totalBilled) * 100) : 0;
          const workers = mockWorkers.filter(w => w.contractorId === c.id && w.status === "Active");

          return (
            <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden">

              {/* Header row — always visible */}
              <button
                onClick={() => setExpanded(isExpanded ? null : c.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0" style={{ background: hex }}>
                  {c.name[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-black text-foreground leading-tight truncate">{c.name}</p>
                    <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${c.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.speciality} · {c.rateType}</p>

                  {/* Payment progress bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${paidPct}%`, background: paidPct === 100 ? "#16A34A" : hex }} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground shrink-0">{paidPct}% paid</span>
                  </div>
                </div>

                {/* Workers + chevron */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-black text-foreground">{c.workerCount} workers</span>
                  {pending > 0 && <span className="text-[10px] font-bold text-amber-600">{fmtINR(pending)} due</span>}
                  {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-border bg-muted/10 p-4 space-y-4">

                  {/* Contact & registration details */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Phone", value: c.phone },
                      { label: "PAN",   value: c.pan   },
                      ...(c.gstin ? [{ label: "GSTIN", value: c.gstin }] : []),
                      { label: "Rate Type", value: c.rateType },
                      { label: "Join Date", value: new Date(c.joinDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                    ].map(f => (
                      <div key={f.label} className="bg-card rounded-xl p-3 border border-border">
                        <p className="text-[10px] text-muted-foreground">{f.label}</p>
                        <p className="text-xs font-bold text-foreground mt-0.5 break-all">{f.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Payment summary */}
                  <div className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Payment Summary</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Total Billed</span>
                        <span className="text-sm font-black text-foreground">{fmtINR(c.totalBilled)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Total Paid</span>
                        <span className="text-sm font-black text-green-600">{fmtINR(c.totalPaid)}</span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-foreground">Balance Due</span>
                        <span className={`text-sm font-black ${pending > 0 ? "text-amber-600" : "text-green-600"}`}>
                          {pending > 0 ? fmtINR(pending) : "Nil"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Workers list */}
                  {workers.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Deployed Workers ({workers.length})
                      </p>
                      <div className="space-y-2">
                        {workers.map(w => (
                          <div key={w.id} className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0" style={{ background: hex }}>
                              {workerInitials(w.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground truncate">{w.name}</p>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${tradeColor[w.trade]}`}>{w.trade}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-black text-foreground">{fmtINR(w.dailyWage)}</p>
                              <p className="text-[10px] text-muted-foreground">per day</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <a
                      href={`tel:${c.phone}`}
                      className="flex-1 h-12 rounded-2xl border-2 border-[#1B3A6B] text-[#1B3A6B] font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                    >
                      <Phone size={15} /> Call
                    </a>
                    {pending > 0 && (
                      <button className="flex-1 h-12 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all" style={{ background: "#16A34A" }}>
                        Pay {fmtINR(pending)}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
