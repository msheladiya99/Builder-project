import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from "recharts";
import {
  AlertTriangle, TrendingDown, Package, Search, Filter,
  ScanLine, ArrowUpDown, RefreshCw, CheckCircle2
} from "lucide-react";
import { mockStockItems, categoryStockSummary, fmtINR, Site, stockHealth, MaterialCategory } from "../inventoryData";
import { useInventoryStore } from "../../../store/store";

interface Props { site: Site; }

const healthConfig = {
  Critical:    { color: "text-red-700 dark:text-red-400",     bg: "bg-red-100/80 dark:bg-red-900/30",     bar: "#EF4444", dot: "bg-red-500" },
  Low:         { color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-100/80 dark:bg-orange-900/30", bar: "#F97316", dot: "bg-orange-500" },
  Normal:      { color: "text-green-700 dark:text-green-400",  bg: "bg-green-100/80 dark:bg-green-900/30",  bar: "#22C55E", dot: "bg-green-500" },
  Overstocked: { color: "text-blue-700 dark:text-blue-400",   bg: "bg-blue-100/80 dark:bg-blue-900/30",   bar: "#3B82F6", dot: "bg-blue-500" },
};

function StockBar({ current, min, max }: { current: number; min: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  const minPct = (min / max) * 100;
  const health = stockHealth(current, min, max);
  const color = health === "Critical" ? "bg-red-500" : health === "Low" ? "bg-orange-500" : health === "Normal" ? "bg-green-500" : "bg-blue-500";

  return (
    <div className="relative h-2 bg-muted/40 rounded-full overflow-hidden">
      {/* Min threshold marker */}
      <div className="absolute top-0 bottom-0 w-px bg-amber-500/60 z-10" style={{ left: `${minPct}%` }} />
      {/* Stock level */}
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.max(pct, 2)}%` }} />
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold text-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-foreground">{typeof p.value === "number" && p.value > 1000 ? fmtINR(p.value, true) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function InventoryStockView({ site }: Props) {
  const [search, setSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState<"All" | "Critical" | "Low" | "Normal" | "Overstocked">("All");
  const [catFilter, setCatFilter] = useState<MaterialCategory | "All">("All");
  const [sort, setSort] = useState<"name" | "stock" | "value" | "health">("health");

  const { stock: storeStock, fetchStock } = useInventoryStore();

  useEffect(() => {
    fetchStock();
  }, []);

  const stockItems = storeStock && storeStock.length > 0 ? storeStock.map((s: any) => ({
    id: s.id,
    code: s.code || `SKU-${s.id.substring(0, 4).toUpperCase()}`,
    name: s.materialName,
    barcode: s.barcode || "890123456789",
    category: s.category || "Cement & Concrete",
    warehouse: s.warehouse || "Main Yard",
    site: s.siteName || site,
    currentStock: Number(s.quantity || 0),
    minStock: Number(s.minLevel || 50),
    maxStock: Number(s.maxLevel || 500),
    rate: Number(s.rate || 420),
    value: Number((s.quantity || 0) * (s.rate || 420)),
    unit: s.unit || "bags"
  })) : mockStockItems;

  const filteredItems = stockItems.filter((item: any) => {
    const matchSite = site === "All Sites" || item.site === site;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.barcode.includes(search);
    const health = stockHealth(item.currentStock, item.minStock, item.maxStock);
    const matchHealth = healthFilter === "All" || health === healthFilter;
    const matchCat = catFilter === "All" || item.category === catFilter;
    return matchSite && matchSearch && matchHealth && matchCat;
  }).sort((a: any, b: any) => {
    if (sort === "stock") return a.currentStock - b.currentStock;
    if (sort === "value") return b.value - a.value;
    if (sort === "health") {
      const order = { Critical: 0, Low: 1, Normal: 2, Overstocked: 3 };
      return order[stockHealth(a.currentStock, a.minStock, a.maxStock)] - order[stockHealth(b.currentStock, b.minStock, b.maxStock)];
    }
    return a.name.localeCompare(b.name);
  });

  const criticalCount = stockItems.filter((i: any) => stockHealth(i.currentStock, i.minStock, i.maxStock) === "Critical").length;
  const lowCount = stockItems.filter((i: any) => stockHealth(i.currentStock, i.minStock, i.maxStock) === "Low").length;
  const totalValue = stockItems.reduce((s: number, i: any) => s + i.value, 0);

  // Chart data
  const chartData = categoryStockSummary.map(c => ({
    name: c.category.split(" ")[0],
    value: c.value / 1000,
    items: c.items,
    alerts: c.alerts,
  }));

  return (
    <div className="p-4 lg:p-5 space-y-4">
      {/* Alert banner */}
      {(criticalCount > 0 || lowCount > 0) && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-black text-foreground">
              {criticalCount > 0 && <span className="text-red-600 dark:text-red-400">{criticalCount} Critical</span>}
              {criticalCount > 0 && lowCount > 0 && <span className="text-muted-foreground"> · </span>}
              {lowCount > 0 && <span className="text-orange-600 dark:text-orange-400">{lowCount} Low Stock</span>}
              <span className="text-foreground font-semibold"> alerts — immediate reorder required</span>
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600">
            <TrendingDown size={11} /> Reorder Now
          </button>
        </div>
      )}

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total SKUs", value: stockItems.length, sub: "Unique materials", color: "border-l-primary" },
          { label: "Critical Alerts", value: criticalCount, sub: "Stock = 0 or below 50% min", color: "border-l-destructive" },
          { label: "Low Stock", value: lowCount, sub: "Below reorder level", color: "border-l-warning" },
          { label: "Total Stock Value", value: fmtINR(totalValue, true), sub: "At current rates", color: "border-l-success" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[10px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-black text-foreground mt-1">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category value chart */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm font-bold text-foreground mb-1">Stock Value by Category</p>
          <p className="text-[10px] text-muted-foreground mb-4">In ₹ thousands</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}K`} width={45} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Value (₹K)" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.alerts > 0 ? "#F97316" : "#1B3A6B"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category summary */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm font-bold text-foreground mb-3">Category Breakdown</p>
          <div className="space-y-2">
            {categoryStockSummary.map(cat => {
              const maxVal = Math.max(...categoryStockSummary.map(c => c.value));
              const pct = (cat.value / maxVal) * 100;
              return (
                <div key={cat.category} className="flex items-center gap-3">
                  <div className="w-28 text-[10px] font-semibold text-muted-foreground truncate shrink-0">
                    {cat.category.split(" ")[0]}
                  </div>
                  <div className="flex-1 h-4 bg-muted/30 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full ${cat.alerts > 0 ? "bg-orange-500" : "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-foreground">{fmtINR(cat.value, true)}</span>
                    {cat.alerts > 0 && (
                      <span className="ml-1.5 text-[9px] font-bold text-orange-500">⚠{cat.alerts}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/20">
            <Search size={13} className="text-muted-foreground shrink-0" />
            <input
              className="flex-1 text-xs bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="Search by material name, code, or barcode..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <ScanLine size={12} className="text-muted-foreground" />
          </div>
          <button onClick={() => fetchStock()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted/40 text-foreground bg-card">
            <RefreshCw size={12} /> Sync
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={11} className="text-muted-foreground" />
          {(["All", "Critical", "Low", "Normal", "Overstocked"] as const).map(h => (
            <button key={h} onClick={() => setHealthFilter(h)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${healthFilter === h ? "bg-orange-500 border-orange-500 text-white" : "border-border text-muted-foreground hover:bg-muted/40"}`}>
              {h}
            </button>
          ))}
          <div className="w-px h-4 bg-border" />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value as any)}
            className="px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-background text-foreground">
            <option value="All">All Categories</option>
            {["Cement & Concrete","Steel & Iron","Electrical","Plumbing","Tiles & Flooring","Hardware","Safety Equipment","Tools & Machinery"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="w-px h-4 bg-border" />
          <select value={sort} onChange={e => setSort(e.target.value as any)}
            className="px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-background text-foreground">
            <option value="health">Sort: Alert Priority</option>
            <option value="stock">Sort: Stock Level</option>
            <option value="value">Sort: Value</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Stock table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-black text-muted-foreground">Material</th>
                <th className="text-left px-3 py-3 font-black text-muted-foreground">Category</th>
                <th className="text-left px-3 py-3 font-black text-muted-foreground">Warehouse</th>
                <th className="text-right px-3 py-3 font-black text-muted-foreground">Stock Level</th>
                <th className="text-center px-3 py-3 font-black text-muted-foreground w-36">Progress</th>
                <th className="text-right px-3 py-3 font-black text-muted-foreground">Rate</th>
                <th className="text-right px-3 py-3 font-black text-muted-foreground">Value</th>
                <th className="text-center px-4 py-3 font-black text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredItems.map((item: any) => {
                const health = stockHealth(item.currentStock, item.minStock, item.maxStock);
                const hc = healthConfig[health];
                return (
                  <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-foreground">{item.name}</p>
                      <p className="text-[9px] font-mono text-muted-foreground">{item.code}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[9px] font-semibold text-muted-foreground">{item.category.split(" ")[0]}</span>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-[10px] text-foreground">{item.warehouse}</p>
                      <p className="text-[9px] text-muted-foreground">{item.site}</p>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <p className="font-black text-foreground">{item.currentStock} <span className="text-[9px] font-normal text-muted-foreground">{item.unit}</span></p>
                      <p className="text-[9px] text-muted-foreground">Min: {item.minStock} / Max: {item.maxStock}</p>
                    </td>
                    <td className="px-3 py-3 w-36">
                      <StockBar current={item.currentStock} min={item.minStock} max={item.maxStock} />
                      <div className="flex justify-between mt-1">
                        <span className="text-[8px] text-muted-foreground">0</span>
                        <span className="text-[8px] text-muted-foreground">{item.maxStock}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right text-muted-foreground">{fmtINR(item.rate)}/{item.unit}</td>
                    <td className="px-3 py-3 text-right font-bold text-foreground">{fmtINR(item.value, true)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-full border flex items-center gap-1 justify-center ${hc.bg} ${hc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${hc.dot}`} />
                        {health}
                      </span>
                      {(health === "Critical" || health === "Low") && (
                        <button className="mt-1 text-[8px] font-bold text-orange-500 hover:underline">Reorder →</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-muted/20">
                <td colSpan={6} className="px-4 py-3 text-xs font-bold text-foreground">
                  {filteredItems.length} items shown
                </td>
                <td className="px-3 py-3 text-right text-xs font-black text-foreground">
                  {fmtINR(filteredItems.reduce((s: number, i: any) => s + i.value, 0), true)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
