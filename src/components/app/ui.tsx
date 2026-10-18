import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Panel({ title, actions, children, className }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border bg-card", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
          <h2 className="text-sm font-semibold">{title}</h2>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
      <Inbox className="h-5 w-5" /> {label}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="m-4 flex flex-col items-start gap-2 rounded-lg border border-destructive/30 bg-destructive-soft p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
      <span className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error instanceof Error ? error.message : "Something went wrong."}
      </span>
      {onRetry && (
        <button onClick={onRetry} className="rounded-md border border-destructive/30 bg-card px-3 py-1 text-xs font-medium">
          Retry
        </button>
      )}
    </div>
  );
}

export function StatusPill({ status }: { status: "present" | "absent" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "present" ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "present" ? "bg-success" : "bg-destructive")} />
      {status === "present" ? "Present" : "Absent"}
    </span>
  );
}

export const th = "px-5 py-2.5 text-left text-xs font-medium text-muted-foreground";
export const td = "px-5 py-2.5 text-sm";
export const inputCls =
  "h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";
export const btnPrimary =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60";

export function fmtDate(d: string) {
  const dt = new Date(d + "T00:00:00");
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
