import { useState } from "react";
import { documents } from "../ownerPortalData";
import { Download, Lock, CheckCircle2, FileText } from "lucide-react";

export function DocumentsView() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const available = documents.filter(d => d.available);
  const pending   = documents.filter(d => !d.available);

  function handleDownload(id: string) {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1800);
  }

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Header band */}
      <div style={{ margin: "12px 16px 0", background: "linear-gradient(135deg, #1B3A6B 0%, #7C3AED 100%)", borderRadius: 20, padding: "16px 18px" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Documents</p>
        <p style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginTop: 4, lineHeight: 1 }}>{available.length} Available</p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 3 }}>{pending.length} pending — will be unlocked on possession</p>
      </div>

      {/* Available docs */}
      <div style={{ padding: "12px 16px 0" }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Ready to Download</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {available.map(doc => {
            const isLoading = downloading === doc.id;
            return (
              <div
                key={doc.id}
                style={{ background: "#fff", border: "1.5px solid #F1F5F9", borderRadius: 18, padding: "14px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              >
                {/* Icon */}
                <div style={{ width: 46, height: 46, borderRadius: 13, background: "#F8FAFC", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {doc.icon}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</p>
                  <div style={{ display: "flex", gap: 6, marginTop: 3, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, color: "#94A3B8" }}>{doc.date}</span>
                    {doc.size !== "—" && (
                      <>
                        <span style={{ width: 3, height: 3, borderRadius: 99, background: "#CBD5E1" }} />
                        <span style={{ fontSize: 10, color: "#94A3B8" }}>{doc.size}</span>
                      </>
                    )}
                    {doc.pages && (
                      <>
                        <span style={{ width: 3, height: 3, borderRadius: 99, background: "#CBD5E1" }} />
                        <span style={{ fontSize: 10, color: "#94A3B8" }}>{doc.pages} pages</span>
                      </>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                    <CheckCircle2 size={11} color="#22C55E" />
                    <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 700 }}>Verified document</span>
                  </div>
                </div>
                {/* Download btn */}
                <button
                  onClick={() => handleDownload(doc.id)}
                  className="active:scale-95 transition-transform"
                  style={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: 12,
                    background: isLoading ? "#F0FDF4" : "#EFF6FF",
                    border: `1.5px solid ${isLoading ? "#86EFAC" : "#BFDBFE"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {isLoading
                    ? <div style={{ width: 14, height: 14, borderRadius: 99, border: "2px solid #22C55E", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                    : <Download size={16} color="#1B3A6B" />
                  }
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending docs */}
      <div style={{ padding: "16px 16px 20px" }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Unlocked on Possession</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pending.map(doc => (
            <div
              key={doc.id}
              style={{ background: "#F8FAFC", border: "1.5px solid #F1F5F9", borderRadius: 18, padding: "14px 14px", display: "flex", alignItems: "center", gap: 12, opacity: 0.7 }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 13, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {doc.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#64748B" }}>{doc.name}</p>
                <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 3 }}>Available: {doc.date}</p>
              </div>
              <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: "#F1F5F9", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lock size={15} color="#CBD5E1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
