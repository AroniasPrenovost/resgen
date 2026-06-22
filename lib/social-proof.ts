/**
 * Single source of truth for the social-proof numbers and copy shared between
 * the marketing landing page and the resume-generator trust rail. The whole
 * point of the generator's rail is to stay consistent with the landing-page
 * claims — keep these in sync (or import from here on the landing page too).
 *
 * Numbers mirror what the landing page already shows:
 *  - rating + live count: components/landing-social-proof.tsx
 *  - "this month": components/landing-features.tsx
 *  - testimonial + before/after: components/landing-content.tsx
 *  - competitor pricing: components/landing-comparison.tsx
 */

export const RATING = "4.8";

/** Resumes built "this month" — matches landing-features.tsx. */
export const BUILT_THIS_MONTH = "2,847";

/** The honest-math comparison rows, in competitor-then-us order. */
export const COMPETITOR_PRICES = [
  { name: "Zety", price: "$337/yr" },
  { name: "Resume.io", price: "$389/yr" },
  { name: "Resume Genius", price: "$311/yr" },
] as const;

export const OUR_PRICE = "$9.99 once";

/** Before/after stat carried from the landing page. */
export const BEFORE_AFTER = {
  before: { value: "0", label: "callbacks in 3 months — before" },
  after: { value: "3", label: "interviews in 2 weeks — after" },
} as const;

/** The Marcus testimonial, condensed for the rail. */
export const TESTIMONIAL = {
  quote:
    "Kept maybe half of what it suggested and had three interviews lined up two weeks later. Something clicked.",
  name: "Marcus T.",
  role: "Customer Success Mgr",
} as const;
