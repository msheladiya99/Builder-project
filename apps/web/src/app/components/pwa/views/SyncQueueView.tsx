import { RefreshCw, CheckCircle2, WifiOff, Wifi, Trash2, AlertCircle, Clock } from "lucide-react";
import { ENTITY_EMOJI, type SyncItem } from "../pwaData";

interface Props {
  queue: SyncItem[];
  isOffline: boolean;
  syncing: boolean;
  onSync: () => void;
  onRemove: (id: string) => void;
}

const STATUS_CFG = {
  pending: { dot: "#F59E0B", label: "Pending",  bg: "#FFFBEB",  border: "#FCD34D", text: "#92400E" },
  failed:  { dot: "#EF4444", label: "Failed",   bg: "#FEF2F2",  border: "#FCA5A5", text: "#991B1B" },
  syncing: { dot: "#3B82F6", label: "Syncing…", bg: "#EFF6FF",  border: "#93C5FD", text: "#1E40AF" },
  synced:  { dot: "#16A34A", label: "Synced",   bg: "#F0FDF4",  border: "#86EFAC", text: "#166534" },
};

export function SyncQueueView({ queue, isOffline, syncing, onSync, onRemove }: Props) {
  const pending   = queue.filter(q => q.status === "pending" || q.status === "failed");
  const inFlight  = queue.filter(q => q.status === "syncing");
  const done      = queue.filter(q => q.status === "synced");
  const totalMB   = queue.reduce((s, q) => {
    const n = parseFloat(q.size);
    return s + (q.size.includes("MB") ? n : n / 1000);
  }, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F8FAFC" }}>

      {/* ── Network status card ── */}
      <div style={{ flexShrink: 0, margin: "4px 12px 0" }}>
        <div style={{
          borderRadius: 18, padding: "14px 16px",
          background: isOffline ? "linear-gradient(135deg,#7F1D1D,#991B1B)" : "linear-gradient(135deg,#064E3B,#065F46)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {isOffline ? <WifiOff size={20} color="#FCA5A5" /> : <Wifi size={20} color="#6EE7B7" />}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 14 }}>{isOffline ? "No Connection" : "Connected"}</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 2 }}>
              {isOffline ? "Changes queued locally · sync when online" : `${pending.length} items ready to upload`}
            </p>
          </div>
          {!isOffline && pending.length > 0 && (
            <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 900, fontSize: 11, padding: "3px 10px", borderRadius: 99 }}>
              {pending.length} pending
            </span>
          )}
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div style={{ flexShrink: 0, margin: "10px 12px 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {[
          { label: "Pending",  value: pending.length,     color: "#F59E0B" },
          { label: "Synced",   value: done.length,        color: "#16A34A" },
          { label: "Size (MB)",value: totalMB.toFixed(1), color: "#1B3A6B" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "10px 12px", textAlign: "center" }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600, marginTop: 3 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Sync button ── */}
      <div style={{ flexShrink: 0, padding: "10px 12px 4px" }}>
        <button
          onClick={onSync}
          disabled={isOffline || pending.length === 0 || syncing}
          className="w-full active:scale-[0.98] transition-transform"
          style={{
            height: 50, borderRadius: 16, fontWeight: 900, fontSize: 14,
            background: isOffline || pending.length === 0 ? "#E2E8F0" : "linear-gradient(135deg,#1B3A6B,#2563EB)",
            color: isOffline || pending.length === 0 ? "#94A3B8" : "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s",
          }}
        >
          <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Syncing all items…" : isOffline ? "Offline — Cannot Sync" : pending.length === 0 ? "All Synced ✓" : `Upload ${pending.length} Pending Item${pending.length !== 1 ? "s" : ""}`}
        </button>
      </div>

      {/* ── Queue list ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 12px 16px" }}>

        {/* Syncing */}
        {inFlight.map(item => {
          const cfg = STATUS_CFG.syncing;
          return (
            <div key={item.id} style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: 16, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{ENTITY_EMOJI[item.entity]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{item.title}</p>
                <p style={{ fontSize: 10, color: "#64748B", marginBottom: 6 }}>{item.sub}</p>
                <div style={{ height: 4, borderRadius: 99, background: "#BFDBFE", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.pct ?? 60}%`, background: "#3B82F6", borderRadius: 99, animation: "pulse 1.5s infinite" }} />
                </div>
              </div>
              <RefreshCw size={14} color="#3B82F6" className="animate-spin shrink-0" />
            </div>
          );
        })}

        {/* Pending + Failed */}
        {pending.length > 0 && (
          <>
            <p style={{ fontSize: 9, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, marginTop: 4 }}>Waiting to Upload</p>
            {pending.map(item => {
              const cfg = STATUS_CFG[item.status as "pending"|"failed"];
              return (
                <div key={item.id} style={{ background: "#fff", border: `1.5px solid ${item.status === "failed" ? "#FCA5A5" : "#E2E8F0"}`, borderRadius: 16, padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Entity icon */}
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: "1px solid #E2E8F0" }}>
                    {ENTITY_EMOJI[item.entity]}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                    <p style={{ fontSize: 10, color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.sub}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 99, background: cfg.dot, flexShrink: 0 }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: cfg.text }}>{cfg.label}</span>
                      {item.retries && <span style={{ fontSize: 9, color: "#EF4444", fontWeight: 700 }}>· {item.retries} retries</span>}
                      <span style={{ fontSize: 9, color: "#94A3B8" }}>· {item.size}</span>
                    </div>
                  </div>

                  {/* Time + delete */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Clock size={9} color="#94A3B8" />
                      <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600 }}>{item.time}</span>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="active:scale-90 transition-transform"
                      style={{ width: 28, height: 28, borderRadius: 8, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Trash2 size={11} color="#EF4444" />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Synced */}
        {done.length > 0 && (
          <>
            <p style={{ fontSize: 9, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, marginTop: 8 }}>Recently Synced</p>
            {done.map(item => (
              <div key={item.id} style={{ background: "#fff", border: "1px solid #F1F5F9", borderRadius: 16, padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 12, opacity: 0.65 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {ENTITY_EMOJI[item.entity]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                  <p style={{ fontSize: 9, color: "#94A3B8" }}>{item.time} · {item.size}</p>
                </div>
                <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
              </div>
            ))}
          </>
        )}

        {queue.length === 0 && (
          <div style={{ textAlign: "center", padding: "52px 0" }}>
            <CheckCircle2 size={40} color="#86EFAC" style={{ margin: "0 auto 10px" }} />
            <p style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>All synced!</p>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>No items waiting to upload</p>
          </div>
        )}
      </div>
    </div>
  );
}
