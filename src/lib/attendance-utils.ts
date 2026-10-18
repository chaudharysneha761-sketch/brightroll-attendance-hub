import { LOW_ATTENDANCE_THRESHOLD } from "./config";

export function percentage(present: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((present / total) * 1000) / 10;
}

export function isBelowThreshold(pct: number, total: number): boolean {
  return total > 0 && pct < LOW_ATTENDANCE_THRESHOLD;
}
