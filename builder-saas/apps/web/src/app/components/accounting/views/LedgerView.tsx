import { useState, useEffect } from "react";
import { ChevronDown, Download, Search } from "lucide-react";
import { mockLedgerAccounts, fmtINR, formatDate, FinancialYear } from "../accountingData";
import { useAccountingStore } from "../../../store/store";

interface Props { fy: FinancialYear; }

const VOUCHER_COLORS: Record<string, string> = {
  Receipt: "bg-success/10 text-success border-success/20",
  Payment: "bg-destructive/10 text-destructive border-destructive/20",
  Journal: "bg-primary/10 text-primary border-primary/20",
  Sales: "bg-info/10 text-info border-info/20",
  Purchase: "bg-warning/10 text-warning border-warning/20",
};

export function LedgerView({ fy }: Props) {
  const [search, setSearch] = useState("");
  const [voucherF, setVoucherF] = useState("All");

  const { accounts: storeAccounts, fetchAccounts } = useAccountingStore();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const ledgerAccounts = storeAccounts && storeAccounts.length > 0 ? storeAccounts.map((a: any) => ({
    id: a.id,
    code: a.code,
    name: a.name,
    group: a.type,
    openingBalance: Number(a.balance || 0),
    openingType: a.type === "Asset" || a.type === "Expense" ? "Dr" : "Cr",
    entries: [
      { id: `e-${a.id}`, date: "2026-05-18", narration: "Current Ledger Balance Sync", voucherNo: `BAL-${a.code}`, voucherType: "Journal", debit: a.type === "Asset" || a.type === "Expense" ? Number(a.balance) : 0, credit: a.type === "Asset" || a.type === "Expense" ? 0 : Number(a.balance), balance: Number(a.balance) }
    ]
  })) : mockLedgerAccounts;

  const [accountId, setAccountId] = useState(ledgerAccounts[0]?.id || "");

  // Update selection if empty or list changes
  useEffect(() => {
    if (ledgerAccounts.length > 0 && !accountId) {
      setAccountId(ledgerAccounts[0].id);
    }
  }, [ledgerAccounts]);

  const account = ledgerAccounts.find((a: any) => a.id === accountId) ?? ledgerAccounts[0] ?? mockLedgerAccounts[0];

  const filtered = account.entries.filter((e: any) => {
    if (voucherF !== "All" && e.voucherType !== voucherF) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.narration.toLowerCase().includes(q) && !e.voucherNo.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalDebit = filtered.reduce((s: number, e: any) => s + e.debit, 0);
  const totalCredit = filtered.reduce((s: number, e: any) => s + e.credit, 0);
  const closingBalance = account.openingBalance + (account.openingType === "Dr" ? totalDebit - totalCredit : totalCredit - totalDebit);
  const closingType = closingBalance >= 0 ? account.openingType : account.openingType === "Dr" ? "Cr" : "Dr";

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Account selector */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 text-foreground">Select Account</label>
            <div className="relative">
              <select
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm font-semibold rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none pr-8 text-foreground"
              >
                {ledgerAccounts.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.code} — {a.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-3 text-right shrink-0">
            <div className="bg-muted/50 rounded-xl px-4 py-2.5">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Account Group</p>
              <p className="text-sm font-bold text-foreground">{account.group}</p>
            </div>
            <div className="bg-muted/50 rounded-xl px-4 py-2.5">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Account Code</p>
              <p className="text-sm font-bold text-primary font-mono">{account.code}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Opening balance banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Opening Balance</p>
          <p className="text-lg font-black text-foreground">{fmtINR(account.openingBalance, true)}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${account.openingType === "Dr" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
            {account.openingType} — As on 01 Apr {fy.split("-")[0]}
          </span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Debits</p>
          <p className="text-lg font-black text-success">{fmtINR(totalDebit, true)}</p>
          <p className="text-[10px] text-muted-foreground">{filtered.filter((e: any) => e.debit > 0).length} transactions</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Credits</p>
          <p className="text-lg font-black text-destructive">{fmtINR(totalCredit, true)}</p>
          <p className="text-[10px] text-muted-foreground">{filtered.filter((e: any) => e.credit > 0).length} transactions</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search narration or voucher no…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground" />
        </div>
        <select value={voucherF} onChange={e => setVoucherF(e.target.value)} className="px-3 py-2.5 text-xs rounded-xl border border-border bg-card focus:outline-none text-foreground font-semibold">
          {["All", "Receipt", "Payment", "Journal", "Sales", "Purchase"].map(o => <option key={o}>{o}</option>)}
        </select>
        <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted text-foreground">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Ledger table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Date", "Narration", "Voucher No", "Type", "Debit (₹)", "Credit (₹)", "Balance (₹)"].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider ${i >= 4 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Opening row */}
              <tr className="bg-muted/20">
                <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">01 Apr {fy.split("-")[0]}</td>
                <td className="px-4 py-2.5 text-xs font-semibold text-foreground" colSpan={2}>Opening Balance — FY {fy}</td>
                <td className="px-4 py-2.5"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">Opening</span></td>
                <td className="px-4 py-2.5 text-right text-xs">{account.openingType === "Dr" ? fmtINR(account.openingBalance) : "—"}</td>
                <td className="px-4 py-2.5 text-right text-xs">{account.openingType === "Cr" ? fmtINR(account.openingBalance) : "—"}</td>
                <td className="px-4 py-2.5 text-right text-xs font-bold text-foreground">{fmtINR(account.openingBalance)} {account.openingType}</td>
              </tr>

              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground text-sm">No entries found</td></tr>
              )}

              {filtered.map((e: any) => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">{formatDate(e.date)}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-foreground">{e.narration}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-mono font-semibold text-primary">{e.voucherNo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${VOUCHER_COLORS[e.voucherType] ?? "bg-muted text-muted-foreground border-border"}`}>
                      {e.voucherType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {e.debit > 0 ? <span className="text-xs font-semibold text-success">{fmtINR(e.debit)}</span> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {e.credit > 0 ? <span className="text-xs font-semibold text-destructive">{fmtINR(e.credit)}</span> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-bold text-foreground">{fmtINR(Math.abs(e.balance))}</span>
                    <span className={`ml-1 text-[10px] font-bold ${e.balance >= 0 ? "text-success" : "text-destructive"}`}>
                      {e.balance >= 0 ? account.openingType : account.openingType === "Dr" ? "Cr" : "Dr"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-border bg-muted/40">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-xs font-bold text-foreground">Closing Balance — FY {fy}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-success">{fmtINR(totalDebit)}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-destructive">{fmtINR(totalCredit)}</td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-black text-foreground">{fmtINR(Math.abs(closingBalance), true)}</span>
                  <span className={`ml-1 text-xs font-bold ${closingType === "Dr" ? "text-success" : "text-destructive"}`}>{closingType}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        Account: {account.name} · Group: {account.group} · FY {fy}
      </p>
    </div>
  );
}
