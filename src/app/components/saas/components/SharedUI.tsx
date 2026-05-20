import { AlertTriangle, RefreshCw, SearchX, Plus, type LucideIcon } from "lucide-react";

// ── Loading Skeleton ─────────────────────────────────────────────────────────

interface SkeletonProps { width?: string | number; height?: number; radius?: number; isDark?: boolean }

export function Skeleton({ width = "100%", height = 14, radius = 6, isDark }: SkeletonProps) {
  return (
    <div
      style={{
        width, height, borderRadius: radius,
        background: isDark
          ? "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)"
          : "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}

export function CardSkeleton({ isDark }: { isDark?: boolean }) {
  const bg = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const bd = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9";
  return (
    <div style={{ background: bg, border: `1.5px solid ${bd}`, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Skeleton width={36} height={36} radius={10} isDark={isDark} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton width="60%" height={12} isDark={isDark} />
          <Skeleton width="40%" height={10} isDark={isDark} />
        </div>
      </div>
      <Skeleton width="100%" height={10} isDark={isDark} />
      <Skeleton width="80%" height={10} isDark={isDark} />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5, isDark }: { cols?: number; isDark?: boolean }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "12px 16px" }}>
          <Skeleton width={i === 0 ? "70%" : "50%"} height={11} isDark={isDark} />
        </td>
      ))}
    </tr>
  );
}

export function DashboardSkeleton({ isDark }: { isDark?: boolean }) {
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[0,1,2,3].map(i => <CardSkeleton key={i} isDark={isDark} />)}
      </div>
      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#fff", border: `1.5px solid ${isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"}`, borderRadius: 16, padding: 16, height: 240 }}>
          <Skeleton width="30%" height={14} isDark={isDark} />
          <div style={{ marginTop: 12, display: "flex", gap: 4, alignItems: "flex-end", height: 160 }}>
            {[70,85,60,90,75,95].map((h, i) => (
              <Skeleton key={i} width="100%" height={h * 1.6} radius={4} isDark={isDark} />
            ))}
          </div>
        </div>
        <CardSkeleton isDark={isDark} />
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  isDark?: boolean;
}

export function EmptyState({ icon: Icon = SearchX, title, description, action, isDark }: EmptyStateProps) {
  const text   = isDark ? "#F1F5F9" : "#0F172A";
  const sub    = isDark ? "rgba(255,255,255,0.35)" : "#94A3B8";
  const iconBg = isDark ? "rgba(255,255,255,0.06)" : "#F8FAFC";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <Icon size={28} color={isDark ? "rgba(255,255,255,0.2)" : "#CBD5E1"} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 6 }}>{title}</p>
      {description && <p style={{ fontSize: 13, color: sub, lineHeight: 1.5, maxWidth: 320, marginBottom: action ? 20 : 0 }}>{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#1B3A6B", color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 800 }}
          className="active:scale-95 transition-transform"
        >
          <Plus size={14} />
          {action.label}
        </button>
      )}
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────────────────

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isDark?: boolean;
}

export function ErrorState({ title = "Something went wrong", description = "An unexpected error occurred. Please try again.", onRetry, isDark }: ErrorStateProps) {
  const text = isDark ? "#F1F5F9" : "#0F172A";
  const sub  = isDark ? "rgba(255,255,255,0.35)" : "#94A3B8";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <AlertTriangle size={28} color="#EF4444" />
      </div>
      <p style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 13, color: sub, lineHeight: 1.5, maxWidth: 320, marginBottom: onRetry ? 20 : 0 }}>{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#EF4444", color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 800 }}
          className="active:scale-95 transition-transform"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      )}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string;
  color: string;
  bg: string;
  dot?: boolean;
  size?: "sm" | "md";
}

export function StatusBadge({ label, color, bg, dot = true, size = "sm" }: BadgeProps) {
  const fs = size === "sm" ? 9 : 11;
  const px = size === "sm" ? "2px 7px" : "4px 10px";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: fs, fontWeight: 800, color, background: bg, padding: px, borderRadius: 99 }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: 99, background: color }} />}
      {label}
    </span>
  );
}

// ── Data Table ────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyTitle?: string;
  emptyDesc?: string;
  isDark?: boolean;
  loading?: boolean;
}

export function DataTable<T>({ columns, data, emptyTitle = "No data", emptyDesc, isDark, loading }: DataTableProps<T>) {
  const headBg   = isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC";
  const headText = isDark ? "rgba(255,255,255,0.4)"  : "#64748B";
  const border   = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9";
  const text     = isDark ? "#F1F5F9"                 : "#0F172A";
  const rowHover = isDark ? "rgba(255,255,255,0.02)"  : "#FAFAFA";

  return (
    <div style={{ overflow: "hidden", borderRadius: 14, border: `1.5px solid ${border}` }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: headBg }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: "10px 16px", textAlign: (col.align || "left") as "left" | "right" | "center", fontSize: 10, fontWeight: 800, color: headText, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap", width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={columns.length} isDark={isDark} />)
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDesc} isDark={isDark} />
                </td>
              </tr>
            ) : data.map((row, i) => (
              <tr
                key={i}
                style={{ borderTop: `1px solid ${border}`, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = rowHover)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {columns.map(col => (
                  <td key={col.key} style={{ padding: "11px 16px", fontSize: 12, color: text, textAlign: (col.align || "left") as "left" | "right" | "center", whiteSpace: "nowrap" }}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: string;
  color?: string;
  bg?: string;
  delta?: number;
  isDark?: boolean;
}

export function StatCard({ label, value, sub, icon, color = "#1B3A6B", bg = "#EFF6FF", delta, isDark }: StatCardProps) {
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const border = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9";
  const text   = isDark ? "#F1F5F9"                 : "#0F172A";
  const subClr = isDark ? "rgba(255,255,255,0.4)"  : "#94A3B8";

  return (
    <div style={{ background: cardBg, border: `1.5px solid ${border}`, borderRadius: 16, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        {icon && (
          <div style={{ width: 38, height: 38, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            {icon}
          </div>
        )}
        {delta !== undefined && (
          <span style={{ fontSize: 10, fontWeight: 800, color: delta >= 0 ? "#22C55E" : "#EF4444", background: delta >= 0 ? "#F0FDF4" : "#FEF2F2", padding: "3px 7px", borderRadius: 99 }}>
            {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p style={{ fontSize: 22, fontWeight: 900, color: text, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 11, fontWeight: 700, color: text, marginTop: 4 }}>{label}</p>
      {sub && <p style={{ fontSize: 10, color: subClr, marginTop: 2 }}>{sub}</p>}
    </div>
  );
}
