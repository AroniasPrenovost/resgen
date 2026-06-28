/**
 * Client-side download rate limiter.
 *
 * Downloads are "unlimited" within the paid 30-day window (matching the
 * marketing promise), but we cap bursts to MAX_PER_WINDOW per rolling hour as
 * light abuse protection. State is a list of recent download timestamps kept in
 * localStorage — consistent with the rest of this product's client-side model
 * (paid status, generation credits, etc. all live in localStorage too).
 *
 * Note: this is intentionally client-side only. Like the existing paywall it is
 * best-effort, not a security boundary.
 */

export const MAX_DOWNLOADS_PER_WINDOW = 5;
export const WINDOW_MS = 60 * 60 * 1000; // 1 hour

const STORAGE_KEY = "dl_rate_v1";

function readStamps(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function writeStamps(stamps: number[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stamps));
  } catch {
    /* storage full / disabled — fail open */
  }
}

/** Timestamps that still fall inside the rolling window. */
function withinWindow(now: number): number[] {
  return readStamps().filter((t) => t > now - WINDOW_MS);
}

/** How many downloads have happened in the last hour. */
export function downloadsInWindow(now: number = Date.now()): number {
  return withinWindow(now).length;
}

/** Whether another download is allowed right now. */
export function canDownload(now: number = Date.now()): boolean {
  return downloadsInWindow(now) < MAX_DOWNLOADS_PER_WINDOW;
}

/** Record a download (call only when one actually succeeds). Prunes old stamps. */
export function recordDownload(now: number = Date.now()): void {
  const stamps = withinWindow(now);
  stamps.push(now);
  writeStamps(stamps);
}

/** Milliseconds until a slot frees up; 0 if a download is allowed now. */
export function msUntilNextAllowed(now: number = Date.now()): number {
  const stamps = withinWindow(now).sort((a, b) => a - b);
  if (stamps.length < MAX_DOWNLOADS_PER_WINDOW) return 0;
  // The oldest in-window stamp is what's holding the limit; a slot frees when it
  // ages out of the window.
  const oldest = stamps[stamps.length - MAX_DOWNLOADS_PER_WINDOW];
  return Math.max(0, oldest + WINDOW_MS - now);
}

/** Human-friendly "try again in ~X minutes" suffix for the rate-limit toast. */
export function nextAllowedLabel(now: number = Date.now()): string {
  const ms = msUntilNextAllowed(now);
  if (ms <= 0) return "now";
  const mins = Math.ceil(ms / 60000);
  return mins <= 1 ? "about a minute" : `about ${mins} minutes`;
}
