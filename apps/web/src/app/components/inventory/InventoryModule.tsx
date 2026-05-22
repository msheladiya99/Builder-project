import { useState } from "react";
import {
  Users, ShoppingCart, Package, ArrowUpFromLine,
  Warehouse, Building2, ChevronDown, AlertTriangle, Truck
} from "lucide-react";
import { Site, mockStockItems, stockHealth } from "./inventoryData";
import { VendorManagementView } from "./views/VendorManagementView";
import { PurchaseOrdersView } from "./views/PurchaseOrdersView";
import { GoodsReceiptView } from "./views/GoodsReceiptView";
import { InventoryStockView } from "./views/InventoryStockView";
import { MaterialIssueView } from "./views/MaterialIssueView";
import { WarehouseTrackingView } from "./views/WarehouseTrackingView";
import { DashboardLayout } from "../layouts/DashboardLayout";

type InventoryView = "vendors" | "purchase-orders" | "grn" | "stock" | "issue" | "warehouse";

const SITES: Site[] = ["All Sites", "Tower A", "Tower B", "Tower C", "Club House", "Basement Parking"];

export function InventoryModule({ isDark, onDarkToggle }: { isDark: boolean; onDarkToggle: () => void }) {
  const [activeView, setActiveView] = useState<InventoryView>("stock");
  const [activeSite, setActiveSite] = useState<Site>("All Sites");
  const [siteOpen, setSiteOpen] = useState(false);

  // Global stock alert count
  const alertCount = mockStockItems.filter(s => {
    const h = stockHealth(s.currentStock, s.minStock, s.maxStock);
    return h === "Critical" || h === "Low";
  }).length;

  const navGroups = [
    {
      label: "Modules",
      items: [
        { id: "vendors", label: "Vendor Management", icon: Users },
        { id: "purchase-orders", label: "Purchase Orders", icon: ShoppingCart },
        { id: "grn", label: "Goods Receipt", icon: Truck },
        { 
          id: "stock", 
          label: "Inventory Stock", 
          icon: Package, 
          badge: alertCount > 0 ? <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeView === "stock" ? "bg-white/20 text-white" : "bg-orange-500/20 text-orange-400"}`}>{alertCount}</span> : undefined
        },
        { id: "issue", label: "Material Issue", icon: ArrowUpFromLine },
        { id: "warehouse", label: "Warehouse Tracking", icon: Warehouse },
      ]
    }
  ];

  function renderView() {
    switch (activeView) {
      case "vendors":        return <VendorManagementView site={activeSite} />;
      case "purchase-orders":return <PurchaseOrdersView site={activeSite} />;
      case "grn":            return <GoodsReceiptView site={activeSite} />;
      case "stock":          return <InventoryStockView site={activeSite} />;
      case "issue":          return <MaterialIssueView site={activeSite} />;
      case "warehouse":      return <WarehouseTrackingView site={activeSite} />;
    }
  }

  const HeaderContent = (
    <>
      <div className="relative mt-3">
        <button
          onClick={() => setSiteOpen(o => !o)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-[11px] font-bold text-white/80">{activeSite}</span>
          </div>
          <ChevronDown size={11} className={`text-white/40 transition-transform ${siteOpen ? "rotate-180" : ""}`} />
        </button>
        {siteOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1A2535] border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
            {SITES.map(s => (
              <button
                key={s}
                onClick={() => { setActiveSite(s); setSiteOpen(false); }}
                className={`w-full text-left px-3 py-2 text-[11px] font-semibold transition-colors hover:bg-white/8 ${activeSite === s ? "text-orange-400" : "text-white/60"}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {alertCount > 0 && (
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/15 border border-orange-500/25">
          <AlertTriangle size={12} className="text-orange-400 shrink-0" />
          <span className="text-[10px] font-bold text-orange-300">{alertCount} stock alerts active</span>
        </div>
      )}
    </>
  );

  const TopbarExtra = (
    <>
      <p className="text-[10px] text-muted-foreground mr-auto ml-2">
        {activeSite === "All Sites" ? "All Sites" : activeSite} · Shri Hari Residency · FY 2025-26
      </p>
      {alertCount > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <AlertTriangle size={12} className="text-orange-500" />
          <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">{alertCount} Alerts</span>
        </div>
      )}
    </>
  );

  return (
    <DashboardLayout
      title="Shri Hari Residency"
      subtitle="PRJ-2526 · Pune"
      logoIcon={<Building2 size={16} className="text-white" />}
      navGroups={navGroups}
      activeNav={activeView}
      onNavChange={(id) => setActiveView(id as InventoryView)}
      headerContent={HeaderContent}
      topbarExtra={TopbarExtra}
      isDark={isDark}
      onDarkToggle={onDarkToggle}
      sidebarTheme="dark"
      version="v2.4.1 · IMS"
    >
      {renderView()}
    </DashboardLayout>
  );
}
