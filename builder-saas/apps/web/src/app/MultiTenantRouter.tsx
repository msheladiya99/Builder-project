import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import { useAuthStore } from "./store/store";

// Lazy load the components
const AuthPage = lazy(() => import("./components/auth/AuthPage").then(m => ({ default: m.AuthPage })));
const SuperAdminDashboard = lazy(() => import("./components/admin/SuperAdminDashboard").then(m => ({ default: m.SuperAdminDashboard })));
const App = lazy(() => import("./App"));
const SaasPlatform = lazy(() => import("./components/saas/SaasPlatform").then(m => ({ default: m.SaasPlatform })));

const Fallback = () => (
  <div className="flex h-screen items-center justify-center bg-background/50 backdrop-blur-sm">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export function MultiTenantRouter() {
  const [hostname, setHostname] = useState(window.location.hostname);
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  // Multi-tenant subdomain detection logic
  const parts = hostname.split(".");
  let isTenant = false;
  let subdomain = "";

  // For localhost (e.g. project1.localhost)
  if (hostname.includes("localhost") && parts.length > 1) {
    isTenant = true;
    subdomain = parts[0];
  } 
  // For real domains (e.g. project1.shrihari.in)
  else if (!hostname.includes("localhost") && parts.length > 2 && parts[0] !== "www") {
    isTenant = true;
    subdomain = parts[0];
  }

  // If we are on the main domain (Super Admin)
  if (!isTenant) {
    if (!isAuthenticated) {
      return (
        <Suspense fallback={<Fallback />}>
          <div className="relative">
             {/* Dev-only bypass button */}
            <button 
              onClick={() => {
                localStorage.setItem("auth_token", "dev-bypass-token");
                localStorage.setItem("auth_user", JSON.stringify({ role: "Super Admin", email: "admin@shrihari.in" }));
                useAuthStore.setState({ isAuthenticated: true, token: "dev-bypass-token", user: { role: "Super Admin", email: "admin@shrihari.in" } });
              }}
              className="fixed top-4 right-4 z-50 bg-red-500 text-white text-xs px-3 py-1.5 rounded shadow-lg opacity-50 hover:opacity-100"
            >
              Bypass Auth (Dev)
            </button>
            <AuthPage defaultScreen="super-admin" onLogin={() => {
              // Ensure we persist even if the default login didn't handle it for some reason
              if (!localStorage.getItem("auth_token")) {
                localStorage.setItem("auth_token", "dev-bypass-token");
              }
              useAuthStore.setState({ isAuthenticated: true });
            }} />
          </div>
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<Fallback />}>
        <SuperAdminDashboard isDark={false} onDarkToggle={() => {}} />
      </Suspense>
    );
  }

  // If we are on a Tenant subdomain (Project ERP)
  if (isTenant) {
    if (!isAuthenticated) {
      return (
        <Suspense fallback={<Fallback />}>
          <div className="relative h-screen bg-[#111827]">
             {/* Dev-only bypass button */}
            <button 
              onClick={() => {
                localStorage.setItem("auth_token", "dev-bypass-tenant-token");
                localStorage.setItem("auth_user", JSON.stringify({ role: "Project Admin", tenantId: subdomain, email: "user@hariheights.in" }));
                useAuthStore.setState({ isAuthenticated: true, token: "dev-bypass-tenant-token", user: { role: "Project Admin", tenantId: subdomain, email: "user@hariheights.in" } });
              }}
              className="fixed top-4 right-4 z-50 bg-emerald-500 text-white text-xs px-3 py-1.5 rounded shadow-lg opacity-50 hover:opacity-100"
            >
              Bypass Tenant Auth (Dev)
            </button>
            {/* The AuthPage contains the 'subdomain' screen ui */}
            <AuthPage defaultScreen="subdomain" subdomain={subdomain} onLogin={() => {
              if (!localStorage.getItem("auth_token")) {
                localStorage.setItem("auth_token", "dev-bypass-tenant-token");
              }
              useAuthStore.setState({ isAuthenticated: true });
            }} />
          </div>
        </Suspense>
      );
    }

    // Render the main ERP App for tenants directly, not the Design System App
    return (
      <Suspense fallback={<Fallback />}>
        <SaasPlatform isStandalone={true} tenantId={subdomain} onExit={() => {}} />
      </Suspense>
    );
  }

  return null;
}
