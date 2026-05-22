import { useState, useMemo } from "react";
import {
  Building2, Search, Filter, Plus, MapPin, Calendar,
  MoreHorizontal, ArrowUpRight, CheckCircle2, Activity, X, TrendingUp
} from "lucide-react";
import { ProjectView } from "./ProjectManagementModule";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// Import types so callback parameters are properly inferred
import { useProjects, Project, Tower } from "./ProjectContext";

interface ProjectListingProps {
  onNavigate: (view: ProjectView, projectId?: string) => void;
}

const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 550 },
  { name: "Apr", value: 450 },
  { name: "May", value: 700 },
  { name: "Jun", value: 650 },
];

// BUG-10 fix: status filter options
const STATUS_OPTIONS = [
  "All",
  "Planning",
  "Approvals Pending",
  "Under Construction",
  "Completed",
  "Handover",
];

export function ProjectListing({ onNavigate }: ProjectListingProps) {
  const { projects } = useProjects();

  // BUG-09 fix: search state
  const [searchTerm, setSearchTerm] = useState("");
  // BUG-10 fix: status filter state
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // BUG-11 fix: KPI stats computed from real project data (not hardcoded)
  const totalProjects = projects.length;
  const underConstruction = useMemo(
    () => projects.filter((p: Project) => p.status === "Under Construction").length,
    [projects]
  );
  const completed = useMemo(
    () => projects.filter((p: Project) => p.status === "Completed").length,
    [projects]
  );
  // Total units from tower data; fall back to "—" if none defined yet
  const totalUnits = useMemo(
    () =>
      projects.reduce((sum: number, p: Project) => {
        const fromTowers = (p.towers || []).reduce(
          (t: number, tw: Tower) => t + (tw.floors || 0) * (tw.unitsPerFloor || 0),
          0
        );
        return sum + fromTowers;
      }, 0),
    [projects]
  );

  // BUG-09 + BUG-10 fix: combined search + filter logic
  const filteredProjects = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return projects.filter((p: Project) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.location || "").toLowerCase().includes(q) ||
        (p.rera || "").toLowerCase().includes(q) ||
        (p.tenantId || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const hasActiveFilters = searchTerm || statusFilter !== "All";

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all real estate developments.
          </p>
        </div>
        <button
          onClick={() => onNavigate("create")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* BUG-11 fix: KPI Cards — all computed from real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Building2 size={20} />
            </div>
            <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
              <TrendingUp size={12} /> Live
            </span>
          </div>
          <h3 className="text-2xl font-bold">{totalProjects}</h3>
          <p className="text-sm text-muted-foreground">Total Projects</p>
        </div>

        {/* Under Construction */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-warning/10 text-warning rounded-lg">
              <Activity size={20} />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Active Phase</span>
          </div>
          <h3 className="text-2xl font-bold">{underConstruction}</h3>
          <p className="text-sm text-muted-foreground">Under Construction</p>
        </div>

        {/* Completed */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-success/10 text-success rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {totalProjects > 0
                ? `${Math.round((completed / totalProjects) * 100)}% of total`
                : "—"}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{completed}</h3>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>

        {/* Total Units */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-info/10 text-info rounded-lg">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold">
            {totalUnits > 0 ? totalUnits.toLocaleString("en-IN") : "—"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {totalUnits > 0 ? "Total Units (towers)" : "Add towers to track units"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: search + list */}
        <div className="lg:col-span-2 space-y-4">

          {/* BUG-09 + BUG-10 fix: working search bar + filter dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, location, RERA, subdomain…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* BUG-10 fix: Filter button with dropdown panel */}
            <div className="relative">
              <button
                onClick={() => setShowFilterPanel((f: boolean) => !f)}
                className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
                  statusFilter !== "All"
                    ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                    : "border-border bg-card hover:bg-muted text-foreground"
                }`}
              >
                <Filter size={15} />
                {statusFilter !== "All" ? statusFilter : "Filter"}
              </button>

              {showFilterPanel && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFilterPanel(false)}
                  />
                  <div className="absolute right-0 top-11 z-20 bg-card border border-border rounded-xl shadow-xl p-2 min-w-[200px]">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                      Filter by Status
                    </p>
                    {STATUS_OPTIONS.map(s => {
                      const count =
                        s === "All"
                          ? projects.length
                          : projects.filter((p: Project) => p.status === s).length;
                      return (
                        <button
                          key={s}
                          onClick={() => {
                            setStatusFilter(s);
                            setShowFilterPanel(false);
                          }}
                          className={`w-full text-left text-sm px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                            statusFilter === s
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <span>{s}</span>
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                    {statusFilter !== "All" && (
                      <button
                        onClick={() => { setStatusFilter("All"); setShowFilterPanel(false); }}
                        className="w-full text-center text-xs text-red-500 hover:underline mt-1 py-1"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Showing {filteredProjects.length} of {projects.length} projects
              </span>
              {statusFilter !== "All" && (
                <button
                  onClick={() => setStatusFilter("All")}
                  className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {statusFilter} <X size={10} />
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors"
                >
                  "{searchTerm}" <X size={10} />
                </button>
              )}
            </div>
          )}

          {/* Project cards */}
          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <Building2 size={36} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="font-semibold text-foreground">
                  {hasActiveFilters ? "No matching projects" : "No projects yet"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasActiveFilters
                    ? "Try adjusting your search or clearing the filter."
                    : "Create your first project to get started."}
                </p>
                {hasActiveFilters ? (
                  <button
                    onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}
                    className="mt-4 text-sm text-primary font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate("create")}
                    className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
                  >
                    + New Project
                  </button>
                )}
              </div>
            ) : (
              filteredProjects.map((project: Project) => (
                <div
                  key={project.id}
                  className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => onNavigate("overview", project.id)}
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full sm:w-48 h-32 object-cover rounded-lg border border-border/50 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-base font-bold group-hover:text-primary transition-colors truncate">
                            {project.name}
                          </h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                              project.status === "Completed"
                                ? "bg-success/10 text-success"
                                : project.status === "Under Construction"
                                ? "bg-warning/10 text-warning"
                                : project.status === "Planning"
                                ? "bg-info/10 text-info"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium flex-wrap">
                          <span className="truncate">{project.rera || "—"}</span>
                          {project.tenantId && (
                            <>
                              <span>·</span>
                              <span className="bg-primary/5 text-primary px-1.5 py-0.5 rounded font-mono font-bold text-[10px] border border-primary/10 flex-shrink-0">
                                {project.tenantId}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted flex-shrink-0"
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                          <MapPin size={10} /> Location
                        </p>
                        <p className="text-xs font-medium truncate">{project.location || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar size={10} /> Completion
                        </p>
                        <p className="text-xs font-medium">{project.completion}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Budget</p>
                        <p className="text-xs font-medium">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-700"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold">{project.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: chart + activities */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4 text-sm">Investment Portfolio Overview</h3>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Recent Activities</h3>
              <button className="text-[10px] text-primary font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { time: "2 hrs ago", action: "Phase 2 approved", project: "Shri Hari Heights" },
                { time: "5 hrs ago", action: "Site inspection completed", project: "Shri Hari Villa" },
                { time: "1 day ago", action: "Contractor assigned", project: "Shri Hari Elegance" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{activity.action}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {activity.project} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}