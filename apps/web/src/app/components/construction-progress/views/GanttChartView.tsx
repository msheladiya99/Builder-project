import {
  mockGantt, mockProjects, GANTT_MONTHS, ganttPct, ganttWidth,
  ganttStatusColor, categoryStyle, fmtDate, TODAY,
  type ProjectId,
} from "../progressData";

interface Props { projectId: ProjectId }

export function GanttChartView({ projectId }: Props) {
  const project = mockProjects.find(p => p.id === projectId)!;
  const tasks   = mockGantt.filter(g => g.projectId === projectId);
  const todayPct = ganttPct(TODAY);

  return (
    <div className="p-4 pb-6 space-y-4 max-w-2xl mx-auto">

      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-3 flex items-center justify-between">
        <div>
          <p className="font-black text-foreground">{project.name} — Gantt</p>
          <p className="text-xs text-muted-foreground">Feb 2026 – Sep 2026</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {(["Completed", "In Progress", "Upcoming", "Delayed"] as const).map(s => (
            <div key={s} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: ganttStatusColor[s] }} />
              <span className="text-[10px] text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">

        {/* Month headers */}
        <div className="border-b border-border">
          <div className="flex" style={{ paddingLeft: 110 }}>
            {GANTT_MONTHS.map(m => (
              <div key={m.date} className="flex-1 text-center py-2 border-l border-border first:border-l-0">
                <span className="text-[10px] font-bold text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task rows */}
        <div>
          {tasks.map((task, i) => {
            const left  = ganttPct(task.startDate);
            const width = ganttWidth(task.startDate, task.endDate);
            const cs    = categoryStyle[task.category];
            const color = ganttStatusColor[task.status];

            return (
              <div
                key={task.id}
                className="flex items-center border-b border-border/50 last:border-b-0"
                style={{ minHeight: 48 }}
              >
                {/* Task label */}
                <div className="shrink-0 px-3 py-2" style={{ width: 110 }}>
                  <p className="text-[10px] font-bold text-foreground leading-tight truncate">{task.title}</p>
                  <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${cs.bg} ${cs.text}`}>
                    {cs.icon} {task.category}
                  </span>
                </div>

                {/* Bar area */}
                <div className="flex-1 relative py-3 pr-2" style={{ height: 48 }}>
                  {/* Month grid lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {GANTT_MONTHS.map(m => (
                      <div key={m.date} className="flex-1 border-l border-border/30 first:border-l-0" />
                    ))}
                  </div>

                  {/* Today marker */}
                  <div
                    className="absolute top-0 bottom-0 w-px z-10 pointer-events-none"
                    style={{ left: `${todayPct}%`, background: "#EF4444" }}
                  >
                    {i === 0 && (
                      <div className="absolute -top-0.5 -left-[18px] bg-red-500 text-white text-[7px] font-black px-1 py-0.5 rounded whitespace-nowrap">
                        Today
                      </div>
                    )}
                  </div>

                  {/* Task bar */}
                  <div
                    className="absolute rounded-lg h-6 flex items-center overflow-hidden"
                    style={{
                      left:   `${left}%`,
                      width:  `${width}%`,
                      top:    "50%",
                      transform: "translateY(-50%)",
                      background: color,
                      opacity: task.status === "Upcoming" ? 0.5 : 1,
                    }}
                  >
                    {/* Progress fill */}
                    {task.progress > 0 && (
                      <div
                        className="absolute left-0 top-0 bottom-0 rounded-lg"
                        style={{ width: `${task.progress}%`, background: "rgba(255,255,255,0.25)" }}
                      />
                    )}
                    <span className="relative px-2 text-[8px] font-black text-white truncate">
                      {task.progress > 0 ? `${task.progress}%` : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task detail list */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Task Details</p>
        {tasks.map(task => {
          const color = ganttStatusColor[task.status];
          const cs    = categoryStyle[task.category];
          return (
            <div key={task.id} className="bg-card border border-border rounded-2xl p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{task.title}</p>
                  <p className="text-[10px] text-muted-foreground">{task.assignee}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0" style={{ background: color }}>
                  {task.status}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-1.5">
                <div className="h-full rounded-full" style={{ width: `${task.progress}%`, background: color }} />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{fmtDate(task.startDate, { day: "numeric", month: "short" })} → {fmtDate(task.endDate, { day: "numeric", month: "short", year: "numeric" })}</span>
                <span className="font-bold" style={{ color }}>{task.progress}% done</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
