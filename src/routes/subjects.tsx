import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { sessionsQuery, subjectsQuery } from "@/lib/queries";
import { EmptyState, ErrorState, LoadingState, PageHeader, Panel, btnPrimary, fmtDate, inputCls, td, th } from "@/components/app/ui";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Subjects & Sessions — Smart Attendance" },
      { name: "description", content: "Manage subjects and create class sessions." },
      { property: "og:title", content: "Subjects & Sessions — Smart Attendance" },
      { property: "og:description", content: "Manage subjects and create class sessions." },
    ],
  }),
  component: SubjectsPage,
});

const empty = { subjectId: 0, date: "", startTime: "", endTime: "", topic: "" };

function SubjectsPage() {
  const qc = useQueryClient();
  const subjects = useQuery(subjectsQuery);
  const sessions = useQuery(sessionsQuery);
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState("");

  const create = useMutation({
    mutationFn: () => api.createSession({ ...form, topic: form.topic || undefined }),
    onSuccess: () => {
      toast.success("Session created");
      setForm(empty);
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (e) => setFormError(e instanceof Error ? e.message : "Failed to create session"),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.subjectId || !form.date || !form.startTime || !form.endTime) return setFormError("Please fill subject, date, start and end time.");
    if (form.endTime <= form.startTime) return setFormError("End time must be after start time.");
    if (!create.isPending) create.mutate();
  };

  const subjectName = (id: number) => subjects.data?.find((s) => s.id === id)?.name ?? `Subject #${id}`;
  const sorted = [...(sessions.data ?? [])].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader title="Subjects & Sessions" subtitle="Subjects, scheduled classes and new sessions." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <Panel title="Subjects">
            {subjects.isLoading ? <LoadingState /> : subjects.error ? <ErrorState error={subjects.error} onRetry={() => subjects.refetch()} /> : !subjects.data?.length ? <EmptyState label="No subjects yet." /> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px]">
                  <thead className="border-b"><tr><th className={th}>Code</th><th className={th}>Name</th><th className={th}>Faculty</th></tr></thead>
                  <tbody className="divide-y">
                    {subjects.data.map((s) => (
                      <tr key={s.id}><td className={`${td} text-muted-foreground`}>{s.code}</td><td className={`${td} font-medium`}>{s.name}</td><td className={`${td} text-muted-foreground`}>{s.faculty || "—"}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
          <Panel title="Sessions">
            {sessions.isLoading ? <LoadingState /> : sessions.error ? <ErrorState error={sessions.error} onRetry={() => sessions.refetch()} /> : !sorted.length ? <EmptyState label="No sessions yet." /> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead className="border-b"><tr><th className={th}>Date</th><th className={th}>Subject</th><th className={th}>Time</th><th className={th}>Topic</th></tr></thead>
                  <tbody className="divide-y">
                    {sorted.map((s) => (
                      <tr key={s.id}><td className={td}>{fmtDate(s.date)}</td><td className={td}>{subjectName(s.subjectId)}</td><td className={`${td} text-muted-foreground`}>{s.startTime}–{s.endTime}</td><td className={`${td} text-muted-foreground`}>{s.topic || "—"}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        <Panel title="Create session" className="h-fit">
          <form onSubmit={onSubmit} className="space-y-4 p-5">
            <label className="block text-xs font-medium text-muted-foreground">Subject
              <select className={`${inputCls} mt-1.5`} value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: Number(e.target.value) })}>
                <option value={0}>Select subject</option>
                {subjects.data?.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
              </select>
            </label>
            <label className="block text-xs font-medium text-muted-foreground">Date
              <input type="date" className={`${inputCls} mt-1.5`} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-muted-foreground">Start
                <input type="time" className={`${inputCls} mt-1.5`} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">End
                <input type="time" className={`${inputCls} mt-1.5`} value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              </label>
            </div>
            <label className="block text-xs font-medium text-muted-foreground">Topic (optional)
              <input className={`${inputCls} mt-1.5`} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Indexing" />
            </label>
            {formError && <p className="rounded-md bg-destructive-soft px-3 py-2 text-xs text-destructive">{formError}</p>}
            <button type="submit" className={`${btnPrimary} w-full`} disabled={create.isPending}>
              {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {create.isPending ? "Creating…" : "Create session"}
            </button>
          </form>
        </Panel>
      </div>
    </>
  );
}
