import { useState, useEffect } from "react";
import {
  Plus, Search, Download, Eye, CheckCircle2, XCircle, Clock,
  AlertTriangle, ChevronDown, ChevronRight, Truck, FileText, Filter, X
} from "lucide-react";
import { mockPurchaseOrders, fmtINR, Site, POStatus, ApprovalStep } from "../inventoryData";
import { useInventoryStore } from "../../../store/store";

interface Props { site: Site; }

const statusConfig: Record<POStatus, { color: string; bg: string; dot: string }> = {
  Draft:               { color: "text-slate-600 dark:text-slate-400",   bg: "bg-slate-100 dark:bg-slate-800/60",     dot: "bg-slate-400" },
  "Pending Approval":  { color: "text-amber-700 dark:text-amber-400",   bg: "bg-amber-100/80 dark:bg-amber-900/30",  dot: "bg-amber-400" },
  Approved:            { color: "text-blue-700 dark:text-blue-400",     bg: "bg-blue-100/80 dark:bg-blue-900/30",   dot: "bg-blue-500" },
  "Partially Received":{ color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-100/80 dark:bg-purple-900/30", dot: "bg-purple-500" },
  Received:            { color: "text-green-700 dark:text-green-400",   bg: "bg-green-100/80 dark:bg-green-900/30", dot: "bg-green-500" },
  Cancelled:           { color: "text-red-700 dark:text-red-400",       bg: "bg-red-100/80 dark:bg-red-900/30",     dot: "bg-red-500" },
};

const priorityConfig: Record<string, string> = {
  Low:    "text-slate-500 bg-slate-100 dark:bg-slate-800",
  Normal: "text-blue-600 bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400",
  High:   "text-orange-600 bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-400",
  Urgent: "text-red-600 bg-red-100/80 dark:bg-red-900/30 dark:text-red-400",
};

function ApprovalTimeline({ steps }: { steps: ApprovalStep[] }) {
  return (
    <div className="flex items-start gap-0 mt-4">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const icon = step.status === "Approved" ? CheckCircle2
          : step.status === "Rejected" ? XCircle
          : step.status === "Skipped" ? AlertTriangle
          : Clock;
        const Icon = icon;
        const color = step.status === "Approved" ? "text-green-500"
          : step.status === "Rejected" ? "text-red-500"
          : step.status === "Skipped" ? "text-slate-400"
          : "text-amber-400";
        const line = step.status === "Approved" ? "bg-green-500"
          : step.status === "Rejected" ? "bg-red-500"
          : "bg-border";
        return (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                step.status === "Approved" ? "border-green-500 bg-green-500/10"
                : step.status === "Rejected" ? "border-red-500 bg-red-500/10"
                : step.status === "Skipped" ? "border-slate-300 bg-muted/20"
                : "border-amber-400 bg-amber-400/10"
              }`}>
                <Icon size={11} className={color} />
              </div>
              {!isLast && <div className={`h-0.5 flex-1 ${line}`} />}
            </div>
            <div className="mt-1.5 text-center px-0.5">
              <p className="text-[8px] font-black text-foreground leading-tight">{step.role.replace(" Manager", " Mgr").replace(" Engineer", " Eng.")}</p>
              <p className="text-[8px] text-muted-foreground leading-tight">{step.name.split(" ")[0]}</p>
              {step.date && <p className="text-[7px] text-muted-foreground">{step.date.slice(5)}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function POCard({ po, onSelect, selected }: { po: any; onSelect: () => void; selected: boolean }) {
  const sc = statusConfig[po.status as POStatus] || statusConfig.Approved;
  const pc = priorityConfig[po.priority] || priorityConfig.Normal;
  const totalItems = po.items?.length || 0;
  const receivedPct = totalItems > 0 ? po.items.reduce((s: number, i: any) => s + (i.receivedQty || 0), 0) / po.items.reduce((s: number, i: any) => s + (i.qty || 0), 0) * 100 : 0;

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden transition-all cursor-pointer hover:shadow-md ${selected ? "border-orange-500 shadow-orange-500/10 shadow-lg" : "border-border"}`} onClick={onSelect}>
      {/* Top bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <FileText size={14} className="text-muted-foreground" />
          <div>
            <p className="text-xs font-black text-foreground">{po.poNo}</p>
            <p className="text-[10px] text-muted-foreground">{po.date} · {po.vendor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${pc}`}>{po.priority}</span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${sc.bg} ${sc.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {po.status}
          </span>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <p className="text-[9px] text-muted-foreground">Site</p>
            <p className="text-xs font-bold text-foreground">{po.site}</p>
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground">Warehouse</p>
            <p className="text-xs font-bold text-foreground">{po.warehouse}</p>
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground">Items</p>
            <p className="text-xs font-bold text-foreground">{totalItems} line{totalItems > 1 ? "s" : ""}</p>
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground">Total Value</p>
            <p className="text-xs font-black text-foreground">{fmtINR(po.total, true)}</p>
          </div>
        </div>

        {/* Receipt progress */}
        {(po.status === "Partially Received" || po.status === "Received") && (
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] text-muted-foreground">Receipt Progress</span>
              <span className="text-[9px] font-bold text-foreground">{Math.round(receivedPct)}%</span>
            </div>
            <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${receivedPct}%` }} />
            </div>
          </div>
        )}

        {/* Approval timeline */}
        {selected && po.approvalSteps && <ApprovalTimeline steps={po.approvalSteps} />}
      </div>

      {/* Items (expanded) */}
      {selected && po.items && (
        <div className="border-t border-border/60">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground">
                <th className="text-left px-4 py-2 font-bold">Material</th>
                <th className="text-right px-3 py-2 font-bold">Qty</th>
                <th className="text-right px-3 py-2 font-bold">Rate</th>
                <th className="text-right px-3 py-2 font-bold">GST%</th>
                <th className="text-right px-4 py-2 font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {po.items.map((item: any) => (
                <tr key={item.id} className="hover:bg-muted/10">
                  <td className="px-4 py-2 font-semibold text-foreground">
                    <div>{item.material || item.materialName}</div>
                    <div className="text-muted-foreground font-mono">{item.materialCode || "N/A"}</div>
                  </td>
                  <td className="px-3 py-2 text-right text-foreground font-semibold">
                    {item.qty || item.quantity} {item.unit || "bags"}
                    {(item.receivedQty || 0) > 0 && <div className="text-green-500 font-normal">✓ {item.receivedQty} recv'd</div>}
                  </td>
                  <td className="px-3 py-2 text-right text-foreground">{fmtINR(item.rate)}</td>
                  <td className="px-3 py-2 text-right text-foreground">{item.gstRate || 18}%</td>
                  <td className="px-4 py-2 text-right font-bold text-foreground">{fmtINR((item.amount || ((item.qty || item.quantity) * item.rate)) * 1.18, true)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/30">
                <td colSpan={3} className="px-4 py-2 text-[10px] font-semibold text-muted-foreground">
                  {po.remarks && <span className="italic">"{po.remarks}"</span>}
                </td>
                <td className="px-3 py-2 text-right text-[10px] font-bold text-foreground">Total</td>
                <td className="px-4 py-2 text-right text-sm font-black text-foreground">{fmtINR(po.total, true)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="px-4 py-2 flex items-center justify-between border-t border-border/40">
        <span className="text-[9px] text-muted-foreground">Created by {po.createdBy} · Due {po.deliveryDate}</span>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-lg hover:bg-muted/40 text-muted-foreground" onClick={e => e.stopPropagation()}>
            <Eye size={12} />
          </button>
          <button className="p-1 rounded-lg hover:bg-muted/40 text-muted-foreground" onClick={e => e.stopPropagation()}>
            <Download size={12} />
          </button>
          <ChevronDown size={12} className={`text-muted-foreground transition-transform ${selected ? "rotate-180" : ""}`} />
        </div>
      </div>
    </div>
  );
}

export function PurchaseOrdersView({ site }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<POStatus | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New PO form state
  const [vendorId, setVendorId] = useState("");
  const [warehouse, setWarehouse] = useState("Central Warehouse");
  const [priority, setPriority] = useState("Normal");
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState([{ materialName: "Cement OPC 53 Grade", quantity: 100, rate: 420, gstRate: 18 }]);

  const { purchaseOrders: storePOs, fetchPurchaseOrders, createPO, vendors, fetchVendors } = useInventoryStore();

  useEffect(() => {
    fetchPurchaseOrders();
    fetchVendors();
  }, []);

  const purchaseOrders = storePOs && storePOs.length > 0 ? storePOs.map((p: any) => ({
    id: p.id,
    poNo: p.poNo || `PO-2026-${p.id.substring(0, 4).toUpperCase()}`,
    vendor: p.vendor?.name || "N/A",
    site: p.siteName || site,
    warehouse: p.warehouse || "Central Storage",
    date: p.date ? new Date(p.date).toLocaleDateString() : "20 May 2026",
    deliveryDate: p.deliveryDate ? new Date(p.deliveryDate).toLocaleDateString() : "30 May 2026",
    priority: p.priority || "Normal",
    status: (p.status || "Approved") as POStatus,
    createdBy: p.createdBy || "Project Manager",
    remarks: p.remarks || "",
    total: Number(p.total || 0),
    approvalSteps: p.approvalSteps || [
      { role: "Site Engineer", name: "Ramesh Kumar", status: "Approved", date: "2026-05-20" },
      { role: "Project Manager", name: "Amit Shah", status: "Approved", date: "2026-05-20" }
    ],
    items: p.items || []
  })) : mockPurchaseOrders;

  const filtered = purchaseOrders.filter((po: any) => {
    const matchSite = site === "All Sites" || po.site === site;
    const matchSearch = po.poNo.toLowerCase().includes(search.toLowerCase()) ||
      po.vendor.toLowerCase().includes(search.toLowerCase()) ||
      po.site.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || po.status === statusFilter;
    return matchSite && matchSearch && matchStatus;
  });

  const totalValue = filtered.reduce((s: number, p: any) => s + p.total, 0);
  const pendingApproval = purchaseOrders.filter((p: any) => p.status === "Pending Approval").length;
  const urgentCount = purchaseOrders.filter((p: any) => p.priority === "Urgent").length;

  const handleAddItemRow = () => {
    setItems([...items, { materialName: "", quantity: 100, rate: 420, gstRate: 18 }]);
  };

  const handleRemoveItemRow = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: string, val: any) => {
    setItems(items.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedVendorObj = vendors.find((v: any) => v.id === vendorId);
      const itemsFormatted = items.map(it => ({
        materialName: it.materialName,
        quantity: Number(it.quantity),
        rate: Number(it.rate),
        gstRate: Number(it.gstRate),
        amount: Number(it.quantity * it.rate),
        gst: Number(it.quantity * it.rate * (it.gstRate / 100))
      }));
      const totalAmount = itemsFormatted.reduce((s, it) => s + it.amount + it.gst, 0);

      await createPO({
        vendorId,
        poNo: `PO-${Date.now().toString().slice(-6)}`,
        warehouse,
        priority,
        remarks,
        total: totalAmount,
        siteName: site === "All Sites" ? "Main Project Site" : site,
        items: itemsFormatted
      });

      setShowAddModal(false);
      setItems([{ materialName: "Cement OPC 53 Grade", quantity: 100, rate: 420, gstRate: 18 }]);
      setVendorId("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:p-5 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total POs", value: purchaseOrders.length, sub: "FY 2025-26", color: "border-l-primary" },
          { label: "Pending Approval", value: pendingApproval, sub: "Awaiting action", color: "border-l-warning" },
          { label: "Urgent POs", value: urgentCount, sub: "Priority flag", color: "border-l-destructive" },
          { label: "Total Order Value", value: fmtINR(totalValue, true), sub: "Filtered view", color: "border-l-success" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[10px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-black text-foreground mt-1">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-3 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-border bg-muted/20">
          <Search size={13} className="text-muted-foreground shrink-0" />
          <input
            className="flex-1 text-xs bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            placeholder="Search PO number, vendor, site..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={11} className="text-muted-foreground" />
          {(["All", "Draft", "Pending Approval", "Approved", "Partially Received", "Received", "Cancelled"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border whitespace-nowrap ${statusFilter === s ? "bg-orange-500 border-orange-500 text-white" : "border-border text-muted-foreground hover:bg-muted/40"}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 ml-auto whitespace-nowrap">
          <Plus size={13} /> New PO
        </button>
      </div>

      {/* PO list */}
      <div className="space-y-3">
        {filtered.map((po: any) => (
          <POCard
            key={po.id}
            po={po}
            selected={selectedId === po.id}
            onSelect={() => setSelectedId(selectedId === po.id ? null : po.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <Truck size={32} className="mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm font-semibold text-muted-foreground">No purchase orders found</p>
          </div>
        )}
      </div>

      {/* Add PO Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm font-black text-foreground">Create Purchase Order</p>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Select Vendor</label>
                  <select required value={vendorId} onChange={e => setVendorId(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                    <option value="">Choose vendor...</option>
                    {vendors.map((v: any) => <option key={v.id} value={v.id}>{v.name} ({v.category})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Warehouse</label>
                  <input required type="text" value={warehouse} onChange={e => setWarehouse(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Remarks</label>
                  <input type="text" value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" placeholder="e.g. deliver by Friday" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Line Items</label>
                  <button type="button" onClick={handleAddItemRow} className="text-[10px] font-bold text-orange-500 hover:underline">+ Add Row</button>
                </div>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input required type="text" value={item.materialName} onChange={e => handleItemChange(idx, "materialName", e.target.value)} className="flex-1 px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground" placeholder="Material Name" />
                      <input required type="number" value={item.quantity} onChange={e => handleItemChange(idx, "quantity", Number(e.target.value))} className="w-20 px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground" placeholder="Qty" />
                      <input required type="number" value={item.rate} onChange={e => handleItemChange(idx, "rate", Number(e.target.value))} className="w-20 px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground" placeholder="Rate" />
                      <input required type="number" value={item.gstRate} onChange={e => handleItemChange(idx, "gstRate", Number(e.target.value))} className="w-16 px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground" placeholder="GST%" />
                      {items.length > 1 && (
                        <button type="button" onClick={() => handleRemoveItemRow(idx)} className="text-red-500 text-xs px-1">✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-500 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-orange-600 transition-colors active:scale-95 transform mt-4">
                Submit Purchase Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
