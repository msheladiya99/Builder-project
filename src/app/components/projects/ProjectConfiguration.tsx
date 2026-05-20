import { useState, useEffect } from "react";
import { ArrowLeft, Save, Shield, FileText, CheckCircle2, Clock, UploadCloud, Bell, Mail } from "lucide-react";
import { ProjectView } from "./ProjectManagementModule";
import { useProjects, ProjectSettings } from "./ProjectContext";

interface ProjectConfigurationProps {
  projectId: string;
  onNavigate: (view: ProjectView, projectId?: string) => void;
}

export function ProjectConfiguration({ projectId, onNavigate }: ProjectConfigurationProps) {
  const [activeTab, setActiveTab] = useState("general");
  const { projects, updateProject } = useProjects();
  
  // Find current project
  const project = projects.find(p => p.id === projectId);

  // States
  const [phase, setPhase] = useState("Phase 1 - Towers A & B");
  const [currency, setCurrency] = useState("INR (₹)");
  
  const [allowContractorsViewProgress, setAllowContractorsViewProgress] = useState(true);
  const [requireAdminApprovalBudget, setRequireAdminApprovalBudget] = useState(false);
  const [enableClientPortalAccess, setEnableClientPortalAccess] = useState(true);

  // Approvals & Legal states
  const [naNocStatus, setNaNocStatus] = useState<'approved' | 'pending'>('approved');
  const [buildingPlanStatus, setBuildingPlanStatus] = useState<'approved' | 'pending'>('approved');
  const [environmentalStatus, setEnvironmentalStatus] = useState<'approved' | 'pending'>('pending');
  const [fireSafetyStatus, setFireSafetyStatus] = useState<'approved' | 'pending'>('pending');

  // Notifications states
  const [taskCompletion, setTaskCompletion] = useState(true);
  const [budgetThreshold, setBudgetThreshold] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [weeklyPdfSummary, setWeeklyPdfSummary] = useState(true);
  const [criticalPathDelays, setCriticalPathDelays] = useState(true);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Populate form with saved database settings when project loads
  useEffect(() => {
    if (project?.settings) {
      const s = project.settings;
      if (s.phase) setPhase(s.phase);
      if (s.currency) setCurrency(s.currency);
      if (s.allowContractorsViewProgress !== undefined) setAllowContractorsViewProgress(s.allowContractorsViewProgress);
      if (s.requireAdminApprovalBudget !== undefined) setRequireAdminApprovalBudget(s.requireAdminApprovalBudget);
      if (s.enableClientPortalAccess !== undefined) setEnableClientPortalAccess(s.enableClientPortalAccess);
      if (s.approvals) {
        if (s.approvals.naNocStatus) setNaNocStatus(s.approvals.naNocStatus);
        if (s.approvals.buildingPlanStatus) setBuildingPlanStatus(s.approvals.buildingPlanStatus);
        if (s.approvals.environmentalStatus) setEnvironmentalStatus(s.approvals.environmentalStatus);
        if (s.approvals.fireSafetyStatus) setFireSafetyStatus(s.approvals.fireSafetyStatus);
      }
      if (s.notifications) {
        if (s.notifications.taskCompletion !== undefined) setTaskCompletion(s.notifications.taskCompletion);
        if (s.notifications.budgetThreshold !== undefined) setBudgetThreshold(s.notifications.budgetThreshold);
        if (s.notifications.dailySummary !== undefined) setDailySummary(s.notifications.dailySummary);
        if (s.notifications.weeklyPdfSummary !== undefined) setWeeklyPdfSummary(s.notifications.weeklyPdfSummary);
        if (s.notifications.criticalPathDelays !== undefined) setCriticalPathDelays(s.notifications.criticalPathDelays);
      }
    }
  }, [project]);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    
    const updatedSettings: ProjectSettings = {
      phase,
      currency,
      allowContractorsViewProgress,
      requireAdminApprovalBudget,
      enableClientPortalAccess,
      approvals: {
        naNocStatus,
        buildingPlanStatus,
        environmentalStatus,
        fireSafetyStatus
      },
      notifications: {
        taskCompletion,
        budgetThreshold,
        dailySummary,
        weeklyPdfSummary,
        criticalPathDelays
      }
    };

    try {
      await updateProject(projectId, { settings: updatedSettings });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Failed to save project settings", e);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General Settings" },
    { id: "approvals", label: "Approvals & Legal" },
    { id: "notifications", label: "Notifications" }
  ];

  if (!project) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading project configuration...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => onNavigate("overview", projectId)}
          className="p-2 border border-border rounded-lg bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Configuration</h1>
          <p className="text-sm text-muted-foreground">Manage settings and approvals for {project.name}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between min-h-[420px]">
          
          <div className="flex-1">
            {activeTab === "general" && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">General Settings</h3>
                <div className="space-y-6">
                  
                  <div className="space-y-4 max-w-lg">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Project Phase</label>
                      <select 
                        value={phase}
                        onChange={(e) => setPhase(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      >
                        <option>Phase 1 - Towers A & B</option>
                        <option>Phase 2 - Towers C & D</option>
                        <option>Phase 3 - Commercial</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Default Currency</label>
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      >
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-border" />
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Shield size={16} className="text-primary"/> Access Control
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={allowContractorsViewProgress}
                          onChange={(e) => setAllowContractorsViewProgress(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background cursor-pointer" 
                        />
                        <span className="text-sm select-none">Allow contractors to view overall progress</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={requireAdminApprovalBudget}
                          onChange={(e) => setRequireAdminApprovalBudget(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background cursor-pointer" 
                        />
                        <span className="text-sm select-none">Require admin approval for budget changes &gt; 5%</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={enableClientPortalAccess}
                          onChange={(e) => setEnableClientPortalAccess(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background cursor-pointer" 
                        />
                        <span className="text-sm select-none">Enable client portal access for booked units</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === "approvals" && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Approvals & Legal Documents</h3>
                
                <div className="space-y-4">
                  {[
                    { name: "NA/NOC Document", status: naNocStatus, setStatus: setNaNocStatus, date: "12 Jan 2023" },
                    { name: "Building Plan Approval (AUDA)", status: buildingPlanStatus, setStatus: setBuildingPlanStatus, date: "05 Feb 2023" },
                    { name: "Environmental Clearance", status: environmentalStatus, setStatus: setEnvironmentalStatus, date: "Submitted 10 Mar 2023" },
                    { name: "Fire Safety NOC", status: fireSafetyStatus, setStatus: setFireSafetyStatus, date: "Required before completion" },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${doc.status === 'approved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <select
                          value={doc.status}
                          onChange={(e) => doc.setStatus(e.target.value as 'approved' | 'pending')}
                          className="bg-background border border-border rounded px-2.5 py-1 text-xs font-semibold focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                        </select>

                        {doc.status === 'approved' ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/5 px-2 py-1 rounded border border-success/10">
                            <CheckCircle2 size={13} /> Approved
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-warning bg-warning/5 px-2 py-1 rounded border border-warning/10">
                            <Clock size={13} /> Pending
                          </span>
                        )}
                        <button className="text-primary hover:text-primary/80 transition-colors p-1" title="Upload document">
                          <UploadCloud size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Notification Preferences</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Bell size={16} className="text-primary"/> Push Notifications
                    </h4>
                    <div className="space-y-4 pl-6">
                      
                      <div className="flex items-center justify-between max-w-md">
                        <span className="text-sm text-foreground">Task completion updates</span>
                        <button
                          type="button"
                          onClick={() => setTaskCompletion(!taskCompletion)}
                          className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none ${
                            taskCompletion ? "bg-primary" : "bg-muted border border-border"
                          }`}
                        >
                          <span className={`inline-block w-3 h-3 transform rounded-full bg-card transition-transform ${
                            taskCompletion ? "translate-x-5" : "translate-x-1"
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between max-w-md">
                        <span className="text-sm text-foreground">Budget threshold alerts</span>
                        <button
                          type="button"
                          onClick={() => setBudgetThreshold(!budgetThreshold)}
                          className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none ${
                            budgetThreshold ? "bg-primary" : "bg-muted border border-border"
                          }`}
                        >
                          <span className={`inline-block w-3 h-3 transform rounded-full bg-card transition-transform ${
                            budgetThreshold ? "translate-x-5" : "translate-x-1"
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between max-w-md">
                        <span className="text-sm text-foreground">Daily progress summary</span>
                        <button
                          type="button"
                          onClick={() => setDailySummary(!dailySummary)}
                          className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none ${
                            dailySummary ? "bg-primary" : "bg-muted border border-border"
                          }`}
                        >
                          <span className={`inline-block w-3 h-3 transform rounded-full bg-card transition-transform ${
                            dailySummary ? "translate-x-5" : "translate-x-1"
                          }`} />
                        </button>
                      </div>

                    </div>
                  </div>

                  <hr className="border-border" />

                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Mail size={16} className="text-primary"/> Email Reports
                    </h4>
                    <div className="space-y-4 pl-6">
                      
                      <div className="flex items-center justify-between max-w-md">
                        <span className="text-sm text-foreground">Weekly PDF summary</span>
                        <button
                          type="button"
                          onClick={() => setWeeklyPdfSummary(!weeklyPdfSummary)}
                          className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none ${
                            weeklyPdfSummary ? "bg-primary" : "bg-muted border border-border"
                          }`}
                        >
                          <span className={`inline-block w-3 h-3 transform rounded-full bg-card transition-transform ${
                            weeklyPdfSummary ? "translate-x-5" : "translate-x-1"
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between max-w-md">
                        <span className="text-sm text-foreground">Critical path delays</span>
                        <button
                          type="button"
                          onClick={() => setCriticalPathDelays(!criticalPathDelays)}
                          className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none ${
                            criticalPathDelays ? "bg-primary" : "bg-muted border border-border"
                          }`}
                        >
                          <span className={`inline-block w-3 h-3 transform rounded-full bg-card transition-transform ${
                            criticalPathDelays ? "translate-x-5" : "translate-x-1"
                          }`} />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted p-4 border-t border-border flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground pl-2">
              {savedSuccess && (
                <span className="text-success font-medium flex items-center gap-1 animate-pulse">
                  <CheckCircle2 size={14} /> Configuration saved to database!
                </span>
              )}
            </span>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              {saving ? (
                <>
                  <Clock className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Configuration
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}