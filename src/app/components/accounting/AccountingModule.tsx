import { useState } from "react";
import {
  Receipt, FileText, BarChart2, BookOpen, PenLine, CreditCard,
  TrendingUp, Scale, ArrowUpDown, Building2, ChevronDown
} from "lucide-react";
import { FinancialYear } from "./accountingData";
import { ReceiptsView } from "./views/ReceiptsView";
import { InvoicesView } from "./views/InvoicesView";
import { GSTReportsView } from "./views/GSTReportsView";
import { LedgerView } from "./views/LedgerView";
import { JournalEntriesView } from "./views/JournalEntriesView";
import { ExpensesView } from "./views/ExpensesView";
import { ProfitLossView } from "./views/ProfitLossView";
import { BalanceSheetView } from "./views/BalanceSheetView";
import { CashFlowView } from "./views/CashFlowView";
import { DashboardLayout } from "../layouts/DashboardLayout";

type AccountingView = "receipts" | "invoices" | "gst" | "ledger" | "journal" | "expenses" | "pl" | "balance" | "cashflow";

const navGroups = [
  {
    label: "Transactions",
    items: [
      { id: "receipts" as AccountingView, label: "Receipts", icon: Receipt },
      { id: "invoices" as AccountingView, label: "Invoices", icon: FileText },
      { id: "expenses" as AccountingView, label: "Expenses", icon: CreditCard },
      { id: "journal" as AccountingView, label: "Journal Entries", icon: PenLine },
    ],
  },
  {
    label: "Reports",
    items: [
      { 
        id: "gst" as AccountingView, 
        label: "GST Reports", 
        icon: BarChart2, 
        badge: <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">GSTR-1</span> 
      },
      { id: "ledger" as AccountingView, label: "Ledger", icon: BookOpen },
      { id: "pl" as AccountingView, label: "Profit & Loss", icon: TrendingUp },
      { id: "balance" as AccountingView, label: "Balance Sheet", icon: Scale },
      { id: "cashflow" as AccountingView, label: "Cash Flow", icon: ArrowUpDown },
    ],
  },
];

const FY_OPTIONS: FinancialYear[] = ["2025-26", "2024-25", "2023-24"];

export function AccountingModule({ isDark, onDarkToggle }: { isDark: boolean; onDarkToggle: () => void }) {
  const [activeView, setActiveView] = useState<AccountingView>("receipts");
  const [fy, setFy] = useState<FinancialYear>("2025-26");
  const [fyOpen, setFyOpen] = useState(false);

  function renderView() {
    switch (activeView) {
      case "receipts":   return <ReceiptsView fy={fy} />;
      case "invoices":   return <InvoicesView fy={fy} />;
      case "gst":        return <GSTReportsView fy={fy} />;
      case "ledger":     return <LedgerView fy={fy} />;
      case "journal":    return <JournalEntriesView fy={fy} />;
      case "expenses":   return <ExpensesView fy={fy} />;
      case "pl":         return <ProfitLossView fy={fy} />;
      case "balance":    return <BalanceSheetView fy={fy} />;
      case "cashflow":   return <CashFlowView fy={fy} />;
    }
  }

  const HeaderContent = (
    <div className="relative mt-3">
      <button
        onClick={() => setFyOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
      >
        <span className="text-xs font-bold text-foreground">FY {fy}</span>
        <ChevronDown size={12} className={`text-muted-foreground transition-transform ${fyOpen ? "rotate-180" : ""}`} />
      </button>
      {fyOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
          {FY_OPTIONS.map(f => (
            <button
              key={f}
              onClick={() => { setFy(f); setFyOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted/40 ${fy === f ? "text-primary bg-primary/5" : "text-foreground"}`}
            >
              FY {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const TopbarExtra = (
    <p className="text-[10px] text-muted-foreground">Financial Year {fy} · Shri Hari Group</p>
  );

  return (
    <DashboardLayout
      title="Shri Hari Group"
      subtitle="27AABCS1234K1Z5"
      logoIcon={<Building2 size={15} className="text-white" />}
      navGroups={navGroups}
      activeNav={activeView}
      onNavChange={(id) => setActiveView(id as AccountingView)}
      headerContent={HeaderContent}
      topbarExtra={TopbarExtra}
      isDark={isDark}
      onDarkToggle={onDarkToggle}
      sidebarTheme="card"
      version="v1.1.0 · Accounting"
    >
      {renderView()}
    </DashboardLayout>
  );
}
