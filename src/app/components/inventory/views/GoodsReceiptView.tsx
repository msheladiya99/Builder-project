import { useState } from "react";
import {
  Truck, CheckCircle2, XCircle, Clock, AlertTriangle, Search,
  Package, ScanLine, Eye, ChevronDown, Plus, Printer
} from "lucide-react";
import { mockGRNs, fmtINR, Site, GRNStatus } from "../inventoryData";

interface Props { site: Site; }

const statusConfig: Record<GRNStatus, { color: string; bg: string; icon: any }> = {
  "Pending QC":  { color: "text-amber-700 dark:text-amber-400",  bg: "bg-amber-100/80 dark:bg-amber-900/30", icon: Clock },
  "QC Passed":   { color: "text-blue-700 dark:text-blue-400",    bg: "bg-blue-100/80 dark:bg-blue-900/30",  icon: CheckCircle2 },
  "QC Failed":   { color: "text-red-700 dark:text-red-400",      bg: "bg-red-100/80 dark:bg-red-900/30",   icon: XCircle },
  Accepted:      { color: "text-green-700 dark:text-green-400",  bg: "bg-green-100/80 dark:bg-green-900/30", icon: CheckCircle2 },
  Rejected:      { color: "text-red-700 dark:text-red-400",      bg: "bg-red-100/80 dark:bg-red-900/30",   icon: XCircle },
};

// Visual barcode renderer
function Barcode({ code, label }: { code: string; label?: string }) {
  // Generate pseudo-random bar pattern from the code
  const bars: number[] = [];
  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    bars.push(((charCode * 7 + i * 3) % 4) + 1);
    bars.push(((charCode * 3 + i * 5) % 3) + 1);
  }
  const totalWidth = bars.reduce((s, b) => s + b, 0) + bars.length;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-end h-10 gap-px bg-white px-2 py-1 rounded border border-border/40">
        {bars.map((w, i) => (
          <div
            key={i}
            className={i % 2 === 0 ? "bg-black" : "bg-white"}
            style={{ width: `${w * 1.5}px`, height: `${28 + (i % 3) * 2}px` }}
          />
        ))}
      </div>
      <p className="text-[8px] font-mono text-muted-foreground tracking-wider">{code}</p>
      {label && <p className="text-[8px] text-muted-foreground">{label}</p>}
    </div>
  );
}

function GRNCard({ grn, expanded, onToggle }: { grn: typeof mockGRNs[0]; expanded: boolean; onToggle: () => void }) {
  const sc = statusConfig[grn.status];
  const StatusIcon = sc.icon;
  const totalAccepted = grn.items.reduce((s, i) => s + i.acceptedQty, 0);
  const totalReceived = grn.items.reduce((s, i) => s + i.receivedQty, 0);
  const totalValue = grn.items.reduce((s, i) => s + i.amount, 0);
  const totalRejected = grn.items.reduce((s, i) => s + i.rejectedQty, 0);

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden transition-all ${expanded ? "border-orange-500 shadow-orange-500/10 shadow-lg" : "border-border"}`}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/10" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-muted/40 flex items-center justify-center shrink-0">
            <Truck size={14} className="text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-black text-foreground">{grn.grnNo}</p>
              <span className="text-[9px] font-bold text-muted-foreground">← {grn.poNo}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{grn.date} · {grn.vendor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {totalRejected > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-red-600 dark:text-red-400 bg-red-100/80 dark:bg-red-900/30 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
              <AlertTriangle size={8} /> {totalRejected} rejected
            </span>
          )}
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${sc.bg} ${sc.color}`}>
            <StatusIcon size={10} /> {grn.status}
          </span>
          <ChevronDown size={13} className={`text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Summary strip */}
      <div className="px-4 pb-3 grid grid-cols-2 lg:grid-cols-5 gap-3 border-b border-border/60">
        {[
          { label: "Site", value: grn.site },
          { label: "Warehouse", value: grn.warehouse },
          { label: "Vehicle No.", value: grn.vehicleNo },
          { label: "DC / Challan No.", value: grn.dcNo },
          { label: "Received By", value: grn.receivedBy },
        ].map(f => (
          <div key={f.label}>
            <p className="text-[9px] text-muted-foreground">{f.label}</p>
            <p className="text-[10px] font-bold text-foreground">{f.value}</p>
          </div>
        ))}
      </div>

      {/* Summary totals */}
      <div className="px-4 py-2.5 grid grid-cols-4 gap-3 border-b border-border/60 bg-muted/10">
        {[
          { label: "Items", value: grn.items.length },
          { label: "Received", value: `${totalReceived} units` },
          { label: "Accepted", value: `${totalAccepted} units`, ok: true },
          { label: "Total Value", value: fmtINR(totalValue, true) },
        ].map(f => (
          <div key={f.label}>
            <p className="text-[9px] text-muted-foreground">{f.label}</p>
            <p className={`text-xs font-black ${f.ok ? "text-green-600 dark:text-green-400" : "text-foreground"}`}>{f.value}</p>
          </div>
        ))}
      </div>

      {/* Expanded items */}
      {expanded && (
        <>
          <div className="divide-y divide-border/50">
            {grn.items.map((item, idx) => (
              <div key={idx} className="px-4 py-3">
                <div className="flex items-start gap-4">
                  {/* Barcode */}
                  <div className="shrink-0">
                    <Barcode code={item.barcode} label={item.batchNo} />
                  </div>

                  {/* Item detail */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-black text-foreground">{item.material}</p>
                        <p className="text-[9px] font-mono text-muted-foreground">{item.materialCode}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-foreground">{fmtINR(item.amount, true)}</p>
                        <p className="text-[9px] text-muted-foreground">@ {fmtINR(item.rate)}/{item.unit}</p>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {[
                        { label: "Ordered", value: `${item.orderedQty} ${item.unit}`, color: "" },
                        { label: "Received", value: `${item.receivedQty} ${item.unit}`, color: "" },
                        { label: "Accepted", value: `${item.acceptedQty} ${item.unit}`, color: "text-green-600 dark:text-green-400" },
                        { label: "Rejected", value: `${item.rejectedQty} ${item.unit}`, color: item.rejectedQty > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground" },
                      ].map(f => (
                        <div key={f.label} className="bg-muted/20 rounded-lg p-1.5 text-center">
                          <p className="text-[8px] text-muted-foreground">{f.label}</p>
                          <p className={`text-[10px] font-black ${f.color || "text-foreground"}`}>{f.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[9px] font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded border border-border/40">
                        <ScanLine size={8} className="inline mr-1" />Batch: {item.batchNo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* QC info & remarks */}
          <div className="px-4 py-3 bg-muted/10 border-t border-border/60 flex items-center justify-between">
            <div className="text-[10px] text-muted-foreground">
              {grn.qcBy && <span><CheckCircle2 size={10} className="inline mr-1 text-green-500" />QC by {grn.qcBy} on {grn.qcDate}</span>}
              {grn.remarks && <span className="ml-3 italic">"{grn.remarks}"</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-[10px] font-semibold hover:bg-muted/40">
                <Printer size={11} /> Print GRN
              </button>
              {grn.status === "Pending QC" && (
                <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-500 text-white text-[10px] font-bold hover:bg-orange-600">
                  <CheckCircle2 size={11} /> Start QC
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function GoodsReceiptView({ site }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<GRNStatus | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>("GRN001");

  const filtered = mockGRNs.filter(grn => {
    const matchSite = site === "All Sites" || grn.site === site;
    const matchSearch = grn.grnNo.toLowerCase().includes(search.toLowerCase()) ||
      grn.vendor.toLowerCase().includes(search.toLowerCase()) ||
      grn.poNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || grn.status === statusFilter;
    return matchSite && matchSearch && matchStatus;
  });

  const pendingQC = mockGRNs.filter(g => g.status === "Pending QC").length;
  const qcFailed = mockGRNs.filter(g => g.status === "QC Failed").length;
  const totalValue = mockGRNs.reduce((s, g) => s + g.items.reduce((ss, i) => ss + i.amount, 0), 0);

  return (
    <div className="p-4 lg:p-5 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total GRNs", value: mockGRNs.length, sub: "FY 2025-26", color: "border-l-primary" },
          { label: "Pending QC", value: pendingQC, sub: "Awaiting inspection", color: "border-l-warning" },
          { label: "QC Failed", value: qcFailed, sub: "Return / rejection", color: "border-l-destructive" },
          { label: "Total Received Value", value: fmtINR(totalValue, true), sub: "Accepted materials", color: "border-l-success" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[10px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-black text-foreground mt-1">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Barcode scanner hint */}
      <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
          <ScanLine size={15} className="text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-foreground">Barcode Scanner Ready</p>
          <p className="text-[10px] text-muted-foreground">Scan material barcode to auto-populate GRN entry · Supports QR, EAN-13, Code128</p>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600">
          Scan Now
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-3 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] px-3 py-2 rounded-xl border border-border bg-muted/20">
          <Search size={13} className="text-muted-foreground shrink-0" />
          <input
            className="flex-1 text-xs bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            placeholder="Search GRN no., vendor, PO..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {(["All", "Pending QC", "QC Passed", "QC Failed", "Accepted", "Rejected"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border whitespace-nowrap ${statusFilter === s ? "bg-orange-500 border-orange-500 text-white" : "border-border text-muted-foreground hover:bg-muted/40"}`}>
            {s}
          </button>
        ))}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 ml-auto">
          <Plus size={13} /> New GRN
        </button>
      </div>

      {/* GRN list */}
      <div className="space-y-3">
        {filtered.map(grn => (
          <GRNCard
            key={grn.id}
            grn={grn}
            expanded={expandedId === grn.id}
            onToggle={() => setExpandedId(expandedId === grn.id ? null : grn.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <Package size={32} className="mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm font-semibold text-muted-foreground">No GRNs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
