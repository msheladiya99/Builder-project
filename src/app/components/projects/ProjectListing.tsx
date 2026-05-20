import { Building2, Search, Filter, Plus, MapPin, Calendar, Users, MoreHorizontal, ArrowUpRight, CheckCircle2, Activity } from "lucide-react";
import { ProjectView } from "./ProjectManagementModule";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useProjects } from "./ProjectContext";

interface ProjectListingProps {
  onNavigate: (view: ProjectView, projectId?: string) => void;
}

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 550 },
  { name: 'Apr', value: 450 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 650 },
];

export function ProjectListing({ onNavigate }: ProjectListingProps) {
  const { projects } = useProjects();
  
  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Portfolio</h1>
          <p className="text-sm text-muted-foreground">Manage and track all real estate developments.</p>
        </div>
        <button 
          onClick={() => onNavigate("create")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Building2 size={20} />
            </div>
            <span className="text-xs font-medium text-success flex items-center gap-1">
              +2 <ArrowUpRight size={14} />
            </span>
          </div>
          <h3 className="text-2xl font-bold">{projects.length}</h3>
          <p className="text-sm text-muted-foreground">Total Projects</p>
        </div>
        
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-warning/10 text-warning rounded-lg">
              <Activity size={20} />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Active Phase
            </span>
          </div>
          <h3 className="text-2xl font-bold">8</h3>
          <p className="text-sm text-muted-foreground">Under Construction</p>
        </div>

        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold">3</h3>
          <p className="text-sm text-muted-foreground">Completed (YTD)</p>
        </div>

        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-info/10 text-info rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold">4,250</h3>
          <p className="text-sm text-muted-foreground">Total Units Delivered</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search projects..."
                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-card hover:bg-muted transition-colors">
              <Filter size={16} />
              Filters
            </button>
          </div>

          <div className="space-y-4">
            {projects.map(project => (
              <div 
                key={project.id} 
                className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => onNavigate("overview", project.id)}
              >
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full sm:w-48 h-32 object-cover rounded-lg border border-border/50"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold group-hover:text-primary transition-colors">{project.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          project.status === 'Completed' ? 'bg-success/10 text-success' : 
                          project.status === 'Under Construction' ? 'bg-warning/10 text-warning' : 
                          'bg-info/10 text-info'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">{project.rera}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><MapPin size={10}/> Location</p>
                      <p className="text-xs font-medium truncate">{project.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Calendar size={10}/> Completion</p>
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
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4 text-sm">Investment Portfolio Overview</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--primary)" fillOpacity={1} fill="url(#colorValue)" />
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
                    <p className="text-[10px] text-muted-foreground">{activity.project} • {activity.time}</p>
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