import { create } from "zustand";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api";


// Helper for calling Express APIs with multi-tenancy headers
export async function apiRequest(path: string, options: any = {}) {
  const token = localStorage.getItem("auth_token") || "";
  
  // Resolve tenant subdomain
  const parts = window.location.hostname.split(".");
  let tenantId = "";
  if (window.location.hostname.includes("localhost") && parts.length > 1) {
    tenantId = parts[0];
  } else if (!window.location.hostname.includes("localhost") && parts.length > 2 && parts[0] !== "www") {
    tenantId = parts[0];
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(tenantId && { "X-Tenant-Id": tenantId }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Network request failed" }));
    throw new Error(err.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

// ── AUTH STORE ──
export const useAuthStore = create<any>((set: any) => ({
  user: JSON.parse(localStorage.getItem("auth_user") || "null"),
  token: localStorage.getItem("auth_token") || "",
  isAuthenticated: !!localStorage.getItem("auth_token"),
  error: null,
  loading: false,

  login: async (email: string, passwordHash: string) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password: passwordHash })
      });
      
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      
      set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
      return data.user;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    set({ user: null, token: "", isAuthenticated: false });
  }
}));

// ── PROJECTS STORE ──
export const useProjectStore = create<any>((set: any, get: any) => ({
  projects: [],
  milestones: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const data = await apiRequest("/projects");
      set({ projects: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addProject: async (projectData: any) => {
    try {
      const data = await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(projectData)
      });
      set((state: any) => ({ projects: [...state.projects, data] }));
      return data;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  fetchMilestones: async () => {
    try {
      const data = await apiRequest("/projects/milestones");
      set({ milestones: data });
    } catch (err: any) {}
  },

  addMilestone: async (milestone: any) => {
    try {
      const data = await apiRequest("/projects/milestones", {
        method: "POST",
        body: JSON.stringify(milestone)
      });
      set((state: any) => ({ milestones: [...state.milestones, data] }));
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}));

// ── FLATS STORE ──
export const useFlatStore = create<any>((set: any) => ({
  flats: [],
  selectedFlat: null,
  loading: false,
  error: null,

  fetchFlats: async () => {
    set({ loading: true });
    try {
      const data = await apiRequest("/flats");
      set({ flats: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchFlatDetails: async (id: string) => {
    try {
      const data = await apiRequest(`/flats/${id}`);
      set({ selectedFlat: data });
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  bookFlat: async (flatId: string, bookingData: any) => {
    try {
      const data = await apiRequest(`/flats/${flatId}/book`, {
        method: "POST",
        body: JSON.stringify(bookingData)
      });
      // Re-fetch flats to get updated status
      const flats = await apiRequest("/flats");
      set({ flats });
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}));

// ── INVENTORY STORE ──
export const useInventoryStore = create<any>((set: any) => ({
  stock: [],
  vendors: [],
  purchaseOrders: [],
  loading: false,

  fetchStock: async () => {
    try {
      const data = await apiRequest("/inventory/stock");
      set({ stock: data });
    } catch (err: any) {}
  },

  fetchVendors: async () => {
    try {
      const data = await apiRequest("/inventory/vendors");
      set({ vendors: data });
    } catch (err: any) {}
  },

  addVendor: async (vendor: any) => {
    try {
      const data = await apiRequest("/inventory/vendors", {
        method: "POST",
        body: JSON.stringify(vendor)
      });
      set((state: any) => ({ vendors: [...state.vendors, data] }));
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  fetchPurchaseOrders: async () => {
    try {
      const data = await apiRequest("/inventory/po");
      set({ purchaseOrders: data });
    } catch (err: any) {}
  },

  createPO: async (poData: any) => {
    try {
      const data = await apiRequest("/inventory/po", {
        method: "POST",
        body: JSON.stringify(poData)
      });
      set((state: any) => ({ purchaseOrders: [...state.purchaseOrders, data] }));
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  receiveGRN: async (grnData: any) => {
    try {
      const data = await apiRequest("/inventory/grn", {
        method: "POST",
        body: JSON.stringify(grnData)
      });
      // Refresh stock levels
      const stock = await apiRequest("/inventory/stock");
      set({ stock });
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}));

// ── LABOUR STORE ──
export const useLabourStore = create<any>((set: any) => ({
  workers: [],
  contractors: [],
  loading: false,

  fetchWorkers: async () => {
    try {
      const data = await apiRequest("/labour/workers");
      set({ workers: data });
    } catch (err: any) {}
  },

  addWorker: async (worker: any) => {
    try {
      const data = await apiRequest("/labour/workers", {
        method: "POST",
        body: JSON.stringify(worker)
      });
      set((state: any) => ({ workers: [...state.workers, data] }));
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  saveAttendance: async (attendanceRecords: any) => {
    try {
      const data = await apiRequest("/labour/attendance", {
        method: "POST",
        body: JSON.stringify({ records: attendanceRecords })
      });
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  fetchContractors: async () => {
    try {
      const data = await apiRequest("/labour/contractors");
      set({ contractors: data });
    } catch (err: any) {}
  }
}));

// ── ACCOUNTING STORE ──
export const useAccountingStore = create<any>((set: any) => ({
  accounts: [],
  expenses: [],
  journals: [],
  loading: false,

  fetchAccounts: async () => {
    try {
      const data = await apiRequest("/accounting/accounts");
      set({ accounts: data });
    } catch (err: any) {}
  },

  fetchExpenses: async () => {
    try {
      const data = await apiRequest("/accounting/expenses");
      set({ expenses: data });
    } catch (err: any) {}
  },

  createExpense: async (expenseData: any) => {
    try {
      const data = await apiRequest("/accounting/expenses", {
        method: "POST",
        body: JSON.stringify(expenseData)
      });
      set((state: any) => ({ expenses: [data, ...state.expenses] }));
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  fetchJournals: async () => {
    try {
      const data = await apiRequest("/accounting/journals");
      set({ journals: data });
    } catch (err: any) {}
  },

  createJournal: async (journalData: any) => {
    try {
      const data = await apiRequest("/accounting/journals", {
        method: "POST",
        body: JSON.stringify(journalData)
      });
      set((state: any) => ({ journals: [data, ...state.journals] }));
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}));

// ── COMPANY STORE ──
export const useCompanyStore = create<any>((set: any) => ({
  company: null,
  loading: false,
  error: null,

  fetchCompany: async () => {
    set({ loading: true });
    try {
      const data = await apiRequest("/company");
      set({ company: data, loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateCompany: async (companyData: any) => {
    set({ loading: true });
    try {
      const data = await apiRequest("/company", {
        method: "PUT",
        body: JSON.stringify(companyData)
      });
      set({ company: data, loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  }
}));
