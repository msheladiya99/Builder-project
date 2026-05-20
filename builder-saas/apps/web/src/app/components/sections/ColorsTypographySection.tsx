import { Card, CardContent } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export function ColorsTypographySection() {
  const palette = [
    {
      name: "Primary — Deep Blue",
      shades: [
        { label: "50", hex: "#EEF3FF", dark: false },
        { label: "100", hex: "#DBEAFE", dark: false },
        { label: "200", hex: "#BFDBFE", dark: false },
        { label: "300", hex: "#93C5FD", dark: false },
        { label: "400", hex: "#4A7FD4", dark: false },
        { label: "500", hex: "#2563EB", dark: true },
        { label: "600", hex: "#1D4ED8", dark: true },
        { label: "700", hex: "#1B3A6B", dark: true },
        { label: "800", hex: "#142D54", dark: true },
        { label: "900", hex: "#0F1F3D", dark: true },
      ],
    },
    {
      name: "Secondary — Gold",
      shades: [
        { label: "50", hex: "#FFFBEB", dark: false },
        { label: "100", hex: "#FEF3C7", dark: false },
        { label: "200", hex: "#FDE68A", dark: false },
        { label: "300", hex: "#FCD34D", dark: false },
        { label: "400", hex: "#E8B64C", dark: false },
        { label: "500", hex: "#D4A22A", dark: false },
        { label: "600", hex: "#C9922A", dark: true },
        { label: "700", hex: "#A87520", dark: true },
        { label: "800", hex: "#7C5316", dark: true },
        { label: "900", hex: "#5A3C0F", dark: true },
      ],
    },
  ];

  const semantic = [
    { name: "Success", hex: "#16A34A", light: "#DCFCE7", label: "Green" },
    { name: "Danger", hex: "#DC2626", light: "#FEE2E2", label: "Red" },
    { name: "Warning", hex: "#D97706", light: "#FEF3C7", label: "Amber" },
    { name: "Info", hex: "#0369A1", light: "#E0F2FE", label: "Sky Blue" },
    { name: "Neutral 500", hex: "#64748B", light: "#F1F5F9", label: "Slate" },
    { name: "Neutral 900", hex: "#0F172A", light: "#F8FAFC", label: "Dark" },
  ];

  const typographyScale = [
    { name: "Display", size: "2.25rem / 36px", weight: "700", usage: "Hero headlines", cls: "text-5xl font-bold" },
    { name: "H1", size: "1.5rem / 24px", weight: "600", usage: "Page titles", cls: "text-3xl font-semibold" },
    { name: "H2", size: "1.25rem / 20px", weight: "600", usage: "Section headings", cls: "text-2xl font-semibold" },
    { name: "H3", size: "1.0625rem / 17px", weight: "600", usage: "Card headers", cls: "text-xl font-semibold" },
    { name: "H4", size: "0.9375rem / 15px", weight: "500", usage: "Sub-section labels", cls: "text-lg font-medium" },
    { name: "Body / Base", size: "0.875rem / 14px", weight: "400", usage: "Default body text", cls: "text-base font-normal" },
    { name: "Small", size: "0.8125rem / 13px", weight: "400", usage: "Secondary text", cls: "text-sm font-normal" },
    { name: "Caption", size: "0.75rem / 12px", weight: "400", usage: "Timestamps, meta", cls: "text-xs font-normal" },
    { name: "Label", size: "0.8125rem / 13px", weight: "500", usage: "Form labels, nav", cls: "text-sm font-medium" },
    { name: "Overline", size: "0.625rem / 10px", weight: "600", usage: "Section overlines", cls: "text-[10px] font-semibold uppercase tracking-widest" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground">Colors & Typography</h1>
        <p className="text-sm text-muted-foreground mt-1">Shri Hari Group brand token system — Deep Blue + Gold</p>
      </div>

      {/* Color Palettes */}
      {palette.map(group => (
        <div key={group.name}>
          <h3 className="text-foreground mb-3">{group.name}</h3>
          <div className="flex rounded-xl overflow-hidden border border-border shadow-sm">
            {group.shades.map(shade => (
              <div
                key={shade.label}
                className="flex-1 flex flex-col items-center justify-end pb-3 pt-10 cursor-pointer hover:scale-y-105 transition-transform origin-bottom"
                style={{ backgroundColor: shade.hex }}
              >
                <span className={`text-[10px] font-semibold ${shade.dark ? "text-white/80" : "text-gray-700"}`}>{shade.label}</span>
                <span className={`text-[9px] mt-0.5 hidden sm:block ${shade.dark ? "text-white/50" : "text-gray-400"}`}>{shade.hex}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Semantic Colors */}
      <div>
        <h3 className="text-foreground mb-3">Semantic Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {semantic.map(c => (
            <Card key={c.name} className="overflow-hidden shadow-sm p-0 gap-0">
              <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
              <CardContent className="px-3 py-2.5">
                <p className="text-xs font-semibold text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.hex}</p>
                <p className="text-[10px] text-muted-foreground">{c.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Surface Tokens */}
      <div>
        <h3 className="text-foreground mb-3">Surface Tokens</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "Background", var: "--background", desc: "App background" },
            { name: "Card", var: "--card", desc: "Card surfaces" },
            { name: "Muted", var: "--muted", desc: "Subtle fills" },
            { name: "Border", var: "--border", desc: "Dividers, outlines" },
          ].map(token => (
            <Card key={token.name} className="p-4 shadow-sm">
              <div className="h-10 rounded-lg border border-border mb-3" style={{ background: `var(${token.var})` }} />
              <p className="text-xs font-semibold text-foreground">{token.name}</p>
              <p className="text-[10px] font-mono text-primary mt-0.5">{token.var}</p>
              <p className="text-[10px] text-muted-foreground">{token.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Typography Scale */}
      <div>
        <h3 className="text-foreground mb-3">Typography Scale — Inter</h3>
        <Card className="overflow-hidden shadow-sm p-0 gap-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                {["Style", "Size / Weight", "Usage", "Preview"].map(h => (
                  <TableHead key={h}>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {typographyScale.map(t => (
                <TableRow key={t.name}>
                  <TableCell>
                    <span className="text-xs font-semibold text-foreground">{t.name}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs text-foreground font-mono">{t.size}</p>
                      <p className="text-[10px] text-muted-foreground">weight {t.weight}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{t.usage}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`${t.cls} text-foreground truncate`}>Shri Hari Group</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Spacing */}
      <div>
        <h3 className="text-foreground mb-3">Spacing Scale</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "1", px: "4px" }, { label: "2", px: "8px" }, { label: "3", px: "12px" },
            { label: "4", px: "16px" }, { label: "5", px: "20px" }, { label: "6", px: "24px" },
            { label: "8", px: "32px" }, { label: "10", px: "40px" }, { label: "12", px: "48px" },
            { label: "16", px: "64px" },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              <div className="bg-primary/20 border border-primary/30 rounded" style={{ width: s.px, height: "20px" }} />
              <p className="text-[10px] font-mono text-muted-foreground">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.px}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h3 className="text-foreground mb-3">Border Radius</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { label: "sm", val: "4px", cls: "rounded" },
            { label: "md", val: "6px", cls: "rounded-md" },
            { label: "lg", val: "8px", cls: "rounded-lg" },
            { label: "xl", val: "12px", cls: "rounded-xl" },
            { label: "2xl", val: "16px", cls: "rounded-2xl" },
            { label: "full", val: "9999px", cls: "rounded-full" },
          ].map(r => (
            <div key={r.label} className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 bg-primary/15 border-2 border-primary/30 ${r.cls}`} />
              <p className="text-[10px] font-semibold text-foreground">{r.label}</p>
              <p className="text-[10px] text-muted-foreground">{r.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow Scale */}
      <div>
        <h3 className="text-foreground mb-3">Shadow Scale</h3>
        <div className="flex flex-wrap gap-5">
          {[
            { label: "none", cls: "", style: {} },
            { label: "sm", cls: "shadow-sm", style: {} },
            { label: "md", cls: "shadow-md", style: {} },
            { label: "lg", cls: "shadow-lg", style: {} },
            { label: "xl", cls: "shadow-xl", style: {} },
            { label: "2xl", cls: "shadow-2xl", style: {} },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              <Card className={`w-20 h-14 ${s.cls} flex items-center justify-center p-0 gap-0 shadow-none`}>
                <span className="text-[10px] text-muted-foreground font-mono">{s.label}</span>
              </Card>
              <p className="text-[10px] text-muted-foreground">shadow-{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
