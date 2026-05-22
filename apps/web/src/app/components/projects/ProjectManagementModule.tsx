import { useState, useEffect } from "react";
import { 
  Building2, Plus, LayoutGrid, Settings, Layers, 
  Activity, ChevronRight, Moon, Sun, Bell, LayoutTemplate
} from "lucide-react";
import { ProjectListing } from "./ProjectListing";
import { ProjectForm } from "./ProjectForm";
import { ProjectOverview } from "./ProjectOverview";
import { ProjectConfiguration } from "./ProjectConfiguration";
import { TowerManagement } from "./TowerManagement";
import { ProjectProvider, useProjects } from "./ProjectContext";

export type ProjectView = "listing" | "create" | "overview" | "edit" | "config" | "towers";

interface ProjectManagementModuleProps {
  isDark: boolean;
  onDarkToggle: () => void;
  tenantId?: string;
  initialView?: ProjectView;
  isStandalone?: boolean;
}

export function ProjectManagementModule({ isDark, onDarkToggle, tenantId, initialView, isStandalone }: ProjectManagementModuleProps) {
  return (
    <ProjectProvider tenantId={tenantId}>
      <InnerProjectModule isDark={isDark} onDarkToggle={onDarkToggle} tenantId={tenantId} initialView={initialView} isStandalone={isStandalone} />
    </ProjectProvider>
  );
}

function InnerProjectModule({ isDark, onDarkToggle, tenantId, initialView, isStandalone }: ProjectManagementModuleProps) {
  const { projects } = useProjects();
  const defaultProject = projects[0];

  const [currentView, setCurrentView] = useState<ProjectView>(isStandalone ? "overview" : (initialView || "listing"));
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(isStandalone && defaultProject ? defaultProject.id : null);

  useEffect(() => {
    if (isStandalone && defaultProject && !selectedProjectId) {
      setSelectedProjectId(defaultProject.id);
      setCurrentView("overview");
    }
  }, [isStandalone, defaultProject, selectedProjectId]);

  const navigateTo = (view: ProjectView, projectId?: string) => {
    setCurrentView(view);
    if (projectId !== undefined) {
      setSelectedProjectId(projectId);
    }
  };

  return (
      <div className="flex h-full bg-background overflow-hidden">
      {/* Module Sidebar */}
      <div className="w-64 border-r border-border bg-card hidden md:flex flex-col shrink-0">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Projects</h2>
            <p className="text-[10px] text-muted-foreground">Shri Hari Group ERP</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {!isStandalone && (
            <>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-4">
                Navigation
              </div>
              
              <button
                onClick={() => navigateTo("listing")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  currentView === "listing" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <LayoutGrid size={16} />
                All Projects
              </button>
              
              <button
                onClick={() => navigateTo("create")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  currentView === "create" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Plus size={16} />
                Create Project
              </button>
            </>
          )}

          {(selectedProjectId || isStandalone) && (
            <>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-6">
                Active Project
              </div>
              
              <button
                onClick={() => navigateTo("overview")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  currentView === "overview" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Activity size={16} />
                Overview
              </button>

              <button
                onClick={() => navigateTo("edit")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  currentView === "edit" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <LayoutTemplate size={16} />
                Edit Details
              </button>

              <button
                onClick={() => navigateTo("config")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  currentView === "config" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Settings size={16} />
                Configuration
              </button>

              <button
                onClick={() => navigateTo("towers")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  currentView === "towers" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Layers size={16} />
                Towers & Wings
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Module Header */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-muted-foreground">Projects</span>
            <ChevronRight size={14} className="text-muted-foreground" />
            <span className="capitalize">{currentView}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onDarkToggle}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-card" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-xs font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl h-full">
            {(!isStandalone && currentView === "listing") && <ProjectListing onNavigate={navigateTo} />}
            {(!isStandalone && currentView === "create") && <ProjectForm mode="create" onNavigate={navigateTo} />}
            {currentView === "overview" && selectedProjectId && <ProjectOverview projectId={selectedProjectId} onNavigate={navigateTo} />}
            {currentView === "edit" && selectedProjectId && <ProjectForm mode="edit" projectId={selectedProjectId} onNavigate={navigateTo} />}
            {currentView === "config" && selectedProjectId && <ProjectConfiguration projectId={selectedProjectId} onNavigate={navigateTo} />}
            {currentView === "towers" && selectedProjectId && <TowerManagement projectId={selectedProjectId} onNavigate={navigateTo} />}
          </div>
        </main>
      </div>
    </div>
  );
}