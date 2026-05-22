import { useState, useEffect } from "react";
import {
  Star, Phone, Mail, MapPin, Search, Filter, Plus,
  CheckCircle2, XCircle, Clock, AlertCircle, TrendingUp, Package, ChevronRight, Award, X
} from "lucide-react";
import { mockVendors, fmtINR, Site, VendorStatus, MaterialCategory } from "../inventoryData";
import { useInventoryStore } from "../../../store/store";

interface Props { site: Site; }

const statusConfig: Record<VendorStatus, { color: string; bg: string; icon: any }> = {
  Active:      { color: "text-green-700 dark:text-green-400",  bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle2 },
  Blacklisted: { color: "text-red-700 dark:text-red-400",     bg: "bg-red-500/10 border-red-500/20",    icon: XCircle },
  "On Hold":   { color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  New:         { color: "text-blue-700 dark:text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20",  icon: AlertCircle },
};

const categoryColors: Record<string, string> = {
  "Cement & Concrete": "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  "Steel & Iron":      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  "Electrical":        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Plumbing":          "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Tiles & Flooring":  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Hardware":          "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Safety Equipment":  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Tools & Machinery": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10} className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"} />
      ))}
      <span className="text-[10px] font-bold text-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function PerformanceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] font-bold text-foreground w-8 text-right">{value}%</span>
    </div>
  );
}

export function VendorManagementView({ site }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VendorStatus | "All">("All");
  const [catFilter, setCatFilter] = useState<MaterialCategory | "All">("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    gstin: "",
    category: "Cement & Concrete"
  });

  const { vendors: storeVendors, fetchVendors, addVendor } = useInventoryStore();

  useEffect(() => {
    fetchVendors();
  }, []);

  const vendors = storeVendors && storeVendors.length > 0 ? storeVendors.map((v: any) => ({
    id: v.id,
    code: v.code || `VND-${v.id.substring(0, 4).toUpperCase()}`,
    name: v.name,
    contactPerson: v.contact || "N/A",
    phone: v.phone || "N/A",
    email: v.email || "N/A",
    city: v.address?.split(",")[0] || "N/A",
    address: v.address || "N/A",
    gstin: v.gstin || "N/A",
    category: v.category || "Cement & Concrete",
    rating: Number(v.rating || 4.5),
    totalOrders: Number(v.totalOrders || 0),
    totalValue: Number(v.totalValue || 0),
    onTimeDelivery: Number(v.onTimeDelivery || 95),
    qualityScore: Number(v.qualityScore || 90),
    paymentTerms: v.paymentTerms || "Net 30",
    creditLimit: Number(v.creditLimit || 500000),
    registeredOn: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "20 May 2026",
    status: (v.status || "Active") as VendorStatus,
    materials: v.materials || ["Cement", "Aggregates"],
  })) : mockVendors;

  const filtered = vendors.filter((v: any) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || v.status === statusFilter;
    const matchCat = catFilter === "All" || v.category === catFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const selectedVendor = vendors.find((v: any) => v.id === selected);

  // Summary stats
  const activeCount = vendors.filter((v: any) => v.status === "Active").length;
  const totalValue = vendors.reduce((s: number, v: any) => s + v.totalValue, 0);
  const avgRating = vendors.length > 0 ? vendors.reduce((s: number, v: any) => s + v.rating, 0) / vendors.length : 0;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVendor({
        name: newVendor.name,
        contact: newVendor.contact,
        phone: newVendor.phone,
        email: newVendor.email,
        address: newVendor.address,
        gstin: newVendor.gstin,
        category: newVendor.category
      });
      setShowAddModal(false);
      setNewVendor({
        name: "",
        contact: "",
        phone: "",
        email: "",
        address: "",
        gstin: "",
        category: "Cement & Concrete"
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:p-5 space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Vendors", value: vendors.length, sub: `${activeCount} active`, icon: Users2, color: "border-l-primary" },
          { label: "Total Procurement", value: fmtINR(totalValue, true), sub: "All-time orders", icon: TrendingUp, color: "border-l-success" },
          { label: "Avg. Rating", value: avgRating.toFixed(1) + " / 5", sub: "Across all vendors", icon: Star, color: "border-l-warning" },
          { label: "Blacklisted", value: vendors.filter((v: any) => v.status === "Blacklisted").length, sub: "Zero tolerance", icon: XCircle, color: "border-l-destructive" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[10px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-black text-foreground mt-1">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 lg:items-start flex-col lg:flex-row">
        {/* Left: vendor list */}
        <div className="flex-1 space-y-3">
          {/* Filters */}
          <div className="bg-card border border-border rounded-2xl p-3 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/20">
                <Search size={13} className="text-muted-foreground" />
                <input
                  className="flex-1 text-xs bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  placeholder="Search vendor name, code, contact..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors">
                <Plus size={13} /> Add Vendor
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Filter size={11} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-semibold">Filter:</span>
              </div>
              {(["All", "Active", "New", "On Hold"] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${statusFilter === s ? "bg-orange-500 border-orange-500 text-white" : "border-border text-muted-foreground hover:bg-muted/40"}`}>
                  {s}
                </button>
              ))}
              <div className="w-px h-5 bg-border self-center" />
              <select
                value={catFilter}
                onChange={e => setCatFilter(e.target.value as any)}
                className="px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-background text-foreground"
              >
                <option value="All">All Categories</option>
                {["Cement & Concrete","Steel & Iron","Electrical","Plumbing","Tiles & Flooring","Hardware"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vendor cards grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {filtered.map((vendor: any) => {
              const sc = statusConfig[vendor.status as VendorStatus] || statusConfig.Active;
              const StatusIcon = sc.icon;
              const isSelected = selected === vendor.id;
              return (
                <div
                  key={vendor.id}
                  onClick={() => setSelected(isSelected ? null : vendor.id)}
                  className={`bg-card border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? "border-orange-500 shadow-orange-500/10 shadow-lg" : "border-border"}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold text-muted-foreground font-mono">{vendor.code}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${sc.bg} ${sc.color} flex items-center gap-1`}>
                          <StatusIcon size={8} />
                          {vendor.status}
                        </span>
                      </div>
                      <p className="text-sm font-black text-foreground leading-tight">{vendor.name}</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <StarRating rating={vendor.rating} />
                    </div>
                  </div>

                  {/* Category */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${categoryColors[vendor.category] ?? "bg-muted text-muted-foreground"}`}>
                    {vendor.category}
                  </span>

                  {/* Contact */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Phone size={10} /> <span>{vendor.contactPerson} · {vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <MapPin size={10} /> <span className="truncate">{vendor.city}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-foreground">{vendor.totalOrders}</p>
                      <p className="text-[9px] text-muted-foreground">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-foreground">{fmtINR(vendor.totalValue, true)}</p>
                      <p className="text-[9px] text-muted-foreground">Value</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-foreground">{vendor.onTimeDelivery}%</p>
                      <p className="text-[9px] text-muted-foreground">On-time</p>
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {vendor.materials.slice(0, 2).map((m: string) => (
                      <span key={m} className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted/40 text-muted-foreground border border-border/60">{m}</span>
                    ))}
                    {vendor.materials.length > 2 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted/40 text-muted-foreground border border-border/60">+{vendor.materials.length - 2} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-end mt-2">
                    <ChevronRight size={12} className={`transition-transform ${isSelected ? "rotate-90 text-orange-500" : "text-muted-foreground/40"}`} />
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="bg-card border border-border rounded-2xl p-10 text-center">
              <Package size={32} className="mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm font-semibold text-muted-foreground">No vendors found</p>
            </div>
          )}
        </div>

        {/* Right: vendor detail panel */}
        {selectedVendor && (
          <div className="lg:w-80 bg-card border border-border rounded-2xl overflow-hidden shrink-0">
            {/* Header */}
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-b border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] font-bold text-muted-foreground font-mono">{selectedVendor.code}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${(statusConfig[selectedVendor.status as VendorStatus] || statusConfig.Active).bg} ${(statusConfig[selectedVendor.status as VendorStatus] || statusConfig.Active).color}`}>
                  {selectedVendor.status}
                </span>
              </div>
              <p className="text-sm font-black text-foreground mb-2">{selectedVendor.name}</p>
              <StarRating rating={selectedVendor.rating} />
            </div>

            <div className="p-4 space-y-4">
              {/* Contact */}
              <div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-2">Contact Details</p>
                <div className="space-y-1.5">
                  {[
                    { icon: Phone, label: selectedVendor.contactPerson, sub: selectedVendor.phone },
                    { icon: Mail, label: selectedVendor.email },
                    { icon: MapPin, label: selectedVendor.address },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <row.icon size={11} className="text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-foreground">{row.label}</p>
                        {row.sub && <p className="text-[10px] text-muted-foreground">{row.sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GST & Terms */}
              <div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-2">Commercial</p>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">GSTIN</span><span className="font-mono font-bold text-foreground">{selectedVendor.gstin}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment Terms</span><span className="font-bold text-foreground">{selectedVendor.paymentTerms}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Credit Limit</span><span className="font-bold text-foreground">{fmtINR(selectedVendor.creditLimit, true)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Registered On</span><span className="font-bold text-foreground">{selectedVendor.registeredOn}</span></div>
                </div>
              </div>

              {/* Performance */}
              <div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-2">
                  <Award size={9} className="inline mr-1" />Performance Metrics
                </p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">On-Time Delivery</span>
                    </div>
                    <PerformanceBar value={selectedVendor.onTimeDelivery} color={selectedVendor.onTimeDelivery >= 90 ? "bg-green-500" : selectedVendor.onTimeDelivery >= 75 ? "bg-yellow-500" : "bg-red-500"} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">Quality Score</span>
                    </div>
                    <PerformanceBar value={selectedVendor.qualityScore} color={selectedVendor.qualityScore >= 90 ? "bg-green-500" : "bg-yellow-500"} />
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-2">Materials Supplied</p>
                <div className="flex flex-wrap gap-1">
                  {selectedVendor.materials.map((m: string) => (
                    <span key={m} className="text-[9px] px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm font-black text-foreground">Add New Vendor</p>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Vendor Name</label>
                <input required type="text" value={newVendor.name} onChange={e => setNewVendor({ ...newVendor, name: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Category</label>
                  <select value={newVendor.category} onChange={e => setNewVendor({ ...newVendor, category: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                    {["Cement & Concrete","Steel & Iron","Electrical","Plumbing","Tiles & Flooring","Hardware"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Contact Person</label>
                  <input required type="text" value={newVendor.contact} onChange={e => setNewVendor({ ...newVendor, contact: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Phone Number</label>
                  <input required type="tel" value={newVendor.phone} onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Email Address</label>
                  <input required type="email" value={newVendor.email} onChange={e => setNewVendor({ ...newVendor, email: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">GSTIN Number</label>
                <input required type="text" value={newVendor.gstin} onChange={e => setNewVendor({ ...newVendor, gstin: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" placeholder="e.g. 27AABCS1234K1Z5" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Street Address</label>
                <input required type="text" value={newVendor.address} onChange={e => setNewVendor({ ...newVendor, address: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" placeholder="e.g. S.G. Highway, Ahmedabad" />
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-orange-600 transition-colors active:scale-95 transform">
                Create Vendor
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Mini icon component
function Users2({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
