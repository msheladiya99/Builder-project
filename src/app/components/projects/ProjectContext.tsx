import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Task {
  id: string;
  title: string;
  tag: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  stage: 'todo' | 'in_progress' | 'review' | 'done';
  assignee?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
}

export interface FinancialQuarter {
  name: string;
  budget: number;
  spent: number;
}

export interface Tower {
  id: string;
  name: string;
  status: string;
  floors: number;
  unitsPerFloor: number;
  wings: string[];
  progress: number;
  completion: string;
}

export interface Project {
  id: string;
  name: string;
  rera: string;
  status: string;
  progress: number;
  location: string;
  completion: string;
  budget: string;
  spent: string;
  image: string;
  startDate?: string;
  endDate?: string;
  manager?: string;
  description?: string;
  tenantId: string;
  tasks?: Task[];
  staff?: Staff[];
  financials?: FinancialQuarter[];
  towers?: Tower[];
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "tenantId">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  getProject: (id: string) => Project | undefined;
  addTask: (projectId: string, task: Omit<Task, "id">) => void;
  updateTaskStage: (projectId: string, taskId: string, newStage: Task['stage']) => void;
  addStaff: (projectId: string, staff: Omit<Staff, "id">) => void;
  addTower: (projectId: string, tower: Omit<Tower, "id">) => void;
  updateTower: (projectId: string, towerId: string, updates: Partial<Tower>) => void;
  deleteTower: (projectId: string, towerId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const defaultProjects: Project[] = [
  {
    id: "PRJ-001",
    tenantId: "shg-001",
    name: "Shri Hari Heights",
    rera: "PR/GJ/AHMEDABAD/AUDA/RAA12345/010123",
    status: "Under Construction",
    progress: 65,
    location: "S.G. Highway, Ahmedabad",
    completion: "Dec 2025",
    budget: "₹120 Cr",
    spent: "₹78 Cr",
    image: "https://images.unsplash.com/photo-1758210784345-96fc36926234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25zdHJ1Y3Rpb24lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZSUyMGluZGlhfGVufDF8fHx8MTc3OTE2OTgxOXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "PRJ-002",
    tenantId: "hariheights",
    name: "Hari Heritage",
    rera: "PR/GJ/GANDHINAGAR/GUDA/RAA12346/010123",
    status: "Planning",
    progress: 15,
    location: "GIFT City, Gandhinagar",
    completion: "Mar 2027",
    budget: "₹250 Cr",
    spent: "₹35 Cr",
    image: "https://images.unsplash.com/photo-1483094035713-218a81c0d971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGZhY2FkZSUyMGJ1aWxkaW5nJTIwdW5kZXIlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzc5MTY5ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "PRJ-003",
    tenantId: "kmb-002",
    name: "Green Valley",
    rera: "PR/GJ/AHMEDABAD/AUDA/RAA12347/010123",
    status: "Completed",
    progress: 100,
    location: "Bopal, Ahmedabad",
    completion: "Jan 2024",
    budget: "₹85 Cr",
    spent: "₹82 Cr",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3OTE2OTgyNXww&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function ProjectProvider({ children, tenantId }: { children: ReactNode; tenantId?: string }) {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem("saas_projects");
    if (stored) {
      setAllProjects(JSON.parse(stored));
    } else {
      setAllProjects(defaultProjects);
      localStorage.setItem("saas_projects", JSON.stringify(defaultProjects));
    }
  }, []);

  const persist = (data: Project[]) => {
    setAllProjects(data);
    localStorage.setItem("saas_projects", JSON.stringify(data));
  };

  const activeTenantId = tenantId || "shg-001";
  const projects = allProjects.filter(p => p.tenantId === activeTenantId);

  const addProject = (projectData: Omit<Project, "id" | "tenantId">) => {
    const newProject: Project = {
      ...projectData,
      id: "PRJ-" + Math.floor(Math.random() * 10000).toString().padStart(4, "0"),
      tenantId: activeTenantId,
    };
    persist([...allProjects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const newData = allProjects.map(p => p.id === id ? { ...p, ...updates } : p);
    persist(newData);
  };

  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  const addTask = (projectId: string, taskData: Omit<Task, "id">) => {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const newTask: Task = { ...taskData, id: "TSK-" + Date.now() };
    const updatedTasks = [...(project.tasks || []), newTask];
    updateProject(projectId, { tasks: updatedTasks });
  };

  const updateTaskStage = (projectId: string, taskId: string, newStage: Task['stage']) => {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    const updatedTasks = (project.tasks || []).map(t => 
      t.id === taskId ? { ...t, stage: newStage } : t
    );
    updateProject(projectId, { tasks: updatedTasks });
  };

  const addStaff = (projectId: string, staffData: Omit<Staff, "id">) => {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    const newStaff: Staff = { ...staffData, id: "STF-" + Date.now() };
    const updatedStaff = [...(project.staff || []), newStaff];
    updateProject(projectId, { staff: updatedStaff });
  };

  const addTower = (projectId: string, towerData: Omit<Tower, "id">) => {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    const newTower: Tower = { ...towerData, id: "TWR-" + Date.now() };
    updateProject(projectId, { towers: [...(project.towers || []), newTower] });
  };

  const updateTower = (projectId: string, towerId: string, updates: Partial<Tower>) => {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    const updatedTowers = (project.towers || []).map(t => t.id === towerId ? { ...t, ...updates } : t);
    updateProject(projectId, { towers: updatedTowers });
  };

  const deleteTower = (projectId: string, towerId: string) => {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    const updatedTowers = (project.towers || []).filter(t => t.id !== towerId);
    updateProject(projectId, { towers: updatedTowers });
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, getProject, addTask, updateTaskStage, addStaff, addTower, updateTower, deleteTower }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
