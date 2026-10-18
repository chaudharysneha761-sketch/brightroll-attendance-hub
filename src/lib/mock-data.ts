import type { AttendanceStatus, Session, Student, Subject } from "./types";

// Sample data used only when DEMO_MODE is on. Held in memory; resets on reload.
export function createMockDb() {
  const students: Student[] = [
    ["CS101", "Aarav Sharma"], ["CS102", "Diya Patel"], ["CS103", "Rohan Mehta"],
    ["CS104", "Ananya Iyer"], ["CS105", "Kabir Singh"], ["CS106", "Isha Reddy"],
    ["CS107", "Vivaan Gupta"], ["CS108", "Meera Nair"], ["CS109", "Arjun Rao"],
    ["CS110", "Saanvi Joshi"], ["CS111", "Aditya Kumar"], ["CS112", "Priya Verma"],
  ].map(([rollNo, name]: string[], i) => ({
    rollNo: rollNo as string,
    name: name as string,
    id: i + 1,
    email: `${(name as string).split(" ")[0]!.toLowerCase()}@college.edu`,
    department: "Computer Science",
  }));

  const subjects: Subject[] = [
    { id: 1, code: "CS301", name: "Database Management Systems", faculty: "Dr. R. Kapoor" },
    { id: 2, code: "CS302", name: "Operating Systems", faculty: "Prof. S. Menon" },
    { id: 3, code: "CS303", name: "Computer Networks", faculty: "Dr. A. Bose" },
  ];

  const sessions: Session[] = [
    { id: 1, subjectId: 1, date: "2026-10-12", startTime: "09:00", endTime: "10:00", topic: "Normalization" },
    { id: 2, subjectId: 2, date: "2026-10-13", startTime: "10:00", endTime: "11:00", topic: "Scheduling" },
    { id: 3, subjectId: 1, date: "2026-10-14", startTime: "09:00", endTime: "10:00", topic: "Joins" },
    { id: 4, subjectId: 3, date: "2026-10-15", startTime: "11:00", endTime: "12:00", topic: "TCP/IP" },
    { id: 5, subjectId: 1, date: "2026-10-16", startTime: "09:00", endTime: "10:00", topic: "Transactions" },
    { id: 6, subjectId: 2, date: "2026-10-19", startTime: "10:00", endTime: "11:00", topic: "Paging" },
  ];

  // attendance[sessionId][studentId] = status (deterministic sample pattern)
  const attendance: Record<number, Record<number, AttendanceStatus>> = {};
  for (const s of sessions.slice(0, 5)) {
    const rec: Record<number, AttendanceStatus> = (attendance[s.id] = {});
    for (const st of students) {
      rec[st.id] = (st.id * 7 + s.id * 3) % 10 < 2 + (st.id % 4 === 0 ? 3 : 0) ? "absent" : "present";
    }
  }

  return { students, subjects, sessions, attendance };
}
