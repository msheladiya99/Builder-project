import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";

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
  settings?: ProjectSettings;
}

export interface ProjectSettings {
  phase?: string;
  currency?: string;
  allowContractorsViewProgress?: boolean;
  requireAdminApprovalBudget?: boolean;
  enableClientPortalAccess?: boolean;
  approvals?: {
    naNocStatus?: 'approved' | 'pending';
    buildingPlanStatus?: 'approved' | 'pending';
    environmentalStatus?: 'approved' | 'pending';
    fireSafetyStatus?: 'approved' | 'pending';
  };
  notifications?: {
    taskCompletion?: boolean;
    budgetThreshold?: boolean;
    dailySummary?: boolean;
    weeklyPdfSummary?: boolean;
    criticalPathDelays?: boolean;
  };
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "tenantId"> & { subdomain?: string }) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
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

const COOKIE_NAME = "saas_projects";

const getCookieData = (name: string): string => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  const chunks: { index: number, value: string }[] = [];
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
    // Check for chunked cookies: name_0, name_1, etc.
    const chunkPrefix = name + "_";
    if (c.indexOf(chunkPrefix) === 0) {
      const eqIdx = c.indexOf("=");
      if (eqIdx > -1) {
        const chunkName = c.substring(0, eqIdx);
        const index = parseInt(chunkName.substring(chunkPrefix.length));
        const value = decodeURIComponent(c.substring(eqIdx + 1));
        chunks.push({ index, value });
      }
    }
  }
  
  if (chunks.length > 0) {
    chunks.sort((a, b) => a.index - b.index);
    return chunks.map(ch => ch.value).join("");
  }
  
  return "";
};

const setCookieData = (name: string, value: string) => {
  // Clear old cookies (including chunked ones)
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    const eqIdx = c.indexOf("=");
    const cName = eqIdx > -1 ? c.substring(0, eqIdx) : c;
    if (cName === name || cName.startsWith(name + "_")) {
      document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost`;
      document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost`;
      document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
  }

  const encodedValue = encodeURIComponent(value);
  // Split value into 3KB chunks to stay under 4KB cookie limit
  const chunkSize = 3000;
  if (encodedValue.length <= chunkSize) {
    document.cookie = `${name}=${encodedValue}; path=/; domain=localhost; max-age=31536000`;
    document.cookie = `${name}=${encodedValue}; path=/; domain=.localhost; max-age=31536000`;
  } else {
    let index = 0;
    for (let i = 0; i < encodedValue.length; i += chunkSize) {
      const chunk = encodedValue.substring(i, i + chunkSize);
      document.cookie = `${name}_${index}=${chunk}; path=/; domain=localhost; max-age=31536000`;
      document.cookie = `${name}_${index}=${chunk}; path=/; domain=.localhost; max-age=31536000`;
      index++;
    }
  }
};

const getSharedProjects = (): Promise<Project[]> => {
  return new Promise((resolve) => {
    // 1. Try to read from cookie first
    const cookieData = getCookieData(COOKIE_NAME);
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        const cleaned = parsed.map((p: any) => {
          const valB = parseFloat(String(p.budget).replace(/[^0-9.]/g, "")) || 0;
          const valS = parseFloat(String(p.spent).replace(/[^0-9.]/g, "")) || 0;
          return {
            ...p,
            budget: valB >= 100000 ? `₹${valB / 10000000} Cr` : String(p.budget || "₹0 Cr"),
            spent: valS >= 100000 ? `₹${valS / 10000000} Cr` : String(p.spent || "₹0 Cr")
          };
        });
        resolve(cleaned);
        return;
      } catch (e) {
        console.error("Error parsing projects from cookie:", e);
      }
    }

    // 2. Fallback to localStorage
    const stored = localStorage.getItem("saas_projects");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const cleaned = parsed.map((p: any) => {
          const valB = parseFloat(String(p.budget).replace(/[^0-9.]/g, "")) || 0;
          const valS = parseFloat(String(p.spent).replace(/[^0-9.]/g, "")) || 0;
          return {
            ...p,
            budget: valB >= 100000 ? `₹${valB / 10000000} Cr` : String(p.budget || "₹0 Cr"),
            spent: valS >= 100000 ? `₹${valS / 10000000} Cr` : String(p.spent || "₹0 Cr")
          };
        });
        resolve(cleaned);
        return;
      } catch (e) {
        console.error("Error parsing projects from localStorage:", e);
      }
    }
    resolve(defaultProjects);
  });
};

const setSharedProjects = (projects: Project[]): Promise<void> => {
  return new Promise((resolve) => {
    const value = JSON.stringify(projects);
    // 1. Write to cookie
    setCookieData(COOKIE_NAME, value);
    // 2. Write to localStorage as fallback
    localStorage.setItem("saas_projects", value);
    resolve();
  });
};

// BUG-13 fix: Clear both cookie AND localStorage stale cache
const clearSharedCache = () => {
  localStorage.removeItem("saas_projects");
  // Clear the cookie by setting it expired
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    const eqIdx = c.indexOf("=");
    const cName = eqIdx > -1 ? c.substring(0, eqIdx) : c;
    if (cName === COOKIE_NAME || cName.startsWith(COOKIE_NAME + "_")) {
      document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost`;
      document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost`;
      document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
  }
};

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api";

const apiFetch = async (path: string, options: RequestInit = {}) => {
  const parts = window.location.hostname.split(".");
  let tenantId = "";
  if (window.location.hostname.includes("localhost") && parts.length > 1) {
    tenantId = parts[0];
  } else if (!window.location.hostname.includes("localhost") && parts.length > 2 && parts[0] !== "www") {
    tenantId = parts[0];
  }

  // Remap hari-heritage and hari-haritage subdomains back to seeded tenant ID hariheights
  if (tenantId === "hari-heritage" || tenantId === "hari-haritage") {
    tenantId = "hariheights";
  }

  const token = localStorage.getItem("auth_token") || "dev-bypass-token";

  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...(tenantId && { "X-Tenant-Id": tenantId }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP error ${response.status}`);
  }

  return response.json();
};

export function ProjectProvider({ children, tenantId }: { children: ReactNode; tenantId?: string }) {
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  // BUG-18 fix: Memoize activeTenantId so it does not recompute on every render
  const activeTenantId = useMemo(() => {
    let id = tenantId || "master"; // "master" = Super Admin, shows ALL projects
    if (id === "hari-heritage" || id === "hari-haritage") id = "hariheights";
    return id;
  }, [tenantId]);

  // BUG-05 fix: Wrap in useCallback with empty deps — apiFetch and setters are all stable
  const loadProjects = useCallback(async () => {
    try {
      const data = await apiFetch("/projects");
      const mapped = data.map((p: any) => {
        // BUG-15 fix: Normalize status to Title Case
        const rawStatus = p.status || "Planning";
        const normalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
        const num2 = typeof p.budget === "number" ? p.budget : parseFloat(p.budget) || 0;
        const bInCr = num2 >= 100000 ? num2 / 10000000 : num2;
        const num3 = typeof p.spent === "number" ? p.spent : parseFloat(p.spent) || 0;
        const sInCr = num3 >= 100000 ? num3 / 10000000 : num3;
        // Format completion date consistently (e.g. "Dec 2025")
        const formatDate = (d: string) => {
          const dt = new Date(d);
          return dt.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
        };
        return {
          id: p.id,
          tenantId: p.tenantId || "shg-001",
          name: p.name,
          rera: p.reraNumber || p.rera || "",
          status: normalizedStatus,
          progress: Number(p.progress || 0),
          location: p.location || "",
          completion: p.endDate ? formatDate(p.endDate) : "TBD",
          budget: `₹${bInCr % 1 === 0 ? bInCr : bInCr.toFixed(2)} Cr`,
          spent: `₹${sInCr % 1 === 0 ? sInCr : sInCr.toFixed(2)} Cr`,
          image: p.image || "https://images.unsplash.com/photo-1758210784345-96fc36926234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          tasks: p.tasks || [],
          towers: p.towers || [],
          staff: p.staff || [],
          financials: p.financials || [],
          settings: p.settings || undefined
        };
      });
      setAllProjects(mapped);
      setSharedProjects(mapped);
    } catch (err) {
      console.error("Failed to load projects from DB, falling back to local cache:", err);
      getSharedProjects().then(data => setAllProjects(data));
    }
  }, []); // stable: only uses external stable refs

  useEffect(() => {
    // BUG-13 fix: Clear BOTH localStorage and cookie cache on mount
    clearSharedCache();
    loadProjects();
    const interval = setInterval(loadProjects, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [loadProjects]);

  // Super Admin (master) sees ALL projects; tenants see only their own
  // BUG-18 continuation: memoize derived projects array
  const projects = useMemo(() =>
    activeTenantId === "master"
      ? allProjects
      : allProjects.filter(p => p.tenantId === activeTenantId),
    [allProjects, activeTenantId]
  );

  const addProject = useCallback(async (projectData: Omit<Project, "id" | "tenantId"> & { subdomain?: string }): Promise<void> => {
    const cleanBudget = (parseFloat(String(projectData.budget).replace(/[^0-9.]/g, "")) || 0) * 10000000;
    const cleanSpent = (parseFloat(String(projectData.spent).replace(/[^0-9.]/g, "")) || 0) * 10000000;
    const projectTenantId = projectData.subdomain || (activeTenantId !== "master" ? activeTenantId : "shg-001");

    const dbPayload = {
      name: projectData.name,
      location: projectData.location,
      rera: projectData.rera,
      budget: cleanBudget,
      spent: cleanSpent,
      status: projectData.status || "Planning",
      tenantId: projectTenantId,
    };

    // Optimistic update using functional setState (BUG-05 fix: avoids stale closure)
    const optimisticId = "PRJ-OPT-" + Date.now();
    const optimisticProject: Project = {
      ...projectData,
      id: optimisticId,
      tenantId: projectTenantId,
      tasks: [],
      towers: [],
      staff: [],
      financials: []
    };
    setAllProjects(prev => [...prev, optimisticProject]);

    try {
      await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify(dbPayload)
      });
      // Refresh from server to replace optimistic entry with real DB record
      await loadProjects();
    } catch (err: any) {
      // Revert optimistic entry on failure
      setAllProjects(prev => prev.filter(p => p.id !== optimisticId));
      // Re-throw so the form can show an error message
      throw err;
    }
  }, [activeTenantId, loadProjects]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>): Promise<void> => {
    // BUG-06 fix: Optimistic update uses functional setState (no stale closure)
    // Do NOT write to cookie here — only write after API confirms (via loadProjects)
    setAllProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

    const dbPayload: any = {};
    if (updates.name !== undefined) dbPayload.name = updates.name;
    if (updates.location !== undefined) dbPayload.location = updates.location;
    if (updates.rera !== undefined) dbPayload.rera = updates.rera;
    if (updates.status !== undefined) dbPayload.status = updates.status;
    if (updates.progress !== undefined) dbPayload.progress = Number(updates.progress);
    if (updates.budget !== undefined) dbPayload.budget = (parseFloat(String(updates.budget).replace(/[^0-9.]/g, "")) || 0) * 10000000;
    if (updates.spent !== undefined) dbPayload.spent = (parseFloat(String(updates.spent).replace(/[^0-9.]/g, "")) || 0) * 10000000;
    if (updates.tasks !== undefined) dbPayload.tasks = updates.tasks;
    if (updates.towers !== undefined) dbPayload.towers = updates.towers;
    if (updates.staff !== undefined) dbPayload.staff = updates.staff;
    if (updates.financials !== undefined) dbPayload.financials = updates.financials;
    if (updates.settings !== undefined) dbPayload.settings = updates.settings;

    try {
      await apiFetch(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(dbPayload)
      });
      // Refresh from server — this also writes correct data to shared storage
      await loadProjects();
    } catch (err: any) {
      console.error("Failed to update project in DB:", err);
      // Revert the optimistic update on failure
      await loadProjects();
      throw err;
    }
  }, [loadProjects]);

  // BUG-14 fix: Search allProjects (not tenant-filtered) so cross-tenant lookups work
  const getProject = useCallback((id: string) => {
    return allProjects.find(p => p.id === id);
  }, [allProjects]);

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
