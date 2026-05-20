import { useState } from "react";
import { Building2, Calendar, MapPin, Users, Settings, Activity, LayoutTemplate, MoreVertical, Plus, Check } from "lucide-react";
import { ProjectView } from "./ProjectManagementModule";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { useProjects, Task, Staff, FinancialQuarter } from "./ProjectContext";

interface ProjectOverviewProps {
  projectId: string;
  onNavigate: (view: ProjectView, projectId?: string) => void;
}

const defaultFinancialData: FinancialQuarter[] = [
  { name: 'Q1', budget: 400, spent: 240 },
  { name: 'Q2', budget: 300, spent: 139 },
  { name: 'Q3', budget: 200, spent: 980 },
  { name: 'Q4', budget: 278, spent: 390 },
];

const defaultStaff: Staff[] = [
  { id: 'S1', role: "Project Manager", name: "Rakesh Patel" },
  { id: 'S2', role: "Site Engineer", name: "Amit Shah" },
  { id: 'S3', role: "Sales Head", name: "Suresh Desai" },
];

const stageDefinitions = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Completed' }
] as const;

export function ProjectOverview({ projectId, onNavigate }: ProjectOverviewProps) {
  const { getProject, addTask, updateTaskStage } = useProjects();
  const project = getProject(projectId);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (e: React.DragEvent, newStage: Task['stage']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      updateTaskStage(projectId, taskId, newStage);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask(projectId, {
      title: newTaskTitle,
      tag: "General",
      priority: "Medium",
      stage: "todo"
    });
    setNewTaskTitle("");
    setShowTaskForm(false);
  };

  if (!project) {
    return <div className="p-8 text-center text-muted-foreground">Project not found</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-card p-6 rounded-xl border border-border relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none bg-gradient-to-l from-primary to-transparent" />
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
              project.status === 'Completed' ? 'bg-success/10 text-success' : 
              project.status === 'Under Construction' ? 'bg-warning/10 text-warning' : 
              'bg-info/10 text-info'
            }`}>
              {project.status}
            </span>
            <span className="text-xs text-muted-foreground font-medium">ID: {project.id}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin size={14}/> {project.location}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14}/> {project.completion}</span>
            <span className="flex items-center gap-1.5 text-primary"><Building2 size={14}/> RERA: {project.rera || "Pending"}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate("edit", projectId)}
            className="px-4 py-2 bg-background border border-border hover:bg-muted text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <LayoutTemplate size={16} />
            Edit Project
          </button>
          <button 
            onClick={() => onNavigate("config", projectId)}
            className="px-4 py-2 bg-background border border-border hover:bg-muted text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Settings size={16} />
            Config
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
          <p className="text-xl font-bold">{project.budget || "₹0 Cr"}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Amount Spent</p>
          <p className="text-xl font-bold text-destructive">{project.spent || "₹0 Cr"}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Units Sold</p>
          <p className="text-xl font-bold text-success">0 / 0</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Overall Progress</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${project.progress}%` }} />
            </div>
            <span className="font-bold text-sm">{project.progress}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kanban Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Task Board</h2>
            <button 
              onClick={() => setShowTaskForm(true)}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Add Task
            </button>
          </div>

          {showTaskForm && (
            <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex items-center gap-3">
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                autoFocus
                className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button onClick={handleAddTask} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">Save</button>
              <button onClick={() => setShowTaskForm(false)} className="text-muted-foreground hover:text-foreground text-sm">Cancel</button>
            </div>
          )}
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {stageDefinitions.map(stage => {
              const items = (project.tasks || []).filter(t => t.stage === stage.id);
              return (
                <div 
                  key={stage.id} 
                  className="min-w-[280px] w-[280px] bg-muted/50 rounded-xl p-3 border border-border flex flex-col max-h-[500px]"
                  onDrop={(e) => handleDrop(e, stage.id)}
                  onDragOver={handleDragOver}
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-semibold">{stage.title}</h3>
                    <span className="text-[10px] bg-background text-muted-foreground px-2 py-0.5 rounded-full border border-border font-medium">
                      {items.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {items.map(item => (
                      <div 
                        key={item.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className="bg-card p-3 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                            item.priority === 'Critical' ? 'bg-destructive/10 text-destructive' :
                            item.priority === 'High' ? 'bg-warning/10 text-warning' :
                            'bg-success/10 text-success'
                          }`}>
                            {item.priority}
                          </span>
                          <button className="text-muted-foreground hover:text-foreground">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                        <h4 className="text-sm font-medium leading-tight mb-3">{item.title}</h4>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded">
                            {item.tag}
                          </span>
                          <div className="flex -space-x-2">
                            <div className="w-5 h-5 rounded-full bg-primary border border-card flex items-center justify-center text-[8px] text-primary-foreground font-bold">
                              {item.assignee ? item.assignee.substring(0,2).toUpperCase() : 'NA'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analytics & Side info */}
        <div className="space-y-6">
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
            <h3 className="font-semibold text-sm mb-4">Financial Overview</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={project.financials || defaultFinancialData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="budget" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Key Staff</h3>
              <button className="text-[10px] text-primary font-medium hover:underline">Manage</button>
            </div>
            <div className="space-y-4">
              {(project.staff || defaultStaff).map((staff, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {staff.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{staff.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{staff.role}</p>
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