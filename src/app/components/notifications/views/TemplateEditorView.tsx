import { useState } from "react";
import { Edit3, Save, Eye, EyeOff, CheckCircle2, Copy, Check } from "lucide-react";
import {
  templates, TYPE_CFG, CHANNEL_CFG,
  type Template, type Channel, type NotifType,
} from "../notificationData";

const CHANNELS: Channel[] = ["whatsapp", "sms", "email", "inapp"];

export function TemplateEditorView() {
  const [selectedId, setSelectedId]   = useState<string>(templates[0].id);
  const [activeChannel, setActiveChannel] = useState<Channel>("whatsapp");
  const [contents, setContents]       = useState<Record<string, Record<Channel, string>>>(
    Object.fromEntries(templates.map(t => [t.id, { ...t.content }]))
  );
  const [preview, setPreview]         = useState(false);
  const [saved, setSaved]             = useState<string | null>(null);
  const [copied, setCopied]           = useState(false);

  const tmpl    = templates.find(t => t.id === selectedId)!;
  const body    = contents[selectedId][activeChannel];
  const typeCfg = TYPE_CFG[tmpl.type];
  const chanCfg = CHANNEL_CFG[activeChannel];

  const availableChannels = CHANNELS.filter(c => tmpl.channels.includes(c));

  function handleSave() {
    setSaved(selectedId);
    setTimeout(() => setSaved(null), 2000);
  }

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function renderPreview(text: string): string {
    const sampleValues: Record<string, string> = {
      customerName:  "Rajesh Mehta",
      amount:        "₹12,50,000",
      flatNumber:    "4B",
      towerName:     "A",
      daysOverdue:   "15",
      projectName:   "SHG Tower Heights",
      bankName:      "SBI",
      emiAmount:     "₹84,000",
      dueDate:       "22 May 2026",
      accountLast4:  "7832",
      reraRegNo:     "MH/07/2022/1456",
      expiryDate:    "27 May 2026",
      daysLeft:      "8",
      materialName:  "TMT Bars Fe500",
      currentStock:  "2.4",
      minStock:      "5",
      unit:          "MT",
      location:      "Tower B Site",
      engineerName:  "Kiran Patil",
      missingDate:   "18 May 2026",
      txnId:         "TXN20260519001",
      paymentDate:   "19 May 2026",
    };
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => sampleValues[key] ?? `[${key}]`);
  }

  const displayText = preview ? renderPreview(body) : body;

  return (
    <div className="flex h-full" style={{ overflow: "hidden" }}>
      {/* Sidebar — template list */}
      <div style={{ width: 160, flexShrink: 0, borderRight: "1px solid #E2E8F0", background: "#F8FAFC", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px 10px 6px", borderBottom: "1px solid #E2E8F0" }}>
          <p style={{ fontSize: 9, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Templates</p>
        </div>
        {templates.map(t => {
          const active = t.id === selectedId;
          const cfg    = TYPE_CFG[t.type];
          return (
            <button
              key={t.id}
              onClick={() => { setSelectedId(t.id); setActiveChannel(t.channels[0] as Channel); }}
              className="w-full text-left active:opacity-80 transition-opacity"
              style={{
                padding: "9px 10px",
                borderBottom: "1px solid #F1F5F9",
                background: active ? "#EFF6FF" : "transparent",
                borderLeft: active ? "3px solid #1B3A6B" : "3px solid transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                <span style={{ fontSize: 14 }}>{cfg.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: active ? "#1B3A6B" : "#0F172A", lineHeight: 1.2 }}>{t.name}</span>
              </div>
              <p style={{ fontSize: 9, color: "#94A3B8" }}>{t.sentCount} sent</p>
              <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                {t.channels.map(c => (
                  <span key={c} style={{ fontSize: 8, background: CHANNEL_CFG[c].bg, color: CHANNEL_CFG[c].color, padding: "1px 5px", borderRadius: 99, fontWeight: 700 }}>
                    {CHANNEL_CFG[c].icon}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Editor panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Editor header */}
        <div style={{ flexShrink: 0, padding: "10px 12px 8px", borderBottom: "1px solid #E2E8F0", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 16 }}>{typeCfg.icon}</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#0F172A" }}>{tmpl.name}</p>
                <p style={{ fontSize: 9, color: "#94A3B8" }}>Edited {tmpl.lastEdited} · {tmpl.sentCount} sent</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <button
                onClick={handleCopy}
                style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}
                title="Copy content"
              >
                {copied ? <Check size={13} color="#22C55E" /> : <Copy size={13} color="#64748B" />}
              </button>
              <button
                onClick={() => setPreview(p => !p)}
                style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${preview ? "#1B3A6B" : "#E2E8F0"}`, background: preview ? "#EFF6FF" : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}
                title="Toggle preview"
              >
                {preview ? <EyeOff size={13} color="#1B3A6B" /> : <Eye size={13} color="#64748B" />}
              </button>
              <button
                onClick={handleSave}
                style={{
                  height: 30, padding: "0 12px", borderRadius: 8, fontSize: 10, fontWeight: 800,
                  background: saved === selectedId ? "#F0FDF4" : "#1B3A6B",
                  color: saved === selectedId ? "#166534" : "#fff",
                  border: `1.5px solid ${saved === selectedId ? "#86EFAC" : "#1B3A6B"}`,
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                {saved === selectedId ? <><CheckCircle2 size={11} />Saved!</> : <><Save size={11} />Save</>}
              </button>
            </div>
          </div>

          {/* Channel tabs */}
          <div style={{ display: "flex", gap: 5 }}>
            {CHANNELS.map(c => {
              const cfg     = CHANNEL_CFG[c];
              const enabled = tmpl.channels.includes(c);
              const active  = activeChannel === c && enabled;
              return (
                <button
                  key={c}
                  onClick={() => enabled && setActiveChannel(c)}
                  style={{
                    padding: "4px 10px", borderRadius: 99, fontSize: 9, fontWeight: 700,
                    border: `1.5px solid ${active ? cfg.color : "#E2E8F0"}`,
                    background: active ? cfg.bg : enabled ? "#fff" : "#F8FAFC",
                    color: active ? cfg.color : enabled ? "#64748B" : "#CBD5E1",
                    cursor: enabled ? "pointer" : "default",
                    opacity: enabled ? 1 : 0.5,
                  }}
                >
                  {cfg.icon} {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: 12, gap: 10 }}>
          {/* Variables chip strip */}
          <div style={{ flexShrink: 0 }}>
            <p style={{ fontSize: 9, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Variables</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {tmpl.variables.map(v => (
                <button
                  key={v}
                  onClick={() => {
                    if (!preview) {
                      const tag = `{{${v}}}`;
                      setContents(prev => ({
                        ...prev,
                        [selectedId]: {
                          ...prev[selectedId],
                          [activeChannel]: (prev[selectedId][activeChannel] || "") + tag,
                        },
                      }));
                    }
                  }}
                  style={{ fontSize: 9, fontWeight: 700, color: "#1B3A6B", background: "#EFF6FF", padding: "3px 8px", borderRadius: 99, border: "1px solid #BFDBFE", cursor: preview ? "default" : "pointer" }}
                >
                  {`{{${v}}}`}
                </button>
              ))}
            </div>
          </div>

          {/* Editor / Preview */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {!tmpl.channels.includes(activeChannel) ? (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, background: "#F8FAFC", borderRadius: 14, border: "1.5px dashed #E2E8F0" }}>
                <span style={{ fontSize: 24 }}>{chanCfg.icon}</span>
                <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>{chanCfg.label} not configured for this template</p>
              </div>
            ) : preview ? (
              <div style={{ height: "100%", overflowY: "auto", background: "#F0F9FF", borderRadius: 14, border: "1.5px solid #BAE6FD", padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                  <span style={{ fontSize: 11 }}>{chanCfg.icon}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: chanCfg.color, textTransform: "uppercase" }}>Preview — {chanCfg.label}</span>
                  <div style={{ flex: 1, height: 1, background: chanCfg.color + "30" }} />
                </div>
                <pre style={{ fontSize: 12, color: "#1E293B", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>
                  {displayText || <span style={{ color: "#CBD5E1" }}>No content</span>}
                </pre>
              </div>
            ) : (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6, flexShrink: 0 }}>
                  <Edit3 size={11} color="#94A3B8" />
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8" }}>Editing {chanCfg.label} template</span>
                </div>
                <textarea
                  value={body}
                  onChange={e => setContents(prev => ({
                    ...prev,
                    [selectedId]: { ...prev[selectedId], [activeChannel]: e.target.value },
                  }))}
                  placeholder={`Enter ${chanCfg.label} template content…\n\nUse {{variableName}} for dynamic values.`}
                  style={{
                    flex: 1, resize: "none", outline: "none",
                    background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14,
                    padding: 12, fontSize: 12, color: "#0F172A", lineHeight: 1.6,
                    fontFamily: "ui-monospace, monospace",
                  }}
                />
                {body && (
                  <p style={{ fontSize: 9, color: "#94A3B8", marginTop: 4, flexShrink: 0 }}>
                    {body.length} chars
                    {activeChannel === "sms" && body.length > 160 && (
                      <span style={{ color: "#F59E0B", fontWeight: 700 }}> · {Math.ceil(body.length / 160)} SMS segments</span>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
