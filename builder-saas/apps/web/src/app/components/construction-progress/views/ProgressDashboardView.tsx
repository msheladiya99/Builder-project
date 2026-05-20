import { AlertTriangle, Users, Zap, TrendingUp, Calendar } from "lucide-react";
import {
  mockProjects, mockMilestones, mockUpdates, mockDiary,
  fmtINR, fmtDate, updateCatStyle, milestoneStyle,
  type ProjectId,
} from "../progressData";

interface Props { projectId: ProjectId }

export function ProgressDashboardView({ projectId }: Props) {
  const project  = mockProjects.find(p => p.id === projectId)!;
  const delayed  = mockMilestones.filter(m => m.projectId === projectId && m.status === "Delayed");
  const updates  = mockUpdates.filter(u => u.projectId === projectId).slice(0, 5);
  const todayDiary = mockDiary.find(d => d.projectId === projectId && d.date === "2026-05-19");
  const daysLeft = Math.round((new Date(project.targetDate).getTime() - new Date("2026-05-19").getTime()) / 86400000);

  return (
    <div className="p-4 pb-6 space-y-4 max-w-2xl mx-auto">

      {/* Delayed milestone alerts */}
      {delayed.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-red-600 shrink-0" />
            <p className="font-black text-red-700 dark:text-red-400 text-sm">
              {delayed.length} Delayed Milestone{delayed.length > 1 ? "s" : ""}
            </p>
          </div>
          {delayed.map(m => (
            <div key={m.id} className="bg-white dark:bg-red-900/20 rounded-xl p-3 border border-red-100 dark:border-red-800">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground">{m.title}</p>
                <span className="text-xs font-black text-red-600 shrink-0">+{m.daysDelayed}d</span>
              </div>
              <p className="text-xs text-muted-foreground">Target: {fmtDate(m.targetDate)}</p>
              {m.engineerNote && (
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 italic">"{m.engineerNote}"</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Overall Progress", value: `${project.overallProgress}%`,   color: project.color },
          { label: "Days Remaining",   value: daysLeft,                        color: daysLeft < 180 ? "#D97706" : "#1B3A6B" },
          { label: "Today Manpower",   value: `${project.todayManpower} men`,  color: "#1B3A6B" },
          { label: "BOQ Executed",     value: fmtINR(project.executedBOQValue), color: "#16A34A" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-black mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* All towers comparison */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">All Towers Progress</p>
        <div className="space-y-3">
          {mockProjects.map(p => (
            <div key={p.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-foreground">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground">{p.type}</span>
                </div>
                <span className="text-sm font-black" style={{ color: p.color }}>{p.overallProgress}%</span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${p.overallProgress}%`, background: p.color }} />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[10px] text-muted-foreground">Floor {p.floorsComplete} of {p.totalFloors}</span>
                <span className="text-[10px] text-muted-foreground">{fmtINR(p.executedBOQValue)} / {fmtINR(p.totalBOQValue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's site summary */}
      {todayDiary && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Today's Site Summary</p>
            <span className="text-lg">
              {todayDiary.weather === "Sunny" ? "☀️" : todayDiary.weather === "Partly Cloudy" ? "⛅" : todayDiary.weather === "Cloudy" ? "☁️" : "🌧️"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center bg-muted/30 rounded-xl p-2">
              <p className="text-base font-black text-foreground">{todayDiary.manpower}</p>
              <p className="text-[10px] text-muted-foreground">Manpower</p>
            </div>
            <div className="text-center bg-muted/30 rounded-xl p-2">
              <p className="text-base font-black text-foreground">{todayDiary.tempHigh}°</p>
              <p className="text-[10px] text-muted-foreground">Max Temp</p>
            </div>
            <div className="text-center bg-muted/30 rounded-xl p-2">
              <p className="text-base font-black text-foreground">{todayDiary.equipmentList.length}</p>
              <p className="text-[10px] text-muted-foreground">Equipment</p>
            </div>
          </div>
          <p className="text-xs text-foreground leading-relaxed line-clamp-3">{todayDiary.workDone}</p>
          {todayDiary.issues !== "NIL." && todayDiary.issues !== "NIL" && (
            <div className="mt-2 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2">
              <AlertTriangle size={13} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">{todayDiary.issues}</p>
            </div>
          )}
        </div>
      )}

      {/* Activity feed */}
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</p>
        <div className="space-y-3">
          {updates.map(u => {
            const cs = updateCatStyle[u.category];
            return (
              <div key={u.id} className="bg-card border border-border rounded-2xl p-4 flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${cs.bg} ${cs.text}`}>{u.category}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground leading-tight">{u.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{u.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Calendar size={10} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{fmtDate(u.date)} · {u.location}</span>
                  </div>
                </div>
                {u.images.length > 0 && (
                  <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: u.images[0].color }}>
                    +{u.images.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Project details */}
      <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg,#0F1C2E 0%,#1B3A6B 100%)" }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-[#C9922A]" />
          <p className="font-black text-white">{project.name} — Project Details</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          {[
            { label: "Site Engineer",    value: project.siteEngineer },
            { label: "Project Manager",  value: project.projectManager },
            { label: "Total Units",      value: `${project.totalUnits} flats` },
            { label: "Active Tasks",     value: project.activeTasks },
            { label: "Start Date",       value: fmtDate(project.startDate, { month: "short", year: "numeric" }) },
            { label: "Target Completion",value: fmtDate(project.targetDate, { month: "short", year: "numeric" }) },
          ].map(d => (
            <div key={d.label} className="bg-white/10 rounded-xl p-2.5">
              <p className="text-white font-black text-sm">{d.value}</p>
              <p className="text-white/50 text-[10px] mt-0.5">{d.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
