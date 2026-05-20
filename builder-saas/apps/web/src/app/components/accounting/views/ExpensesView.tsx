import { useState, useMemo, useEffect } from "react";
import { Search, Download, Filter, X, ChevronUp, ChevronDown, CheckSquare, Square, Plus } from "lucide-react";
import { mockExpenses, fmtINR, formatDate, FinancialYear, ExpenseDoc } from "../accountingData";
import { useAccountingStore } from "../../../store/store";

interface Props { fy: FinancialYear; }

const STATUS_COLORS: Record<string, string> = {
  Paid: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Approved: "bg-info/10 text-info border-info/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};
const CAT_COLORS: Record<string, string> = {
  Construction: "bg-primary/10 text-primary",
  Materials: "bg-warning/10 text-warning",
  Marketing: "bg-secondary/10 text-secondary",
  Professional: "bg-info/10 text-info",
  Admin: "bg-muted text-muted-foreground",
  Finance: "bg-destructive/10 text-destructive",
};

type SortKey = "date" | "amount" | "vendor";

export function ExpensesView({ fy }: Props) {
  const [search, setSearch] = useState("");
  const [categoryF, setCategoryF] = useState("All");
  const [statusF, setStatusF] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

  // New expense form state
  const [newExp, setNewExp] = useState({
    category: "Materials",
    vendor: "",
    vendorGSTIN: "",
    amount: 15000,
    gstRate: 18,
    tdsRate: 1,
    description: "",
    mode: "Bank Transfer"
  });

  const { expenses: storeExpenses, fetchExpenses, createExpense } = useAccountingStore();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const data = useMemo(() => {
    const list = storeExpenses && storeExpenses.length > 0 ? storeExpenses.map((e: any) => ({
      id: e.id,
      expenseNo: e.expenseNo || `EXP-${e.id.substring(0, 4).toUpperCase()}`,
      billNo: e.billNo || "BILL/26/892",
      date: e.date ? e.date.substring(0, 10) : "2026-05-20",
      vendor: e.vendor || "N/A",
      vendorGSTIN: e.vendorGSTIN || "N/A",
      description: e.description || "",
      category: e.category || "Materials",
      amount: Number(e.amount || 0),
      gst: Number(e.gst || 0),
      gstRate: Number(e.gstRate || 18),
      tds: Number(e.tds || 0),
      tdsRate: Number(e.tdsRate || 1),
      netPayable: Number(e.netPayable || e.amount),
      mode: e.mode || "Bank Transfer",
      status: e.status || "Approved",
      fy: e.fy || fy
    })) : mockExpenses;

    return list.filter((e: any) => e.fy === fy);
  }, [storeExpenses, fy]);

  const filtered = useMemo(() => {
    let rows = data.filter((e: any) => {
      if (categoryF !== "All" && e.category !== categoryF) return false;
      if (statusF !== "All" && e.status !== statusF) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!e.vendor.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.expenseNo.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    return [...rows].sort((a: any, b: any) => {
      const va = sortKey === "amount" ? a.amount : sortKey === "date" ? a.date : a.vendor;
      const vb = sortKey === "amount" ? b.amount : sortKey === "date" ? b.date : b.vendor;
      return va < vb ? (sortDir === "asc" ? -1 : 1) : va > vb ? (sortDir === "asc" ? 1 : -1) : 0;
    });
  }, [data, search, categoryF, statusF, sortKey, sortDir]);

  const totalAmount = filtered.reduce((s, e) => s + e.amount, 0);
  const totalGST = filtered.reduce((s, e) => s + e.gst, 0);
  const totalTDS = filtered.reduce((s, e) => s + e.tds, 0);
  const totalNetPayable = filtered.reduce((s, e) => s + e.netPayable, 0);

  const categories = useMemo(() => {
    const cats: Record<string, number> = {};
    data.forEach((e: any) => { cats[e.category] = (cats[e.category] ?? 0) + e.amount; });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  }, [data]);
  const maxCat = categories[0]?.[1] ?? 1;

  const toggleSort = (k: SortKey) => { if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("asc"); } };
  const toggleAll = () => { if (selected.size === filtered.length) setSelected(new Set()); else setSelected(new Set(filtered.map((e: any) => e.id))); };
  const toggleOne = (id: string) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s); };
  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k ? (sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : <ChevronDown size={11} className="opacity-30" />;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const calculatedGst = Math.round(newExp.amount * (newExp.gstRate / 100));
      const calculatedTds = Math.round(newExp.amount * (newExp.tdsRate / 100));
      const netPayable = newExp.amount + calculatedGst - calculatedTds;

      await createExpense({
        category: newExp.category,
        vendor: newExp.vendor,
        vendorGSTIN: newExp.vendorGSTIN || null,
        amount: Number(newExp.amount),
        gst: calculatedGst,
        gstRate: Number(newExp.gstRate),
        tds: calculatedTds,
        tdsRate: Number(newExp.tdsRate),
        netPayable: netPayable,
        mode: newExp.mode,
        billNo: `B-${Date.now().toString().slice(-5)}`,
        date: new Date().toISOString(),
        fy
      });

      setShowAddModal(false);
      setNewExp({
        category: "Materials",
        vendor: "",
        vendorGSTIN: "",
        amount: 15000,
        gstRate: 18,
        tdsRate: 1,
        description: "",
        mode: "Bank Transfer"
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Expenses", value: fmtINR(totalAmount, true), sub: `${data.length} bills`, color: "border-l-primary" },
          { label: "GST Input Credit", value: fmtINR(totalGST, true), sub: "Eligible ITC", color: "border-l-success" },
          { label: "TDS Deducted", value: fmtINR(totalTDS, true), sub: "u/s 194C / 194J", color: "border-l-warning" },
          { label: "Net Payable", value: fmtINR(totalNetPayable, true), sub: "After TDS", color: "border-l-destructive" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[11px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-foreground mb-4">Expense Breakdown by Category</p>
        <div className="space-y-3">
          {categories.map(([cat, amt]) => {
            const pct = (amt / maxCat) * 100;
            return (
              <div key={cat} className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[cat] ?? "bg-muted text-muted-foreground"} w-24 text-center`}>{cat}</span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-primary/70 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-bold text-foreground w-20 text-right">{fmtINR(amt, true)}</span>
                <span className="text-[10px] text-muted-foreground w-10 text-right">{((amt / (totalAmount || 1)) * 100).toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendor, description, expense no…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button onClick={() => setShowFilters(f => !f)} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${showFilters ? "bg-primary text-white border-primary" : "border-border text-foreground hover:bg-muted"}`}>
          <Filter size={13} /> Filters
        </button>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors">
          <Plus size={13} /> Record Expense
        </button>
      </div>

      {showFilters && (
        <div className="bg-card border border-border rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Category", value: categoryF, set: setCategoryF, opts: ["All", "Construction", "Materials", "Marketing", "Professional", "Admin", "Finance"] },
            { label: "Status", value: statusF, set: setStatusF, opts: ["All", "Paid", "Pending", "Approved", "Rejected"] },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">{f.label}</label>
              <select value={f.value} onChange={e => f.set(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none text-foreground">
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
          <span className="text-xs font-semibold text-primary">{selected.size} selected</span>
          <button className="text-xs font-semibold text-primary hover:underline">Export Selected</button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-muted-foreground">Deselect all</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 w-10 text-left">
                  <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground">
                    {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Expense No</th>
                <th className="px-4 py-3 text-left"><button onClick={() => toggleSort("date")} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground">Date <SortIcon k="date" /></button></th>
                <th className="px-4 py-3 text-left"><button onClick={() => toggleSort("vendor")} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground">Vendor <SortIcon k="vendor" /></button></th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-right"><button onClick={() => toggleSort("amount")} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground ml-auto">Amount <SortIcon k="amount" /></button></th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">GST</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">TDS</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Net Payable</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Mode</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && <tr><td colSpan={11} className="px-4 py-12 text-center text-muted-foreground text-sm">No expenses found</td></tr>}
              {filtered.map(e => (
                <tr key={e.id} className={`hover:bg-muted/30 transition-colors ${selected.has(e.id) ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-3"><button onClick={() => toggleOne(e.id)} className="text-muted-foreground hover:text-foreground">{selected.has(e.id) ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}</button></td>
                  <td className="px-4 py-3">
                    <p className="text-[11px] font-mono font-semibold text-foreground">{e.expenseNo}</p>
                    <p className="text-[10px] text-muted-foreground">{e.billNo}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">{formatDate(e.date)}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-foreground">{e.vendor}</p>
                    {e.vendorGSTIN && <p className="text-[10px] font-mono text-muted-foreground">{e.vendorGSTIN}</p>}
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{e.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[e.category] ?? "bg-muted text-muted-foreground"}`}>{e.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-semibold text-foreground whitespace-nowrap">{fmtINR(e.amount)}</td>
                  <td className="px-4 py-3 text-right">
                    {e.gst > 0 ? (
                      <div>
                        <p className="text-xs text-success">{fmtINR(e.gst)}</p>
                        <p className="text-[10px] text-muted-foreground">{e.gstRate}% ITC</p>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">Exempt</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-destructive">{e.tds > 0 ? `-${fmtINR(e.tds)}` : "—"}</td>
                  <td className="px-4 py-3 text-right text-xs font-bold text-foreground whitespace-nowrap">{fmtINR(e.netPayable)}</td>
                  <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">{e.mode}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[e.status] ?? "bg-muted text-muted-foreground border-border"}`}>{e.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-border bg-muted/30">
              <tr>
                <td colSpan={5} className="px-4 py-3 text-xs font-bold text-foreground">Total ({filtered.length} expenses)</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-foreground">{fmtINR(totalAmount)}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-success">{fmtINR(totalGST)}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-destructive">-{fmtINR(totalTDS)}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-foreground">{fmtINR(totalNetPayable)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm font-black text-foreground">Record Expense Voucher</p>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Category</label>
                  <select value={newExp.category} onChange={e => setNewExp({ ...newExp, category: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                    {["Materials", "Labour", "Admin", "Finance", "Construction", "Marketing", "Professional"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Vendor / Payee</label>
                  <input required type="text" value={newExp.vendor} onChange={e => setNewExp({ ...newExp, vendor: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Vendor GSTIN (Optional)</label>
                <input type="text" value={newExp.vendorGSTIN} onChange={e => setNewExp({ ...newExp, vendorGSTIN: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" placeholder="e.g. 24AABCS1234K1Z5" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Base Amount (₹)</label>
                  <input required type="number" value={newExp.amount} onChange={e => setNewExp({ ...newExp, amount: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">GST Rate</label>
                  <select value={newExp.gstRate} onChange={e => setNewExp({ ...newExp, gstRate: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                    {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">TDS Rate</label>
                  <select value={newExp.tdsRate} onChange={e => setNewExp({ ...newExp, tdsRate: Number(e.target.value) })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                    {[0, 1, 2, 5, 10].map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Payment Mode</label>
                <select value={newExp.mode} onChange={e => setNewExp({ ...newExp, mode: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                  {["Bank Transfer", "UPI", "Cheque", "Cash"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Description</label>
                <input required type="text" value={newExp.description} onChange={e => setNewExp({ ...newExp, description: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" placeholder="e.g. cement bags supply bill" />
              </div>

              <div className="bg-muted/30 p-3 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-muted-foreground"><span>GST Input Credit:</span><span className="font-bold text-success">+{fmtINR(Math.round(newExp.amount * (newExp.gstRate / 100)))}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>TDS Deductible:</span><span className="font-bold text-destructive">-{fmtINR(Math.round(newExp.amount * (newExp.tdsRate / 100)))}</span></div>
                <div className="flex justify-between text-foreground font-black pt-1 border-t border-border/40"><span>Net Payable:</span><span>{fmtINR(newExp.amount + Math.round(newExp.amount * (newExp.gstRate / 100)) - Math.round(newExp.amount * (newExp.tdsRate / 100)))}</span></div>
              </div>

              <button type="submit" className="w-full bg-orange-500 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-orange-600 transition-colors active:scale-95 transform">
                Submit Voucher
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
