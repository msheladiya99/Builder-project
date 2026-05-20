import { useState } from "react";
import { ArrowLeft, UploadCloud, MapPin, Calendar as CalendarIcon, Save } from "lucide-react";
import { ProjectView } from "./ProjectManagementModule";
import { useProjects } from "./ProjectContext";
import { format } from "date-fns";

interface ProjectFormProps {
  mode: "create" | "edit";
  projectId?: string;
  onNavigate: (view: ProjectView, projectId?: string) => void;
}

export function ProjectForm({ mode, projectId, onNavigate }: ProjectFormProps) {
  const { addProject, updateProject, getProject } = useProjects();
  
  const existingProject = mode === "edit" && projectId ? getProject(projectId) : null;

  const [formData, setFormData] = useState({
    name: existingProject?.name || "",
    subdomain: existingProject?.tenantId || "",
    rera: existingProject?.rera || "",
    address: existingProject?.location || "",
    status: existingProject?.status || "Planning",
    startDate: existingProject?.startDate || "",
    endDate: existingProject?.endDate || "",
    manager: existingProject?.manager || "",
    description: existingProject?.description || ""
  });

  const [isSubdomainManual, setIsSubdomainManual] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === "name" && mode === "create" && !isSubdomainManual) {
        next.subdomain = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .slice(0, 30);
      }
      return next;
    });
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubdomainManual(true);
    setFormData(prev => ({
      ...prev,
      subdomain: e.target.value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 30)
    }));
  };

  const handleSave = () => {
    if (mode === "create") {
      addProject({
        name: formData.name,
        rera: formData.rera,
        subdomain: formData.subdomain || formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 30),
        location: formData.address,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        manager: formData.manager,
        description: formData.description,
        progress: 0,
        completion: formData.endDate ? new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "TBD",
        budget: "₹0 Cr",
        spent: "₹0 Cr",
        image: "https://images.unsplash.com/photo-1483094035713-218a81c0d971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGZhY2FkZSUyMGJ1aWxkaW5nJTIwdW5kZXIlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzc5MTY5ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
      });
      onNavigate("listing");
    } else if (projectId) {
      updateProject(projectId, {
        name: formData.name,
        rera: formData.rera,
        tenantId: formData.subdomain,
        location: formData.address,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        manager: formData.manager,
        description: formData.description,
      });
      onNavigate("overview", projectId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
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
            {mode === "create" ? "Add a new real estate development." : `Updating information for ${formData.name}`}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 space-y-8">
          
          {/* Basic Info */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Project Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  placeholder="e.g. Shri Hari Elegance"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Workspace Subdomain</label>
                <div className="flex">
                  <input 
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleSubdomainChange}
                    className="w-full bg-background border border-border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 text-foreground"
                    placeholder="e.g. elegance"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-border bg-muted text-muted-foreground text-xs font-semibold">
                    .localhost
                  </span>
                </div>
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
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">RERA Number</label>
                <input 
                  type="text"
                  name="rera"
                  value={formData.rera}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  placeholder="e.g. PR/GJ/..."
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
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

          {/* Location & Maps */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
              Location Details
            </h3>
            <div className="grid grid-cols-1 gap-4 pl-8">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Site Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
              
              <div className="h-48 bg-muted rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1687840430404-b82859282de4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaG1lZGFiYWQlMjBjaXR5JTIwbWFwJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzkxNjk4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Map Placeholder" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity"
                />
                <button className="relative bg-card text-card-foreground border border-border shadow-sm px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors z-10">
                  Pin Location on Map
                </button>
              </div>
            </div>
          </section>

          {/* Timeline & Status */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
              Timeline & Status
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
              </div>
            </div>
          </section>

          {/* Staff Assignment */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">4</span>
              Staff Assignment
            </h3>
            <div className="pl-8">
              <div className="space-y-1.5 max-w-md">
                <label className="text-xs font-medium text-foreground">Project Manager</label>
                <select 
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a manager</option>
                  <option>Rakesh Patel</option>
                  <option>Amit Shah</option>
                  <option>Suresh Desai</option>
                </select>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">5</span>
              Project Gallery
            </h3>
            <div className="pl-8">
              <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-medium">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 10MB)</p>
              </div>
            </div>
          </section>

        </div>
        
        <div className="bg-muted p-4 border-t border-border flex justify-end gap-3">
          <button 
            onClick={() => onNavigate(mode === "edit" ? "overview" : "listing", projectId)}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-card hover:bg-background transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            {mode === "create" ? "Create Project" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}