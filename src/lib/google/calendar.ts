/**
 * Google Calendar API Helper
 *
 * Creates calendar events for election phases.
 * Uses the Google Calendar REST API v3.
 */

const CALENDAR_API = "https://www.googleapis.com/calendar/v3";

export interface CalendarEvent {
  summary: string;
  description: string;
  start: { date: string }; // All-day event (YYYY-MM-DD)
  end: { date: string };
  reminders?: {
    useDefault: boolean;
    overrides?: { method: string; minutes: number }[];
  };
}

export interface ElectionPhaseData {
  name: string;
  dateRange: string;
  description: string;
  details: string[];
}

/**
 * Build a CalendarEvent from an election phase.
 * Parses the dateRange string ("Jan 15 — Mar 1, 2026") into ISO dates.
 */
export function buildElectionEvent(phase: ElectionPhaseData): CalendarEvent {
  const { startDate, endDate } = parseDateRange(phase.dateRange);

  return {
    summary: `🗳️ VoxChain: ${phase.name}`,
    description: [
      phase.description,
      "",
      "Details:",
      ...phase.details.map((d) => `• ${d}`),
      "",
      "— Added via VoxChain Civic Education Platform",
    ].join("\n"),
    start: { date: startDate },
    end: { date: endDate },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 1440 }, // 1 day before
        { method: "popup", minutes: 60 },   // 1 hour before
      ],
    },
  };
}

/**
 * Create a calendar event using the Google Calendar API.
 * Requires an OAuth access token from Firebase Auth.
 *
 * Returns the event ID on success, empty string on failure.
 */
export async function createCalendarEvent(
  accessToken: string,
  event: CalendarEvent
): Promise<string> {
  try {
    const response = await fetch(
      `${CALENDAR_API}/calendars/primary/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      console.warn("[VoxChain] Calendar API error:", response.status);
      return "";
    }

    const data = await response.json();
    return (data.id as string) ?? "";
  } catch (err) {
    console.warn("[VoxChain] Failed to create calendar event:", err);
    return "";
  }
}

/**
 * Generate a Google Calendar URL for users who don't want to sign in.
 * Opens Google Calendar's "create event" page with pre-filled data.
 */
export function getCalendarUrl(event: CalendarEvent): string {
  const startDate = event.start.date.replace(/-/g, "");
  const endDate = event.end.date.replace(/-/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.summary,
    dates: `${startDate}/${endDate}`,
    details: event.description,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ── Private helpers ──────────────────────────────────────

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04",
  may: "05", jun: "06", jul: "07", aug: "08",
  sep: "09", oct: "10", nov: "11", dec: "12",
};

/**
 * Parse a date range string like "Jan 15 — Mar 1, 2026" into ISO dates.
 * Falls back to current year if parsing fails.
 */
function parseDateRange(range: string): {
  startDate: string;
  endDate: string;
} {
  const currentYear = new Date().getFullYear().toString();

  try {
    // Split on dash/em-dash separators
    const parts = range.split(/\s*[—–-]\s*/);

    if (parts.length === 1) {
      // Single date like "Nov 3, 2026"
      const d = parseSingleDate(parts[0], currentYear);
      return { startDate: d, endDate: d };
    }

    // Extract year from last part
    const yearMatch = parts[parts.length - 1].match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : currentYear;

    const startDate = parseSingleDate(parts[0], year);
    const endDate = parseSingleDate(parts[1], year);

    return { startDate, endDate };
  } catch {
    // Fallback
    return {
      startDate: `${currentYear}-01-01`,
      endDate: `${currentYear}-12-31`,
    };
  }
}

function parseSingleDate(dateStr: string, defaultYear: string): string {
  const cleaned = dateStr.replace(",", "").trim();
  const tokens = cleaned.split(/\s+/);

  if (tokens.length < 2) return `${defaultYear}-01-01`;

  const monthStr = tokens[0].toLowerCase().slice(0, 3);
  const month = MONTHS[monthStr] ?? "01";
  const day = tokens[1].replace(/\D/g, "").padStart(2, "0");
  const year = tokens.length >= 3 ? tokens[2].replace(/\D/g, "") : defaultYear;

  return `${year}-${month}-${day}`;
}
