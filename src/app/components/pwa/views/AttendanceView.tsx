import { useState } from "react";
import { Search, Check, CheckCircle2, Users, ChevronDown } from "lucide-react";
import { workers as initialWorkers, ATT_CONFIG, initials, type AttStatus, type SyncItem } from "../pwaData";

type Filter = "All" | "Marked" | "Pending";

interface Props {
  isOffline: boolean;
  addPending: (item: Omit<SyncItem, "id">) => void;
}

export function AttendanceView({ isOffline, addPending }: Props) {
  const [roster, setRoster]   = useState(initialWorkers.map(w => ({ ...w })));
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<Filter>("All");
  const [saved, setSaved]     = useState(false);

  const P = roster.filter(w => w.att === "P").length;
  const A = roster.filter(w => w.att === "A").length;
  const H = roster.filter(w => w.att === "H").length;
  const L = roster.filter(w => w.att === "L").length;

  const visible = roster.filter(w => {
    const s = `${w.name} ${w.code} ${w.trade}`.toLowerCase();
    const matchSearch = s.includes(search.toLowerCase());
    const matchFilter = filter === "All" ? true : filter === "Marked" ? w.att !== "P" : true;
    return matchSearch && matchFilter;
  });

  function mark(id: string, att: AttStatus) {
    setRoster(p => p.map(w => w.id === id ? { ...w, att } : w));
    setSaved(false);
  }

  function markAll(att: AttStatus) {
    setRoster(p => p.map(w => ({ ...w, att })));
    setSaved(false);
  }

  function submit() {
    setSaved(true);
    addPending({
      entity: "attendance", title: `Attendance — ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
      sub: `${P} present · Tower A`, size: "4.2 KB",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
      status: "pending",
    });
  }

  return (
    <div className="flex flex-col h-full">

      {/* Stats row */}
      <div className="shrink-0 mx-3 mb-2">
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "10px 0", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { label: "Present", val: P, ...ATT_CONFIG.P },
            { label: "Absent",  val: A, ...ATT_CONFIG.A },
            { label: "Half",    val: H, ...ATT_CONFIG.H },
            { label: "Leave",   val: L, ...ATT_CONFIG.L },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center", borderRight: "1px solid #F1F5F9" }} className="last:border-r-0">
              <p style={{ fontSize: 20, fontWeight: 900, lineHeight: 1, color: s.accent }}>{s.val}</p>
              <p style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600, marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick-mark strip */}
      <div className="shrink-0 mx-3 mb-2 flex gap-2 overflow-x-auto scrollbar-none">
        <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, alignSelf: "center", whiteSpace: "nowrap" }}>All:</span>
        {(["P","A","H","L"] as AttStatus[]).map(a => {
          const c = ATT_CONFIG[a];
          return (
            <button
              key={a}
              onClick={() => markAll(a)}
              className="shrink-0 active:scale-95 transition-transform"
              style={{ height: 32, paddingInline: 12, borderRadius: 99, background: c.light, color: c.text, fontSize: 11, fontWeight: 800 }}
            >
              {c.long}
            </button>
          );
        })}
      </div>

      {/* Search + filter */}
      <div className="shrink-0 mx-3 mb-2 flex gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-2xl px-3" style={{ background: "#fff", border: "1.5px solid #E2E8F0", height: 40 }}>
          <Search size={13} color="#94A3B8" className="shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Name, code, trade…"
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 13, color: "#0F172A" }}
          />
        </div>
        <button
          onClick={() => setFilter(f => f === "All" ? "Pending" : f === "Pending" ? "Marked" : "All")}
          className="flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
          style={{ height: 40, paddingInline: 12, borderRadius: 12, background: "#fff", border: "1.5px solid #E2E8F0", fontSize: 11, fontWeight: 700, color: "#475569" }}
        >
          {filter} <ChevronDown size={11} />
        </button>
      </div>

      {/* Worker list */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-2">
        {visible.map(w => {
          const cfg = ATT_CONFIG[w.att];
          return (
            <div
              key={w.id}
              style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #E2E8F0", padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}
            >
              {/* Avatar */}
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: w.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 12, fontWeight: 900, flexShrink: 0,
              }}>
                {initials(w.name)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>{w.name}</p>
                <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>{w.trade} · {w.code}</p>
              </div>

              {/* Att buttons */}
              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                {(["P","A","H","L"] as AttStatus[]).map(a => {
                  const c = ATT_CONFIG[a];
                  const active = w.att === a;
                  return (
                    <button
                      key={a}
                      onClick={() => mark(w.id, a)}
                      className="active:scale-90 transition-transform"
                      style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: active ? c.accent : c.light,
                        color: active ? "#fff" : c.text,
                        fontSize: 11, fontWeight: 900,
                        border: `2px solid ${active ? c.accent : "transparent"}`,
                        flexShrink: 0,
                      }}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="shrink-0 p-3 pt-2" style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        {/* Progress line */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>Tower A · 19 May 2026 · {roster.length} workers</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1B3A6B" }}>{Math.round(((P+A+H+L)/roster.length)*100)}% marked</span>
        </div>
        <div style={{ height: 4, borderRadius: 99, background: "#E2E8F0", overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", borderRadius: 99, background: "#1B3A6B", width: `${((P+A+H+L)/roster.length)*100}%`, transition: "width 0.3s" }} />
        </div>

        {saved ? (
          <div style={{ height: 52, borderRadius: 16, background: "#F0FDF4", border: "1.5px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <CheckCircle2 size={17} color="#16A34A" />
            <span style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>
              {isOffline ? "Saved offline · will sync when online" : "Attendance submitted!"}
            </span>
          </div>
        ) : (
          <button
            onClick={submit}
            className="w-full active:scale-[0.98] transition-transform"
            style={{ height: 52, borderRadius: 16, background: "linear-gradient(135deg,#1B3A6B 0%,#2563EB 100%)", color: "#fff", fontWeight: 900, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {isOffline && <span style={{ fontSize: 14 }}>📡</span>}
            <Users size={16} />
            Submit Attendance
            {isOffline && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>(offline)</span>}
          </button>
        )}
      </div>
    </div>
  );
}
