import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { reportQuery, subjectsQuery } from "@/lib/queries";
import { isBelowThreshold } from "@/lib/attendance-utils";
import { LOW_ATTENDANCE_THRESHOLD } from "@/lib/config";
import { cn } from "@/lib/utils";
import { EmptyState, ErrorState, LoadingState, PageHeader, Panel, inputCls, td, th } from "@/components/app/ui";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Smart Attendance" },
      { name: "description", content: "Student-wise attendance totals and percentages by subject." },
      { property: "og:title", content: "Reports — Smart Attendance" },
      { property: "og:description", content: "Student-wise attendance totals and percentages by subject." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const subjects = useQuery(subjectsQuery);
  const [subjectId, setSubjectId] = useState(0);
  const [lowOnly, setLowOnly] = useState(false);
  useEffect(() => {
    if (!subjectId && subjects.data?.length) setSubjectId(subjects.data[0].id);
  }, [subjects.data, subjectId]);
  const report = useQuery(reportQuery(subjectId));

  const rows = (report.data ?? []).filter((r) => !lowOnly || isBelowThreshold(r.percentage, r.totalSessions));
  const lowCount = (report.data ?? []).filter((r) => isBelowThreshold(r.percentage, r.totalSessions)).length;

  return (
    <>
      <PageHeader title="Reports" subtitle="Student-wise attendance by subject." />
      <Panel className="mb-6">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
          <label className="text-xs font-medium text-muted-foreground sm:w-80">Subject
            <select className={`${inputCls} mt-1.5`} value={subjectId} onChange={(e) => setSubjectId(Number(e.target.value))}>
              {!subjects.data?.length && <option value={0}>{subjects.isLoading ? "Loading…" : "No subjects"}</option>}
              {subjects.data?.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
            </select>
          </label>
          <label className="flex h-9 items-center gap-2 text-sm">
            <input type="checkbox" className="accent-primary" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />
            Below {LOW_ATTENDANCE_THRESHOLD}% only
          </label>
        </div>
        <p className="border-t px-5 py-2.5 text-xs text-muted-foreground">
          Date filters aren't available: the attendance report endpoint only supports filtering by subject.
        </p>
        {subjects.error && <ErrorState error={subjects.error} onRetry={() => subjects.refetch()} />}
      </Panel>

      {lowCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/40 bg-warning-soft px-4 py-2.5 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {lowCount} student{lowCount > 1 ? "s are" : " is"} below {LOW_ATTENDANCE_THRESHOLD}% attendance.
        </div>
      )}

      <Panel title="Student attendance">
        {!subjectId ? <EmptyState label="Select a subject." /> : report.isLoading ? <LoadingState /> : report.error ? <ErrorState error={report.error} onRetry={() => report.refetch()} /> : rows.length === 0 ? (
          <EmptyState label={lowOnly ? "No students below the threshold." : "No attendance data for this subject."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead className="border-b"><tr><th className={th}>Roll No</th><th className={th}>Name</th><th className={th}>Sessions</th><th className={th}>Present</th><th className={th}>Absent</th><th className={th}>Attendance</th></tr></thead>
              <tbody className="divide-y">
                {rows.map((r) => {
                  const low = isBelowThreshold(r.percentage, r.totalSessions);
                  return (
                    <tr key={r.studentId} className={cn(low && "bg-warning-soft/60")}>
                      <td className={`${td} text-muted-foreground`}>{r.rollNo}</td>
                      <td className={`${td} font-medium`}>{r.name}</td>
                      <td className={td}>{r.totalSessions}</td>
                      <td className={`${td} text-success`}>{r.present}</td>
                      <td className={`${td} text-destructive`}>{r.absent}</td>
                      <td className={td}>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div className={low ? "h-full bg-destructive/70" : "h-full bg-success"} style={{ width: `${r.percentage}%` }} />
                          </div>
                          <span className={cn("text-sm", low && "font-medium text-destructive")}>{r.percentage}%</span>
                          {low && <AlertTriangle className="h-3.5 w-3.5 text-destructive" aria-label="Below threshold" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
