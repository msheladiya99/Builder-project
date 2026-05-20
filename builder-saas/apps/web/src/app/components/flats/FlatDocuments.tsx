import { useState } from "react";
import {
  ArrowLeft, FileText, Upload, Download, Eye, CheckCircle,
  AlertCircle, FolderOpen, Search, File, Home
} from "lucide-react";
import { mockFlats, mockDocuments, statusConfig, type FlatDocument } from "./flatData";
import type { FlatView } from "./FlatManagementModule";

interface FlatDocumentsProps {
  flatId: string;
  onNavigate: (view: FlatView, flatId?: string) => void;
}

type DocStatus = FlatDocument["status"];

const statusConf: Record<DocStatus, { icon: (props: { size: number; className?: string }) => JSX.Element; color: string; bg: string; border: string; label: string }> = {
  Verified:  { icon: CheckCircle, color: "text-success",     bg: "bg-success/10",     border: "border-success/30",     label: "Verified" },
  Uploaded:  { icon: Clock,       color: "text-warning",     bg: "bg-warning/10",     border: "border-warning/30",     label: "Under Review" },
  Pending:   { icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted",     border: "border-border",         label: "Pending Upload" },
  Rejected:  { icon: XCircle,     color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "Rejected" },
};

const categories = [
  { key: "All", icon: FolderOpen, label: "All Documents" },
  { key: "Booking", icon: Home, label: "Booking" },
  { key: "KYC", icon: Shield, label: "KYC / Identity" },
  { key: "Payment", icon: IndianRupee, label: "Payment Receipts" },
  { key: "Legal", icon: Stamp, label: "Legal / Agreement" },
  { key: "NOC", icon: FileText, label: "NOC / Clearance" },
];

const fileTypeIcon: Record<string, (props: { size: number; className?: string }) => JSX.Element> = {
  PDF: File,
  JPG: Image,
  PNG: Image,
};

const allDocTemplates: FlatDocument[] = [
  { id: "t1", flatId: "", category: "Booking", name: "Booking Application Form", status: "Pending", fileType: "PDF" },
  { id: "t2", flatId: "", category: "KYC", name: "PAN Card Copy", status: "Pending", fileType: "PDF" },
  { id: "t3", flatId: "", category: "KYC", name: "Aadhar Card Copy", status: "Pending", fileType: "PDF" },
  { id: "t4", flatId: "", category: "KYC", name: "Photograph", status: "Pending", fileType: "JPG" },
  { id: "t5", flatId: "", category: "KYC", name: "Address Proof", status: "Pending", fileType: "PDF" },
  { id: "t6", flatId: "", category: "Payment", name: "Booking Amount Receipt", status: "Pending", fileType: "PDF" },
  { id: "t7", flatId: "", category: "Payment", name: "2nd Instalment Receipt", status: "Pending", fileType: "PDF" },
  { id: "t8", flatId: "", category: "Payment", name: "3rd Instalment Receipt", status: "Pending", fileType: "PDF" },
  { id: "t9", flatId: "", category: "Legal", name: "Agreement for Sale", status: "Pending", fileType: "PDF" },
  { id: "t10", flatId: "", category: "Legal", name: "Sale Deed / Registration", status: "Pending", fileType: "PDF" },
  { id: "t11", flatId: "", category: "NOC", name: "Bank NOC / Clearance", status: "Pending", fileType: "PDF" },
  { id: "t12", flatId: "", category: "NOC", name: "Society NOC", status: "Pending", fileType: "PDF" },
];

export function FlatDocuments({ flatId, onNavigate }: FlatDocumentsProps) {
  const flat = mockFlats.find(f => f.id === flatId);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  if (!flat) return <div className="text-muted-foreground p-8">Unit not found.</div>;

  const sc = statusConfig[flat.status];

  // Merge uploaded docs with templates
  const flatDocs = mockDocuments.filter(d => d.flatId === flatId);
  const uploadedIds = new Set(flatDocs.map(d => d.name));
  const docs: FlatDocument[] = [
    ...flatDocs,
    ...allDocTemplates
      .filter(t => !uploadedIds.has(t.name))
      .map(t => ({ ...t, flatId })),
  ];

  const filtered = docs.filter(d => {
    if (activeCategory !== "All" && d.category !== activeCategory) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: docs.length,
    verified: docs.filter(d => d.status === "Verified").length,
    uploaded: docs.filter(d => d.status === "Uploaded").length,
    pending: docs.filter(d => d.status === "Pending").length,
    rejected: docs.filter(d => d.status === "Rejected").length,
  };

  const completionPct = Math.round((stats.verified / stats.total) * 100);

  const handleUpload = (docId: string) => {
    setUploadingDoc(docId);
    setTimeout(() => setUploadingDoc(null), 1200);
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => onNavigate("details", flat.id)} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold">Documents — {flat.unitNo}</h1>
          <p className="text-xs text-muted-foreground">Wing {flat.wing} · {flat.bhk} · {flat.ownerName || "Unassigned"}</p>
        </div>
        <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.color} ${sc.border}`}>
          {flat.status}
        </span>
      </div>

      {/* Status overview */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Document Completion</h3>
          <span className="text-sm font-bold text-primary">{completionPct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Verified", value: stats.verified, color: "text-success", bg: "bg-success/10" },
            { label: "Under Review", value: stats.uploaded, color: "text-warning", bg: "bg-warning/10" },
            { label: "Pending Upload", value: stats.pending, color: "text-muted-foreground", bg: "bg-muted" },
            { label: "Rejected", value: stats.rejected, color: "text-destructive", bg: "bg-destructive/10" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-lg p-3 text-center`}>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Category sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-3 space-y-1">
            {categories.map(cat => {
              const count = cat.key === "All" ? docs.length : docs.filter(d => d.category === cat.key).length;
              const catVerified = cat.key === "All"
                ? stats.verified
                : docs.filter(d => d.category === cat.key && d.status === "Verified").length;
              const isComplete = catVerified === count && count > 0;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                    activeCategory === cat.key
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <cat.icon size={14} className="shrink-0" />
                  <span className="flex-1">{cat.label}</span>
                  <div className="flex items-center gap-1">
                    {isComplete && <CheckCircle size={10} className="text-success" />}
                    <span className="text-[10px] font-bold opacity-70">{count}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Upload drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
            className={`mt-3 border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <Upload size={20} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-xs font-medium text-muted-foreground">Drop files here</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">PDF, JPG, PNG up to 10MB</p>
            <button className="mt-2 text-[10px] font-semibold text-primary hover:underline">Browse Files</button>
          </div>
        </div>

        {/* Document list */}
        <div className="lg:col-span-3 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Grouped by category */}
          {categories.filter(c => c.key !== "All").map(cat => {
            const catDocs = filtered.filter(d => d.category === cat.key);
            if (catDocs.length === 0) return null;
            if (activeCategory !== "All" && activeCategory !== cat.key) return null;
            return (
              <div key={cat.key} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border">
                  <cat.icon size={13} className="text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cat.label}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{catDocs.filter(d => d.status === "Verified").length}/{catDocs.length} verified</span>
                </div>
                <div className="divide-y divide-border/50">
                  {catDocs.map(doc => {
                    const conf = statusConf[doc.status];
                    const StatusIcon = conf.icon;
                    const FileIcon = fileTypeIcon[doc.fileType || "PDF"] || File;
                    const isUploading = uploadingDoc === doc.id;
                    return (
                      <div key={doc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                        {/* File icon */}
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          doc.status === "Pending" ? "bg-muted" : "bg-primary/10"
                        }`}>
                          <FileIcon size={16} className={doc.status === "Pending" ? "text-muted-foreground" : "text-primary"} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${doc.status === "Pending" ? "text-muted-foreground" : "text-foreground"}`}>
                            {doc.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${conf.bg} ${conf.color} ${conf.border}`}>
                              {conf.label}
                            </span>
                            {doc.uploadedDate && (
                              <span className="text-[10px] text-muted-foreground">{doc.uploadedDate}</span>
                            )}
                            {doc.fileSize && (
                              <span className="text-[10px] text-muted-foreground">{doc.fileSize}</span>
                            )}
                            {doc.fileType && (
                              <span className="text-[10px] font-mono bg-muted px-1 rounded text-muted-foreground">{doc.fileType}</span>
                            )}
                          </div>
                        </div>

                        {/* Status icon */}
                        <StatusIcon size={16} className={`${conf.color} shrink-0`} />

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-2">
                          {doc.status === "Pending" || doc.status === "Rejected" ? (
                            <button
                              onClick={() => handleUpload(doc.id)}
                              disabled={isUploading}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                isUploading
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white"
                              }`}
                            >
                              {isUploading ? (
                                <span className="flex items-center gap-1"><span className="animate-spin">⟳</span> Uploading...</span>
                              ) : (
                                <><Upload size={10} /> Upload</>
                              )}
                            </button>
                          ) : (
                            <>
                              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                                <Eye size={13} />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                                <Download size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-10 text-center">
              <FolderOpen size={24} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No documents found</p>
              <p className="text-xs text-muted-foreground mt-1">Try changing the category or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Clock({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
}
function XCircle({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>;
}
function Image({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
}
function Stamp({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><path d="M5 22h14"/><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77z"/><path d="M14 13V8.5a2.5 2.5 0 0 0-5 0V13"/></svg>;
}
function IndianRupee({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>;
}
function Shield({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
