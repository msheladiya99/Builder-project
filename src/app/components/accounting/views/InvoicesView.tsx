import { useState, useMemo } from "react";
import { Search, Download, Eye, Printer, FileDown, X, ChevronDown, ChevronUp, CheckSquare, Square, Filter } from "lucide-react";
import { mockInvoices, fmtINR, formatDate, FinancialYear, Invoice } from "../accountingData";

interface Props { fy: FinancialYear; }

const STATUS_COLORS: Record<string, string> = {
  Paid: "bg-success/10 text-success border-success/20",
  Unpaid: "bg-muted text-muted-foreground border-border",
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
  Partial: "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-secondary/10 text-secondary border-secondary/20",
  Cancelled: "bg-muted text-muted-foreground border-border",
};

function Badge({ label }: { label: string }) {
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[label] ?? "bg-muted text-muted-foreground border-border"}`}>{label}</span>;
}

type SortKey = "invoiceDate" | "total" | "invoiceNo";

export function InvoicesView({ fy }: Props) {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [wingF, setWingF] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("invoiceDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<Invoice | null>(null);

  const data = useMemo(() => mockInvoices.filter(i => i.fy === fy), [fy]);

  const filtered = useMemo(() => {
    let rows = data.filter(i => {
      if (statusF !== "All" && i.status !== statusF) return false;
      if (wingF !== "All" && i.wing !== wingF) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!i.party.toLowerCase().includes(q) && !i.invoiceNo.toLowerCase().includes(q) && !i.flatNo.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    return [...rows].sort((a, b) => {
      const va = sortKey === "total" ? a.total : sortKey === "invoiceDate" ? a.invoiceDate : a.invoiceNo;
      const vb = sortKey === "total" ? b.total : sortKey === "invoiceDate" ? b.invoiceDate : b.invoiceNo;
      return va < vb ? (sortDir === "asc" ? -1 : 1) : va > vb ? (sortDir === "asc" ? 1 : -1) : 0;
    });
  }, [data, search, statusF, wingF, sortKey, sortDir]);

  const totalInvoiced = filtered.reduce((s, i) => s + i.total, 0);
  const totalPaid = filtered.reduce((s, i) => s + i.paidAmount, 0);
  const totalGST = filtered.reduce((s, i) => s + i.cgst + i.sgst + i.igst, 0);
  const totalTDS = filtered.reduce((s, i) => s + i.tds, 0);

  const toggleSort = (k: SortKey) => { if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("asc"); } };
  const toggleAll = () => { if (selected.size === filtered.length) setSelected(new Set()); else setSelected(new Set(filtered.map(i => i.id))); };
  const toggleOne = (id: string) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s); };
  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k ? (sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : <ChevronDown size={11} className="opacity-30" />;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Invoiced", value: fmtINR(totalInvoiced, true), color: "border-l-primary" },
          { label: "Amount Collected", value: fmtINR(totalPaid, true), color: "border-l-success" },
          { label: "Total GST Charged", value: fmtINR(totalGST, true), color: "border-l-warning" },
          { label: "Total TDS Deducted", value: fmtINR(totalTDS, true), color: "border-l-destructive" },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by party, invoice no, flat…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <button onClick={() => setShowFilters(f => !f)} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${showFilters ? "bg-primary text-white border-primary" : "border-border text-foreground hover:bg-muted"}`}>
          <Filter size={13} /> Filters
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted">
          <Download size={13} /> Export
        </button>
      </div>

      {showFilters && (
        <div className="bg-card border border-border rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Status", value: statusF, set: setStatusF, opts: ["All", "Paid", "Unpaid", "Overdue", "Partial", "Draft", "Cancelled"] },
            { label: "Wing", value: wingF, set: setWingF, opts: ["All", "A", "B", "C", "D"] },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">{f.label}</label>
              <select value={f.value} onChange={e => f.set(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none">
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
                <th className="px-4 py-3 text-left"><button onClick={() => toggleSort("invoiceNo")} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground">Invoice No <SortIcon k="invoiceNo" /></button></th>
                <th className="px-4 py-3 text-left"><button onClick={() => toggleSort("invoiceDate")} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground">Date <SortIcon k="invoiceDate" /></button></th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Party / Flat</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Taxable</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">GST</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">TDS</th>
                <th className="px-4 py-3 text-right"><button onClick={() => toggleSort("total")} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground ml-auto">Total <SortIcon k="total" /></button></th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && <tr><td colSpan={11} className="px-4 py-12 text-center text-muted-foreground text-sm">No invoices found</td></tr>}
              {filtered.map(inv => (
                <tr key={inv.id} className={`hover:bg-muted/30 transition-colors ${selected.has(inv.id) ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-3"><button onClick={() => toggleOne(inv.id)} className="text-muted-foreground hover:text-foreground">{selected.has(inv.id) ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}</button></td>
                  <td className="px-4 py-3"><p className="text-xs font-mono font-semibold text-foreground whitespace-nowrap">{inv.invoiceNo}</p></td>
                  <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">{formatDate(inv.invoiceDate)}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    <span className={inv.status === "Overdue" ? "text-destructive font-semibold" : "text-foreground"}>{formatDate(inv.dueDate)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-foreground">{inv.party}</p>
                    <p className="text-[10px] text-muted-foreground">Flat {inv.flatNo} · Wing {inv.wing}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-foreground">{fmtINR(inv.subtotal)}</td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-xs text-foreground">{fmtINR(inv.cgst + inv.sgst + inv.igst)}</p>
                    <p className="text-[10px] text-muted-foreground">{inv.igst > 0 ? "IGST" : "CGST+SGST"}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-destructive">{inv.tds > 0 ? `-${fmtINR(inv.tds)}` : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-xs font-bold text-foreground">{fmtINR(inv.total)}</p>
                    {inv.paidAmount < inv.total && inv.paidAmount > 0 && (
                      <p className="text-[10px] text-warning">Paid: {fmtINR(inv.paidAmount)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3"><Badge label={inv.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setPreview(inv)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors" title="Preview"><Eye size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-border bg-muted/30">
              <tr>
                <td colSpan={5} className="px-4 py-3 text-xs font-bold text-foreground">Total ({filtered.length} invoices)</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-foreground">{fmtINR(filtered.reduce((s, i) => s + i.subtotal, 0))}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-foreground">{fmtINR(totalGST)}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-destructive">-{fmtINR(totalTDS)}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-foreground">{fmtINR(totalInvoiced)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b bg-gray-50 shrink-0">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Tax Invoice Preview</h2>
                <p className="text-[11px] text-gray-500">{preview.invoiceNo}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800">
                  <Printer size={12} /> Print
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-700 text-white text-xs font-semibold hover:bg-green-800">
                  <FileDown size={12} /> PDF
                </button>
                <button onClick={() => setPreview(null)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500"><X size={16} /></button>
              </div>
            </div>

            {/* Invoice paper */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-gray-900 text-sm max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-6 border-b-2 border-blue-900">
                  <div>
                    <h1 className="text-2xl font-black text-blue-900 tracking-tight">SHRI HARI GROUP</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Builders & Developers | Real Estate</p>
                    <p className="text-xs text-gray-600 mt-1">Plot 45, Sector 7, CBD Belapur, Navi Mumbai — 400614</p>
                    <p className="text-xs text-gray-600">GSTIN: 27AABCS1234K1Z5 | PAN: AABCS1234K</p>
                    <p className="text-xs text-gray-600">Tel: +91-22-2756-7890 | accounts@shriggroup.com</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-blue-900 text-white px-4 py-1.5 rounded-lg text-xs font-black tracking-widest mb-3">TAX INVOICE</div>
                    <div className="text-xs space-y-1">
                      <p><span className="text-gray-500">Invoice No:</span> <span className="font-bold">{preview.invoiceNo}</span></p>
                      <p><span className="text-gray-500">Date:</span> <span className="font-semibold">{formatDate(preview.invoiceDate)}</span></p>
                      <p><span className="text-gray-500">Due Date:</span> <span className="font-semibold">{formatDate(preview.dueDate)}</span></p>
                    </div>
                  </div>
                </div>

                {/* Bill to / payment details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-[9px] font-black text-blue-900 uppercase tracking-widest mb-2">Bill To</p>
                    <p className="font-bold text-gray-900">{preview.party}</p>
                    <p className="text-xs text-gray-600 mt-1">{preview.partyAddress}</p>
                    {preview.partyGSTIN && <p className="text-xs text-gray-600 mt-1">GSTIN: <span className="font-mono font-semibold">{preview.partyGSTIN}</span></p>}
                    <p className="text-xs text-gray-600 mt-1">Property: <span className="font-semibold">Flat {preview.flatNo}, Shri Hari Heights</span></p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-2">Bank Details</p>
                    <p className="text-xs text-gray-600">Bank: <span className="font-semibold">HDFC Bank Ltd</span></p>
                    <p className="text-xs text-gray-600">A/c No: <span className="font-mono font-semibold">2345678901</span> (Current)</p>
                    <p className="text-xs text-gray-600">IFSC: <span className="font-mono font-semibold">HDFC0000234</span></p>
                    <p className="text-xs text-gray-600">Branch: CBD Belapur, Navi Mumbai</p>
                    <p className="text-xs text-gray-600 mt-1">UPI: shriggroup@hdfc</p>
                  </div>
                </div>

                {/* Items */}
                <table className="w-full mb-5 text-xs">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="p-2 text-left rounded-tl-lg">#</th>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-center">HSN/SAC</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Rate (₹)</th>
                      <th className="p-2 text-right">Amount (₹)</th>
                      <th className="p-2 text-center">GST%</th>
                      <th className="p-2 text-right">CGST</th>
                      <th className="p-2 text-right rounded-tr-lg">SGST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="p-2 text-gray-500">{idx + 1}</td>
                        <td className="p-2 text-gray-800">{item.description}</td>
                        <td className="p-2 text-center font-mono text-gray-700">{item.hsnSac}</td>
                        <td className="p-2 text-right text-gray-700">{item.qty} {item.unit}</td>
                        <td className="p-2 text-right text-gray-700">{item.rate.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right font-semibold">{item.amount.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-center text-gray-600">{item.gstRate}%</td>
                        <td className="p-2 text-right text-gray-700">{item.cgst.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right text-gray-700">{item.sgst.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-6">
                  <div className="w-72 space-y-1 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-gray-200"><span className="text-gray-600">Taxable Value</span><span className="font-semibold">₹{preview.subtotal.toLocaleString("en-IN")}</span></div>
                    {preview.cgst > 0 && <>
                      <div className="flex justify-between py-1.5 border-b border-gray-200"><span className="text-gray-600">CGST @ {preview.items[0]?.gstRate / 2}%</span><span>₹{preview.cgst.toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between py-1.5 border-b border-gray-200"><span className="text-gray-600">SGST @ {preview.items[0]?.gstRate / 2}%</span><span>₹{preview.sgst.toLocaleString("en-IN")}</span></div>
                    </>}
                    {preview.igst > 0 && <div className="flex justify-between py-1.5 border-b border-gray-200"><span className="text-gray-600">IGST @ {preview.items[0]?.gstRate}%</span><span>₹{preview.igst.toLocaleString("en-IN")}</span></div>}
                    {preview.roundOff !== 0 && <div className="flex justify-between py-1.5 border-b border-gray-200"><span className="text-gray-600">Round Off</span><span>{preview.roundOff > 0 ? "+" : ""}{preview.roundOff}</span></div>}
                    <div className="flex justify-between py-2 px-3 bg-blue-900 text-white rounded-lg mt-1">
                      <span className="font-bold">Total Amount</span>
                      <span className="font-bold">₹{preview.total.toLocaleString("en-IN")}</span>
                    </div>
                    {preview.tds > 0 && <>
                      <div className="flex justify-between py-1.5 text-red-600"><span>Less: TDS (u/s 194C @ 1%)</span><span className="font-semibold">-₹{preview.tds.toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between py-1.5 text-green-700 font-bold border-t border-green-200 mt-1"><span>Net Amount Payable</span><span>₹{(preview.total - preview.tds).toLocaleString("en-IN")}</span></div>
                    </>}
                  </div>
                </div>

                {/* Amount in words */}
                <div className="bg-gray-50 rounded-lg p-3 mb-5 border border-gray-200 text-xs text-gray-700">
                  <span className="font-bold">Amount in Words: </span>
                  <span className="italic">Rupees {preview.total.toLocaleString("en-IN")} only</span>
                </div>

                {/* Terms */}
                <div className="mb-6 text-xs text-gray-600 space-y-1">
                  <p className="font-bold text-gray-700 mb-2">Terms & Conditions:</p>
                  <p>1. Payment is due within 15 days from invoice date. Delayed payments attract 18% p.a. interest.</p>
                  <p>2. This is a computer-generated invoice and does not require a physical signature.</p>
                  <p>3. TDS certificate (Form 16B) must be submitted within 30 days of payment. GSTIN to be quoted.</p>
                  <p>4. Disputes subject to Navi Mumbai (Maharashtra) jurisdiction only.</p>
                </div>

                {/* Signature area */}
                <div className="flex justify-between items-end pt-4 border-t border-gray-200">
                  <div className="text-[10px] text-gray-500">
                    <p>CIN: U45200MH2010PTC123456</p>
                    <p>This is a system-generated document</p>
                  </div>
                  <div className="text-right">
                    <div className="mt-10 border-t border-gray-500 pt-2 w-44">
                      <p className="text-xs font-bold text-gray-700">For SHRI HARI GROUP</p>
                      <p className="text-[10px] text-gray-500">Authorised Signatory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
