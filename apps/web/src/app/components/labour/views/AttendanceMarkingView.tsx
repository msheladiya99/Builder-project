import { useState } from "react";
import { ChevronLeft, ChevronRight, Save, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";
import {
  mockWorkers, mockContractors, mockAttendance,
  AttendanceStatus, contractorColor, workerInitials,
  TODAY, ALL_DATES,
} from "../labourData";

// Status display config
const STATUS_CFG: Record<AttendanceStatus, { label: string; short: string; bg: string; text: string; ring: string }> = {
  P:   { label: "Present",  short: "P", bg: "#22C55E", text: "#fff", ring: "ring-green-400"  },
  A:   { label: "Absent",   short: "A", bg: "#EF4444", text: "#fff", ring: "ring-red-400"    },
  H:   { label: "Half Day", short: "½", bg: "#F59E0B", text: "#fff", ring: "ring-amber-400"  },
  S:   { label: "Sunday",   short: "S", bg: "#CBD5E1", text: "#64748B", ring: "ring-slate-300" },
  "—": { label: "Tap",      short: "—", bg: "#E2E8F0", text: "#94A3B8", ring: "ring-slate-200" },
};

const CYCLE: AttendanceStatus[] = ["P", "A", "H"];

export function AttendanceMarkingView() {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [cFilter, setCFilter] = useState("All");
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    const init: Record<string, AttendanceStatus> = {};
    mockWorkers.forEach(w => { init[w.id] = mockAttendance[w.id]?.[TODAY] ?? "—"; });
    return init;
  });
  const [saved, setSaved] = useState(false);

  const dateIdx = ALL_DATES.findIndex(d => d.date === selectedDate);
  const isSunday = new Date(selectedDate).getDay() === 0;

  function changeDate(dir: -1 | 1) {
    const idx = dateIdx + dir;
    if (idx < 0 || idx >= ALL_DATES.length) return;
    const newDate = ALL_DATES[idx].date;
    setSelectedDate(newDate);
    const next: Record<string, AttendanceStatus> = {};
    mockWorkers.forEach(w => { next[w.id] = mockAttendance[w.id]?.[newDate] ?? "—"; });
    setAttendance(next);
    setSaved(false);
  }

  const workers = mockWorkers.filter(w =>
    w.status === "Active" && (cFilter === "All" || w.contractorId === cFilter)
  );

  function tap(id: string) {
    if (isSunday) return;
    setAttendance(prev => {
      const cur = prev[id] as AttendanceStatus;
      const idx = CYCLE.indexOf(cur);
      return { ...prev, [id]: CYCLE[(idx + 1) % CYCLE.length] };
    });
    setSaved(false);
  }

  function markAll(s: AttendanceStatus) {
    const u: Record<string, AttendanceStatus> = {};
    workers.forEach(w => { u[w.id] = s; });
    setAttendance(p => ({ ...p, ...u }));
    setSaved(false);
  }

  function reset() {
    const u: Record<string, AttendanceStatus> = {};
    workers.forEach(w => { u[w.id] = "—"; });
    setAttendance(p => ({ ...p, ...u }));
    setSaved(false);
  }

  const presentCount  = workers.filter(w => attendance[w.id] === "P").length;
  const halfCount     = workers.filter(w => attendance[w.id] === "H").length;
  const absentCount   = workers.filter(w => attendance[w.id] === "A").length;
  const unmarkedCount = workers.filter(w => attendance[w.id] === "—").length;

  const dateLabel = new Date(selectedDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "short",
  });

  return (
    <div className="flex flex-col h-full">

      {/* ── Date navigator ──────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border shrink-0">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <button
            onClick={() => changeDate(-1)}
            disabled={dateIdx === 0}
            className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center disabled:opacity-25 hover:bg-muted/40 active:scale-95 transition-all"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="text-center">
            <p className="text-lg font-black text-foreground">{dateLabel}</p>
            <p className="text-xs text-muted-foreground">
              {selectedDate === TODAY ? "Today" : selectedDate === "2026-05-18" ? "Yesterday" : ALL_DATES[dateIdx]?.label}
              {isSunday && " · Weekly Off"}
            </p>
          </div>

          <button
            onClick={() => changeDate(1)}
            disabled={dateIdx >= ALL_DATES.length - 1}
            className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center disabled:opacity-25 hover:bg-muted/40 active:scale-95 transition-all"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Live tally */}
        {!isSunday && (
          <div className="flex items-center justify-center gap-6 pb-3">
            <Tally color="#22C55E" label="Present" value={presentCount} />
            <Tally color="#F59E0B" label="Half"    value={halfCount}    />
            <Tally color="#EF4444" label="Absent"  value={absentCount}  />
            {unmarkedCount > 0 && <Tally color="#94A3B8" label="Pending" value={unmarkedCount} />}
          </div>
        )}
      </div>

      {/* ── Quick actions ───────────────────────────────────────────────────── */}
      {!isSunday && (
        <div className="bg-muted/20 border-b border-border px-4 py-2.5 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-2xl mx-auto">
            <span className="text-xs text-muted-foreground font-semibold shrink-0">Mark all:</span>
            <button onClick={() => markAll("P")} className="shrink-0 h-9 px-4 rounded-xl bg-green-500 text-white font-black text-sm active:scale-95 transition-all">All P</button>
            <button onClick={() => markAll("A")} className="shrink-0 h-9 px-4 rounded-xl bg-red-500 text-white font-black text-sm active:scale-95 transition-all">All A</button>
            <button onClick={reset} className="shrink-0 h-9 px-3 rounded-xl border border-border text-muted-foreground text-sm font-semibold flex items-center gap-1 active:scale-95 transition-all"><RotateCcw size={13} /> Reset</button>
          </div>
        </div>
      )}

      {/* ── Contractor filter ────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border px-4 py-2.5 shrink-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-none max-w-2xl mx-auto">
          {[{ id: "All", name: `All (${mockWorkers.filter(w => w.status === "Active").length})` },
            ...mockContractors.map(c => ({
              id: c.id,
              name: `${c.name.split(" ")[0]} (${mockWorkers.filter(w => w.contractorId === c.id && w.status === "Active").length})`,
            }))
          ].map(c => {
            const isActive = cFilter === c.id;
            const hex = c.id === "All" ? "#1B3A6B" : (contractorColor[c.id]?.hex ?? "#1B3A6B");
            return (
              <button
                key={c.id}
                onClick={() => setCFilter(c.id)}
                className="shrink-0 h-9 px-4 rounded-xl border font-bold text-sm transition-all whitespace-nowrap"
                style={isActive
                  ? { background: hex, color: "#fff", borderColor: hex }
                  : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Worker rows ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {isSunday ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-4">
            <span className="text-5xl">😴</span>
            <p className="text-lg font-black text-foreground">Sunday — Weekly Off</p>
            <p className="text-sm text-muted-foreground">No attendance to mark today</p>
          </div>
        ) : (
          <div className="px-4 py-3 space-y-2 max-w-2xl mx-auto pb-32">
            {workers.map(w => {
              const status = attendance[w.id] ?? "—";
              const sc = STATUS_CFG[status];
              const { hex } = contractorColor[w.contractorId] ?? { hex: "#1B3A6B" };

              return (
                <div
                  key={w.id}
                  className="bg-card border border-border rounded-2xl flex items-center gap-3 pr-3 overflow-hidden"
                >
                  {/* Left contractor stripe */}
                  <div className="w-1.5 self-stretch rounded-l-2xl shrink-0" style={{ background: hex }} />

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black my-3 shrink-0" style={{ background: hex }}>
                    <span className="text-sm">{workerInitials(w.name)}</span>
                  </div>

                  {/* Name + trade */}
                  <div className="flex-1 min-w-0 py-3">
                    <p className="font-black text-foreground text-base leading-tight truncate">{w.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{w.trade} · {w.code}</p>
                  </div>

                  {/* BIG tap button */}
                  <button
                    onClick={() => tap(w.id)}
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5 font-black shrink-0 ring-2 ring-offset-2 ring-offset-card active:scale-90 transition-all ${sc.ring}`}
                    style={{ background: sc.bg, color: sc.text, minWidth: 64, minHeight: 64 }}
                  >
                    <span className="text-2xl leading-none">{sc.short}</span>
                    <span className="text-[8px] leading-none opacity-80">{sc.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Save button ──────────────────────────────────────────────────────── */}
      {!isSunday && (
        <div className="shrink-0 px-4 pb-4 pt-3 bg-background/95 backdrop-blur-sm border-t border-border">
          <button
            onClick={() => setSaved(true)}
            className="w-full h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-all max-w-2xl mx-auto"
            style={{
              background: saved ? "#DCFCE7" : unmarkedCount > 0 ? "#F59E0B" : "#1B3A6B",
              color: saved ? "#16A34A" : "#fff",
            }}
          >
            {saved
              ? <><CheckCircle2 size={22} /> Attendance Saved!</>
              : unmarkedCount > 0
                ? <><AlertTriangle size={22} /> Save ({unmarkedCount} unmarked)</>
                : <><Save size={22} /> Save Attendance</>
            }
          </button>
          {!saved && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              {presentCount + halfCount} present · {absentCount} absent · tap card to change
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Tally({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
      <span className="text-sm font-black text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
