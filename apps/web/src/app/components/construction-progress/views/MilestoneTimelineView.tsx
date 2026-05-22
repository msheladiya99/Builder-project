import { CheckCircle2, Clock, AlertTriangle, Circle } from "lucide-react";
import {
  mockMilestones, fmtDate, milestoneStyle, type ProjectId, type MilestoneStatus,
} from "../progressData";

interface Props { projectId: ProjectId }

const STATUS_ICON: Record<MilestoneStatus, React.ReactNode> = {
  Completed:    <CheckCircle2 size={18} className="text-green-500" />,
  "In Progress":<Clock size={18} className="text-blue-500" />,
  Upcoming:     <Circle size={18} className="text-slate-400" />,
  Delayed:      <AlertTriangle size={18} className="text-red-500" />,
};

export function MilestoneTimelineView({ projectId }: Props) {
  const milestones = mockMilestones
    .filter(m => m.projectId === projectId)
    .sort((a, b) => a.targetDate.localeCompare(b.targetDate));

  const completed   = milestones.filter(m => m.status === "Completed").length;
  const delayed     = milestones.filter(m => m.status === "Delayed").length;
  const inProgress  = milestones.filter(m => m.status === "In Progress").length;

  return (
    <div className="p-4 pb-6 space-y-4 max-w-2xl mx-auto">

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Total",       value: milestones.length, color: "#1B3A6B"  },
          { label: "Done",        value: completed,          color: "#16A34A"  },
          { label: "Active",      value: inProgress,         color: "#2563EB"  },
          { label: "Delayed",     value: delayed,            color: "#EF4444"  },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-2.5 text-center">
            <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-1">
          {milestones.map((m, i) => {
            const ms = milestoneStyle[m.status];
            return (
              <div key={m.id} className="relative flex gap-4">

                {/* Timeline dot */}
                <div className="shrink-0 flex flex-col items-center z-10">
                  <div
                    className={`w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center bg-background ${ms.ring}`}
                    style={{ marginTop: 16 }}
                  >
                    <div className={`w-3 h-3 rounded-full ${ms.dot}`} />
                  </div>
                  {i < milestones.length - 1 && <div className="flex-1" />}
                </div>

                {/* Card */}
                <div
                  className="flex-1 mb-3 rounded-2xl overflow-hidden border"
                  style={{ borderColor: m.status === "Delayed" ? "#FCA5A5" : m.status === "In Progress" ? "#93C5FD" : "var(--border)" }}
                >
                  {/* Status header bar */}
                  {(m.status === "Delayed" || m.status === "In Progress") && (
                    <div
                      className="px-3 py-1.5 flex items-center gap-2"
                      style={{ background: m.status === "Delayed" ? "#FEE2E2" : "#DBEAFE" }}
                    >
                      {STATUS_ICON[m.status]}
                      <span className="text-xs font-black" style={{ color: m.status === "Delayed" ? "#DC2626" : "#1D4ED8" }}>
                        {m.status === "Delayed" ? `Delayed by ${m.daysDelayed} days` : "In Progress"}
                      </span>
                    </div>
                  )}

                  <div className="p-3 bg-card">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-black text-foreground text-sm leading-tight">{m.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{m.description}</p>
                      </div>
                      <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${ms.badge}`}>
                        {ms.label}
                      </span>
                    </div>

                    {/* Dates row */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="bg-muted/30 rounded-lg px-2 py-1">
                        <p className="text-[9px] text-muted-foreground">Target</p>
                        <p className="text-[10px] font-bold text-foreground">{fmtDate(m.targetDate)}</p>
                      </div>
                      {m.actualDate && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-2 py-1">
                          <p className="text-[9px] text-muted-foreground">Completed</p>
                          <p className="text-[10px] font-bold text-green-700 dark:text-green-400">{fmtDate(m.actualDate)}</p>
                        </div>
                      )}
                      <div className="bg-muted/30 rounded-lg px-2 py-1">
                        <p className="text-[9px] text-muted-foreground">Weight</p>
                        <p className="text-[10px] font-bold text-foreground">{m.weight}%</p>
                      </div>
                    </div>

                    {/* Engineer note for delayed */}
                    {m.engineerNote && m.status === "Delayed" && (
                      <div className="mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl px-3 py-2 flex gap-2">
                        <AlertTriangle size={12} className="text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 dark:text-amber-400 italic">"{m.engineerNote}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress summary */}
      <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#0F1C2E 0%,#1B3A6B 100%)" }}>
        <p className="font-black text-white mb-3">Milestone Completion</p>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2 flex">
          <div style={{ width: `${(completed / milestones.length) * 100}%`, background: "#16A34A" }} className="h-full" />
          <div style={{ width: `${(inProgress / milestones.length) * 100}%`, background: "#2563EB" }} className="h-full" />
          <div style={{ width: `${(delayed / milestones.length) * 100}%`, background: "#EF4444" }} className="h-full" />
        </div>
        <div className="flex justify-between text-[10px] text-white/60">
          <span>■ Completed {completed}</span>
          <span>■ In Progress {inProgress}</span>
          <span>■ Delayed {delayed}</span>
        </div>
      </div>
    </div>
  );
}
