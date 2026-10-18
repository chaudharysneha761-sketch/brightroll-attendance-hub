import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";

export const studentsQuery = queryOptions({ queryKey: ["students"], queryFn: api.getStudents });
export const subjectsQuery = queryOptions({ queryKey: ["subjects"], queryFn: api.getSubjects });
export const sessionsQuery = queryOptions({ queryKey: ["sessions"], queryFn: api.getSessions });
export const reportQuery = (subjectId: number) =>
  queryOptions({
    queryKey: ["report", subjectId],
    queryFn: () => api.getAttendanceReport(subjectId),
    enabled: subjectId > 0,
  });
