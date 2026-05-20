import { useState } from "react";
import { X, Check, AlertCircle, Info, AlertTriangle, Bell, CheckCircle2, XCircle, Loader2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "../ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "../ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "info" | "loading";
  title: string;
  desc?: string;
}

let toastId = 0;

export function OverlaysSection() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const addToast = (type: Toast["type"], title: string, desc?: string) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, title, desc }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const toastIcon = (type: Toast["type"]) => ({
    success: <CheckCircle2 size={16} className="text-success" />,
    error: <XCircle size={16} className="text-destructive" />,
    warning: <AlertTriangle size={16} className="text-warning" />,
    info: <Info size={16} className="text-info" />,
    loading: <Loader2 size={16} className="text-primary animate-spin" />,
  }[type]);

  const toastBorder = (type: Toast["type"]) => ({
    success: "border-l-4 border-l-success",
    error: "border-l-4 border-l-destructive",
    warning: "border-l-4 border-l-warning",
    info: "border-l-4 border-l-info",
    loading: "border-l-4 border-l-primary",
  }[type]);

  return (
    <div className="space-y-10">
      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-card border border-border rounded-xl shadow-2xl px-4 py-3 flex items-start gap-3 animate-in slide-in-from-right-4 duration-300 ${toastBorder(toast.type)}`}
          >
            <div className="flex-shrink-0 mt-0.5">{toastIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{toast.title}</p>
              {toast.desc && <p className="text-xs text-muted-foreground mt-0.5">{toast.desc}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div>
        <h1 className="text-foreground">Modals & Overlays</h1>
        <p className="text-sm text-muted-foreground mt-1">Dialog, confirmation, alert, and toast notification components</p>
      </div>

      {/* Toast Notifications */}
      <section>
        <h3 className="text-foreground mb-4">Toast Notifications</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <p className="text-xs text-muted-foreground mb-4">Click to trigger live toast notifications (bottom-right)</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => addToast("success", "Booking confirmed!", "Unit B-204 successfully booked for Suresh Nair")}
              className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 text-success rounded-lg text-sm font-medium hover:bg-success/20 transition-colors"
            >
              <CheckCircle2 size={14} /> Success Toast
            </button>
            <button
              onClick={() => addToast("error", "Payment failed", "Transaction declined. Please retry with a different method.")}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
            >
              <XCircle size={14} /> Error Toast
            </button>
            <button
              onClick={() => addToast("warning", "Document pending", "Agreement must be signed within 7 days")}
              className="flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/30 text-warning rounded-lg text-sm font-medium hover:bg-warning/20 transition-colors"
            >
              <AlertTriangle size={14} /> Warning Toast
            </button>
            <button
              onClick={() => addToast("info", "System update", "New ERP features available. Refresh to update.")}
              className="flex items-center gap-2 px-4 py-2 bg-info/10 border border-info/30 text-info rounded-lg text-sm font-medium hover:bg-info/20 transition-colors"
            >
              <Info size={14} /> Info Toast
            </button>
            <button
              onClick={() => addToast("loading", "Processing demand...", "Generating demand letters for Block C")}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Loader2 size={14} /> Loading Toast
            </button>
          </div>

          {/* Static previews */}
          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Preview</p>
            {[
              { type: "success" as const, title: "Booking confirmed!", desc: "Unit B-204 booked for Suresh Nair" },
              { type: "error" as const, title: "Payment failed", desc: "Transaction declined — retry required" },
              { type: "warning" as const, title: "Document pending", desc: "Agreement unsigned — 7 days left" },
              { type: "info" as const, title: "System update available", desc: "Refresh to apply latest changes" },
            ].map((t, i) => (
              <div key={i} className={`bg-card border border-border rounded-xl px-4 py-3 flex items-start gap-3 shadow-sm ${toastBorder(t.type)}`}>
                <div className="flex-shrink-0 mt-0.5">{toastIcon(t.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alert Banners */}
      <section>
        <h3 className="text-foreground mb-4">Alert Banners</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3">
          {[
            {
              type: "info", icon: <Info size={16} />,
              title: "RERA registration due",
              msg: "Hari Heights Phase 2 RERA registration expires in 14 days. Renew immediately.",
              variant: "default" as const,
              cls: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
            },
            {
              type: "success", icon: <CheckCircle2 size={16} />,
              title: "All demands generated",
              msg: "Monthly demand letters successfully sent to 142 customers.",
              variant: "default" as const,
              cls: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
            },
            {
              type: "warning", icon: <AlertTriangle size={16} />,
              title: "Construction delayed",
              msg: "Green Valley Phase 2 is 18 days behind schedule. Review contractor performance.",
              variant: "default" as const,
              cls: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200",
            },
            {
              type: "error", icon: <AlertCircle size={16} />,
              title: "Critical: Payment gateway down",
              msg: "Online payments are currently unavailable. Contact IT support immediately.",
              variant: "destructive" as const,
              cls: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
            },
          ].map((alert, i) => (
            <Alert key={i} variant={alert.variant} className={alert.cls}>
              {alert.icon}
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.msg}</AlertDescription>
            </Alert>
          ))}
        </div>
      </section>

      {/* Modal Triggers */}
      <section>
        <h3 className="text-foreground mb-4">Modal Dialogs</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap gap-3 mb-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Confirm Delete Modal</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col items-center text-center pt-4">
                  <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-4">
                    <AlertTriangle size={28} className="text-destructive" />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">Delete Booking?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      Are you sure you want to delete <strong>BK-2401</strong>? This action cannot be undone and all associated data will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter className="sm:justify-center flex-row gap-3 mt-4">
                  <AlertDialogCancel className="flex-1 mt-0">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <Button>Form Modal</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                  <DialogDescription>Fill in customer inquiry details</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">First Name</label>
                      <Input placeholder="First Name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Last Name</label>
                      <Input placeholder="Last Name" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Mobile</label>
                    <Input placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Interested In</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="p1">Project Alpha</SelectItem>
                        <SelectItem value="p2">Project Beta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                  <Button onClick={() => { setFormOpen(false); addToast("success", "Lead added!", "New lead successfully captured"); }}>
                    <Plus size={14} className="mr-2" /> Add Lead
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-warning border-warning/50 hover:bg-warning/10">Alert Modal</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <div className="flex flex-col items-center text-center pt-4">
                  <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mb-4">
                    <Bell size={26} className="text-warning" />
                  </div>
                  <DialogHeader>
                    <DialogTitle className="text-center">Payment Overdue</DialogTitle>
                    <DialogDescription className="text-center">
                      <strong>₹53.5L</strong> is overdue from Suresh Nair (BK-2401). Last demand was sent on <strong>1 May 2026</strong>. Send a reminder now?
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <DialogFooter className="sm:justify-center flex-row gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setAlertOpen(false)}>Dismiss</Button>
                  <Button className="flex-1 bg-warning text-warning-foreground hover:bg-warning/90" onClick={() => { setAlertOpen(false); addToast("success", "Reminder sent!", "Payment reminder sent to Suresh Nair"); }}>
                    Send Reminder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Modal style previews */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-muted/40 px-4 py-2 border-b border-border">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Modal Preview (static)</p>
            </div>
            <div className="p-6 relative min-h-64 flex items-center justify-center bg-foreground/5 dark:bg-foreground/5">
              {/* Fake backdrop */}
              <div className="absolute inset-0 bg-black/5 dark:bg-black/30 rounded-b-xl" />
              {/* Modal */}
              <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h4 className="text-foreground">Record Payment</h4>
                  <button className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors">
                    <X size={15} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Amount Received</label>
                    <Input
                      defaultValue="₹5,00,000"
                      readOnly
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Payment Mode</label>
                    <Select defaultValue="neft">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neft">NEFT / RTGS</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-border bg-muted/30 flex items-center justify-end gap-2">
                  <Button variant="ghost">Cancel</Button>
                  <Button>
                    <Check size={14} className="mr-1.5" /> Save Payment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
