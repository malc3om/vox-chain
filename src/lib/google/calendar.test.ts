import { describe, it, expect } from "vitest";
import {
  buildElectionEvent,
  getCalendarUrl,
} from "@/lib/google/calendar";

describe("calendar", () => {
  const mockPhase = {
    name: "Voter Registration",
    dateRange: "Jan 15 — Mar 1, 2026",
    description: "Citizens register to vote.",
    details: ["Online registration opens", "Mail-in forms accepted"],
  };

  it("builds a calendar event from election phase data", () => {
    const event = buildElectionEvent(mockPhase);
    expect(event.summary).toContain("Voter Registration");
    expect(event.summary).toContain("VoxChain");
    expect(event.start.date).toBe("2026-01-15");
    expect(event.end.date).toBe("2026-03-01");
    expect(event.description).toContain("Citizens register to vote.");
    expect(event.reminders?.overrides?.length).toBe(2);
  });

  it("generates a valid Google Calendar URL", () => {
    const event = buildElectionEvent(mockPhase);
    const url = getCalendarUrl(event);
    expect(url).toContain("calendar.google.com/calendar/render");
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("Voter+Registration");
  });

  it("handles single-date election phases", () => {
    const singleDay = {
      ...mockPhase,
      name: "Election Day",
      dateRange: "Nov 3, 2026",
    };
    const event = buildElectionEvent(singleDay);
    expect(event.start.date).toBe("2026-11-03");
    expect(event.end.date).toBe("2026-11-03");
  });
});
