import { describe, expect, it } from "vitest";
import { isBelowThreshold, percentage } from "@/lib/attendance-utils";

describe("attendance rules", () => {
  it("flags students below 75%", () => {
    expect(isBelowThreshold(74.9, 10)).toBe(true);
    expect(isBelowThreshold(75, 10)).toBe(false);
  });
  it("computes percentage", () => {
    expect(percentage(3, 4)).toBe(75);
    expect(percentage(0, 0)).toBe(0);
  });
});
