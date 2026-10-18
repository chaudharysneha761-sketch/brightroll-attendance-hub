import { API_BASE_URL, DEMO_MODE } from "./config";
import { createMockDb } from "./mock-data";
import { percentage } from "./attendance-utils";
import type {
  AttendancePayload,
  NewSessionPayload,
  ReportRow,
  Session,
  Student,
  Subject,
} from "./types";

// ---------- Real API ----------
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new Error(`Could not reach the server at ${API_BASE_URL}.`);
  }
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
      else if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---------- Demo (in-memory only) ----------
let db: ReturnType<typeof createMockDb> | null = null;
const mock = () => (db ??= createMockDb());
const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), 350));

function mockReport(subjectId: number): ReportRow[] {
  const d = mock();
  const ids = d.sessions.filter((s) => s.subjectId === subjectId && d.attendance[s.id]).map((s) => s.id);
  return d.students.map((st) => {
    const present = ids.filter((id) => d.attendance[id][st.id] === "present").length;
    const total = ids.filter((id) => d.attendance[id][st.id]).length;
    return {
      studentId: st.id,
      rollNo: st.rollNo,
      name: st.name,
      totalSessions: total,
      present,
      absent: total - present,
      percentage: percentage(present, total),
    };
  });
}

// ---------- Public API ----------
export const api = {
  getStudents: (): Promise<Student[]> => (DEMO_MODE ? delay(mock().students) : request("/api/students")),
  getSubjects: (): Promise<Subject[]> => (DEMO_MODE ? delay(mock().subjects) : request("/api/subjects")),
  getSessions: (): Promise<Session[]> => (DEMO_MODE ? delay(mock().sessions) : request("/api/sessions")),

  createSession: (p: NewSessionPayload): Promise<Session> => {
    if (!DEMO_MODE) return request("/api/sessions", { method: "POST", body: JSON.stringify(p) });
    const d = mock();
    const s: Session = { id: Math.max(0, ...d.sessions.map((x) => x.id)) + 1, ...p };
    d.sessions.push(s);
    return delay(s);
  },

  submitAttendance: (p: AttendancePayload): Promise<unknown> => {
    if (!DEMO_MODE) return request("/api/attendance", { method: "POST", body: JSON.stringify(p) });
    const d = mock();
    d.attendance[p.sessionId] = Object.fromEntries(p.records.map((r) => [r.studentId, r.status]));
    return delay({ ok: true });
  },

  getAttendanceReport: (subjectId: number): Promise<ReportRow[]> =>
    DEMO_MODE
      ? delay(mockReport(subjectId))
      : request(`/api/reports/attendance?subjectId=${encodeURIComponent(subjectId)}`),
};
