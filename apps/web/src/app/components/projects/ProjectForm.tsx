import { useState, useEffect } from "react";
import {
  ArrowLeft, UploadCloud, MapPin, Calendar as CalendarIcon, Save,
  Loader2, AlertCircle, CheckCircle2, Info
} from "lucide-react";
import { ProjectView } from "./ProjectManagementModule";
import { useProjects } from "./ProjectContext";

// Explicit form-state type — prevents all 'prev implicitly has any' TS errors
interface ProjectFormData {
  name: string;
  subdomain: string;
  rera: string;
  address: string;
  status: string;
  startDate: string;
  endDate: string;
  manager: string;
  description: string;
  budget: number | string;
  spent: number | string;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  projectId?: string;
  onNavigate: (view: ProjectView, projectId?: string) => void;
}

// BUG-01 fix: removed unused 'format' from date-fns; use consistent en-IN locale helper
const formatDateLabel = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

const parseCr = (str: string | undefined | null): number => {
  if (!str) return 0;
  const cleaned = String(str).replace(/[^0-9.]/g, "");
  const val = parseFloat(cleaned) || 0;
  // If value looks like raw paise/lakhs (>100000), convert to Cr
  return val >= 100000 ? val / 10000000 : val;
};

export function ProjectForm({ mode, projectId, onNavigate }: ProjectFormProps) {
  const { addProject, updateProject, getProject } = useProjects();
  const existingProject = mode === "edit" && projectId ? getProject(projectId) : null;

  // BUG-18/types fix: explicitly typed useState prevents 'prev implicitly any' errors
  const [formData, setFormData] = useState<ProjectFormData>({
    name: existingProject?.name || "",
    subdomain: existingProject?.tenantId || "",
    rera: existingProject?.rera || "",
    address: existingProject?.location || "",
    status: existingProject?.status || "Planning",
    startDate: existingProject?.startDate || "",
    endDate: existingProject?.endDate || "",
    manager: existingProject?.manager || "",
    description: existingProject?.description || "",
    budget: existingProject ? parseCr(existingProject.budget) : 0,
    spent: existingProject ? parseCr(existingProject.spent) : 0,
  });

  const [isSubdomainManual, setIsSubdomainManual] = useState(false);

  // BUG-07 fix: loading state prevents double-submit
  const [isLoading, setIsLoading] = useState(false);
  // BUG-08 fix: error and success feedback
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  // BUG-02 fix: field-level validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // BUG-16/17 fix: coming-soon toast
  const [comingSoonMsg, setComingSoonMsg] = useState("");

  // BUG-12 fix: managers loaded dynamically (with static fallback)
  const [managers, setManagers] = useState<string[]>([
    "Rajesh Sharma", "Priya Nair", "Kiran Patil",
    "Meena Joshi", "Rakesh Patel", "Amit Shah", "Suresh Desai",
  ]);
  useEffect(() => {
    const token = localStorage.getItem("auth_token") || "dev-bypass-token";
    const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api";
    fetch(`${apiBase}/users?role=Project Admin,Site Engineer`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r: Response) => r.ok ? r.json() : null)
      .then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          setManagers(data.map((u: any) => String(u.name || u.email || "")));
        }
      })
      .catch(() => { /* keep static fallback */ });
  }, []);

  // BUG-02 fix: validate required fields
  const validate = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Project name is required";
    if (!formData.address.trim()) errors.address = "Site address is required";
    if (!formData.subdomain.trim()) errors.subdomain = "Workspace subdomain is required";
    // BUG-04 fix: budget must be > 0
    const budgetNum = parseFloat(String(formData.budget)) || 0;
    if (budgetNum <= 0) errors.budget = "Budget must be greater than ₹0";
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ProjectFormData) => {
      const next: ProjectFormData = { ...prev, [name]: value };
      // Auto-generate subdomain from project name
      if (name === "name" && mode === "create" && !isSubdomainManual) {
        next.subdomain = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .slice(0, 30);
      }
      return next;
    });
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev: Record<string, string>) => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubdomainManual(true);
    const value = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 30);
    setFormData((prev: ProjectFormData) => ({ ...prev, subdomain: value }));
    if (fieldErrors.subdomain) {
      setFieldErrors((prev: Record<string, string>) => { const n = { ...prev }; delete n.subdomain; return n; });
    }
  };

  // BUG-16/17 fix: show coming-soon toast for 2 seconds
  const showComingSoon = (feature: string) => {
    setComingSoonMsg(`${feature} — Coming Soon`);
    setTimeout(() => setComingSoonMsg(""), 2000);
  };

  // BUG-03 fix: handleSave is now async and properly awaits addProject/updateProject
  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaveError("");
    setSaveSuccess(false);
    setIsLoading(true);

    const budgetStr = `₹${parseFloat(String(formData.budget)) || 0} Cr`;
    const spentStr = `₹${parseFloat(String(formData.spent)) || 0} Cr`;
    const completionLabel = formData.endDate ? formatDateLabel(formData.endDate) : "TBD";
    const autoSubdomain = formData.subdomain ||
      formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 30);

    try {
      if (mode === "create") {
        await addProject({
          name: formData.name,
          rera: formData.rera,
          subdomain: autoSubdomain,
          location: formData.address,
          status: formData.status,
          startDate: formData.startDate,
          endDate: formData.endDate,
          manager: formData.manager,
          description: formData.description,
          progress: 0,
          completion: completionLabel,
          budget: budgetStr,
          spent: spentStr,
          image: "https://images.unsplash.com/photo-1483094035713-218a81c0d971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        });
        setSaveSuccess(true);
        // Navigate after short delay so user sees success
        setTimeout(() => onNavigate("listing"), 900);
      } else if (projectId) {
        await updateProject(projectId, {
          name: formData.name,
          rera: formData.rera,
          tenantId: formData.subdomain,
          location: formData.address,
          status: formData.status,
          startDate: formData.startDate,
          endDate: formData.endDate,
          manager: formData.manager,
          description: formData.description,
          budget: budgetStr,
          spent: spentStr,
        });
        setSaveSuccess(true);
        setTimeout(() => onNavigate("overview", projectId), 900);
      }
    } catch (err: any) {
      // BUG-08 fix: show error banner in the UI
      setSaveError(err.message || "Failed to save project. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all text-foreground ${
      fieldErrors[field]
        ? "border-red-400 focus:ring-red-300/40"
        : "border-border focus:ring-primary/20"
    }`;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => onNavigate(mode === "edit" ? "overview" : "listing", projectId)}
          className="p-2 border border-border rounded-lg bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "create" ? "Create New Project" : "Edit Project Details"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Add a new real estate development to your portfolio."
              : `Updating information for ${formData.name}`}
          </p>
        </div>
      </div>

      {/* Coming-soon toast (BUG-16/17 fix) */}
      {comingSoonMsg && (
        <div className="flex items-center gap-2 mb-4 text-sm text-blue-700 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg px-4 py-2.5">
          <Info size={15} className="flex-shrink-0" />
          {comingSoonMsg}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 space-y-8">

          {/* ─ Section 1: Basic Info ─ */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8">

              {/* Project Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputCls("name")}
                  placeholder="e.g. Shri Hari Elegance"
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} /> {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Workspace Subdomain */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Workspace Subdomain <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleSubdomainChange}
                    className={`w-full bg-background border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all text-foreground ${
                      fieldErrors.subdomain
                        ? "border-red-400 focus:ring-red-300/40"
                        : "border-border focus:ring-primary/20"
                    }`}
                    placeholder="e.g. elegance"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-border bg-muted text-muted-foreground text-xs font-semibold">
                    .localhost
                  </span>
                </div>
                {fieldErrors.subdomain ? (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} /> {fieldErrors.subdomain}
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Workspace URL:{" "}
                    <a
                      href={`http://${formData.subdomain || "subdomain"}.localhost:${window.location.port || "5173"}/saas`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      http://{formData.subdomain || "subdomain"}.localhost:{window.location.port || "5173"}/saas
                    </a>
                  </p>
                )}
              </div>

              {/* RERA */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">RERA Number</label>
                <input
                  type="text"
                  name="rera"
                  value={formData.rera}
                  onChange={handleChange}
                  className={inputCls("rera")}
                  placeholder="e.g. PR/GJ/..."
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-medium text-foreground">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Brief description of the project..."
                />
              </div>
            </div>
          </section>

          {/* ─ Section 2: Location ─ */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
              Location Details
            </h3>
            <div className="grid grid-cols-1 gap-4 pl-8">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Site Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full bg-background border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.address
                        ? "border-red-400 focus:ring-red-300/40"
                        : "border-border focus:ring-primary/20"
                    }`}
                    placeholder="Enter full address"
                  />
                </div>
                {fieldErrors.address && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} /> {fieldErrors.address}
                  </p>
                )}
              </div>

              {/* BUG-16 fix: Map pin button shows "Coming soon" */}
              <div className="h-48 bg-muted rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1687840430404-b82859282de4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Map Placeholder"
                  className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity"
                />
                <button
                  type="button"
                  onClick={() => showComingSoon("Interactive map pin")}
                  className="relative bg-card text-card-foreground border border-border shadow-sm px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors z-10"
                >
                  📍 Pin Location on Map
                </button>
              </div>
            </div>
          </section>

          {/* ─ Section 3: Timeline & Status ─ */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
              Timeline &amp; Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Project Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>Planning</option>
                  <option>Approvals Pending</option>
                  <option>Under Construction</option>
                  <option>Completed</option>
                  <option>Handover</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Start Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Est. Completion</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {formData.endDate && (
                  <p className="text-[10px] text-muted-foreground">
                    Displays as: <strong>{formatDateLabel(formData.endDate)}</strong>
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ─ Section 4: Financials ─ */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">4</span>
              Financial Details (in Crores)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
              {/* Budget */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Total Budget (Cr) <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border bg-muted text-muted-foreground text-xs font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={`w-full bg-background border rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all text-foreground ${
                      fieldErrors.budget
                        ? "border-red-400 focus:ring-red-300/40"
                        : "border-border focus:ring-primary/20"
                    }`}
                    placeholder="e.g. 120"
                    step="0.01"
                    min="0"
                  />
                </div>
                {fieldErrors.budget && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} /> {fieldErrors.budget}
                  </p>
                )}
              </div>
              {/* Spent */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Amount Spent (Cr)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border bg-muted text-muted-foreground text-xs font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="spent"
                    value={formData.spent}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    placeholder="e.g. 78"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ─ Section 5: Staff Assignment ─ */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">5</span>
              Staff Assignment
            </h3>
            <div className="pl-8">
              <div className="space-y-1.5 max-w-md">
                <label className="text-xs font-medium text-foreground">Project Manager</label>
                {/* BUG-12 fix: managers loaded dynamically from API */}
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a manager</option>
                  {managers.map((m: string) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground">
                  Managers are loaded from the system. Add staff under Team &rarr; Users.
                </p>
              </div>
            </div>
          </section>

          {/* ─ Section 6: Gallery ─ */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">6</span>
              Project Gallery
            </h3>
            <div className="pl-8">
              {/* BUG-17 fix: upload section shows "Coming soon" */}
              <div
                onClick={() => showComingSoon("Image upload")}
                className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-medium">Click to upload or drag &amp; drop</p>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 10MB)</p>
                <span className="mt-2 text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* ─ Footer ─ */}
        <div className="bg-muted/50 p-4 border-t border-border flex flex-col gap-3">
          {/* BUG-08 fix: error banner */}
          {saveError && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg px-3 py-2.5">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{saveError}</span>
            </div>
          )}
          {saveSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-lg px-3 py-2.5">
              <CheckCircle2 size={15} className="flex-shrink-0" />
              Project {mode === "create" ? "created" : "updated"} successfully! Redirecting…
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate(mode === "edit" ? "overview" : "listing", projectId)}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-card hover:bg-background transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            {/* BUG-07 fix: disabled while loading, shows spinner */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || saveSuccess}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <><Loader2 size={15} className="animate-spin" /> Saving…</>
              ) : saveSuccess ? (
                <><CheckCircle2 size={15} /> Saved!</>
              ) : (
                <><Save size={15} />{mode === "create" ? "Create Project" : "Save Changes"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}