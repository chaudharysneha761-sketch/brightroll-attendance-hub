export interface Student {
  id: number;
  rollNo: string;
  name: string;
  email?: string;
  department?: string;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  faculty?: string;
}

export interface Session {
  id: number;
  subjectId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;
  topic?: string | undefined;
}

export type AttendanceStatus = "present" | "absent";

export interface AttendancePayload {
  sessionId: number;
  records: { studentId: number; status: AttendanceStatus }[];
}

export interface NewSessionPayload {
  subjectId: number;
  date: string;
  startTime: string;
  endTime: string;
  topic?: string | undefined;
}

export interface ReportRow {
  studentId: number;
  rollNo: string;
  name: string;
  totalSessions: number;
  present: number;
  absent: number;
  percentage: number;
}
