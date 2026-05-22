import { useState } from "react";
import { dailyUpdates, sitePhotos, WEATHER_CFG } from "../constructionData";
import type { PhotoCategory } from "../constructionData";

interface Props { isDark: boolean; }

const PHOTO_CATEGORY_LABELS: Record<PhotoCategory, string> = {
  foundation: "Foundation", structure: "Structure", masonry: "Masonry",
  mep: "MEP", finishing: "Finishing", site: "Site", inspection: "Inspection",
};

const PHOTO_FILTERS: { id: PhotoCategory | "all"; label: string }[] = [
  { id: "all",        label: "All"         },
  { id: "structure",  label: "Structure"   },
  { id: "masonry",    label: "Masonry"     },
  { id: "mep",        label: "MEP"         },
  { id: "finishing",  label: "Finishing"   },
  { id: "inspection", label: "Inspection"  },
  { id: "foundation", label: "Foundation"  },
  { id: "site",       label: "Site"        },
];

export function DailyUpdatesView({ isDark }: Props) {
  const [lightbox, setLightbox] = useState<{ color: string; label: string; engineer: string; date: string } | null>(null);
  const [photoFilter, setPhotoFilter] = useState<PhotoCategory | "all">("all");
  const [activeTab, setActiveTab] = useState<"feed" | "gallery">("feed");

  const bg     = isDark ? "#0F172A" : "#F1F5F9";
  const card   = isDark ? "#1E293B" : "#FFFFFF";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const txt    = isDark ? "#F1F5F9" : "#0F172A";
  const sub    = isDark ? "#94A3B8" : "#64748B";

  const filteredPhotos = photoFilter === "all" ? sitePhotos : sitePhotos.filter(p => p.category === photoFilter);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: bg }}>

      {/* Tabs */}
      <div style={{ padding: "0 20px", background: card, borderBottom: `1px solid ${border}`, flexShrink: 0, display: "flex", gap: 0 }}>
        {(["feed","gallery"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 20px", border: "none", cursor: "pointer", background: "transparent",
              borderBottom: activeTab === tab ? "2px solid #1B3A6B" : "2px solid transparent",
              color: activeTab === tab ? "#1B3A6B" : sub, fontSize: 12, fontWeight: activeTab === tab ? 700 : 400,
            }}
          >
            {tab === "feed" ? `📋 Daily Feed (${dailyUpdates.length})` : `📷 Photo Gallery (${sitePhotos.length})`}
          </button>
        ))}
      </div>

      {activeTab === "feed" ? (
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "Updates this week", value: dailyUpdates.length, icon: "📋" },
              { label: "Total photos",       value: dailyUpdates.reduce((s, u) => s + u.photos.length, 0), icon: "📷" },
              { label: "Total workers logged", value: dailyUpdates.reduce((s, u) => s + u.workerCount, 0), icon: "👷" },
            ].map(s => (
              <div key={s.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#1B3A6B" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: sub }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Update cards */}
          {dailyUpdates.map(u => {
            const wcfg = WEATHER_CFG[u.weather];
            return (
              <div key={u.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden" }}>

                {/* Card header */}
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${border}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: sub }}>{u.displayDate}</span>
                        <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 700, background: "#F0FDF4", borderRadius: 8, padding: "1px 6px" }}>+{u.delta}%</span>
                        {u.issues.length > 0 && <span style={{ fontSize: 10, color: "#EF4444", fontWeight: 700, background: "#FEF2F2", borderRadius: 8, padding: "1px 6px" }}>⚠ {u.issues.length} issue{u.issues.length > 1 ? "s" : ""}</span>}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: txt, lineHeight: 1.4 }}>{u.headline}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#1B3A6B" }}>{u.overallProgress}%</div>
                      <div style={{ fontSize: 9, color: sub }}>PROGRESS</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 4, background: isDark ? "#334155" : "#E2E8F0", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
                    <div style={{ width: `${u.overallProgress}%`, height: "100%", background: "linear-gradient(90deg, #1B3A6B, #22C55E)", borderRadius: 3 }} />
                  </div>

                  <div style={{ display: "flex", gap: 16, fontSize: 11, color: sub }}>
                    <span>👷 {u.workerCount} workers</span>
                    <span>{wcfg.icon} {wcfg.label}</span>
                    <span>— {u.engineer}</span>
                  </div>
                </div>

                {/* Tasks */}
                <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#22C55E", marginBottom: 6 }}>✓ COMPLETED</div>
                    {u.completed.map((t, i) => (
                      <div key={i} style={{ fontSize: 11, color: txt, marginBottom: 3, display: "flex", gap: 5 }}>
                        <span style={{ color: "#22C55E", flexShrink: 0 }}>✓</span>{t}
                      </div>
                    ))}
                  </div>
                  <div>
                    {u.issues.length > 0 && <>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>⚠ ISSUES</div>
                      {u.issues.map((issue, i) => (
                        <div key={i} style={{ fontSize: 11, color: "#EF4444", marginBottom: 3, display: "flex", gap: 5 }}>
                          <span style={{ flexShrink: 0 }}>!</span>{issue}
                        </div>
                      ))}
                    </>}
                    {u.materials.length > 0 && <>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#C9922A", marginBottom: 6, marginTop: u.issues.length > 0 ? 8 : 0 }}>📦 MATERIALS</div>
                      {u.materials.map((m, i) => (
                        <div key={i} style={{ fontSize: 11, color: sub, marginBottom: 3 }}>• {m}</div>
                      ))}
                    </>}
                  </div>
                </div>

                {/* Engineer note */}
                <div style={{ padding: "10px 16px", background: isDark ? "rgba(27,58,107,0.12)" : "rgba(27,58,107,0.04)", borderTop: `1px solid ${border}` }}>
                  <span style={{ fontSize: 11, color: "#1B3A6B", fontStyle: "italic" }}>"{u.engineerNote}"</span>
                  <span style={{ fontSize: 10, color: sub }}> — {u.engineer}</span>
                </div>

                {/* Photo strip */}
                {u.photos.length > 0 && (
                  <div style={{ padding: "10px 16px 14px", borderTop: `1px solid ${border}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: sub, marginBottom: 8 }}>📷 PHOTOS ({u.photos.length})</div>
                    <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                      {u.photos.map(photo => (
                        <button
                          key={photo.id}
                          onClick={() => setLightbox({ color: photo.color, label: photo.label, engineer: u.engineer, date: u.displayDate })}
                          style={{
                            flexShrink: 0, width: 90, height: 72, borderRadius: 8,
                            background: photo.color, border: "none", cursor: "pointer",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 9, padding: "4px 6px",
                          }}
                        >
                          <span style={{ fontSize: 18, marginBottom: 2 }}>📷</span>
                          <span style={{ textAlign: "center", lineHeight: 1.3, opacity: 0.85 }}>{photo.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Gallery View */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Filter */}
          <div style={{ padding: "8px 20px", background: card, borderBottom: `1px solid ${border}`, display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
            {PHOTO_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setPhotoFilter(f.id)}
                style={{
                  padding: "5px 12px", borderRadius: 20, border: `1px solid ${photoFilter === f.id ? "#1B3A6B" : border}`,
                  background: photoFilter === f.id ? "#1B3A6B" : "transparent",
                  color: photoFilter === f.id ? "#fff" : sub,
                  fontSize: 11, fontWeight: photoFilter === f.id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                {f.label} {f.id === "all" ? `(${sitePhotos.length})` : `(${sitePhotos.filter(p => p.category === f.id).length})`}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
              {filteredPhotos.map(photo => (
                <button
                  key={photo.id}
                  onClick={() => setLightbox({ color: photo.color, label: photo.label, engineer: photo.engineer, date: photo.date })}
                  style={{
                    background: photo.color, border: "none", borderRadius: 10, cursor: "pointer",
                    aspectRatio: "4/3", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                  }}
                >
                  <span style={{ fontSize: 24, marginBottom: 6, opacity: 0.6 }}>📷</span>
                  <span style={{ fontSize: 10, color: "#fff", fontWeight: 600, textAlign: "center", padding: "0 8px", lineHeight: 1.3 }}>{photo.label}</span>
                  {photo.tag && (
                    <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.5)", color: "#fff", borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>{photo.tag}</div>
                  )}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", padding: "6px 8px" }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.8)" }}>{photo.date}</div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)" }}>
                      {photo.floor ? `Floor ${photo.floor} · ` : ""}{PHOTO_CATEGORY_LABELS[photo.category]}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setLightbox(null)}
        >
          <div style={{ position: "relative", maxWidth: 480, width: "100%", borderRadius: 16, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <div style={{ background: lightbox.color, height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <span style={{ fontSize: 56, opacity: 0.5 }}>📷</span>
              <p style={{ fontSize: 16, fontWeight: 700, marginTop: 12 }}>{lightbox.label}</p>
              <p style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>Site photo placeholder</p>
            </div>
            <div style={{ background: "#1E293B", padding: "12px 16px" }}>
              <div style={{ fontSize: 12, color: "#F1F5F9", fontWeight: 600 }}>{lightbox.label}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{lightbox.engineer} · {lightbox.date}</div>
            </div>
            <button
              onClick={() => setLightbox(null)}
              style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
