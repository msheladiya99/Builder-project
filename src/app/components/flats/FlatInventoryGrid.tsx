import { useState, useMemo } from "react";
import {
  Search, Filter, Grid3X3, List, ArrowUpDown, ChevronDown,
  Home, TrendingUp, CheckCircle, XCircle, BookOpen, Stamp,
  SlidersHorizontal, LayoutGrid, X, ArrowUp, ArrowDown
} from "lucide-react";
import { mockFlats, statusConfig, fmt, type Flat, type FlatStatus } from "./flatData";
import type { FlatView } from "./FlatManagementModule";

interface FlatInventoryGridProps {
  onNavigate: (view: FlatView, flatId?: string) => void;
}

type SortKey = "unitNo" | "floor" | "basePrice" | "superArea";
type ViewMode = "grid" | "list";

const wings = ["All", "A", "B", "C", "D"];
const bhkOptions = ["All", "1BHK", "2BHK", "3BHK"];
const statusOptions: (FlatStatus | "All")[] = ["All", "Available", "Booked", "Sold", "Registered", "Cancelled"];
const floorOptions = ["All", "G", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];

export function FlatInventoryGrid({ onNavigate }: FlatInventoryGridProps) {
  const [search, setSearch] = useState("");
  const [wingFilter, setWingFilter] = useState("All");
  const [bhkFilter, setBhkFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<FlatStatus | "All">("All");
  const [floorFilter, setFloorFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("unitNo");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const stats = useMemo(() => ({
    total: mockFlats.length,
    available: mockFlats.filter(f => f.status === "Available").length,
    booked: mockFlats.filter(f => f.status === "Booked").length,
    sold: mockFlats.filter(f => f.status === "Sold").length,
    registered: mockFlats.filter(f => f.status === "Registered").length,
    cancelled: mockFlats.filter(f => f.status === "Cancelled").length,
  }), []);

  const filtered = useMemo(() => {
    let result = mockFlats.filter(f => {
      if (wingFilter !== "All" && f.wing !== wingFilter) return false;
      if (bhkFilter !== "All" && f.bhk !== bhkFilter) return false;
      if (statusFilter !== "All" && f.status !== statusFilter) return false;
      if (floorFilter !== "All" && f.floorLabel !== floorFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!f.unitNo.toLowerCase().includes(q) && !f.ownerName?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    result.sort((a, b) => {
      let va: number | string = a[sortKey];
      let vb: number | string = b[sortKey];
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return result;
  }, [search, wingFilter, bhkFilter, statusFilter, floorFilter, sortKey, sortDir]);

  const paginated = filtered.slice(0, page * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const activeFilterCount = [wingFilter, bhkFilter, statusFilter, floorFilter].filter(v => v !== "All").length;

  const kpiCards = [
    { label: "Total Units", value: stats.total, icon: Home, color: "text-primary", bg: "bg-primary/10" },
    { label: "Available", value: stats.available, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    { label: "Booked", value: stats.booked, icon: BookOpen, color: "text-warning", bg: "bg-warning/10" },
    { label: "Sold", value: stats.sold, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    { label: "Registered", value: stats.registered, icon: Stamp, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {kpiCards.map(k => (
          <button
            key={k.label}
            onClick={() => setStatusFilter(k.label === "Total Units" ? "All" : k.label as FlatStatus)}
            className={`bg-card rounded-xl border p-3 text-left hover:shadow-md transition-all group ${
              statusFilter === k.label || (k.label === "Total Units" && statusFilter === "All")
                ? "border-primary ring-1 ring-primary/30"
                : "border-border"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg ${k.bg} ${k.color} flex items-center justify-center mb-2 transition-transform group-hover:scale-110`}>
              <k.icon size={15} />
            </div>
            <p className="text-lg font-bold">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.label}</p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-card rounded-xl border border-border p-3 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by unit no. or owner..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Wing quick filters */}
        <div className="flex items-center gap-1">
          {wings.map(w => (
            <button
              key={w}
              onClick={() => { setWingFilter(w); setPage(1); }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                wingFilter === w
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {w === "All" ? "All Wings" : `Wing ${w}`}
            </button>
          ))}
        </div>

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowFilters(s => !s)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            showFilters || activeFilterCount > 0
              ? "bg-primary/10 border-primary/30 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <SlidersHorizontal size={13} />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white text-[10px] rounded-full px-1.5 py-0.5 leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort */}
        <select
          value={sortKey}
          onChange={e => { setSortKey(e.target.value as SortKey); setPage(1); }}
          className="px-2 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none"
        >
          <option value="unitNo">Sort: Unit No.</option>
          <option value="floor">Sort: Floor</option>
          <option value="basePrice">Sort: Price</option>
          <option value="superArea">Sort: Area</option>
        </select>
        <button
          onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
          className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          {sortDir === "asc" ? <ArrowUp size={13} className="text-muted-foreground" /> : <ArrowDown size={13} className="text-muted-foreground" />}
        </button>

        {/* View toggle */}
        <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Advanced filters panel */}
      {showFilters && (
        <div className="bg-card rounded-xl border border-border p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value as FlatStatus | "All"); setPage(1); }}
              className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none"
            >
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">BHK Type</label>
            <select
              value={bhkFilter}
              onChange={e => { setBhkFilter(e.target.value); setPage(1); }}
              className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none"
            >
              {bhkOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Floor</label>
            <select
              value={floorFilter}
              onChange={e => { setFloorFilter(e.target.value); setPage(1); }}
              className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none"
            >
              {floorOptions.map(f => <option key={f} value={f}>{f === "All" ? "All Floors" : f === "G" ? "Ground Floor" : `Floor ${f}`}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setWingFilter("All"); setBhkFilter("All"); setStatusFilter("All"); setFloorFilter("All"); setSearch(""); setPage(1); }}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{Math.min(paginated.length, filtered.length)}</span> of <span className="font-semibold text-foreground">{filtered.length}</span> units
        </p>
        <button
          onClick={() => onNavigate("availability-map")}
          className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
        >
          <Grid3X3 size={12} />
          View Floor Plan Map
        </button>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {paginated.map(flat => (
            <FlatCard key={flat.id} flat={flat} onNavigate={onNavigate} />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {[
                    { label: "Unit No.", key: "unitNo" },
                    { label: "Wing", key: null },
                    { label: "Floor", key: "floor" },
                    { label: "BHK", key: null },
                    { label: "Area (sq.ft)", key: "superArea" },
                    { label: "Price", key: "basePrice" },
                    { label: "Status", key: null },
                    { label: "Owner", key: null },
                    { label: "", key: null },
                  ].map(col => (
                    <th
                      key={col.label}
                      className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
                      onClick={() => col.key && handleSort(col.key as SortKey)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {col.key && <ArrowUpDown size={10} className="opacity-50" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((flat, i) => {
                  const sc = statusConfig[flat.status];
                  return (
                    <tr
                      key={flat.id}
                      className={`border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                      onClick={() => onNavigate("details", flat.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          <span className="text-sm font-semibold">{flat.unitNo}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">Wing {flat.wing}</td>
                      <td className="px-4 py-3 text-sm">{flat.floorLabel === "G" ? "Ground" : `Floor ${flat.floorLabel}`}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {flat.bhk}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{flat.superArea} sq.ft</td>
                      <td className="px-4 py-3 text-sm font-semibold">{fmt(flat.basePrice)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color} ${sc.border}`}>
                          {flat.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{flat.ownerName || "—"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={e => { e.stopPropagation(); onNavigate("details", flat.id); }}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Load more */}
      {paginated.length < filtered.length && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            Load more ({filtered.length - paginated.length} remaining)
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Home size={24} className="text-muted-foreground" />
          </div>
          <p className="font-semibold mb-1">No units found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}

function FlatCard({ flat, onNavigate }: { flat: Flat; onNavigate: (v: FlatView, id?: string) => void }) {
  const sc = statusConfig[flat.status];
  return (
    <div
      onClick={() => onNavigate("details", flat.id)}
      className="bg-card rounded-xl border border-border hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group overflow-hidden"
    >
      {/* Status stripe */}
      <div className={`h-1 w-full ${sc.dot}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-bold group-hover:text-primary transition-colors">{flat.unitNo}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {flat.floorLabel === "G" ? "Ground Floor" : `Floor ${flat.floorLabel}`} · Wing {flat.wing}
            </p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color} ${sc.border}`}>
            {flat.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3">
          <div>
            <p className="text-[10px] text-muted-foreground">BHK</p>
            <p className="text-xs font-semibold">{flat.bhk}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Carpet Area</p>
            <p className="text-xs font-semibold">{flat.carpetArea} sq.ft</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Super Built-up</p>
            <p className="text-xs font-semibold">{flat.superArea} sq.ft</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Facing</p>
            <p className="text-xs font-semibold">{flat.facing}</p>
          </div>
        </div>

        <div className="border-t border-border/60 pt-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Base Price</p>
            <p className="text-sm font-bold text-primary">{fmt(flat.basePrice)}</p>
          </div>
          {flat.ownerName && (
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Owner</p>
              <p className="text-[10px] font-semibold truncate max-w-[90px]">{flat.ownerName}</p>
            </div>
          )}
          {!flat.ownerName && flat.status === "Available" && (
            <button
              onClick={e => { e.stopPropagation(); onNavigate("booking", flat.id); }}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-success/10 text-success border border-success/30 hover:bg-success hover:text-white transition-all"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
