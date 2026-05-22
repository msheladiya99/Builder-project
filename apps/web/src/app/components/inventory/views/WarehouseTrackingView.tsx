import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Warehouse, AlertTriangle, Package, User, Phone,
  Calendar, TrendingUp, MapPin, ChevronRight, ClipboardList
} from "lucide-react";
import { mockWarehouses, mockStockItems, fmtINR, Site, stockHealth } from "../inventoryData";

interface Props { site: Site; }

function CapacityRing({ pct }: { pct: number }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct > 90 ? "#EF4444" : pct > 70 ? "#F97316" : "#22C55E";
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width={80} height={80} className="-rotate-90">
        <circle cx={40} cy={40} r={r} fill="none" stroke="var(--muted)" strokeWidth={8} opacity={0.3} />
        <circle
          cx={40} cy={40} r={r} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-black text-foreground">{Math.round(pct)}%</span>
        <span className="text-[8px] text-muted-foreground">used</span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold mb-1 text-foreground">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-foreground">{fmtINR(p.value, true)}</span>
        </div>
      ))}
    </div>
  );
}

export function WarehouseTrackingView({ site }: Props) {
  const [selectedWH, setSelectedWH] = useState<string | null>("WH01");

  const filtered = mockWarehouses.filter(wh =>
    site === "All Sites" || wh.site === site || wh.site === "All Sites"
  );

  const selected = mockWarehouses.find(w => w.id === selectedWH);
  const selectedItems = selected
    ? mockStockItems.filter(i => i.warehouse === selected.name)
    : [];

  const totalCapacity = filtered.reduce((s, w) => s + w.capacity, 0);
  const totalUtilized = filtered.reduce((s, w) => s + w.utilized, 0);
  const totalAlerts = filtered.reduce((s, w) => s + w.stockAlerts, 0);
  const totalValue = filtered.reduce((s, w) => s + w.totalValue, 0);

  // Bar chart: capacity vs utilized per warehouse
  const chartData = filtered.map(w => ({
    name: w.name.replace(" Store", "").replace("Site ", ""),
    Capacity: w.capacity,
    Utilized: w.utilized,
    pct: Math.round((w.utilized / w.capacity) * 100),
  }));

  return (
    <div className="p-4 lg:p-5 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Warehouses", value: filtered.length, sub: "Active locations", color: "border-l-primary" },
          { label: "Overall Utilization", value: `${Math.round((totalUtilized / totalCapacity) * 100)}%`, sub: `${totalUtilized}/${totalCapacity} sqft`, color: "border-l-warning" },
          { label: "Stock Alerts", value: totalAlerts, sub: "Across all warehouses", color: totalAlerts > 0 ? "border-l-destructive" : "border-l-success" },
          { label: "Total Stock Value", value: fmtINR(totalValue, true), sub: "Combined inventory", color: "border-l-success" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[10px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-black text-foreground mt-1">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Utilization chart */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm font-bold text-foreground mb-1">Warehouse Capacity & Utilization</p>
        <p className="text-[10px] text-muted-foreground mb-4">Storage area in sqft</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barGap={4} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Capacity" fill="#1B3A6B" opacity={0.3} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Utilized" fill="#F97316" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Warehouse cards */}
        <div className="flex-1 space-y-3">
          {filtered.map(wh => {
            const pct = (wh.utilized / wh.capacity) * 100;
            const isSelected = selectedWH === wh.id;
            const capColor = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-orange-500" : "bg-green-500";
            return (
              <div
                key={wh.id}
                onClick={() => setSelectedWH(isSelected ? null : wh.id)}
                className={`bg-card border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? "border-orange-500 shadow-orange-500/10 shadow-lg" : "border-border"}`}
              >
                <div className="flex items-start gap-4">
                  <CapacityRing pct={pct} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-black text-foreground">{wh.name}</p>
                          <span className="text-[9px] font-bold text-muted-foreground font-mono">{wh.code}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <MapPin size={9} />
                          <span>{wh.site}</span>
                        </div>
                      </div>
                      {wh.stockAlerts > 0 && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                          <AlertTriangle size={8} /> {wh.stockAlerts} alerts
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 grid grid-cols-3 gap-2">
                      <div className="bg-muted/20 rounded-xl p-2 text-center">
                        <p className="text-[10px] font-black text-foreground">{wh.totalItems}</p>
                        <p className="text-[8px] text-muted-foreground">SKUs</p>
                      </div>
                      <div className="bg-muted/20 rounded-xl p-2 text-center">
                        <p className="text-[10px] font-black text-foreground">{fmtINR(wh.totalValue, true)}</p>
                        <p className="text-[8px] text-muted-foreground">Value</p>
                      </div>
                      <div className="bg-muted/20 rounded-xl p-2 text-center">
                        <p className="text-[10px] font-black text-foreground">{wh.utilized}/{wh.capacity}</p>
                        <p className="text-[8px] text-muted-foreground">sqft</p>
                      </div>
                    </div>

                    <div className="mt-2.5 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${capColor} transition-all`} style={{ width: `${pct}%` }} />
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-[9px] text-muted-foreground">
                      <User size={9} /> {wh.incharge}
                      <span>·</span>
                      <Phone size={9} /> {wh.phone}
                      <span>·</span>
                      <Calendar size={9} /> Audit: {wh.lastAudit}
                    </div>
                  </div>

                  <ChevronRight size={13} className={`text-muted-foreground/40 transition-transform mt-1 shrink-0 ${isSelected ? "rotate-90 text-orange-500" : ""}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right panel: warehouse stock detail */}
        {selected && selectedItems.length > 0 && (
          <div className="lg:w-80 bg-card border border-border rounded-2xl overflow-hidden shrink-0">
            <div className="px-4 py-3 border-b border-border bg-orange-500/5">
              <p className="text-xs font-black text-foreground">{selected.name}</p>
              <p className="text-[10px] text-muted-foreground">Stock ledger — {selectedItems.length} SKUs</p>
            </div>
            <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
              {selectedItems.map(item => {
                const health = stockHealth(item.currentStock, item.minStock, item.maxStock);
                const dot = health === "Critical" ? "bg-red-500" : health === "Low" ? "bg-orange-500" : "bg-green-500";
                return (
                  <div key={item.id} className="px-4 py-3 flex items-center justify-between hover:bg-muted/10">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-foreground truncate">{item.name}</p>
                        <p className="text-[9px] text-muted-foreground">{item.code}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-[10px] font-black text-foreground">{item.currentStock} {item.unit}</p>
                      <p className="text-[9px] text-muted-foreground">{fmtINR(item.value, true)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 border-t border-border bg-muted/20">
              <div className="flex justify-between text-[10px]">
                <span className="font-bold text-foreground">Total Value</span>
                <span className="font-black text-foreground">{fmtINR(selectedItems.reduce((s, i) => s + i.value, 0), true)}</span>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-border">
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition-colors">
                <ClipboardList size={12} /> Conduct Audit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
