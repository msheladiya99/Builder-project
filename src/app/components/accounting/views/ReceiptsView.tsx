import { useState, useMemo } from "react";
import { Search, Download, Filter, X, ChevronUp, ChevronDown, CheckSquare, Square, IndianRupee, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { mockReceipts, fmtINR, formatDate, FinancialYear, ReceiptDoc } from "../accountingData";

interface Props { fy: FinancialYear; }

const STATUS_COLORS: Record<string, string> = {
  Cleared: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Bounced: "bg-destructive/10 text-destructive border-destructive/20",
};
const CAT_COLORS: Record<string, string> = {
  Booking: "bg-primary/10 text-primary border-primary/20",
  Demand: "bg-info/10 text-info border-info/20",
  Maintenance: "bg-secondary/10 text-secondary border-secondary/20",
  Registration: "bg-success/10 text-success border-success/20",
  Other: "bg-muted text-muted-foreground border-border",
};

function Badge({ label, colorCls }: { label: string; colorCls: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${colorCls}`}>
      {label}
    </span>
  );
}

type SortKey = "date" | "amount" | "receiptNo";

export function ReceiptsView({ fy }: Props) {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [categoryF, setCategoryF] = useState("All");
  const [modeF, setModeF] = useState("All");
  const [wingF, setWingF] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const data = useMemo(() => {
    return mockReceipts.filter(r => r.fy === fy);
  }, [fy]);

  const filtered = useMemo(() => {
    let rows = data.filter(r => {
      if (statusF !== "All" && r.status !== statusF) return false;
      if (categoryF !== "All" && r.category !== categoryF) return false;
      if (modeF !== "All" && r.mode !== modeF) return false;
      if (wingF !== "All" && r.wing !== wingF) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.party.toLowerCase().includes(q) && !r.receiptNo.toLowerCase().includes(q) && !r.flatNo.toLowerCase().includes(q) && !r.reference.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    rows = [...rows].sort((a, b) => {
      let va: string | number = sortKey === "date" ? a.date : sortKey === "amount" ? a.amount : a.receiptNo;
      let vb: string | number = sortKey === "date" ? b.date : sortKey === "amount" ? b.amount : b.receiptNo;
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [data, search, statusF, categoryF, modeF, wingF, sortKey, sortDir]);

  const totalReceived = filtered.reduce((s, r) => s + r.netAmount, 0);
  const totalTDS = filtered.reduce((s, r) => s + r.tds, 0);
  const cleared = filtered.filter(r => r.status === "Cleared").length;
  const pending = filtered.filter(r => r.status === "Pending").length;
  const bounced = filtered.filter(r => r.status === "Bounced").length;

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  };
  const toggleOne = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : <ChevronDown size={11} className="opacity-30" />;

  const activeFilters = [statusF !== "All" && `Status: ${statusF}`, categoryF !== "All" && `Category: ${categoryF}`, modeF !== "All" && `Mode: ${modeF}`, wingF !== "All" && `Wing: ${wingF}`].filter(Boolean) as string[];

  const exportCSV = () => {
    const rows = filtered.map(r => [r.receiptNo, r.date, r.party, r.flatNo, r.category, r.mode, r.amount, r.tds, r.netAmount, r.status, r.reference].join(","));
    const csv = ["Receipt No,Date,Party,Flat,Category,Mode,Amount,TDS,Net Amount,Status,Reference", ...rows].join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv); a.download = `receipts-${fy}.csv`; a.click();
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Received", value: fmtINR(totalReceived, true), sub: `${filtered.length} receipts`, icon: IndianRupee, color: "bg-primary" },
          { label: "TDS Deducted", value: fmtINR(totalTDS, true), sub: "u/s 194C / 194J", icon: AlertCircle, color: "bg-warning" },
          { label: "Cleared", value: cleared.toString(), sub: "payments settled", icon: CheckCircle2, color: "bg-success" },
          { label: "Pending", value: pending.toString(), sub: "awaiting clearance", icon: Clock, color: "bg-info" },
          { label: "Bounced", value: bounced.toString(), sub: "cheque returns", icon: X, color: "bg-destructive" },
        ].map(k => (
          <div key={k.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${k.color} flex items-center justify-center shrink-0`}>
              <k.icon size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-muted-foreground leading-tight">{k.label}</p>
              <p className="text-base font-bold text-foreground">{k.value}</p>
              <p className="text-[10px] text-muted-foreground">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by party, receipt no, flat, reference…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
          />
        </div>
        <button onClick={() => setShowFilters(f => !f)} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${showFilters ? "bg-primary text-white border-primary" : "border-border text-foreground hover:bg-muted"}`}>
          <Filter size={13} /> Filters {activeFilters.length > 0 && <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{activeFilters.length}</span>}
        </button>
        <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted transition-all">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-card border border-border rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Status", value: statusF, set: setStatusF, opts: ["All", "Cleared", "Pending", "Bounced"] },
            { label: "Category", value: categoryF, set: setCategoryF, opts: ["All", "Booking", "Demand", "Maintenance", "Registration", "Other"] },
            { label: "Mode", value: modeF, set: setModeF, opts: ["All", "NEFT", "RTGS", "UPI", "Cash", "Cheque", "DD"] },
            { label: "Wing", value: wingF, set: setWingF, opts: ["All", "A", "B", "C", "D"] },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">{f.label}</label>
              <select value={f.value} onChange={e => f.set(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-semibold">Active filters:</span>
          {activeFilters.map(f => (
            <span key={f} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-semibold">
              {f}
              <button onClick={() => {
                if (f.startsWith("Status")) setStatusF("All");
                if (f.startsWith("Category")) setCategoryF("All");
                if (f.startsWith("Mode")) setModeF("All");
                if (f.startsWith("Wing")) setWingF("All");
              }}><X size={10} /></button>
            </span>
          ))}
          <button onClick={() => { setStatusF("All"); setCategoryF("All"); setModeF("All"); setWingF("All"); }} className="text-[10px] text-destructive font-semibold hover:underline">Clear all</button>
        </div>
      )}

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
          <span className="text-xs font-semibold text-primary">{selected.size} selected</span>
          <button onClick={exportCSV} className="text-xs font-semibold text-primary hover:underline">Export Selected</button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Deselect all</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left w-10">
                  <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground">
                    {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort("receiptNo")} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                    Receipt No <SortIcon k="receiptNo" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort("date")} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                    Date <SortIcon k="date" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Party</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Flat</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Mode</th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => toggleSort("amount")} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground ml-auto">
                    Amount <SortIcon k="amount" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">TDS</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Net</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="px-4 py-12 text-center text-muted-foreground text-sm">No receipts found</td></tr>
              )}
              {filtered.map(r => (
                <tr key={r.id} className={`hover:bg-muted/30 transition-colors ${selected.has(r.id) ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleOne(r.id)} className="text-muted-foreground hover:text-foreground">
                      {selected.has(r.id) ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-mono font-semibold text-foreground">{r.receiptNo}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{r.reference}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">{formatDate(r.date)}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-foreground whitespace-nowrap">{r.party}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-bold text-primary">{r.flatNo}</span>
                  </td>
                  <td className="px-4 py-3"><Badge label={r.category} colorCls={CAT_COLORS[r.category] ?? CAT_COLORS.Other} /></td>
                  <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">{r.mode}</td>
                  <td className="px-4 py-3 text-right text-xs font-semibold text-foreground whitespace-nowrap">{fmtINR(r.amount)}</td>
                  <td className="px-4 py-3 text-right text-xs text-destructive whitespace-nowrap">
                    {r.tds > 0 ? `-${fmtINR(r.tds)}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-bold text-foreground whitespace-nowrap">{fmtINR(r.netAmount)}</td>
                  <td className="px-4 py-3"><Badge label={r.status} colorCls={STATUS_COLORS[r.status]} /></td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-border bg-muted/30">
              <tr>
                <td colSpan={7} className="px-4 py-3 text-xs font-bold text-foreground">
                  Total ({filtered.length} receipts)
                </td>
                <td className="px-4 py-3 text-right text-xs font-bold text-foreground">{fmtINR(filtered.reduce((s, r) => s + r.amount, 0))}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-destructive">-{fmtINR(totalTDS)}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-success">{fmtINR(totalReceived)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">Showing {filtered.length} of {data.length} receipts for FY {fy}</p>
    </div>
  );
}
