import { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, ChevronRight, Download, Plus, CheckCircle2, Clock, RotateCcw, X } from "lucide-react";
import { mockJournalEntries, fmtINR, formatDate, FinancialYear } from "../accountingData";
import { useAccountingStore } from "../../../store/store";

interface Props { fy: FinancialYear; }

const STATUS_COLORS: Record<string, string> = {
  Posted: "bg-success/10 text-success border-success/20",
  Draft: "bg-warning/10 text-warning border-warning/20",
  Reversed: "bg-destructive/10 text-destructive border-destructive/20",
};
const STATUS_ICONS: Record<string, typeof CheckCircle2> = {
  Posted: CheckCircle2,
  Draft: Clock,
  Reversed: RotateCcw,
};

export function JournalEntriesView({ fy }: Props) {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["je1"]));
  const [showAddModal, setShowAddModal] = useState(false);

  // New JV form state
  const [narration, setNarration] = useState("");
  const [amount, setAmount] = useState(25000);
  const [debitAcc, setDebitAcc] = useState("");
  const [creditAcc, setCreditAcc] = useState("");

  const { journals: storeJournals, fetchJournals, createJournal, accounts, fetchAccounts } = useAccountingStore();

  useEffect(() => {
    fetchJournals();
    fetchAccounts();
  }, []);

  const data = useMemo(() => {
    const list = storeJournals && storeJournals.length > 0 ? storeJournals.map((j: any) => ({
      id: j.id,
      voucherNo: j.entryNo || `JV-2026-${j.id.substring(0, 4).toUpperCase()}`,
      date: j.date ? j.date.substring(0, 10) : "2026-05-20",
      narration: j.narration || "",
      createdBy: j.createdBy || "Accountant",
      status: j.status || "Posted",
      totalDebit: Number(j.totalDebit || 45000),
      totalCredit: Number(j.totalCredit || 45000),
      fy: j.fy || fy,
      lines: j.lines || [
        { account: "Labour Wage Expense", accountGroup: "Expenses", debit: 45000, credit: 0 },
        { account: "Payables (Vendors)", accountGroup: "Liabilities", debit: 0, credit: 45000 }
      ]
    })) : mockJournalEntries;

    return list.filter((j: any) => j.fy === fy);
  }, [storeJournals, fy]);

  const filtered = useMemo(() => {
    return data.filter((j: any) => {
      if (statusF !== "All" && j.status !== statusF) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!j.narration.toLowerCase().includes(q) && !j.voucherNo.toLowerCase().includes(q) && !j.createdBy.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [data, search, statusF]);

  const toggleExpanded = (id: string) => {
    const s = new Set(expanded);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpanded(s);
  };

  const totalPosted = filtered.filter((j: any) => j.status === "Posted").length;
  const totalAmount = filtered.reduce((s: number, j: any) => s + j.totalDebit, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!debitAcc || !creditAcc || debitAcc === creditAcc) return;

    try {
      const debObj = accounts.find((a: any) => a.code === debitAcc) || { name: "Debit Account", type: "Asset" };
      const credObj = accounts.find((a: any) => a.code === creditAcc) || { name: "Credit Account", type: "Liability" };

      await createJournal({
        entryNo: `JV-2026-${Date.now().toString().slice(-4)}`,
        narration,
        fy,
        totalDebit: Number(amount),
        totalCredit: Number(amount),
        status: "Posted",
        createdBy: "Accountant",
        lines: [
          { account: debObj.name, accountGroup: debObj.type + "s", debit: Number(amount), credit: 0 },
          { account: credObj.name, accountGroup: credObj.type + "s", debit: 0, credit: Number(amount) }
        ]
      });

      setShowAddModal(false);
      setNarration("");
      setDebitAcc("");
      setCreditAcc("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Journal Vouchers", value: filtered.length.toString(), color: "border-l-primary" },
          { label: "Posted Entries", value: totalPosted.toString(), color: "border-l-success" },
          { label: "Total Debit (= Credit)", value: fmtINR(totalAmount, true), color: "border-l-warning" },
          { label: "Draft / Pending", value: filtered.filter((j: any) => j.status === "Draft").length.toString(), color: "border-l-muted-foreground" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[11px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search narration, voucher no, created by…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground" />
        </div>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="px-3 py-2.5 text-xs rounded-xl border border-border bg-card focus:outline-none font-medium text-foreground">
          {["All", "Posted", "Draft", "Reversed"].map(o => <option key={o}>{o}</option>)}
        </select>
        <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted text-foreground">
          <Download size={13} /> Export
        </button>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90">
          <Plus size={13} /> New JV
        </button>
      </div>

      {/* Journal entry cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground text-sm">No journal entries found</div>
        )}
        {filtered.map((je: any) => {
          const isOpen = expanded.has(je.id);
          const StatusIcon = STATUS_ICONS[je.status] ?? CheckCircle2;
          const balanced = Math.abs(je.totalDebit - je.totalCredit) < 1;
          return (
            <div key={je.id} className="bg-card border border-border rounded-2xl overflow-hidden transition-all">
              {/* Header row */}
              <button
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors text-left"
                onClick={() => toggleExpanded(je.id)}
              >
                <div className="text-muted-foreground">
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                  <div>
                    <p className="text-xs font-mono font-bold text-primary">{je.voucherNo}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(je.date)}</p>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-xs font-semibold text-foreground line-clamp-1">{je.narration}</p>
                    <p className="text-[10px] text-muted-foreground">{je.createdBy} · {je.lines?.length || 0} lines</p>
                  </div>
                  <div className="flex items-center gap-2 justify-end sm:justify-start">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[je.status] || STATUS_COLORS.Posted}`}>
                      <StatusIcon size={9} /> {je.status}
                    </span>
                    <span className="text-xs font-bold text-foreground">{fmtINR(je.totalDebit, true)}</span>
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && je.lines && (
                <div className="border-t border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-6 py-2.5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Account</th>
                          <th className="px-4 py-2.5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Group</th>
                          <th className="px-4 py-2.5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Debit (₹)</th>
                          <th className="px-4 py-2.5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Credit (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {je.lines.map((line: any, idx: number) => (
                          <tr key={idx} className={`${line.debit > 0 ? "" : "pl-4"} hover:bg-muted/20`}>
                            <td className={`py-2.5 text-xs font-medium text-foreground ${line.debit > 0 ? "px-6" : "px-10"}`}>
                              {line.account}
                            </td>
                            <td className="px-4 py-2.5 text-[11px] text-muted-foreground">{line.accountGroup}</td>
                            <td className="px-4 py-2.5 text-right">
                              {line.debit > 0 ? <span className="text-xs font-semibold text-success">{fmtINR(line.debit)}</span> : <span className="text-xs text-muted-foreground">—</span>}
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              {line.credit > 0 ? <span className="text-xs font-semibold text-destructive">{fmtINR(line.credit)}</span> : <span className="text-xs text-muted-foreground">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t-2 border-border bg-muted/30">
                        <tr>
                          <td colSpan={2} className="px-6 py-2.5 text-xs font-bold text-foreground">
                            Total
                            {balanced
                              ? <span className="ml-2 text-[10px] font-bold text-success">✓ Balanced</span>
                              : <span className="ml-2 text-[10px] font-bold text-destructive">⚠ Imbalanced!</span>}
                          </td>
                          <td className="px-4 py-2.5 text-right text-xs font-bold text-success">{fmtINR(je.totalDebit)}</td>
                          <td className="px-4 py-2.5 text-right text-xs font-bold text-destructive">{fmtINR(je.totalCredit)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="px-4 py-3 border-t border-border bg-muted/10 flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span>Created by: <span className="font-semibold text-foreground">{je.createdBy}</span></span>
                    <span>Voucher: <span className="font-mono font-semibold text-primary">{je.voucherNo}</span></span>
                    <span>Date: <span className="font-semibold text-foreground">{formatDate(je.date)}</span></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        {filtered.length} journal vouchers · FY {fy} · All amounts in Indian Rupees (INR)
      </p>

      {/* Add Journal Entry Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm font-black text-foreground">New Journal Voucher (JV)</p>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Narration / Description</label>
                <input required type="text" value={narration} onChange={e => setNarration(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" placeholder="e.g. provision for office rent" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Voucher Amount (₹)</label>
                <input required type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Debit Account (Dr.)</label>
                  <select required value={debitAcc} onChange={e => setDebitAcc(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                    <option value="">Select Account</option>
                    {accounts.map((a: any) => <option key={a.id} value={a.code}>{a.code} - {a.name} ({a.type})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Credit Account (Cr.)</label>
                  <select required value={creditAcc} onChange={e => setCreditAcc(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                    <option value="">Select Account</option>
                    {accounts.map((a: any) => <option key={a.id} value={a.code}>{a.code} - {a.name} ({a.type})</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-500 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-orange-600 transition-colors active:scale-95 transform">
                Post Journal Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
