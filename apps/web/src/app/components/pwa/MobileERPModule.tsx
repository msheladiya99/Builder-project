import { useState, useCallback, type ReactNode } from "react";
import {
  WifiOff, Wifi, RefreshCw, Download, X, ClipboardList,
  Wallet, BookOpen, Building2, ArrowUpFromLine, Bell, ChevronRight,
} from "lucide-react";
import { initialQueue, type SyncItem, type PWATab } from "./pwaData";
import { AttendanceView }   from "./views/AttendanceView";
import { ExpenseEntryView } from "./views/ExpenseEntryView";
import { SiteDiaryView }    from "./views/SiteDiaryView";
import { FlatDetailsView }  from "./views/FlatDetailsView";
import { SyncQueueView }    from "./views/SyncQueueView";

interface Props { isDark: boolean; onDarkToggle: () => void; }

const TAB_DEFS: { id: PWATab; label: string; shortLabel: string }[] = [
  { id: "attendance", label: "Attend",  shortLabel: "Attendance"   },
  { id: "expense",    label: "Expense", shortLabel: "Log Expense"  },
  { id: "diary",      label: "Diary",   shortLabel: "Site Diary"   },
  { id: "flats",      label: "Flats",   shortLabel: "Flat Details" },
  { id: "sync",       label: "Sync",    shortLabel: "Sync Queue"   },
];

export function MobileERPModule({ isDark, onDarkToggle }: Props) {
  const [tab, setTab]                 = useState<PWATab>("attendance");
  const [isOffline, setIsOffline]     = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);
  const [queue, setQueue]             = useState<SyncItem[]>(initialQueue);
  const [syncing, setSyncing]         = useState(false);
  const [lastSync, setLastSync]       = useState("10:45 AM");
  const [nudge, setNudge]             = useState(false);

  const pending = queue.filter(q => q.status === "pending" || q.status === "failed").length;

  const addPending = useCallback((item: Omit<SyncItem, "id">) => {
    setQueue(prev => [{ ...item, id: `SQ-${Date.now()}` }, ...prev]);
    setNudge(true);
    setTimeout(() => setNudge(false), 600);
  }, []);

  function handleSync() {
    if (isOffline || syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setQueue(prev => prev.map(q =>
        q.status === "pending" || q.status === "failed" ? { ...q, status: "synced" as const } : q
      ));
      const now = new Date();
      setLastSync(`${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`);
      setSyncing(false);
    }, 2200);
  }

  const currentTab = TAB_DEFS.find(t => t.id === tab)!;

  const TAB_ICONS: Record<PWATab, ReactNode> = {
    attendance: <ClipboardList  size={19} />,
    expense:    <Wallet         size={19} />,
    diary:      <BookOpen       size={19} />,
    flats:      <Building2      size={19} />,
    sync:       <ArrowUpFromLine size={19} />,
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden" style={{ background: "#F8FAFC" }}>

      {/* ── Status bar ── */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-2 pb-1" style={{ background: "#0F1C2E", minHeight: 26 }}>
        <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, letterSpacing: 0.2 }}>9:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isOffline
            ? <WifiOff size={11} color="#F87171" />
            : <Wifi    size={11} color="rgba(255,255,255,0.4)" />
          }
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600 }}>84%</span>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="shrink-0 flex items-center px-4 pb-3 pt-2 gap-3" style={{ background: "#0F1C2E" }}>
        {/* App info */}
        <div className="flex-1 min-w-0">
          <p style={{ color: "#fff", fontWeight: 900, fontSize: 16, lineHeight: 1.2 }}>SHG Field App</p>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, fontWeight: 600, marginTop: 1 }}>{currentTab.shortLabel} · Tower A</p>
        </div>

        {/* Sync pill */}
        <button
          onClick={() => { setTab("sync"); }}
          className="flex items-center gap-1.5 active:opacity-70 transition-opacity"
          style={{ background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "6px 10px" }}
        >
          <RefreshCw
            size={11}
            style={{ color: syncing ? "#60A5FA" : isOffline ? "#F87171" : "#34D399" }}
            className={syncing ? "animate-spin" : ""}
          />
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 700 }}>
            {syncing ? "Syncing…" : isOffline ? "Offline" : lastSync}
          </span>
          {pending > 0 && (
            <span
              className={nudge ? "scale-125" : ""}
              style={{
                background: "#FBBF24", color: "#000", borderRadius: 99,
                minWidth: 16, height: 16, fontSize: 8, fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 4px", transition: "transform 0.15s",
              }}
            >
              {pending}
            </span>
          )}
        </button>

        {/* Notification bell */}
        <button className="relative active:opacity-70 transition-opacity" style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bell size={17} color="rgba(255,255,255,0.45)" />
          <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: 99, background: "#EF4444", border: "1.5px solid #0F1C2E" }} />
        </button>
      </div>

      {/* ── Offline banner ── */}
      {isOffline && (
        <div
          className="shrink-0 flex items-center gap-2.5 px-4 py-2.5"
          style={{ background: "#7F1D1D" }}
        >
          <WifiOff size={13} color="#FCA5A5" className="shrink-0" />
          <p style={{ color: "#FCA5A5", fontSize: 11, fontWeight: 600, flex: 1, lineHeight: 1.4 }}>
            Offline · Changes save locally and sync when reconnected
          </p>
          <button onClick={() => setIsOffline(false)} className="active:opacity-60 transition-opacity shrink-0">
            <X size={13} color="#FCA5A5" />
          </button>
        </div>
      )}

      {/* ── PWA install prompt ── */}
      {!installDismissed && !isOffline && (
        <div className="shrink-0 mx-3 mt-2.5 flex items-center gap-3 rounded-2xl border overflow-hidden"
          style={{ background: "#fff", borderColor: "#E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {/* Left accent */}
          <div style={{ width: 4, alignSelf: "stretch", background: "linear-gradient(180deg,#1B3A6B,#3B82F6)", borderRadius: "4px 0 0 4px", flexShrink: 0 }} />
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1B3A6B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Download size={17} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: "10px 0" }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>Add to Home Screen</p>
            <p style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Install for offline access &amp; faster loads</p>
          </div>
          <button
            style={{ background: "#1B3A6B", color: "#fff", borderRadius: 10, padding: "7px 14px", fontSize: 11, fontWeight: 800, flexShrink: 0 }}
            className="active:scale-95 transition-transform mr-1"
            onClick={() => setInstallDismissed(true)}
          >
            Install
          </button>
          <button onClick={() => setInstallDismissed(true)} className="mr-2 active:opacity-60 transition-opacity shrink-0">
            <X size={14} color="#94A3B8" />
          </button>
        </div>
      )}

      {/* ── Offline simulator toggle ── */}
      <button
        onClick={() => setIsOffline(v => !v)}
        className="shrink-0 mx-3 mt-2 active:opacity-70 transition-opacity"
        style={{
          height: 34, borderRadius: 10, border: "1.5px dashed #CBD5E1",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          background: "transparent",
        }}
      >
        {isOffline
          ? <><WifiOff size={11} color="#EF4444" /><span style={{ fontSize: 10, color: "#EF4444", fontWeight: 700 }}>Tap to go online</span></>
          : <><span style={{ width: 6, height: 6, borderRadius: 99, background: "#22C55E", display: "inline-block" }} /><span style={{ fontSize: 10, color: "#64748B", fontWeight: 600 }}>Online · tap to simulate offline</span></>
        }
      </button>

      {/* ── Content ── */}
      <div className="flex-1 overflow-hidden mt-2">
        {tab === "attendance" && <AttendanceView  isOffline={isOffline} addPending={addPending} />}
        {tab === "expense"    && <ExpenseEntryView isOffline={isOffline} addPending={addPending} />}
        {tab === "diary"      && <SiteDiaryView    isOffline={isOffline} addPending={addPending} />}
        {tab === "flats"      && <FlatDetailsView />}
        {tab === "sync"       && <SyncQueueView queue={queue} isOffline={isOffline} syncing={syncing} onSync={handleSync} onRemove={id => setQueue(p => p.filter(q => q.id !== id))} />}
      </div>

      {/* ── Bottom nav ── */}
      <div className="shrink-0 border-t" style={{ background: "#fff", borderColor: "#E2E8F0" }}>
        <div style={{ display: "flex", paddingBottom: 4 }}>
          {TAB_DEFS.map(t => {
            const active = tab === t.id;
            const hasBadge = t.id === "sync" && pending > 0;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 flex flex-col items-center justify-center pt-2 pb-1 gap-0.5 relative active:bg-slate-50 transition-colors"
                style={{ minWidth: 0 }}
              >
                {/* Pill indicator */}
                {active && (
                  <span style={{
                    position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                    width: 32, height: 3, borderRadius: 99, background: "#1B3A6B",
                  }} />
                )}
                <span style={{ position: "relative", display: "flex" }}>
                  <span style={{ color: active ? "#1B3A6B" : "#94A3B8" }}>{TAB_ICONS[t.id]}</span>
                  {hasBadge && (
                    <span style={{
                      position: "absolute", top: -5, right: -6,
                      minWidth: 14, height: 14, borderRadius: 99,
                      background: "#F59E0B", color: "#000",
                      fontSize: 7, fontWeight: 900,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 3px", border: "1.5px solid #fff",
                    }}>
                      {pending}
                    </span>
                  )}
                </span>
                <span style={{ fontSize: 9, fontWeight: active ? 800 : 600, color: active ? "#1B3A6B" : "#94A3B8" }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
