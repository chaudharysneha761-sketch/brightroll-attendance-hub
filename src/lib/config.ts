// Single place to configure the backend connection.
// Set VITE_API_BASE_URL to your Express server, and VITE_DEMO_MODE=false to use it.
export const API_BASE_URL: string =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://localhost:5000";

// Demo mode is explicit: it is ON unless VITE_DEMO_MODE is set to "false".
export const DEMO_MODE: boolean = (import.meta.env["VITE_DEMO_MODE"] as string | undefined) !== "false";

export const LOW_ATTENDANCE_THRESHOLD = 75;
