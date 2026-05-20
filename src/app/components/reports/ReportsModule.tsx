import { useState } from "react";
import { Moon, Sun, BarChart2, Receipt, AlertCircle, Package, Users, TrendingUp, Banknote } from "lucide-react";
import { ReportToolbar } from "./ReportToolbar";
import { SalesReportView }     from "./views/SalesReportView";
import { GSTReportView }       from "./views/GSTReportView";
import { OutstandingDuesView } from "./views/OutstandingDuesView";
import { MaterialReportView }  from "./views/MaterialReportView";
import { LabourReportView }    from "./views/LabourReportView";
import { ProfitAnalysisView }  from "./views/ProfitAnalysisView";
import { CashFlowView }        from "./views/CashFlowView";
import type { DateRange, TowerFilter } from "./reportsData";
import { type ReportId } from "./reportsData";

interface ReportDef {
  id: ReportId;
  label: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

const REPORTS: ReportDef[] = [
  { id: "sales",       label: "Sales Report",      icon: <BarChart2 size={16} />,   color: "#1B3A6B", badge: "Live" },
  { id: "gst",         label: "GST Report",        icon: <Receipt size={16} />,     color: "#7C3AED" },
  { id: "outstanding", label: "Outstanding Dues",  icon: <AlertCircle size={16} />, color: "#EF4444", badge: "4 Due" },
  { id: "material",    label: "Material Report",   icon: <Package size={16} />,     color: "#C9922A" },
  { id: "labour",      label: "Labour Report",     icon: <Users size={16} />,       color: "#0D9488" },
  { id: "profit",      label: "Profit Analysis",   icon: <TrendingUp size={16} />,  color: "#16A34A" },
  { id: "cashflow",    label: "Cash Flow",         icon: <Banknote size={16} />,    color: "#F97316" },
];

interface Props {
  isDark: boolean;
  onDarkToggle: () => void;
}

export function ReportsModule({ isDark, onDarkToggle }: Props) {
  const [activeReport, setActiveReport] = useState<ReportId>("sales");
  const [dateRange, setDateRange]       = useState<DateRange>("month");
  const [tower, setTower]               = useState<TowerFilter>("All");
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  const current = REPORTS.find(r => r.id === activeReport)!;

  function renderView() {
    switch (activeReport) {
      case "sales":       return <SalesReportView />;
      case "gst":         return <GSTReportView />;
      case "outstanding": return <OutstandingDuesView />;
      case "material":    return <MaterialReportView />;
      case "labour":      return <LabourReportView />;
      case "profit":      return <ProfitAnalysisView />;
      case "cashflow":    return <CashFlowView />;
    }
  }

  return (
    <div className="flex h-full overflow-hidden bg-background">

      {/* ── Sidebar (desktop always visible, mobile slide-in) ── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`
          shrink-0 flex flex-col z-50 transition-transform duration-200
          fixed inset-y-0 left-0 lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ width: 220, background: "#0F1C2E" }}
      >
        {/* Sidebar header */}
        <div className="px-4 pt-5 pb-4 border-b border-white/8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-black text-sm leading-tight">Analytics</p>
              <p className="text-white/40 text-[10px] mt-0.5">Shri Hari Group</p>
            </div>
            <button onClick={onDarkToggle} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>

        {/* Report nav */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest px-2 mb-2">Reports</p>
          {REPORTS.map(r => {
            const isActive = activeReport === r.id;
            return (
              <button
                key={r.id}
                onClick={() => { setActiveReport(r.id); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                style={isActive
                  ? { background: r.color, color: "#fff" }
                  : { color: "rgba(255,255,255,0.5)" }
                }
              >
                <span style={{ color: isActive ? "#fff" : r.color }}>{r.icon}</span>
                <span className="text-xs font-bold flex-1">{r.label}</span>
                {r.badge && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full" style={{ background: isActive ? "rgba(255,255,255,0.2)" : r.color, color: "#fff" }}>
                    {r.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-white/8">
          <p className="text-[9px] text-white/25 text-center">Shri Hari Group ERP · v2.0</p>
        </div>
      </div>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top header bar — Power BI style */}
        <div className="shrink-0 border-b border-border px-4 py-3 flex items-center gap-3" style={{ background: "var(--card)" }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="lg:hidden flex flex-col gap-1 w-7 h-7 items-center justify-center"
          >
            <div className="w-5 h-0.5 bg-foreground rounded" />
            <div className="w-5 h-0.5 bg-foreground rounded" />
            <div className="w-5 h-0.5 bg-foreground rounded" />
          </button>

          {/* Active report info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: current.color }}>
              {current.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-foreground leading-tight truncate">{current.label}</p>
              <p className="text-[10px] text-muted-foreground">Shri Hari Group · All Projects</p>
            </div>
          </div>

          {/* Spacer + period indicator */}
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground">Live Data</span>
          </div>
        </div>

        {/* Toolbar */}
        <ReportToolbar
          dateRange={dateRange}
          setDateRange={setDateRange}
          tower={tower}
          setTower={setTower}
          reportTitle={current.label}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 max-w-2xl mx-auto pb-8">
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
}
