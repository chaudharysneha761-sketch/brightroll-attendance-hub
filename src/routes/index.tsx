import { createFileRoute } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { BookOpen, CalendarDays, Percent, Users } from "lucide-react";
import { reportQuery, sessionsQuery, studentsQuery, subjectsQuery } from "@/lib/queries";
import { percentage } from "@/lib/attendance-utils";
import { EmptyState, ErrorState, LoadingState, PageHeader, Panel, fmtDate, td, th } from "@/components/app/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Smart Attendance" },
      { name: "description", content: "Overview of students, subjects, sessions and attendance." },
      { property: "og:title", content: "Dashboard — Smart Attendance" },
      { property: "og:description", content: "Overview of students, subjects, sessions and attendance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const students = useQuery(studentsQuery);
  const subjects = useQuery(subjectsQuery);
  const sessions = useQuery(sessionsQuery);
  const reports = useQueries({
    queries: (subjects.data ?? []).map((s) => reportQuery(s.id)),
  });

  const totals = reports.reduce(
    (a, r) => {
      for (const row of r.data ?? []) {
        a.present += row.present;
        a.absent += row.absent;
      }
      return a;
    },
    { present: 0, absent: 0 },
  );
  const marked = totals.present + totals.absent;
  const pct = percentage(totals.present, marked);
  const reportsLoading = subjects.isLoading || reports.some((r) => r.isLoading);
  const reportError = reports.find((r) => r.error)?.error;

  const subjectName = (id: number) => subjects.data?.find((s) => s.id === id)?.name ?? `Subject #${id}`;
  const recent = [...(sessions.data ?? [])].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  const metrics = [
    { label: "Students", value: students.data?.length, q: students, icon: Users },
    { label: "Subjects", value: subjects.data?.length, q: subjects, icon: BookOpen },
    { label: "Sessions", value: sessions.data?.length, q: sessions, icon: CalendarDays },
    { label: "Attendance", value: marked ? `${pct}%` : "—", q: { isLoading: reportsLoading, error: reportError }, icon: Percent },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Time & attendance overview" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {m.label} <m.icon className="h-4 w-4" />
            </div>
            <div className="mt-3 text-2xl font-semibold">
              {m.q.isLoading ? <span className="text-muted-foreground">…</span> : m.q.error ? <span className="text-sm text-destructive">Error</span> : m.value ?? 0}
            </div>
          </div>
        ))}
      </div>

      <Panel title="Attendance breakdown" className="mt-6">
        {reportsLoading ? (
          <LoadingState />
        ) : reportError ? (
          <ErrorState error={reportError} onRetry={() => reports.forEach((r) => r.refetch())} />
        ) : marked === 0 ? (
          <EmptyState label="No attendance recorded yet." />
        ) : (
          <div className="p-5">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="bg-success" style={{ width: `${pct}%` }} />
              <div className="bg-destructive/70" style={{ width: `${100 - pct}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-5 text-sm">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" />Present <b>{totals.present}</b></span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-destructive/70" />Absent <b>{totals.absent}</b></span>
              <span className="text-muted-foreground">{pct}% overall</span>
            </div>
          </div>
        )}
      </Panel>

      <Panel title="Recent attendance sessions" className="mt-6">
        {sessions.isLoading ? (
          <LoadingState />
        ) : sessions.error ? (
          <ErrorState error={sessions.error} onRetry={() => sessions.refetch()} />
        ) : recent.length === 0 ? (
          <EmptyState label="No sessions yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead className="border-b"><tr><th className={th}>Date</th><th className={th}>Subject</th><th className={th}>Time</th><th className={th}>Topic</th></tr></thead>
              <tbody className="divide-y">
                {recent.map((s) => (
                  <tr key={s.id}>
                    <td className={td}>{fmtDate(s.date)}</td>
                    <td className={td}>{subjectName(s.subjectId)}</td>
                    <td className={`${td} text-muted-foreground`}>{s.startTime}–{s.endTime}</td>
                    <td className={`${td} text-muted-foreground`}>{s.topic || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
