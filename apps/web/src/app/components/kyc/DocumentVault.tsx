import { useState } from "react";
import {
  ArrowLeft, Upload, Download, Eye, CheckCircle, AlertCircle, Clock,
  FileText, Shield, Banknote, Building2, Home, FolderOpen,
  Search, ChevronDown, ChevronRight, Sparkles, Calendar,
  Lock, ExternalLink, X, Info
} from "lucide-react";
import { mockOwners, mockDocuments, stepStatusConfig, type KYCDocument, type DocCategory } from "./kycData";
import type { KYCView } from "./KYCModule";

interface DocumentVaultProps {
  ownerId: string;
  onNavigate: (view: KYCView, ownerId?: string) => void;
}

const categoryConfig: Record<DocCategory, { icon: typeof FileText; label: string; color: string; bg: string }> = {
  Identity:  { icon: Shield,    label: "Identity Documents",   color: "text-primary",     bg: "bg-primary/10" },
  Address:   { icon: Home,      label: "Address Proof",        color: "text-info",        bg: "bg-info/10" },
  Income:    { icon: Banknote,  label: "Income Documents",     color: "text-success",     bg: "bg-success/10" },
  Bank:      { icon: Building2, label: "Bank Documents",       color: "text-warning",     bg: "bg-warning/10" },
  Property:  { icon: FileText,  label: "Property Documents",   color: "text-secondary",   bg: "bg-secondary/10" },
};

const statusConf = {
  Verified:      { label: "Verified",      color: "text-success",           bg: "bg-success/10",     border: "border-success/30" },
  "Under Review":{ label: "Under Review",  color: "text-warning",           bg: "bg-warning/10",     border: "border-warning/30" },
  Uploaded:      { label: "Uploaded",      color: "text-info",              bg: "bg-info/10",        border: "border-info/30" },
  Pending:       { label: "Pending",       color: "text-muted-foreground",  bg: "bg-muted",          border: "border-border" },
  Rejected:      { label: "Rejected",      color: "text-destructive",       bg: "bg-destructive/10", border: "border-destructive/30" },
};

const allCategories: DocCategory[] = ["Identity", "Address", "Income", "Bank", "Property"];

export function DocumentVault({ ownerId, onNavigate }: DocumentVaultProps) {
  const owner = mockOwners.find(o => o.id === ownerId);
  const ownerDocs = mockDocuments.filter(d => d.ownerId === ownerId);

  const [activeCategory, setActiveCategory] = useState<DocCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [expandedOCR, setExpandedOCR] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<KYCDocument | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  if (!owner) return null;

  const filtered = ownerDocs.filter(d => {
    if (activeCategory !== "All" && d.category !== activeCategory) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.type.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: ownerDocs.length,
    verified: ownerDocs.filter(d => d.status === "Verified").length,
    review: ownerDocs.filter(d => d.status === "Under Review" || d.status === "Uploaded").length,
    pending: ownerDocs.filter(d => d.status === "Pending").length,
    rejected: ownerDocs.filter(d => d.status === "Rejected").length,
  };

  const completionPct = Math.round((stats.verified / stats.total) * 100);

  const handleUpload = (docId: string) => {
    setUploadingId(docId);
    setTimeout(() => setUploadingId(null), 1500);
  };

  const grouped = allCategories.reduce<Record<DocCategory, KYCDocument[]>>((acc, cat) => {
    acc[cat] = filtered.filter(d => d.category === cat);
    return acc;
  }, {} as Record<DocCategory, KYCDocument[]>);

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => onNavigate("profile", ownerId)} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Lock size={18} className="text-primary" /> Document Vault
          </h1>
          <p className="text-xs text-muted-foreground">{owner.salutation} {owner.name} · {ownerDocs.length} documents</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield size={11} className="text-success" /> AES-256 Encrypted
          </span>
        </div>
      </div>

      {/* Completion bar */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Document Completion</p>
          <span className={`text-sm font-bold ${completionPct === 100 ? "text-success" : completionPct >= 60 ? "text-warning" : "text-destructive"}`}>{completionPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
          <div className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all" style={{ width: `${completionPct}%` }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Verified", val: stats.verified, color: "text-success", bg: "bg-success/10" },
            { label: "In Review", val: stats.review, color: "text-warning", bg: "bg-warning/10" },
            { label: "Pending", val: stats.pending, color: "text-muted-foreground", bg: "bg-muted" },
            { label: "Rejected", val: stats.rejected, color: "text-destructive", bg: "bg-destructive/10" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); }}
        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/20"}`}
      >
        <Upload size={20} className="mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-semibold">Drop documents here to upload</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG · Max 20MB per file · All uploads are encrypted</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">Browse Files</button>
          <span className="text-xs text-muted-foreground">or drag & drop</span>
        </div>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">
        {/* Category sidebar */}
        <div className="lg:w-56 shrink-0 space-y-1">
          <button
            onClick={() => setActiveCategory("All")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition-all ${activeCategory === "All" ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}`}
          >
            <div className="flex items-center gap-2">
              <FolderOpen size={14} />
              All Documents
            </div>
            <span className="text-[10px] font-bold">{ownerDocs.length}</span>
          </button>

          {allCategories.map(cat => {
            const catDocs = ownerDocs.filter(d => d.category === cat);
            const catConf = categoryConfig[cat];
            const allVerified = catDocs.every(d => d.status === "Verified");
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition-all ${activeCategory === cat ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}`}
              >
                <div className="flex items-center gap-2">
                  <catConf.icon size={13} />
                  {cat}
                </div>
                <div className="flex items-center gap-1">
                  {allVerified && catDocs.length > 0 && <CheckCircle size={10} className="text-success" />}
                  <span className="text-[10px] font-bold">{catDocs.length}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Document list */}
        <div className="flex-1 space-y-4">
          {/* Search + sort */}
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {/* Grouped documents */}
          {allCategories.map(cat => {
            const docs = grouped[cat];
            if (docs.length === 0 || (activeCategory !== "All" && activeCategory !== cat)) return null;
            const catConf = categoryConfig[cat];
            return (
              <div key={cat} className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                  <div className={`w-6 h-6 rounded-lg ${catConf.bg} ${catConf.color} flex items-center justify-center`}>
                    <catConf.icon size={12} />
                  </div>
                  <span className="text-xs font-semibold">{catConf.label}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{docs.filter(d => d.status === "Verified").length}/{docs.length} verified</span>
                </div>
                <div className="divide-y divide-border/50">
                  {docs.map(doc => {
                    const sConf = statusConf[doc.status];
                    const isUploading = uploadingId === doc.id;
                    const hasOCR = !!doc.ocrData && Object.keys(doc.ocrData).length > 0;
                    const ocrExpanded = expandedOCR === doc.id;

                    return (
                      <div key={doc.id}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                          {/* File icon */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            doc.status === "Verified" ? "bg-success/10 border-success/20" : doc.status === "Pending" ? "bg-muted border-border" : "bg-primary/10 border-primary/20"
                          }`}>
                            <FileText size={16} className={doc.status === "Verified" ? "text-success" : doc.status === "Pending" ? "text-muted-foreground" : "text-primary"} />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-sm font-semibold ${doc.status === "Pending" ? "text-muted-foreground" : ""}`}>{doc.name}</p>
                              {doc.isRequired && <span className="text-[9px] font-bold text-destructive/70">Required</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${sConf.bg} ${sConf.color} ${sConf.border}`}>
                                {sConf.label}
                              </span>
                              {doc.uploadedDate && <span className="text-[10px] text-muted-foreground">{doc.uploadedDate}</span>}
                              {doc.fileSize && <span className="text-[10px] text-muted-foreground">{doc.fileSize}</span>}
                              {doc.fileType && <span className="text-[10px] font-mono bg-muted px-1 rounded text-muted-foreground">{doc.fileType}</span>}
                              {doc.expiryDate && (
                                <span className="text-[10px] text-warning flex items-center gap-0.5">
                                  <Calendar size={9} /> Exp: {doc.expiryDate}
                                </span>
                              )}
                            </div>
                            {doc.remarks && (
                              <p className="text-[10px] text-destructive mt-0.5 flex items-center gap-1">
                                <AlertCircle size={9} /> {doc.remarks}
                              </p>
                            )}
                          </div>

                          {/* OCR toggle */}
                          {hasOCR && (
                            <button
                              onClick={() => setExpandedOCR(ocrExpanded ? null : doc.id)}
                              className={`p-1.5 rounded-lg transition-colors text-[10px] font-semibold flex items-center gap-1 border ${ocrExpanded ? "bg-warning/10 border-warning/30 text-warning" : "border-border text-muted-foreground hover:bg-muted"}`}
                            >
                              <Sparkles size={11} /> OCR
                            </button>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            {doc.status === "Pending" || doc.status === "Rejected" ? (
                              <button
                                onClick={() => handleUpload(doc.id)}
                                disabled={isUploading}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                  isUploading ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white"
                                }`}
                              >
                                {isUploading ? <span className="animate-spin">⟳</span> : <Upload size={10} />}
                                {isUploading ? "Uploading" : "Upload"}
                              </button>
                            ) : (
                              <>
                                <button onClick={() => setPreviewDoc(doc)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                  <Eye size={13} />
                                </button>
                                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                  <Download size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* OCR panel */}
                        {ocrExpanded && doc.ocrData && (
                          <div className="mx-4 mb-3 p-4 bg-warning/5 border border-warning/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles size={13} className="text-warning" />
                              <span className="text-xs font-semibold">OCR Extracted Data</span>
                              <span className="ml-auto text-[10px] text-success font-semibold flex items-center gap-1"><CheckCircle size={9} /> 94% confidence</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {Object.entries(doc.ocrData).map(([k, v]) => (
                                <div key={k} className="bg-white/60 dark:bg-card/60 rounded-lg p-2.5">
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{k}</p>
                                  <p className={`text-xs font-semibold mt-0.5 ${k.toLowerCase().includes("no") || k.toLowerCase().includes("account") ? "font-mono tracking-wider" : ""}`}>{v}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="bg-card rounded-2xl border border-border p-10 text-center">
              <FolderOpen size={28} className="mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold">No documents found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 bg-muted/40 rounded-2xl border border-border text-xs text-muted-foreground">
        <Lock size={13} className="shrink-0 mt-0.5 text-primary" />
        <span>All documents are stored with AES-256 encryption. Access is logged and audited. Document retention policy: 7 years post-possession or as per regulatory requirements. Secure document sharing via time-limited signed URLs only.</span>
      </div>

      {/* Document preview modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewDoc(null)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg z-10 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <p className="font-semibold text-sm">{previewDoc.name}</p>
                <p className="text-[10px] text-muted-foreground">{previewDoc.fileType} · {previewDoc.fileSize} · {previewDoc.uploadedDate}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Simulated document preview */}
              <div className="w-full h-48 rounded-xl bg-muted/50 border border-border flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <FileText size={32} />
                <p className="text-sm font-medium">{previewDoc.name}</p>
                <p className="text-xs">Preview not available in demo</p>
              </div>

              {/* OCR data if available */}
              {previewDoc.ocrData && (
                <div className="p-3 bg-warning/5 border border-warning/20 rounded-xl">
                  <p className="text-[10px] font-semibold text-warning uppercase tracking-wider mb-2 flex items-center gap-1"><Sparkles size={10} /> OCR Data</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(previewDoc.ocrData).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[9px] text-muted-foreground uppercase">{k}</p>
                        <p className="text-xs font-semibold">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                  <Download size={13} /> Download
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <ExternalLink size={13} /> Open Full View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
