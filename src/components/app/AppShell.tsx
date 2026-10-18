import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BarChart3, BookOpen, ClipboardCheck, LayoutGrid, Users } from "lucide-react";
import { DEMO_MODE, API_BASE_URL } from "@/lib/config";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/mark-attendance", label: "Mark Attendance", icon: ClipboardCheck },
  { to: "/students", label: "Students", icon: Users },
  { to: "/subjects", label: "Subjects & Sessions", icon: BookOpen },
  { to: "/reports", label: "Reports", icon: BarChart3 },
] as const;

const linkCls =
  "group relative flex items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[72px] flex-col items-center gap-2 border-r bg-sidebar py-5 md:flex">
        <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-foreground text-sm font-bold text-background">SA</div>
        {nav.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className={`${linkCls} h-11 w-11`} aria-label={n.label}>
            <n.icon className="h-[18px] w-[18px]" />
            <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition group-hover:opacity-100">
              {n.label}
            </span>
          </Link>
        ))}
      </aside>

      <div className="md:pl-[72px]">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-8">
          <span className="truncate text-sm font-semibold">Smart Attendance</span>
          {DEMO_MODE ? (
            <span className="shrink-0 rounded-full border border-primary bg-primary-soft px-3 py-1 text-xs font-medium">Demo Data</span>
          ) : (
            <span className="hidden truncate text-xs text-muted-foreground sm:block">API: {API_BASE_URL}</span>
          )}
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-8 md:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t bg-sidebar px-2 py-2 md:hidden">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className={`${linkCls} h-11 w-12`} aria-label={n.label}>
            <n.icon className="h-5 w-5" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
