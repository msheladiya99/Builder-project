import { useState } from "react";
import { complaints, COMPLAINT_CATEGORIES, COMPLAINT_STATUS, PRIORITY_CFG } from "../ownerPortalData";
import { Plus, ChevronDown, ChevronUp, CheckCircle2, MessageCircle, X, Send } from "lucide-react";

type ViewState = "list" | "new";

export function ComplaintsView() {
  const [view, setView]           = useState<ViewState>("list");
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [category, setCategory]   = useState("");
  const [subject, setSubject]     = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [priority, setPriority]   = useState<"low" | "medium" | "high">("medium");

  function handleSubmit() {
    if (!category || !subject || !description) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setView("list");
      setCategory(""); setSubject(""); setDescription("");
    }, 2500);
  }

  if (view === "new") {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div style={{ flexShrink: 0, padding: "12px 16px", borderBottom: "1px solid #F1F5F9", background: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setView("list")} style={{ width: 34, height: 34, borderRadius: 10, background: "#F8FAFC", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#64748B" />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Raise a Complaint</p>
            <p style={{ fontSize: 10, color: "#94A3B8" }}>We typically respond within 48 hours</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ padding: "16px" }}>
          {submitted ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: 99, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={32} color="#22C55E" />
              </div>
              <p style={{ fontSize: 17, fontWeight: 900, color: "#0F172A" }}>Complaint Raised!</p>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>Your ticket has been created.<br />Our team will review and respond shortly.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Category */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Category *</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {COMPLAINT_CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      style={{
                        padding: "6px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                        border: `1.5px solid ${category === c ? "#1B3A6B" : "#E2E8F0"}`,
                        background: category === c ? "#EFF6FF" : "#fff",
                        color: category === c ? "#1B3A6B" : "#64748B",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Priority *</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["low", "medium", "high"] as const).map(p => {
                    const cfg = PRIORITY_CFG[p];
                    return (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        style={{
                          flex: 1, padding: "8px 0", borderRadius: 12, fontSize: 11, fontWeight: 700,
                          border: `1.5px solid ${priority === p ? cfg.color : "#E2E8F0"}`,
                          background: priority === p ? `${cfg.color}12` : "#fff",
                          color: priority === p ? cfg.color : "#94A3B8",
                        }}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Subject *</p>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Brief subject of your complaint"
                  style={{ width: "100%", background: "#fff", border: `1.5px solid ${subject ? "#1B3A6B" : "#E2E8F0"}`, borderRadius: 14, padding: "12px 14px", fontSize: 13, color: "#0F172A", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Description */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Description *</p>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Please describe your complaint in detail. Include dates, locations, and any relevant information."
                  rows={5}
                  className="w-full outline-none resize-none"
                  style={{ background: "#fff", border: `1.5px solid ${description ? "#1B3A6B" : "#E2E8F0"}`, borderRadius: 14, padding: "12px 14px", fontSize: 13, color: "#0F172A", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>

              {/* Info notice */}
              <div style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "10px 12px" }}>
                <p style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>
                  📧 Updates will be sent to <strong>rajesh.mehta@gmail.com</strong> and <strong>+91 98765 43210</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        {!submitted && (
          <div style={{ flexShrink: 0, padding: "10px 16px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
            <button
              onClick={handleSubmit}
              disabled={!category || !subject || !description}
              className="w-full active:scale-[0.98] transition-transform"
              style={{
                height: 52, borderRadius: 16, fontWeight: 900, fontSize: 15,
                background: category && subject && description ? "linear-gradient(135deg,#1B3A6B,#2563EB)" : "#E2E8F0",
                color: category && subject && description ? "#fff" : "#94A3B8",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Send size={16} />
              Submit Complaint
            </button>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col h-full">
      {/* Stats bar */}
      <div style={{ flexShrink: 0, padding: "10px 16px 0" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Total",      value: complaints.length, color: "#1B3A6B", bg: "#EFF6FF" },
            { label: "Open",       value: complaints.filter(c => c.status === "open" || c.status === "in-progress").length, color: "#F59E0B", bg: "#FFFBEB" },
            { label: "Resolved",   value: complaints.filter(c => c.status === "resolved" || c.status === "closed").length,  color: "#22C55E", bg: "#F0FDF4" },
          ].map(stat => (
            <div key={stat.label} style={{ flex: 1, background: stat.bg, borderRadius: 14, padding: "10px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 900, color: stat.color }}>{stat.value}</p>
              <p style={{ fontSize: 9, color: stat.color, fontWeight: 700, textTransform: "uppercase", marginTop: 2 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "12px 16px 16px" }}>
        {complaints.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <MessageCircle size={32} color="#CBD5E1" style={{ margin: "0 auto 8px" }} />
            <p style={{ color: "#94A3B8", fontSize: 13 }}>No complaints yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {complaints.map(c => {
              const statusCfg   = COMPLAINT_STATUS[c.status];
              const priorityCfg = PRIORITY_CFG[c.priority];
              const isOpen      = expanded === c.id;

              return (
                <div
                  key={c.id}
                  style={{ background: "#fff", border: `1.5px solid ${isOpen ? "#BFDBFE" : "#F1F5F9"}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : c.id)}
                    className="w-full text-left active:opacity-90 transition-opacity"
                    style={{ padding: "14px 14px" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      {/* Category icon */}
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: statusCfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 17 }}>
                        <MessageCircle size={17} color={statusCfg.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                          <p style={{ fontSize: 12, fontWeight: 800, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.subject}</p>
                          {isOpen ? <ChevronUp size={15} color="#CBD5E1" /> : <ChevronDown size={15} color="#CBD5E1" />}
                        </div>
                        <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{c.category} · {c.ticketNo}</p>
                        <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 9, fontWeight: 800, color: statusCfg.color, background: statusCfg.bg, padding: "2px 7px", borderRadius: 99 }}>
                            {statusCfg.label}
                          </span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: priorityCfg.color, background: `${priorityCfg.color}14`, padding: "2px 7px", borderRadius: 99 }}>
                            {priorityCfg.label} Priority
                          </span>
                          <span style={{ fontSize: 9, color: "#94A3B8" }}>{c.raisedDate}</span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ padding: "0 14px 14px", borderTop: "1px dashed #F1F5F9" }}>
                      <div style={{ paddingTop: 10 }}>
                        <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Your Complaint</p>
                        <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{c.description}</p>
                      </div>

                      {c.response && (
                        <div style={{ marginTop: 10, background: "#F8FAFC", borderRadius: 12, padding: "10px 12px", borderLeft: "3px solid #1B3A6B" }}>
                          <p style={{ fontSize: 10, fontWeight: 800, color: "#1B3A6B", marginBottom: 4 }}>Our Response · {c.updatedDate}</p>
                          <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{c.response}</p>
                        </div>
                      )}

                      {(c.status === "resolved" || c.status === "closed") && (
                        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                          <CheckCircle2 size={13} color="#22C55E" />
                          <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 700 }}>Issue resolved on {c.updatedDate}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Raise complaint button */}
      <div style={{ flexShrink: 0, padding: "10px 16px 14px", borderTop: "1px solid #F1F5F9", background: "#fff" }}>
        <button
          onClick={() => setView("new")}
          className="w-full active:scale-[0.98] transition-transform"
          style={{ height: 52, borderRadius: 16, fontWeight: 800, fontSize: 14, background: "linear-gradient(135deg, #1B3A6B, #2563EB)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <Plus size={18} />
          Raise a New Complaint
        </button>
      </div>
    </div>
  );
}
