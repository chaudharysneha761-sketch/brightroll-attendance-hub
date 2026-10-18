import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { studentsQuery } from "@/lib/queries";
import { EmptyState, ErrorState, LoadingState, PageHeader, Panel, inputCls, td, th } from "@/components/app/ui";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "Students — Smart Attendance" },
      { name: "description", content: "Search and browse enrolled students." },
      { property: "og:title", content: "Students — Smart Attendance" },
      { property: "og:description", content: "Search and browse enrolled students." },
    ],
  }),
  component: Students,
});

function Students() {
  const q = useQuery(studentsQuery);
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();
  const rows = (q.data ?? []).filter((s) =>
    [s.name, s.rollNo, s.email, s.department].some((v) => v?.toLowerCase().includes(term)),
  );

  return (
    <>
      <PageHeader title="Students" subtitle={q.data ? `${q.data.length} enrolled` : ""} />
      <Panel>
        <div className="border-b p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input className={`${inputCls} pl-9`} placeholder="Search by name, roll no, email…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        {q.isLoading ? <LoadingState /> : q.error ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : rows.length === 0 ? (
          <EmptyState label={term ? "No students match your search." : "No students yet."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead className="border-b"><tr><th className={th}>Roll No</th><th className={th}>Name</th><th className={th}>Email</th><th className={th}>Department</th></tr></thead>
              <tbody className="divide-y">
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td className={`${td} text-muted-foreground`}>{s.rollNo}</td>
                    <td className={`${td} font-medium`}>{s.name}</td>
                    <td className={`${td} text-muted-foreground`}>{s.email || "—"}</td>
                    <td className={`${td} text-muted-foreground`}>{s.department || "—"}</td>
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
