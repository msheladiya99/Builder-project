import { useState } from "react";
import { ChevronUp, ChevronDown, MoreHorizontal, Search, Filter, Download, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

const tableData = [
  { id: "BK-2401", customer: "Suresh Nair", unit: "B-204", project: "Hari Heights", amount: "₹68,50,000", paid: "₹15,00,000", due: "₹53,50,000", status: "Active", date: "12 Apr 2026" },
  { id: "BK-2398", customer: "Priya Sharma", unit: "A-101", project: "Shri Residency", amount: "₹42,00,000", paid: "₹42,00,000", due: "₹0", status: "Completed", date: "08 Apr 2026" },
  { id: "BK-2395", customer: "Anil Mehta", unit: "C-312", project: "Green Valley", amount: "₹55,75,000", paid: "₹10,00,000", due: "₹45,75,000", status: "Overdue", date: "01 Apr 2026" },
  { id: "BK-2390", customer: "Kavitha Rao", unit: "D-508", project: "Lakshmi Towers", amount: "₹88,00,000", paid: "₹22,00,000", due: "₹66,00,000", status: "Active", date: "28 Mar 2026" },
  { id: "BK-2385", customer: "Vijay Krishnan", unit: "B-115", project: "Hari Heights", amount: "₹38,50,000", paid: "₹0", due: "₹38,50,000", status: "Cancelled", date: "22 Mar 2026" },
  { id: "BK-2380", customer: "Meena Pillai", unit: "A-303", project: "Shri Residency", amount: "₹47,25,000", paid: "₹47,25,000", due: "₹0", status: "Completed", date: "15 Mar 2026" },
];

const statusConfig: Record<string, { cls: string; dot: string }> = {
  Active: { cls: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200", dot: "bg-blue-500" },
  Completed: { cls: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200", dot: "bg-green-500" },
  Overdue: { cls: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200", dot: "bg-red-500" },
  Cancelled: { cls: "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400 border-gray-200", dot: "bg-gray-400" },
  "On Track": { cls: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200", dot: "bg-green-500" },
  Delayed: { cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200", dot: "bg-amber-500" },
  Draft: { cls: "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400 border-gray-200", dot: "bg-gray-400" },
  Pending: { cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200", dot: "bg-amber-500" },
  Verified: { cls: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200", dot: "bg-green-500" },
  Critical: { cls: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200", dot: "bg-red-500" },
  "New": { cls: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200", dot: "bg-purple-500" },
  Paid: { cls: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200", dot: "bg-green-500" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig["Active"];
  return (
    <Badge variant="outline" className={`gap-1.5 px-2.5 py-0.5 ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </Badge>
  );
}

export function DataDisplaySection() {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState<string | null>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("All");

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: string }) => (
    <span className="ml-1 inline-flex flex-col opacity-40">
      <ChevronUp size={9} className={sortCol === col && sortDir === "asc" ? "opacity-100 text-primary" : ""} />
      <ChevronDown size={9} className={sortCol === col && sortDir === "desc" ? "opacity-100 text-primary" : ""} />
    </span>
  );

  const allChecked = selected.length === tableData.length;

  const tabs = ["All", "Active", "Completed", "Overdue", "Cancelled"];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground">Data Display</h1>
        <p className="text-sm text-muted-foreground mt-1">Tables, badges, and data presentation components</p>
      </div>

      {/* Status Badges */}
      <section>
        <h3 className="text-foreground mb-4">Status Badges</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {Object.keys(statusConfig).map(status => (
              <StatusBadge key={status} status={status} />
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pill / Solid Variants</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Premium", cls: "bg-secondary text-secondary-foreground hover:bg-secondary/90" },
                { label: "VIP", cls: "bg-primary text-primary-foreground hover:bg-primary/90" },
                { label: "GST Exempt", cls: "bg-purple-600 text-white hover:bg-purple-600/90" },
                { label: "RERA Approved", cls: "bg-emerald-600 text-white hover:bg-emerald-600/90" },
                { label: "NRI", cls: "bg-sky-600 text-white hover:bg-sky-600/90" },
              ].map(b => (
                <Badge key={b.label} className={b.cls}>{b.label}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Count Badges</p>
            <div className="flex flex-wrap items-center gap-4">
              {[
                { label: "Messages", count: 12, cls: "bg-primary text-primary-foreground" },
                { label: "Overdue", count: 4, cls: "bg-destructive text-destructive-foreground" },
                { label: "Pending", count: 9, cls: "bg-warning text-white" },
                { label: "New Leads", count: 27, cls: "bg-success text-success-foreground" },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="text-sm text-foreground">{b.label}</span>
                  <Badge className={`px-2 py-0.5 rounded-full min-w-[22px] justify-center ${b.cls}`}>{b.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section>
        <h3 className="text-foreground mb-4">Data Table — Bookings</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Table header controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-border">
            <Tabs defaultValue="All" className="w-full sm:w-auto">
              <TabsList className="bg-transparent gap-2 h-auto p-0">
                {tabs.map(tab => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-transparent shadow-none"
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                    {tab === "All" && <span className="ml-1.5 text-[10px] opacity-70">{tableData.length}</span>}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              {selected.length > 0 && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {selected.length} selected
                </span>
              )}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search…"
                  className="pl-8 h-8 text-xs w-36 focus:w-52 transition-all"
                />
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Filter size={12} /> Filter
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Download size={12} /> Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-10">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all
                      ${allChecked ? "bg-primary border-primary" : "border-border hover:border-primary/60"}`}
                    onClick={() =>
                      setSelected(allChecked ? [] : tableData.map(d => d.id))
                    }
                  >
                    {allChecked && (
                      <svg viewBox="0 0 12 12" className="w-3 h-3 text-white fill-none stroke-current" strokeWidth="2">
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    )}
                  </div>
                </TableHead>
                {[
                  { key: "id", label: "Booking ID" },
                  { key: "customer", label: "Customer" },
                  { key: "unit", label: "Unit" },
                  { key: "project", label: "Project" },
                  { key: "amount", label: "Total Amt" },
                  { key: "paid", label: "Paid" },
                  { key: "status", label: "Status" },
                  { key: "date", label: "Date" },
                ].map(col => (
                  <TableHead
                    key={col.key}
                    className="cursor-pointer hover:bg-muted/60 transition-colors select-none text-[11px] font-semibold text-muted-foreground uppercase tracking-wide h-10"
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="flex items-center">
                      {col.label} <SortIcon col={col.key} />
                    </span>
                  </TableHead>
                ))}
                <TableHead>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map(row => (
                <TableRow
                  key={row.id}
                  className={`group ${selected.includes(row.id) ? "bg-primary/5 dark:bg-primary/10" : ""}`}
                >
                  <TableCell>
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all
                        ${selected.includes(row.id) ? "bg-primary border-primary" : "border-border hover:border-primary/60"}`}
                      onClick={() => toggleSelect(row.id)}
                    >
                      {selected.includes(row.id) && (
                        <svg viewBox="0 0 12 12" className="w-3 h-3 text-white fill-none stroke-current" strokeWidth="2">
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-primary font-mono">{row.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary">{row.customer.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">{row.customer}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground font-mono font-medium">{row.unit}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground whitespace-nowrap">{row.project}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">{row.amount}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium whitespace-nowrap ${row.paid === "₹0" ? "text-muted-foreground" : "text-success"}`}>
                      {row.paid}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{row.date}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground">
                        <Eye size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground">
                        <Edit2 size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500">
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">1–6</span> of <span className="font-semibold text-foreground">248</span> bookings
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="w-7 h-7 text-muted-foreground" disabled>
                <ChevronLeft size={13} />
              </Button>
              {[1, 2, 3, "...", 41].map((page, i) => (
                <Button
                  key={i}
                  variant={page === 1 ? "default" : "outline"}
                  size="icon"
                  className={`w-7 h-7 text-xs font-medium ${page === "..." ? "border-transparent bg-transparent hover:bg-transparent cursor-default" : ""}`}
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="icon" className="w-7 h-7 text-muted-foreground">
                <ChevronRight size={13} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Component */}
      <section>
        <h3 className="text-foreground mb-4">Tabs</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-8">
          {/* Line tabs */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Line Tabs</p>
            <Tabs defaultValue="Overview">
              <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0">
                {["Overview", "Payment Schedule", "Documents", "Timeline", "Communications"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none border-transparent text-muted-foreground hover:text-foreground border-b-2 rounded-none px-4 py-2.5 text-sm font-medium"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">Tab content area — Overview panel shown here</p>
              </div>
            </Tabs>
          </div>

          {/* Pill tabs */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pill Tabs</p>
            <Tabs defaultValue="Monthly">
              <TabsList>
                {["Monthly", "Quarterly", "Yearly"].map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Button group tabs */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Segmented Control</p>
            <div className="flex rounded-lg border border-border overflow-hidden w-fit">
              {["List", "Grid", "Kanban"].map((tab, i) => (
                <Button
                  key={tab}
                  variant={i === 0 ? "default" : "ghost"}
                  className={`rounded-none border-r border-border last:border-0 ${i === 0 ? "" : "hover:bg-muted"}`}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
