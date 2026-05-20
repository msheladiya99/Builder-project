import { Download, FileSpreadsheet, Share2, Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import { DATE_RANGES, TOWER_FILTERS, type DateRange, type TowerFilter } from "./reportsData";

interface Props {
  dateRange: DateRange;
  setDateRange: (r: DateRange) => void;
  tower: TowerFilter;
  setTower: (t: TowerFilter) => void;
  reportTitle: string;
}

export function ReportToolbar({ dateRange, setDateRange, tower, setTower, reportTitle }: Props) {
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showTowerMenu, setShowTowerMenu] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  function handleExport(type: "pdf" | "excel" | "whatsapp") {
    const msg = type === "pdf" ? "Exporting PDF…" : type === "excel" ? "Exporting Excel…" : "Opening WhatsApp…";
    setExportToast(msg);
    setTimeout(() => setExportToast(null), 2200);
  }

  const activeRange = DATE_RANGES.find(d => d.id === dateRange)!;
  const activeTower = TOWER_FILTERS.find(t => t.id === tower)!;

  return (
    <div className="shrink-0 border-b border-border bg-card px-4 py-3 flex flex-wrap items-center gap-2 relative">
      {/* Date range picker */}
      <div className="relative">
        <button
          onClick={() => { setShowDateMenu(v => !v); setShowTowerMenu(false); }}
          className="h-9 px-3 rounded-xl border border-border bg-background flex items-center gap-1.5 text-xs font-semibold text-foreground hover:border-[#1B3A6B] transition-all"
        >
          <Calendar size={13} className="text-[#1B3A6B]" />
          {activeRange.label}
          <ChevronDown size={12} className="text-muted-foreground" />
        </button>
        {showDateMenu && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowDateMenu(false)} />
            <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-xl shadow-xl z-40 min-w-[140px] overflow-hidden">
              {DATE_RANGES.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setDateRange(r.id); setShowDateMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-muted/50 transition-colors"
                  style={r.id === dateRange ? { color: "#1B3A6B", background: "rgba(27,58,107,0.06)" } : { color: "var(--foreground)" }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Tower filter */}
      <div className="relative">
        <button
          onClick={() => { setShowTowerMenu(v => !v); setShowDateMenu(false); }}
          className="h-9 px-3 rounded-xl border border-border bg-background flex items-center gap-1.5 text-xs font-semibold text-foreground hover:border-[#1B3A6B] transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-[#1B3A6B]" />
          {activeTower.label}
          <ChevronDown size={12} className="text-muted-foreground" />
        </button>
        {showTowerMenu && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowTowerMenu(false)} />
            <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-xl shadow-xl z-40 min-w-[130px] overflow-hidden">
              {TOWER_FILTERS.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTower(t.id); setShowTowerMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-muted/50 transition-colors"
                  style={t.id === tower ? { color: "#1B3A6B", background: "rgba(27,58,107,0.06)" } : { color: "var(--foreground)" }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Export buttons */}
      <button
        onClick={() => handleExport("whatsapp")}
        className="h-9 px-3 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 flex items-center gap-1.5 text-xs font-bold text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all"
      >
        <Share2 size={13} /> Share
      </button>

      <button
        onClick={() => handleExport("excel")}
        className="h-9 px-3 rounded-xl border border-border bg-background flex items-center gap-1.5 text-xs font-bold text-foreground hover:border-[#16A34A] hover:text-[#16A34A] transition-all"
      >
        <FileSpreadsheet size={13} /> Excel
      </button>

      <button
        onClick={() => handleExport("pdf")}
        className="h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-bold text-white transition-all active:scale-95"
        style={{ background: "#1B3A6B" }}
      >
        <Download size={13} /> PDF
      </button>

      {/* Toast */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B3A6B] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl animate-in slide-in-from-bottom-2">
          {exportToast}
        </div>
      )}
    </div>
  );
}
