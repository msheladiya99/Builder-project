import { useState } from "react";
import { Grid3X3, ArrowLeft, Info, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { mockFlats, statusConfig, fmt, type Flat, type FlatStatus } from "./flatData";
import type { FlatView } from "./FlatManagementModule";

interface FlatAvailabilityMapProps {
  onNavigate: (view: FlatView, flatId?: string) => void;
}

const wings = ["A", "B", "C", "D"];
const allStatuses: FlatStatus[] = ["Available", "Booked", "Sold", "Registered", "Cancelled"];

export function FlatAvailabilityMap({ onNavigate }: FlatAvailabilityMapProps) {
  const [activeWing, setActiveWing] = useState("A");
  const [tooltip, setTooltip] = useState<Flat | null>(null);
  const [collapsedFloors, setCollapsedFloors] = useState<Set<string>>(new Set());

  const wingFlats = mockFlats.filter(f => f.wing === activeWing);

  const floors = Array.from(new Set(wingFlats.map(f => f.floor)))
    .sort((a, b) => b - a); // top floor first

  const unitNumbers = [1, 2, 3, 4];

  const getFlat = (floor: number, unit: number) =>
    wingFlats.find(f => f.floor === floor && f.unit === unit);

  const wingStats = wings.map(w => {
    const wf = mockFlats.filter(f => f.wing === w);
    return {
      wing: w,
      total: wf.length,
      available: wf.filter(f => f.status === "Available").length,
      booked: wf.filter(f => f.status === "Booked").length,
      sold: wf.filter(f => f.status === "Sold").length,
      registered: wf.filter(f => f.status === "Registered").length,
    };
  });

  const toggleFloor = (floorKey: string) => {
    setCollapsedFloors(prev => {
      const next = new Set(prev);
      if (next.has(floorKey)) next.delete(floorKey);
      else next.add(floorKey);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => onNavigate("inventory")} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Grid3X3 size={18} className="text-primary" /> Floor Plan Availability Map
          </h1>
          <p className="text-xs text-muted-foreground">Click on any unit to view details</p>
        </div>
      </div>

      {/* Wing summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {wingStats.map(ws => (
          <button
            key={ws.wing}
            onClick={() => setActiveWing(ws.wing)}
            className={`bg-card rounded-xl border p-3 text-left transition-all hover:shadow-md ${
              activeWing === ws.wing ? "border-primary ring-2 ring-primary/20" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                activeWing === ws.wing ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}>
                {ws.wing}
              </div>
              <span className="text-[10px] text-muted-foreground">{ws.total} units</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-success">Available</span>
                <span className="font-bold">{ws.available}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-warning">Booked</span>
                <span className="font-bold">{ws.booked}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-primary">Sold</span>
                <span className="font-bold">{ws.sold}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-purple-500">Registered</span>
                <span className="font-bold">{ws.registered}</span>
              </div>
            </div>
            {/* availability bar */}
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all"
                style={{ width: `${(ws.available / ws.total) * 100}%` }}
              />
            </div>
            <p className="text-[9px] text-muted-foreground mt-1">{Math.round((ws.available / ws.total) * 100)}% available</p>
          </button>
        ))}
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">
        {/* Floor plan grid */}
        <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden">
          {/* Wing header */}
          <div className="bg-[#0A1628] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg">
                {activeWing}
              </div>
              <div>
                <p className="font-bold text-sm">Wing {activeWing} — Shri Hari Group</p>
                <p className="text-[10px] text-white/60">{floors.length} Floors · {unitNumbers.length} Units per Floor</p>
              </div>
            </div>
            <div className="flex gap-1">
              {wings.map(w => (
                <button
                  key={w}
                  onClick={() => setActiveWing(w)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeWing === w ? "bg-white text-[#0A1628]" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Unit column headers */}
          <div className="flex items-center border-b border-border bg-muted/50 px-4 py-2 gap-1">
            <div className="w-16 shrink-0 text-[10px] font-bold text-muted-foreground uppercase">Floor</div>
            {unitNumbers.map(u => (
              <div key={u} className="flex-1 text-center text-[10px] font-bold text-muted-foreground uppercase">
                Unit 0{u}
              </div>
            ))}
            <div className="w-8 shrink-0" />
          </div>

          {/* Floors */}
          <div className="overflow-y-auto max-h-[600px]">
            {floors.map(floor => {
              const floorLabel = floor === 0 ? "G" : String(floor);
              const floorKey = `${activeWing}-${floorLabel}`;
              const collapsed = collapsedFloors.has(floorKey);
              const floorFlats = unitNumbers.map(u => getFlat(floor, u));
              const floorAvailable = floorFlats.filter(f => f?.status === "Available").length;

              return (
                <div key={floorKey} className="border-b border-border/50 last:border-0">
                  {/* Floor row */}
                  <div className="flex items-center px-4 py-2.5 gap-1 hover:bg-muted/20 transition-colors">
                    <div className="w-16 shrink-0">
                      <button
                        onClick={() => toggleFloor(floorKey)}
                        className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
                      >
                        {collapsed ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
                        {floor === 0 ? "GF" : `F${floor}`}
                      </button>
                    </div>
                    {!collapsed && unitNumbers.map(u => {
                      const flat = getFlat(floor, u);
                      if (!flat) return <div key={u} className="flex-1 h-12 rounded-lg bg-muted/30" />;
                      const sc = statusConfig[flat.status];
                      return (
                        <div
                          key={u}
                          className="flex-1 relative"
                          onMouseEnter={() => setTooltip(flat)}
                          onMouseLeave={() => setTooltip(null)}
                        >
                          <button
                            onClick={() => onNavigate("details", flat.id)}
                            className={`w-full h-12 rounded-lg border-2 transition-all hover:scale-105 hover:shadow-md hover:z-10 relative flex flex-col items-center justify-center gap-0.5 ${sc.bg} ${sc.border} ${sc.color}`}
                          >
                            <span className="text-[9px] font-bold leading-none">{flat.bhk}</span>
                            <span className="text-[8px] opacity-70 leading-none">{flat.carpetArea}sqft</span>
                          </button>
                        </div>
                      );
                    })}
                    {collapsed && (
                      <div className="flex-1 h-8 flex items-center gap-1 px-2">
                        {allStatuses.map(s => {
                          const count = floorFlats.filter(f => f?.status === s).length;
                          if (!count) return null;
                          return (
                            <span key={s} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusConfig[s].bg} ${statusConfig[s].color} border ${statusConfig[s].border}`}>
                              {count} {s}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <div className="w-8 shrink-0 text-[9px] text-center text-muted-foreground">
                      {floorAvailable > 0 && (
                        <span className="text-success font-bold">{floorAvailable}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Legend + Tooltip */}
        <div className="lg:w-64 space-y-4">
          {/* Legend */}
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Status Legend</p>
            <div className="space-y-2">
              {allStatuses.map(s => {
                const sc = statusConfig[s];
                const count = mockFlats.filter(f => f.wing === activeWing && f.status === s).length;
                return (
                  <div key={s} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border-2 ${sc.bg} ${sc.border}`} />
                      <span className="text-xs font-medium">{s}</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Availability bar */}
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground mb-2">Wing {activeWing} Availability</p>
              <div className="h-3 rounded-full overflow-hidden bg-muted flex">
                {allStatuses.map(s => {
                  const count = mockFlats.filter(f => f.wing === activeWing && f.status === s).length;
                  const pct = (count / wingFlats.length) * 100;
                  return (
                    <div
                      key={s}
                      className={`h-full ${statusConfig[s].dot} transition-all`}
                      style={{ width: `${pct}%` }}
                      title={`${s}: ${count} units`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Tooltip / flat info */}
          {tooltip ? (
            <div className="bg-card rounded-xl border border-primary/30 p-4 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">{tooltip.unitNo}</p>
                  <p className="text-[10px] text-muted-foreground">Wing {tooltip.wing} · {tooltip.floorLabel === "G" ? "Ground Floor" : `Floor ${tooltip.floorLabel}`}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusConfig[tooltip.status].bg} ${statusConfig[tooltip.status].color} ${statusConfig[tooltip.status].border}`}>
                  {tooltip.status}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">BHK</span><span className="font-semibold">{tooltip.bhk}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Carpet Area</span><span className="font-semibold">{tooltip.carpetArea} sq.ft</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Facing</span><span className="font-semibold">{tooltip.facing}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Base Price</span><span className="font-semibold text-primary">{fmt(tooltip.basePrice)}</span></div>
                {tooltip.ownerName && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Owner</span><span className="font-semibold truncate ml-2 text-right">{tooltip.ownerName}</span></div>
                )}
              </div>
              <button
                onClick={() => onNavigate("details", tooltip.id)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-semibold hover:bg-primary hover:text-white transition-all"
              >
                <Eye size={12} /> View Details
              </button>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center text-center gap-2 text-muted-foreground">
              <Info size={18} />
              <p className="text-xs">Hover over a unit cell to see its details here</p>
            </div>
          )}

          {/* Floor quick jump */}
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Jump</p>
            <div className="grid grid-cols-5 gap-1">
              {floors.map(floor => {
                const floorLabel = floor === 0 ? "G" : String(floor);
                const floorFlats = wingFlats.filter(f => f.floor === floor);
                const hasAvail = floorFlats.some(f => f.status === "Available");
                return (
                  <button
                    key={floor}
                    onClick={() => {
                      const el = document.getElementById(`floor-${activeWing}-${floorLabel}`);
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`text-[10px] font-bold py-1 rounded-md transition-all ${
                      hasAvail
                        ? "bg-success/10 text-success border border-success/30 hover:bg-success hover:text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {floorLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
