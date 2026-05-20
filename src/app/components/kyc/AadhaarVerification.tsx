import { useState } from "react";
import {
  ArrowLeft, Upload, Shield, CheckCircle, AlertCircle, Clock,
  Eye, EyeOff, Fingerprint, Camera,
  Info, Sparkles, User, MapPin, Calendar
} from "lucide-react";
import { mockOwners, mockDocuments, stepStatusConfig, maskAadhaar } from "./kycData";
import type { KYCView } from "./KYCModule";

interface AadhaarVerificationProps {
  ownerId: string;
  onNavigate: (view: KYCView, ownerId?: string) => void;
}

type UploadState = "idle" | "uploading" | "processing" | "done";

const ocrFieldLabels: Record<string, string> = {
  "Aadhaar No": "Aadhaar Number",
  "Name": "Full Name",
  "DOB": "Date of Birth",
  "Gender": "Gender",
  "Address": "Registered Address",
};

export function AadhaarVerification({ ownerId, onNavigate }: AadhaarVerificationProps) {
  const owner = mockOwners.find(o => o.id === ownerId);
  const aadhaarDoc = mockDocuments.find(d => d.ownerId === ownerId && d.type === "Aadhaar Card");
  const ssc = stepStatusConfig[owner?.aadhaarStatus || "Pending"];

  const [uploadState, setUploadState] = useState<UploadState>(aadhaarDoc ? "done" : "idle");
  const [showOCR, setShowOCR] = useState(!!aadhaarDoc?.ocrData);
  const [showRaw, setShowRaw] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [ocrEdits, setOcrEdits] = useState<Record<string, string>>(aadhaarDoc?.ocrData || {});
  const [editMode, setEditMode] = useState(false);
  const [verified, setVerified] = useState(owner?.aadhaarStatus === "Verified");
  const [verifyRunning, setVerifyRunning] = useState(false);

  if (!owner) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploadState("uploading");
    setTimeout(() => setUploadState("processing"), 1200);
    setTimeout(() => { setUploadState("done"); setShowOCR(true); setOcrEdits(aadhaarDoc?.ocrData || mockOCR); }, 2800);
  };

  const simulateVerify = () => {
    setVerifyRunning(true);
    setTimeout(() => { setVerifyRunning(false); setVerified(true); }, 2200);
  };

  const mockOCR: Record<string, string> = {
    "Aadhaar No": owner.aadhar,
    "Name": owner.name.toUpperCase(),
    "DOB": new Date(owner.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
    "Gender": owner.gender.toUpperCase(),
    "Address": `${owner.address}, ${owner.city} - ${owner.pincode}`,
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => onNavigate("profile", ownerId)} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Fingerprint size={18} className="text-primary" /> Aadhaar Verification
          </h1>
          <p className="text-xs text-muted-foreground">{owner.salutation} {owner.name} · {owner.phone}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${ssc.bg} ${ssc.color} ${ssc.border}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${ssc.dot}`} /> {owner.aadhaarStatus}
          </span>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
        <Shield size={16} className="text-primary mt-0.5 shrink-0" />
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">UIDAI Aadhaar Verification — </span>
          Upload clear images of both front and back of the Aadhaar card. Our system uses OCR to extract and validate data against UIDAI records. All data is encrypted and stored securely.
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upload zone */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Upload size={14} className="text-primary" /> Upload Aadhaar Card
            </h3>

            {/* Upload status indicator */}
            {uploadState === "uploading" && (
              <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary">Uploading document...</p>
                  <div className="h-1 bg-primary/20 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse w-2/3" />
                  </div>
                </div>
              </div>
            )}
            {uploadState === "processing" && (
              <div className="mb-4 p-3 bg-warning/5 border border-warning/20 rounded-xl flex items-center gap-3">
                <Sparkles size={16} className="text-warning animate-pulse shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-warning">Running OCR extraction...</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Detecting text and fields from document image</p>
                </div>
              </div>
            )}

            {/* Drop zone — front */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                dragOver ? "border-primary bg-primary/5" : uploadState === "done" ? "border-success/40 bg-success/5" : "border-border hover:border-primary/40 hover:bg-muted/30"
              }`}
              onClick={() => uploadState === "idle" && simulateUpload()}
            >
              {uploadState === "done" ? (
                <div className="space-y-2">
                  {/* Simulated Aadhaar card preview */}
                  <div className="w-full max-w-xs mx-auto bg-gradient-to-br from-[#1a3a6b] to-[#0d2144] rounded-xl p-4 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-6 translate-x-6" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 translate-y-4 -translate-x-4" />
                    <div className="flex items-start gap-3 relative">
                      <div className="w-12 h-14 rounded-lg bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
                        <User size={20} className="text-white/70" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Government of India</p>
                        <p className="text-sm font-bold mt-0.5 leading-tight">{owner.name.toUpperCase()}</p>
                        <p className="text-[10px] text-white/70 mt-1">DOB: {new Date(owner.dob).toLocaleDateString("en-IN")}</p>
                        <p className="text-[10px] text-white/70">{owner.gender}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                      <p className="text-sm font-mono font-bold tracking-widest">{maskAadhaar(owner.aadhar)}</p>
                      <div className="w-8 h-8 rounded bg-white/90 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-0.5">
                          {Array.from({ length: 9 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#1a3a6b] rounded-sm" />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] text-white/40 mt-1 text-right font-mono">आधार / AADHAAR</p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-success text-xs font-semibold">
                    <CheckCircle size={13} /> Document uploaded successfully
                  </div>
                  <button onClick={() => setUploadState("idle")} className="text-[11px] text-muted-foreground hover:text-foreground underline">
                    Replace document
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Upload size={22} className="text-primary" />
                  </div>
                  <p className="text-sm font-semibold mb-1">Drop Aadhaar Card here</p>
                  <p className="text-xs text-muted-foreground mb-3">Front + Back · PDF, JPG, PNG · Max 10MB</p>
                  <div className="flex items-center justify-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
                      <Upload size={12} /> Browse Files
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                      <Camera size={12} /> Camera Scan
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Aadhaar guidelines */}
            <div className="mt-4 space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Upload Guidelines</p>
              {["Ensure all four corners are visible", "Image should be clear and not blurry", "Both front and back are required", "Laminated copies are acceptable"].map(g => (
                <div key={g} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle size={11} className="text-success shrink-0" /> {g}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OCR Preview */}
        <div className="space-y-4">
          {showOCR ? (
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles size={14} className="text-warning" /> OCR Extracted Data
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditMode(e => !e)} className={`text-xs px-2 py-1 rounded-lg border transition-all ${editMode ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
                    {editMode ? "Done" : "Edit"}
                  </button>
                  <button onClick={() => setShowRaw(r => !r)} className="text-[10px] text-muted-foreground hover:text-foreground">
                    {showRaw ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                </div>
              </div>

              {/* OCR fields */}
              <div className="space-y-3">
                {Object.entries(ocrEdits).map(([key, val]) => (
                  <div key={key} className={`p-3 rounded-xl border transition-all ${editMode ? "border-primary/20 bg-primary/5" : "border-border/60 bg-muted/30"}`}>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      {key === "Aadhaar No" && <Shield size={9} />}
                      {key === "Name" && <User size={9} />}
                      {key === "Address" && <MapPin size={9} />}
                      {key === "DOB" && <Calendar size={9} />}
                      {ocrFieldLabels[key] || key}
                    </p>
                    {editMode ? (
                      <input
                        value={val}
                        onChange={e => setOcrEdits(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full text-sm font-semibold bg-transparent border-none outline-none focus:ring-0 font-mono"
                      />
                    ) : (
                      <p className={`text-sm font-semibold ${key === "Aadhaar No" ? "font-mono tracking-widest" : ""}`}>
                        {key === "Aadhaar No" && !showRaw ? maskAadhaar(val) : val}
                      </p>
                    )}
                    {key === "Name" && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle size={10} className="text-success" />
                        <span className="text-[10px] text-success">Matches registration record</span>
                      </div>
                    )}
                    {key === "Aadhaar No" && verified && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle size={10} className="text-success" />
                        <span className="text-[10px] text-success">Verified with UIDAI</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Confidence score */}
              <div className="mt-4 p-3 bg-success/5 border border-success/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-success" />
                  <span className="text-xs font-semibold">OCR Confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: "94%" }} />
                  </div>
                  <span className="text-xs font-bold text-success">94%</span>
                </div>
              </div>

              {/* Verify button */}
              {!verified ? (
                <button
                  onClick={simulateVerify}
                  disabled={verifyRunning}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-all"
                >
                  {verifyRunning ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Verifying with UIDAI...</>
                  ) : (
                    <><Shield size={15} /> Verify with UIDAI</>
                  )}
                </button>
              ) : (
                <div className="mt-4 flex items-center gap-3 p-3 bg-success/10 border border-success/30 rounded-xl">
                  <CheckCircle size={18} className="text-success shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-success">UIDAI Verification Successful</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Verified on {new Date().toLocaleDateString("en-IN")} · Reference: UIDAI{Math.floor(Math.random() * 999999 + 100000)}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-5 flex flex-col items-center justify-center gap-3 text-center min-h-[280px]">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <Sparkles size={22} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">OCR Preview</p>
                <p className="text-xs text-muted-foreground mt-1">Upload an Aadhaar card to see extracted data here</p>
              </div>
            </div>
          )}

          {/* Verification history */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Verification History</p>
            <div className="space-y-2">
              {aadhaarDoc ? (
                <>
                  <HistoryRow date={aadhaarDoc.uploadedDate!} action="Document Uploaded" status="success" />
                  {aadhaarDoc.verifiedDate && <HistoryRow date={aadhaarDoc.verifiedDate} action="UIDAI Verification Successful" status="success" />}
                  <HistoryRow date={aadhaarDoc.verifiedDate || "Pending"} action="KYC Step Marked Verified" status={aadhaarDoc.status === "Verified" ? "success" : "pending"} />
                </>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-3">No verification history yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-xl border border-border text-xs text-muted-foreground">
        <Info size={13} className="shrink-0 mt-0.5" />
        <span>Aadhaar data is processed in accordance with UIDAI guidelines. Data is encrypted using AES-256 and is accessible only to authorised personnel. Virtual IDs (VID) are recommended for enhanced privacy.</span>
      </div>
    </div>
  );
}

function HistoryRow({ date, action, status }: { date: string; action: string; status: "success" | "pending" | "failed" }) {
  const cfg = {
    success: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    failed: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
  }[status];
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${cfg.bg}`}>
        <cfg.icon size={10} className={cfg.color} />
      </div>
      <span className="flex-1">{action}</span>
      <span className="text-muted-foreground text-[10px]">{date}</span>
    </div>
  );
}

