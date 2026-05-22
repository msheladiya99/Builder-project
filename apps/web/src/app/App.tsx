import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";

// Lazy load design system sections
const OverviewSection = lazy(() => import("./components/sections/OverviewSection").then(m => ({ default: m.OverviewSection })));
const ColorsTypographySection = lazy(() => import("./components/sections/ColorsTypographySection").then(m => ({ default: m.ColorsTypographySection })));
const ButtonsFormsSection = lazy(() => import("./components/sections/ButtonsFormsSection").then(m => ({ default: m.ButtonsFormsSection })));
const DataDisplaySection = lazy(() => import("./components/sections/DataDisplaySection").then(m => ({ default: m.DataDisplaySection })));
const CardsSection = lazy(() => import("./components/sections/CardsSection").then(m => ({ default: m.CardsSection })));
const ChartsSection = lazy(() => import("./components/sections/ChartsSection").then(m => ({ default: m.ChartsSection })));
const OverlaysSection = lazy(() => import("./components/sections/OverlaysSection").then(m => ({ default: m.OverlaysSection })));
const EmptyNavSection = lazy(() => import("./components/sections/EmptyNavSection").then(m => ({ default: m.EmptyNavSection })));

// Lazy load modules
const ProjectManagementModule = lazy(() => import("./components/projects/ProjectManagementModule").then(m => ({ default: m.ProjectManagementModule })));
const FlatManagementModule = lazy(() => import("./components/flats/FlatManagementModule").then(m => ({ default: m.FlatManagementModule })));
const KYCModule = lazy(() => import("./components/kyc/KYCModule").then(m => ({ default: m.KYCModule })));
const AccountingModule = lazy(() => import("./components/accounting/AccountingModule").then(m => ({ default: m.AccountingModule })));
const InventoryModule = lazy(() => import("./components/inventory/InventoryModule").then(m => ({ default: m.InventoryModule })));
const ConstructionProgressModule = lazy(() => import("./components/construction-progress/ConstructionProgressModule").then(m => ({ default: m.ConstructionProgressModule })));
const ReportsModule = lazy(() => import("./components/reports/ReportsModule").then(m => ({ default: m.ReportsModule })));
const MobileERPModule = lazy(() => import("./components/pwa/MobileERPModule").then(m => ({ default: m.MobileERPModule })));
const NotificationModule = lazy(() => import("./components/notifications/NotificationModule").then(m => ({ default: m.NotificationModule })));
const OwnerPortalModule = lazy(() => import("./components/owner-portal/OwnerPortalModule").then(m => ({ default: m.OwnerPortalModule })));
const SaasPlatform = lazy(() => import("./components/saas/SaasPlatform").then(m => ({ default: m.SaasPlatform })));
const AuthPage = lazy(() => import("./components/auth/AuthPage").then(m => ({ default: m.AuthPage })));
const SuperAdminDashboard = lazy(() => import("./components/admin/SuperAdminDashboard").then(m => ({ default: m.SuperAdminDashboard })));

const designSystemNav = [
  { label: "Dashboard", path: "/", emoji: "🏗️", desc: "Live ERP overview" },
  { label: "Colors & Tokens", path: "/colors", emoji: "🎨", desc: "Brand palette & tokens" },
  { label: "Buttons & Forms", path: "/buttons", emoji: "🔘", desc: "Controls & inputs" },
  { label: "Tables & Badges", path: "/tables", emoji: "📊", desc: "Data tables & status" },
  { label: "Cards", path: "/cards", emoji: "🃏", desc: "Card patterns" },
  { label: "Charts", path: "/charts", emoji: "📈", desc: "Analytics & visualization" },
  { label: "Modals & Toasts", path: "/modals", emoji: "💬", desc: "Overlays & notifications" },
  { label: "Empty States & Nav", path: "/empty", emoji: "📱", desc: "Empty states & mobile nav" },
];

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dsOpen, setDsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(d => !d);

  // Check if we are inside the design system view or app mode view
  const isDesignSystemRoute = designSystemNav.some(n => n.path === location.pathname);

  // Loader for lazy suspense
  const Fallback = () => (
    <div className="flex h-full items-center justify-center bg-background/50 backdrop-blur-sm p-10">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Mobile PWA mode
  if (location.pathname === "/pwa") {
    return (
      <div className="min-h-screen flex flex-col bg-[#111827]" style={{ height: "100vh" }}>
        <div className="bg-[#0F1C2E] border-b border-white/8 px-4 py-2 flex items-center gap-3 shrink-0 z-50">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to Design System
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Mobile PWA · Offline-First ERP</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div className="relative w-full max-w-[390px] h-full max-h-[820px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#1a1a1a]" style={{ boxShadow: "0 0 0 8px #111, 0 40px 80px rgba(0,0,0,0.8)" }}>
            <Suspense fallback={<Fallback />}><MobileERPModule isDark={isDark} onDarkToggle={toggleDark} /></Suspense>
          </div>
        </div>
      </div>
    );
  }

  // Reports mode
  if (location.pathname === "/reports") {
    return (
      <div className="min-h-screen flex flex-col bg-background" style={{ height: "100vh" }}>
        <div className="bg-[#0F1C2E] border-b border-white/8 px-4 py-2 flex items-center gap-3 z-50 shrink-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to Design System
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Analytics & Reports</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Fallback />}><ReportsModule isDark={isDark} onDarkToggle={toggleDark} /></Suspense>
        </div>
      </div>
    );
  }

  // Construction progress mode
  if (location.pathname === "/construction") {
    return (
      <div className="min-h-screen flex flex-col bg-background" style={{ height: "100vh" }}>
        <div className="bg-[#0F1C2E] border-b border-white/8 px-4 py-2 flex items-center gap-3 z-50 shrink-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to Design System
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Construction Project Progress Tracking</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Fallback />}><ConstructionProgressModule isDark={isDark} onDarkToggle={toggleDark} /></Suspense>
        </div>
      </div>
    );
  }

  // Inventory mode
  if (location.pathname === "/inventory") {
    return (
      <div className="min-h-screen flex flex-col bg-background" style={{ height: "100vh" }}>
        <div className="bg-[#0F1923] border-b border-white/8 px-4 py-2 flex items-center gap-3 z-50 shrink-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to Design System
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Material Purchase & Inventory Management</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Fallback />}><InventoryModule isDark={isDark} onDarkToggle={toggleDark} /></Suspense>
        </div>
      </div>
    );
  }

  // Accounting mode
  if (location.pathname === "/accounting") {
    return (
      <div className="min-h-screen flex flex-col bg-background" style={{ height: "100vh" }}>
        <div className="bg-[#0A1628] border-b border-white/8 px-4 py-2 flex items-center gap-3 z-50 shrink-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to Design System
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Accounting & Payment Management</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Fallback />}><AccountingModule isDark={isDark} onDarkToggle={toggleDark} /></Suspense>
        </div>
      </div>
    );
  }

  // Projects mode
  if (location.pathname === "/projects") {
    return (
      <div className="flex flex-col bg-background" style={{ height: "100vh" }}>
        <div className="bg-[#0A1628] border-b border-white/8 px-4 py-2 flex items-center gap-3 z-50 shrink-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to Design System
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Project Management Module</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Fallback />}><ProjectManagementModule isDark={isDark} onDarkToggle={toggleDark} /></Suspense>
        </div>
      </div>
    );
  }

  // KYC mode
  if (location.pathname === "/kyc") {
    return (
      <div className="flex flex-col bg-background" style={{ height: "100vh" }}>
        <div className="bg-[#0A1628] border-b border-white/8 px-4 py-2 flex items-center gap-3 z-50 shrink-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to Design System
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Owner KYC & Profile Management</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Fallback />}><KYCModule isDark={isDark} onDarkToggle={toggleDark} /></Suspense>
        </div>
      </div>
    );
  }

  // Flats mode
  if (location.pathname === "/flats") {
    return (
      <div className="flex flex-col bg-background" style={{ height: "100vh" }}>
        <div className="bg-[#0A1628] border-b border-white/8 px-4 py-2 flex items-center gap-3 z-50 shrink-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to Design System
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Flat & Unit Management</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Fallback />}><FlatManagementModule isDark={isDark} onDarkToggle={toggleDark} /></Suspense>
        </div>
      </div>
    );
  }

  // Admin mode
  if (location.pathname === "/admin") {
    return (
      <div className="flex flex-col" style={{ height: "100vh" }}>
        <div className="bg-[#0A1628] border-b border-white/8 px-4 py-2 flex items-center gap-3 z-50 shrink-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to Design System
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Super Admin Dashboard</span>
        </div>
        <div className="flex-1 overflow-auto">
          <Suspense fallback={<Fallback />}><SuperAdminDashboard isDark={isDark} onDarkToggle={toggleDark} /></Suspense>
        </div>
      </div>
    );
  }

  // SaaS Platform mode
  if (location.pathname === "/saas") {
    return <Suspense fallback={<Fallback />}><SaasPlatform onExit={() => navigate("/")} /></Suspense>;
  }

  // Owner Portal mode
  if (location.pathname === "/owner-portal") {
    return (
      <div className="min-h-screen flex flex-col bg-[#111827]" style={{ height: "100vh" }}>
        <div className="bg-[#0A1628] border-b border-white/8 px-4 py-2 flex items-center gap-3 shrink-0 z-50">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to ERP
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Owner Self-Service Portal</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div className="relative w-full max-w-[430px] h-full max-h-[860px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#1a1a1a]" style={{ boxShadow: "0 0 0 8px #111, 0 40px 80px rgba(0,0,0,0.8)" }}>
            <Suspense fallback={<Fallback />}><OwnerPortalModule onBack={() => navigate("/")} /></Suspense>
          </div>
        </div>
      </div>
    );
  }

  // Notifications mode
  if (location.pathname === "/notifications") {
    return (
      <div className="flex flex-col bg-background" style={{ height: "100vh" }}>
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Fallback />}><NotificationModule onBack={() => navigate("/")} /></Suspense>
        </div>
      </div>
    );
  }

  // Auth mode
  if (location.pathname === "/auth") {
    return (
      <div className="flex flex-col" style={{ height: "100vh" }}>
        <div className="bg-[#0A1628] border-b border-white/8 px-4 py-2 flex items-center gap-3 z-50 shrink-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors">
            ← Back to Design System
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Authentication Screens</span>
        </div>
        <div className="flex-1 overflow-auto">
          <Suspense fallback={<Fallback />}><AuthPage /></Suspense>
        </div>
      </div>
    );
  }

  // Design System layout (default shell)
  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <Sidebar
        activeSection={designSystemNav.find(n => n.path === location.pathname)?.label || "Dashboard"}
        onSectionChange={(l) => {
          const item = designSystemNav.find(n => n.label === l);
          if (item) navigate(item.path);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Navbar
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          isDark={isDark}
          onDarkToggle={toggleDark}
          activeSection={designSystemNav.find(n => n.path === location.pathname)?.label || "Dashboard"}
        />

        {/* Design System Tab Bar */}
        <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-14 z-10">
          <div className="flex items-center gap-0 px-4 overflow-x-auto scrollbar-none">
            {/* Apps & Modules Entry Points */}
            <button onClick={() => navigate("/saas")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-2 text-white bg-[#1B3A6B] rounded-md hover:bg-[#2563EB]" style={{ marginTop: "auto", marginBottom: "auto" }}>
              🏗️ BuildERP SaaS Platform
              <span className="text-[9px] bg-amber-400 text-black rounded-full px-1.5 py-0.5 font-bold">FULL</span>
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button onClick={() => navigate("/owner-portal")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              🏠 Owner Portal<span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/30 rounded-full px-1.5 py-0.5 font-bold">New</span>
            </button>
            <button onClick={() => navigate("/notifications")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              🔔 Notifications<span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/30 rounded-full px-1.5 py-0.5 font-bold">New</span>
            </button>
            <button onClick={() => navigate("/pwa")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              📱 Mobile PWA<span className="text-[9px] bg-green-500/10 text-green-600 border border-green-500/30 rounded-full px-1.5 py-0.5 font-bold">New</span>
            </button>
            <button onClick={() => navigate("/reports")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              📊 Reports<span className="text-[9px] bg-purple-500/10 text-purple-600 border border-purple-500/30 rounded-full px-1.5 py-0.5 font-bold">New</span>
            </button>
            <button onClick={() => navigate("/construction")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              🏗️ Construction<span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/30 rounded-full px-1.5 py-0.5 font-bold">New</span>
            </button>
            <button onClick={() => navigate("/projects")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              🏗️ Projects<span className="text-[9px] bg-primary/10 text-primary border border-primary/30 rounded-full px-1.5 py-0.5 font-bold">New</span>
            </button>
            <button onClick={() => navigate("/inventory")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              📦 Inventory<span className="text-[9px] bg-orange-500/10 text-orange-600 border border-orange-500/30 rounded-full px-1.5 py-0.5 font-bold">New</span>
            </button>
            <button onClick={() => navigate("/accounting")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              💰 Accounting<span className="text-[9px] bg-success/10 text-success border border-success/30 rounded-full px-1.5 py-0.5 font-bold">New</span>
            </button>
            <button onClick={() => navigate("/kyc")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              🔐 Owner KYC<span className="text-[9px] bg-primary/10 text-primary border border-primary/30 rounded-full px-1.5 py-0.5 font-bold">New</span>
            </button>
            <button onClick={() => navigate("/flats")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              🏠 Flats & Units<span className="text-[9px] bg-success/10 text-success border border-success/30 rounded-full px-1.5 py-0.5 font-bold">New</span>
            </button>
            <button onClick={() => navigate("/admin")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              🏢 Super Admin<span className="text-[9px] bg-primary/10 text-primary border border-primary/30 rounded-full px-1.5 py-0.5 font-bold">Live</span>
            </button>
            <button onClick={() => navigate("/auth")} className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 border-transparent whitespace-nowrap transition-all mr-1 text-muted-foreground hover:text-foreground hover:border-border">
              🔐 Auth Screens<span className="text-[9px] bg-secondary/10 text-secondary border border-secondary/30 rounded-full px-1.5 py-0.5 font-bold">8</span>
            </button>

            <div className="w-px h-5 bg-border mx-1" />

            {/* Design System Sections */}
            <button onClick={() => setDsOpen(o => !o)} className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all mr-2 ${dsOpen ? "border-secondary text-secondary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              Design System <span className={`text-[9px] border rounded-full px-1.5 py-0.5 transition-colors ${dsOpen ? "border-secondary text-secondary" : "border-border text-muted-foreground"}`}>{designSystemNav.length}</span>
            </button>
            <div className="w-px h-5 bg-border mr-2" />
            
            {designSystemNav.map(item => (
              <button
                key={item.label}
                onClick={() => { navigate(item.path); setDsOpen(false); }}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${location.pathname === item.path ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}
              >
                <span>{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* DS Quick Picker */}
          {dsOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setDsOpen(false)} />
              <div className="absolute left-0 top-full w-full bg-card border-b border-border shadow-xl z-30 px-4 py-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">SHG Design System — All Sections</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {designSystemNav.map(item => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setDsOpen(false); }}
                      className={`text-left px-3 py-2.5 rounded-xl border transition-all ${location.pathname === item.path ? "bg-primary/5 border-primary/30 text-primary" : "border-border hover:bg-muted text-foreground"}`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-base">{item.emoji}</span>
                        <span className="text-xs font-semibold">{item.label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground pl-6">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main content using Routes */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <Suspense fallback={<Fallback />}>
              <Routes>
                <Route path="/" element={<OverviewSection />} />
                <Route path="/colors" element={<ColorsTypographySection />} />
                <Route path="/buttons" element={<ButtonsFormsSection />} />
                <Route path="/tables" element={<DataDisplaySection />} />
                <Route path="/cards" element={<CardsSection />} />
                <Route path="/charts" element={<ChartsSection />} />
                <Route path="/modals" element={<OverlaysSection />} />
                <Route path="/empty" element={<EmptyNavSection />} />
                <Route path="*" element={<OverviewSection />} />
              </Routes>
            </Suspense>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-card border-t border-border">
          <div className="flex items-stretch">
            {[
              { icon: "🏗️", label: "Home", path: "/" },
              { icon: "🎨", label: "Colors", path: "/colors" },
              { icon: "📊", label: "Data", path: "/tables" },
              { icon: "📈", label: "Charts", path: "/charts" },
              { icon: "🔐", label: "Auth", path: "/auth" },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors relative ${location.pathname === item.path ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="text-[9px] font-semibold">{item.label}</span>
                {location.pathname === item.path && <span className="w-1 h-1 rounded-full bg-primary absolute bottom-1.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
