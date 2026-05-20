import { useState } from "react";
import { Users, CalendarCheck, IndianRupee, Briefcase, FileSpreadsheet, Sun, Moon } from "lucide-react";
import { WorkerListingView } from "./views/WorkerListingView";
import { AttendanceMarkingView } from "./views/AttendanceMarkingView";
import { WageCalculationsView } from "./views/WageCalculationsView";
import { ContractorManagementView } from "./views/ContractorManagementView";
import { PayrollSheetsView } from "./views/PayrollSheetsView";
import { mockWorkers, mockAttendance, TODAY } from "./labourData";

type Tab = "workers" | "attendance" | "wages" | "contractors" | "payroll";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "workers",     label: "Workers",     icon: Users          },
  { id: "attendance",  label: "Attendance",  icon: CalendarCheck  },
  { id: "wages",       label: "Wages",       icon: IndianRupee    },
  { id: "contractors", label: "Contractors", icon: Briefcase      },
  { id: "payroll",     label: "Payroll",     icon: FileSpreadsheet},
];

export function LabourModule({ isDark, onDarkToggle }: { isDark: boolean; onDarkToggle: () => void }) {
  const [tab, setTab] = useState<Tab>("attendance");

  const todayPresent  = mockWorkers.filter(w => w.status === "Active" && mockAttendance[w.id]?.[TODAY] === "P").length;
  const todayAbsent   = mockWorkers.filter(w => w.status === "Active" && mockAttendance[w.id]?.[TODAY] === "A").length;
  const totalActive   = mockWorkers.filter(w => w.status === "Active").length;

  return (
    <div className="flex flex-col h-full bg-background">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg,#0F1C2E 0%,#1B3A6B 100%)" }}>
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div>
            <p className="text-white font-black text-lg leading-tight">Shri Hari Residency</p>
            <p className="text-white/50 text-xs mt-0.5">
              {new Date(TODAY).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button
            onClick={onDarkToggle}
            className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
          >
            {isDark ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}
          </button>
        </div>

        {/* Today summary pills */}
        <div className="flex gap-2 px-4 pb-4">
          <Pill color="#22C55E" label="Present" value={todayPresent} />
          <Pill color="#EF4444" label="Absent"  value={todayAbsent} />
          <Pill color="#94A3B8" label="Total"   value={totalActive} />
        </div>
      </div>

      {/* ── Tab bar ────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-border bg-card shrink-0">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{ minHeight: 64 }}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all border-b-2 ${
                active
                  ? "border-[#1B3A6B] text-[#1B3A6B]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-black leading-none tracking-tight">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {tab === "workers"     && <WorkerListingView />}
        {tab === "attendance"  && <AttendanceMarkingView />}
        {tab === "wages"       && <WageCalculationsView />}
        {tab === "contractors" && <ContractorManagementView />}
        {tab === "payroll"     && <PayrollSheetsView />}
      </div>
    </div>
  );
}

function Pill({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-white/60 text-xs">{label}</span>
      <span className="text-white font-black text-sm">{value}</span>
    </div>
  );
}
