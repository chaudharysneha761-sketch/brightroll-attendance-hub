import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { sessionsQuery, studentsQuery, subjectsQuery } from "@/lib/queries";
import type { AttendanceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EmptyState, ErrorState, LoadingState, PageHeader, Panel, btnPrimary, fmtDate, inputCls, td, th } from "@/components/app/ui";

export const Route = createFileRoute("/mark-attendance")({
  head: () => ({
    meta: [
      { title: "Mark Attendance — Smart Attendance" },
      { name: "description", content: "Mark students present or absent for a class session." },
      { property: "og:title", content: "Mark Attendance — Smart Attendance" },
      { property: "og:description", content: "Mark students present or absent for a class session." },
    ],
  }),
  component: MarkAttendance,
});

function MarkAttendance() {
  const qc = useQueryClient();
  const subjects = useQuery(subjectsQuery);
  const sessions = useQuery(sessionsQuery);
  const students = useQuery(studentsQuery);
  const [subjectId, setSubjectId] = useState(0);
  const [sessionId, setSessionId] = useState(0);
  const [marks, setMarks] = useState<Record<number, AttendanceStatus>>({});
  const [saved, setSaved] = useState(false);

  const subjectSessions = (sessions.data ?? []).filter((s) => s.subjectId === subjectId);

  useEffect(() => {
    setMarks({});
    setSaved(false);
  }, [sessionId]);

  const submit = useMutation({
    mutationFn: () =>
      api.submitAttendance({
        sessionId,
        records: (students.data ?? []).map((s) => ({ studentId: s.id, status: marks[s.id] ?? "absent" })),
      }),
    onSuccess: () => {
      toast.success("Attendance saved");
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["report"] });
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to save attendance"),
  });

  const list = students.data ?? [];
  const present = list.filter((s) => marks[s.id] === "present").length;
  const absent = list.filter((s) => marks[s.id] === "absent").length;
  const unmarked = list.length - present - absent;
  const setAll = (st: AttendanceStatus) => setMarks(Object.fromEntries(list.map((s) => [s.id, st])));

  return (
    <>
      <PageHeader title="Mark Attendance" subtitle="Choose a subject and session, then mark each student." />

      <Panel className="mb-6">
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="text-xs font-medium text-muted-foreground">
            Subject
            <select className={`${inputCls} mt-1.5`} value={subjectId} disabled={subjects.isLoading}
              onChange={(e) => { setSubjectId(Number(e.target.value)); setSessionId(0); }}>
              <option value={0}>{subjects.isLoading ? "Loading…" : "Select subject"}</option>
              {subjects.data?.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            Class session
            <select className={`${inputCls} mt-1.5`} value={sessionId} disabled={!subjectId}
              onChange={(e) => setSessionId(Number(e.target.value))}>
              <option value={0}>{!subjectId ? "Select a subject first" : subjectSessions.length ? "Select session" : "No sessions for this subject"}</option>
              {subjectSessions.map((s) => <option key={s.id} value={s.id}>{fmtDate(s.date)} · {s.startTime}–{s.endTime}{s.topic ? ` · ${s.topic}` : ""}</option>)}
            </select>
          </label>
        </div>
        {(subjects.error || sessions.error) && <ErrorState error={subjects.error || sessions.error} onRetry={() => { subjects.refetch(); sessions.refetch(); }} />}
      </Panel>

      {!sessionId ? (
        <Panel><EmptyState label="Select a subject and session to start marking." /></Panel>
      ) : (
        <Panel
          title="Students"
          actions={
            <div className="flex gap-2">
              <button onClick={() => setAll("present")} className="rounded-md border px-2.5 py-1 text-xs hover:bg-muted">All present</button>
              <button onClick={() => setAll("absent")} className="rounded-md border px-2.5 py-1 text-xs hover:bg-muted">All absent</button>
            </div>
          }
        >
          <div className="flex flex-wrap gap-4 border-b px-5 py-3 text-sm">
            <span className="text-success">Present <b>{present}</b></span>
            <span className="text-destructive">Absent <b>{absent}</b></span>
            <span className="text-muted-foreground">Unmarked <b>{unmarked}</b></span>
          </div>
          {students.isLoading ? <LoadingState /> : students.error ? <ErrorState error={students.error} onRetry={() => students.refetch()} /> : list.length === 0 ? <EmptyState label="No students found." /> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px]">
                <thead className="border-b"><tr><th className={th}>Roll No</th><th className={th}>Name</th><th className={`${th} text-right`}>Status</th></tr></thead>
                <tbody className="divide-y">
                  {list.map((s) => (
                    <tr key={s.id}>
                      <td className={`${td} text-muted-foreground`}>{s.rollNo}</td>
                      <td className={td}>{s.name}</td>
                      <td className={`${td} text-right`}>
                        <div className="inline-flex rounded-lg border p-0.5">
                          {(["present", "absent"] as const).map((st) => (
                            <button key={st} onClick={() => { setMarks((m) => ({ ...m, [s.id]: st })); setSaved(false); }}
                              className={cn("rounded-md px-3 py-1 text-xs font-medium transition",
                                marks[s.id] === st ? (st === "present" ? "bg-success text-destructive-foreground" : "bg-destructive text-destructive-foreground") : "text-muted-foreground hover:bg-muted")}>
                              {st === "present" ? "Present" : "Absent"}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-muted-foreground">
              {saved ? <span className="flex items-center gap-1.5 text-success"><CheckCircle2 className="h-4 w-4" />Saved for this session</span> : unmarked > 0 ? "Mark every student before submitting." : "Ready to submit."}
            </span>
            <button className={btnPrimary} disabled={submit.isPending || unmarked > 0 || list.length === 0} onClick={() => submit.mutate()}>
              {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {submit.isPending ? "Saving…" : "Submit attendance"}
            </button>
          </div>
        </Panel>
      )}
    </>
  );
}
