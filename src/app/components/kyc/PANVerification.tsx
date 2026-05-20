import { useState } from "react";
import {
  ArrowLeft, Upload, CreditCard, CheckCircle, AlertCircle,
  Sparkles, Info, ExternalLink, Shield, TrendingUp
} from "lucide-react";
import { mockOwners, mockDocuments, stepStatusConfig, maskPAN } from "./kycData";
import type { KYCView } from "./KYCModule";

interface PANVerificationProps {
  ownerId: string;
  onNavigate: (view: KYCView, ownerId?: string) => void;
}

type UploadState = "idle" | "uploading" | "processing" | "done";
type NSDLState = "idle" | "checking" | "matched" | "mismatch";

export function PANVerification({ ownerId, onNavigate }: PANVerificationProps) {
  const owner = mockOwners.find(o => o.id === ownerId);
  const panDoc = mockDocuments.find(d => d.ownerId === ownerId && d.type === "PAN Card");
  const ssc = stepStatusConfig[owner?.panStatus || "Pending"];

  const [uploadState, setUploadState] = useState<UploadState>(panDoc ? "done" : "idle");
  const [showOCR, setShowOCR] = useState(!!panDoc?.ocrData);
  const [dragOver, setDragOver] = useState(false);
  const [nsdlState, setNSDLState] = useState<NSDLState>(owner?.panStatus === "Verified" ? "matched" : owner?.panStatus === "Under Review" ? "mismatch" : "idle");
  const [ocrEdits, setOcrEdits] = useState<Record<string, string>>(panDoc?.ocrData || {});
  const [editMode, setEditMode] = useState(false);

  if (!owner) return null;

  const mockOCR: Record<string, string> = {
    "PAN No": owner.pan,
    "Name": owner.name.toUpperCase(),
    "Father's Name": "MOHAN LAL " + owner.name.split(" ").slice(-1)[0].toUpperCase(),
    "DOB": new Date(owner.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
  };

  const handleSimulateUpload = () => {
    setUploadState("uploading");
    setTimeout(() => setUploadState("processing"), 1000);
    setTimeout(() => { setUploadState("done"); setShowOCR(true); setOcrEdits(panDoc?.ocrData || mockOCR); }, 2400);
  };

  const handleNSDL = () => {
    setNSDLState("checking");
    setTimeout(() => {
      // Simulate mismatch for Priya (o2), match for others
      setNSDLState(ownerId === "o2" ? "mismatch" : "matched");
    }, 2500);
  };

  const panTypeInfo: Record<string, string> = {
    "Individual": "P", "HUF": "H", "Company": "C", "Firm": "F", "AOP": "A", "BOI": "B", "Local Authority": "L",
  };

  const panCategory = owner.pan.charAt(3);
  const panCategoryLabel = Object.entries(panTypeInfo).find(([, v]) => v === panCategory)?.[0] || "Individual";

  const itrData = owner.kycScore >= 80 ? [
    { fy: "2022-23", income: "₹18,45,000", tax: "₹3,12,000", status: "Filed" },
    { fy: "2021-22", income: "₹16,80,000", tax: "₹2,74,000", status: "Filed" },
    { fy: "2020-21", income: "₹14,20,000", tax: "₹2,10,000", status: "Filed" },
  ] : [];

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => onNavigate("profile", ownerId)} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <CreditCard size={18} className="text-primary" /> PAN Verification
          </h1>
          <p className="text-xs text-muted-foreground">{owner.salutation} {owner.name} · {owner.pan}</p>
        </div>
        <div className="ml-auto">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${ssc.bg} ${ssc.color} ${ssc.border}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${ssc.dot}`} /> {owner.panStatus}
          </span>
        </div>
      </div>

      {/* Warning for mismatch case */}
      {nsdlState === "mismatch" && (
        <div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-2xl">
          <AlertCircle size={16} className="text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">Name Mismatch Detected</p>
            <p className="text-xs text-muted-foreground mt-0.5">The name on PAN card differs from Aadhaar records. Customer must submit a name-correction affidavit or updated PAN. NSDL reference: NSM-{Date.now().toString().slice(-8)}.</p>
            <button className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"><ExternalLink size={10} /> Raise NSDL Correction Request</button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upload & Card Preview */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Upload size={14} className="text-primary" /> Upload PAN Card
            </h3>

            {uploadState !== "idle" && uploadState !== "done" && (
              <div className={`mb-4 p-3 rounded-xl border flex items-center gap-3 ${uploadState === "uploading" ? "bg-primary/5 border-primary/20" : "bg-warning/5 border-warning/20"}`}>
                <div className={`w-4 h-4 rounded-full border-2 animate-spin shrink-0 ${uploadState === "uploading" ? "border-primary border-t-transparent" : "border-warning border-t-transparent"}`} />
                <p className={`text-xs font-semibold ${uploadState === "uploading" ? "text-primary" : "text-warning"}`}>
                  {uploadState === "uploading" ? "Uploading..." : "Running OCR..."}
                </p>
              </div>
            )}

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleSimulateUpload(); }}
              onClick={() => uploadState === "idle" && handleSimulateUpload()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
                dragOver ? "border-primary bg-primary/5" : uploadState === "done" ? "border-success/40 bg-success/5" : "border-border hover:border-primary/30 hover:bg-muted/30"
              }`}
            >
              {uploadState === "done" ? (
                <div className="space-y-3">
                  {/* PAN card visual */}
                  <div className="w-full max-w-[260px] mx-auto bg-[#f5f0e8] rounded-xl p-4 border border-[#d4c9a8] relative overflow-hidden shadow-sm">
                    <div className="absolute top-1 right-2 text-[8px] text-[#8B6914] font-bold uppercase tracking-widest opacity-50">Income Tax Dept.</div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded bg-[#1a3a6b] flex items-center justify-center">
                        <div className="text-white text-[8px] font-bold text-center leading-tight">INDIA GOVT.</div>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#4a3820] font-bold uppercase tracking-wide">Permanent Account Number Card</p>
                        <p className="text-[8px] text-[#8B6914]">Income Tax Department — NSDL</p>
                      </div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-2.5 space-y-1">
                      <div>
                        <p className="text-[8px] text-[#8B6914] uppercase">Permanent Account No.</p>
                        <p className="text-sm font-mono font-bold text-[#1a1a1a] tracking-[0.2em]">{maskPAN(owner.pan)}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-[#8B6914] uppercase">Name</p>
                        <p className="text-[11px] font-bold text-[#1a1a1a] uppercase">{owner.name}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-[8px] text-[#8B6914] uppercase">Father's Name</p>
                          <p className="text-[9px] font-semibold text-[#1a1a1a]">MOHAN LAL SHARMA</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-[#8B6914] uppercase">Date of Birth</p>
                          <p className="text-[9px] font-semibold text-[#1a1a1a]">{new Date(owner.dob).toLocaleDateString("en-IN")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-success flex items-center justify-center gap-1 font-semibold">
                    <CheckCircle size={12} /> Uploaded successfully
                  </p>
                  <button onClick={() => setUploadState("idle")} className="text-[11px] text-muted-foreground hover:text-foreground underline">Replace</button>
                </div>
              ) : (
                <>
                  <CreditCard size={28} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-semibold mb-1">Upload PAN Card</p>
                  <p className="text-xs text-muted-foreground mb-3">Front side only · PDF, JPG, PNG · Max 5MB</p>
                  <button className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
                    Choose File
                  </button>
                </>
              )}
            </div>

            {/* PAN details */}
            {uploadState === "done" && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs p-2.5 bg-muted/40 rounded-xl">
                  <span className="text-muted-foreground">PAN Category</span>
                  <span className="font-semibold">{panCategoryLabel}</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 bg-muted/40 rounded-xl">
                  <span className="text-muted-foreground">Assessing Officer Code</span>
                  <span className="font-mono font-semibold">{owner.pan.slice(0, 3)}/W/{owner.pan.slice(-4)}/1</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* OCR + NSDL Verification */}
        <div className="space-y-4">
          {showOCR && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles size={14} className="text-warning" /> OCR Extracted Data
                </h3>
                <button onClick={() => setEditMode(e => !e)} className={`text-xs px-2 py-1 rounded-lg border transition-all ${editMode ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
                  {editMode ? "Save" : "Edit"}
                </button>
              </div>

              <div className="space-y-2.5">
                {Object.entries(ocrEdits).map(([key, val]) => (
                  <div key={key} className={`p-3 rounded-xl border ${editMode ? "border-primary/20 bg-primary/5" : "bg-muted/30 border-border/50"}`}>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{key}</p>
                    {editMode ? (
                      <input value={val} onChange={e => setOcrEdits(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full text-sm font-semibold bg-transparent outline-none font-mono" />
                    ) : (
                      <p className={`text-sm font-semibold ${key === "PAN No" ? "font-mono tracking-widest" : ""}`}>{val}</p>
                    )}
                    {key === "Name" && nsdlState === "mismatch" && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle size={10} className="text-destructive" />
                        <span className="text-[10px] text-destructive">Mismatch with Aadhaar name</span>
                      </div>
                    )}
                    {key === "Name" && nsdlState === "matched" && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle size={10} className="text-success" />
                        <span className="text-[10px] text-success">Matches NSDL & Aadhaar records</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* NSDL verify button */}
              <div className="mt-4">
                {nsdlState === "idle" && (
                  <button onClick={handleNSDL} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                    <Shield size={14} /> Verify with NSDL / ITD
                  </button>
                )}
                {nsdlState === "checking" && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-xs font-semibold text-primary">Querying NSDL database...</span>
                  </div>
                )}
                {nsdlState === "matched" && (
                  <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/30 rounded-xl">
                    <CheckCircle size={18} className="text-success shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-success">NSDL Verification Passed</p>
                      <p className="text-[10px] text-muted-foreground">PAN is active · No liens or blocks detected</p>
                    </div>
                  </div>
                )}
                {nsdlState === "mismatch" && (
                  <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
                    <AlertCircle size={18} className="text-destructive shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">Name Mismatch — Action Required</p>
                      <p className="text-[10px] text-muted-foreground">Refer to compliance team for resolution</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ITR Summary */}
          {itrData.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" /> ITR / Income Summary (NSDL)
              </h3>
              <div className="space-y-2">
                {itrData.map(row => (
                  <div key={row.fy} className="flex items-center justify-between py-2.5 px-3 bg-muted/30 rounded-xl text-xs">
                    <span className="font-semibold text-muted-foreground">FY {row.fy}</span>
                    <span className="font-semibold">{row.income}</span>
                    <span className="text-muted-foreground">Tax: {row.tax}</span>
                    <span className="text-[10px] font-bold text-success px-1.5 py-0.5 rounded-full bg-success/10">{row.status}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                <Info size={10} /> Data sourced from income-tax.gov.in portal · For internal use only
              </p>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Verification Checklist</p>
            <div className="space-y-2">
              {[
                { label: "PAN 10-character format validated", done: !!owner.pan },
                { label: "PAN type is Individual (P)", done: owner.pan.charAt(3) === "P" },
                { label: "Name matches Aadhaar records", done: nsdlState === "matched" },
                { label: "PAN is active (not cancelled/blocked)", done: nsdlState === "matched" },
                { label: "ITR filed for last 2 years", done: itrData.length >= 2 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  {item.done
                    ? <CheckCircle size={12} className="text-success shrink-0" />
                    : <div className="w-3 h-3 rounded-full border border-muted-foreground/30 shrink-0" />}
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
