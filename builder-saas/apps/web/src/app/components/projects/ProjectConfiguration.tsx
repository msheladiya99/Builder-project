import { useState } from "react";
import { ArrowLeft, Save, Shield, FileText, CheckCircle2, Clock, UploadCloud, Bell, Mail } from "lucide-react";
import { ProjectView } from "./ProjectManagementModule";

interface ProjectConfigurationProps {
  projectId: string;
  onNavigate: (view: ProjectView, projectId?: string) => void;
}

export function ProjectConfiguration({ projectId, onNavigate }: ProjectConfigurationProps) {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General Settings" },
    { id: "approvals", label: "Approvals & Legal" },
    { id: "notifications", label: "Notifications" }
  ];

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
          <p className="text-sm text-muted-foreground">Manage settings and approvals for Shri Hari Heights</p>
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
        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          
          {activeTab === "general" && (
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">General Settings</h3>
              <div className="space-y-6">
                
                <div className="space-y-4 max-w-lg">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Project Phase</label>
                    <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20">
                      <option>Phase 1 - Towers A & B</option>
                      <option>Phase 2 - Towers C & D</option>
                      <option>Phase 3 - Commercial</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Default Currency</label>
                    <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20">
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
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background" />
                      <span className="text-sm">Allow contractors to view overall progress</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background" />
                      <span className="text-sm">Require admin approval for budget changes &gt; 5%</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background" />
                      <span className="text-sm">Enable client portal access for booked units</span>
                    </label>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Approvals & Legal Documents</h3>
              
              <div className="space-y-4">
                {[
                  { name: "NA/NOC Document", status: "approved", date: "12 Jan 2023" },
                  { name: "Building Plan Approval (AUDA)", status: "approved", date: "05 Feb 2023" },
                  { name: "Environmental Clearance", status: "pending", date: "Submitted 10 Mar 2023" },
                  { name: "Fire Safety NOC", status: "pending", date: "Required before completion" },
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
                      {doc.status === 'approved' ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">
                          <CheckCircle2 size={14} /> Approved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded">
                          <Clock size={14} /> Pending
                        </span>
                      )}
                      <button className="text-primary hover:text-primary/80 text-sm font-medium">
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
              <h3 className="text-lg font-bold mb-4">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Bell size={16} className="text-primary"/> Push Notifications
                  </h4>
                  <div className="space-y-3 pl-6">
                    <label className="flex items-center justify-between max-w-md cursor-pointer group">
                      <span className="text-sm text-foreground">Task completion updates</span>
                      <div className="relative inline-flex items-center h-5 w-9 rounded-full bg-primary/20 transition-colors">
                        <span className="translate-x-4 inline-block w-3 h-3 transform bg-primary rounded-full transition-transform" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between max-w-md cursor-pointer group">
                      <span className="text-sm text-foreground">Budget threshold alerts</span>
                      <div className="relative inline-flex items-center h-5 w-9 rounded-full bg-primary/20 transition-colors">
                        <span className="translate-x-4 inline-block w-3 h-3 transform bg-primary rounded-full transition-transform" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between max-w-md cursor-pointer group">
                      <span className="text-sm text-foreground">Daily progress summary</span>
                      <div className="relative inline-flex items-center h-5 w-9 rounded-full bg-muted transition-colors border border-border">
                        <span className="translate-x-1 inline-block w-3 h-3 transform bg-muted-foreground rounded-full transition-transform" />
                      </div>
                    </label>
                  </div>
                </div>

                <hr className="border-border" />

                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Mail size={16} className="text-primary"/> Email Reports
                  </h4>
                  <div className="space-y-3 pl-6">
                    <label className="flex items-center justify-between max-w-md cursor-pointer group">
                      <span className="text-sm text-foreground">Weekly PDF summary</span>
                      <div className="relative inline-flex items-center h-5 w-9 rounded-full bg-primary/20 transition-colors">
                        <span className="translate-x-4 inline-block w-3 h-3 transform bg-primary rounded-full transition-transform" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between max-w-md cursor-pointer group">
                      <span className="text-sm text-foreground">Critical path delays</span>
                      <div className="relative inline-flex items-center h-5 w-9 rounded-full bg-primary/20 transition-colors">
                        <span className="translate-x-4 inline-block w-3 h-3 transform bg-primary rounded-full transition-transform" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-muted p-4 border-t border-border flex justify-end gap-3">
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 transition-colors">
              <Save size={16} />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}