import { useState } from "react";
import {
  Shield, User, Fingerprint, CreditCard, Users, FileText,
  Lock, Moon, Sun, Bell, ChevronRight, Search, CheckCircle,
  AlertCircle, Clock, ChevronDown
} from "lucide-react";
import { OwnerProfile } from "./OwnerProfile";
import { AadhaarVerification } from "./AadhaarVerification";
import { PANVerification } from "./PANVerification";
import { CoApplicantForm } from "./CoApplicantForm";
import { NomineeDetails } from "./NomineeDetails";
import { DocumentVault } from "./DocumentVault";
import {
  mockOwners, kycStatusConfig, stepStatusConfig,
  kycScoreColor, kycScoreBg, type Owner
} from "./kycData";

export type KYCView = "profile" | "aadhaar" | "pan" | "co-applicant" | "nominee" | "document-vault";

interface KYCModuleProps {
  isDark: boolean;
  onDarkToggle: () => void;
}

const viewNav: { view: KYCView; icon: typeof Shield; label: string; shortLabel: string }[] = [
  { view: "profile",        icon: User,        label: "Owner Profile",      shortLabel: "Profile" },
  { view: "aadhaar",        icon: Fingerprint, label: "Aadhaar Verification", shortLabel: "Aadhaar" },
  { view: "pan",            icon: CreditCard,  label: "PAN Verification",   shortLabel: "PAN" },
  { view: "co-applicant",   icon: Users,       label: "Co-Applicant",       shortLabel: "Co-App." },
  { view: "nominee",        icon: User,        label: "Nominee Details",    shortLabel: "Nominee" },
  { view: "document-vault", icon: Lock,        label: "Document Vault",     shortLabel: "Vault" },
];

function KYCStepBadge({ status }: { status: string }) {
  if (status === "Verified") return <CheckCircle size={11} className="text-success" />;
  if (status === "Under Review" || status === "Uploaded" || status === "In Progress") return <Clock size={11} className="text-warning" />;
  if (status === "Rejected") return <AlertCircle size={11} className="text-destructive" />;
  return <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />;
}

export function KYCModule({ isDark, onDarkToggle }: KYCModuleProps) {
  const [currentView, setCurrentView] = useState<KYCView>("profile");
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>(mockOwners[0].id);
  const [ownerSearchOpen, setOwnerSearchOpen] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState("");

  const navigateTo = (view: KYCView, ownerId?: string) => {
    setCurrentView(view);
    if (ownerId) setSelectedOwnerId(ownerId);
  };

  const selectedOwner = mockOwners.find(o => o.id === selectedOwnerId) || mockOwners[0];
  const filteredOwners = mockOwners.filter(o =>
    o.name.toLowerCase().includes(ownerSearch.toLowerCase()) ||
    o.phone.includes(ownerSearch) ||
    o.pan.toLowerCase().includes(ownerSearch.toLowerCase())
  );

  const kscOwner = kycStatusConfig[selectedOwner.kycStatus];

  const getOwnerStepStatus = (owner: Owner, view: KYCView): string => {
    if (view === "aadhaar") return owner.aadhaarStatus;
    if (view === "pan") return owner.panStatus;
    if (view === "co-applicant") return owner.coApplicants.length > 0 ? owner.coApplicants[0].kycStatus : "Not Started";
    if (view === "nominee") return owner.nominees.length > 0 ? "Verified" : "Pending";
    return "Pending";
  };

  const breadcrumbLabel = viewNav.find(v => v.view === currentView)?.label || "Profile";

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 border-r border-border bg-card flex-col hidden md:flex shrink-0">
        {/* Sidebar header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">KYC Management</p>
              <p className="text-[10px] text-muted-foreground">Owner Verification Portal</p>
            </div>
          </div>

          {/* Owner selector */}
          <div className="relative">
            <button
              onClick={() => setOwnerSearchOpen(o => !o)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary/80 to-secondary/80 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {selectedOwner.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{selectedOwner.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${kscOwner.color.replace("text-", "bg-")}`} />
                  <span className={`text-[9px] font-semibold ${kscOwner.color}`}>{selectedOwner.kycStatus}</span>
                </div>
              </div>
              <ChevronDown size={13} className="text-muted-foreground shrink-0" />
            </button>

            {ownerSearchOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOwnerSearchOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        autoFocus
                        value={ownerSearch}
                        onChange={e => setOwnerSearch(e.target.value)}
                        placeholder="Search owner..."
                        className="w-full pl-7 pr-2 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredOwners.map(owner => {
                      const ksc = kycStatusConfig[owner.kycStatus];
                      return (
                        <button
                          key={owner.id}
                          onClick={() => { setSelectedOwnerId(owner.id); setOwnerSearchOpen(false); setOwnerSearch(""); setCurrentView("profile"); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-muted transition-colors ${owner.id === selectedOwnerId ? "bg-primary/5" : ""}`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary/80 to-secondary/80 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {owner.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{owner.name}</p>
                            <p className="text-[10px] text-muted-foreground">{owner.phone}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${ksc.bg} ${ksc.color} ${ksc.border}`}>
                            {owner.kycStatus === "Not Started" ? "New" : owner.kycStatus}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* KYC Score mini */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">KYC Score</p>
            <span className={`text-sm font-bold ${kycScoreColor(selectedOwner.kycScore)}`}>{selectedOwner.kycScore}/100</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${kycScoreBg(selectedOwner.kycScore)}`}
              style={{ width: `${selectedOwner.kycScore}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-1">KYC Steps</p>
          {viewNav.map((item, i) => {
            const stepSt = item.view !== "profile" && item.view !== "document-vault"
              ? getOwnerStepStatus(selectedOwner, item.view)
              : null;

            return (
              <button
                key={item.view}
                onClick={() => navigateTo(item.view, selectedOwnerId)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                  currentView === item.view
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {/* Step number for non-special views */}
                {item.view !== "profile" && item.view !== "document-vault" ? (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                    stepSt === "Verified"
                      ? "bg-success/10 border-success/30 text-success"
                      : stepSt === "Pending" || stepSt === "Not Started"
                      ? "bg-muted border-border text-muted-foreground"
                      : "bg-warning/10 border-warning/30 text-warning"
                  }`}>
                    {i}
                  </div>
                ) : (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${currentView === item.view ? "bg-primary/20" : "bg-muted"}`}>
                    <item.icon size={12} />
                  </div>
                )}
                <span className="flex-1">{item.label}</span>
                {stepSt && <KYCStepBadge status={stepSt} />}
              </button>
            );
          })}

          {/* Quick stats */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Quick Stats</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "Linked Flats", val: selectedOwner.linkedFlats.length },
                { label: "Co-Applicants", val: selectedOwner.coApplicants.length },
                { label: "Nominees", val: selectedOwner.nominees.length },
                { label: "RM", val: selectedOwner.rmName.split(" ")[0] },
              ].map(s => (
                <div key={s.label} className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold">{s.val}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Module header */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground hidden sm:inline">KYC</span>
            <ChevronRight size={13} className="text-muted-foreground hidden sm:inline" />
            <span className="text-muted-foreground hidden sm:inline truncate max-w-[120px]">{selectedOwner.name.split(" ")[0]}</span>
            <ChevronRight size={13} className="text-muted-foreground hidden sm:inline" />
            <span className="font-semibold">{breadcrumbLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onDarkToggle} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive border border-card" />
            </button>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1.5px]">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-[9px] font-bold">AD</div>
            </div>
          </div>
        </header>

        {/* Mobile tab bar */}
        <div className="md:hidden flex items-center gap-1 px-3 py-2 border-b border-border bg-card overflow-x-auto scrollbar-none shrink-0">
          {viewNav.map(item => (
            <button
              key={item.view}
              onClick={() => navigateTo(item.view, selectedOwnerId)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all shrink-0 ${
                currentView === item.view
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon size={11} />
              {item.shortLabel}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">
            {currentView === "profile" && (
              <OwnerProfile ownerId={selectedOwnerId} onNavigate={navigateTo} />
            )}
            {currentView === "aadhaar" && (
              <AadhaarVerification ownerId={selectedOwnerId} onNavigate={navigateTo} />
            )}
            {currentView === "pan" && (
              <PANVerification ownerId={selectedOwnerId} onNavigate={navigateTo} />
            )}
            {currentView === "co-applicant" && (
              <CoApplicantForm ownerId={selectedOwnerId} onNavigate={navigateTo} />
            )}
            {currentView === "nominee" && (
              <NomineeDetails ownerId={selectedOwnerId} onNavigate={navigateTo} />
            )}
            {currentView === "document-vault" && (
              <DocumentVault ownerId={selectedOwnerId} onNavigate={navigateTo} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
