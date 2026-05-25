// Tracks how many resumes this user has actually generated, persisted in
// localStorage so the public "resumes generated" counter can fold the user's
// own generations into its total. The point is that when a visitor is watching
// the number and generates a resume, the count visibly ticks up — so it always
// feels real/live, not just a synthetic time-based estimate.

export const LOCAL_GENERATIONS_KEY = 'user_resumes_generated';

// Fired same-tab after an increment (the native `storage` event only fires in
// OTHER tabs), so a ResumeCounter on the same page can update immediately.
export const LOCAL_GENERATIONS_EVENT = 'user-resumes-generated-updated';

export const getLocalGenerationCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const raw = Number(window.localStorage.getItem(LOCAL_GENERATIONS_KEY) || '0');
  return Number.isFinite(raw) && raw > 0 ? raw : 0;
};

// Increments the stored count by one and notifies listeners. Returns the new total.
export const incrementLocalGenerationCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const next = getLocalGenerationCount() + 1;
  window.localStorage.setItem(LOCAL_GENERATIONS_KEY, String(next));
  window.dispatchEvent(new CustomEvent(LOCAL_GENERATIONS_EVENT, { detail: next }));
  return next;
};
