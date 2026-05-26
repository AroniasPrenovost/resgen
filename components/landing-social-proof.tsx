"use client";

import { ResumeCounter } from "@/components/resume-counter";

const Star = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="#FBBF24"><path d="M10 1l2.6 6.3L19 8l-5 4.5L15.5 19 10 15.5 4.5 19 6 12.5 1 8l6.4-.7L10 1z" /></svg>
);

const avatars = [
  { initials: "MT", from: "#A78BFA", to: "#EC4899" },
  { initials: "BP", from: "#60A5FA", to: "#A78BFA" },
  { initials: "SK", from: "#34D399", to: "#60A5FA" },
  { initials: "PN", from: "#FBBF24", to: "#EC4899" },
];

export const LandingSocialProof = () => {
  return (
    <section className="border-y border-[var(--border-soft)] bg-[var(--bg-soft)]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex -space-x-2">
              {avatars.map((a) => (
                <div
                  key={a.initials}
                  className="w-8 h-8 rounded-full border-2 border-[var(--bg-soft)] flex items-center justify-center text-[10px] font-semibold text-white"
                  style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex"><Star /><Star /><Star /><Star /><Star /></div>
              <span className="font-medium text-white">4.8</span>
              <span className="text-[var(--text-muted)]">from job seekers who&apos;ve made</span>
              <strong className="text-white"><ResumeCounter variant="number-only" /></strong>
              <span className="text-[var(--text-muted)]">resumes</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="6" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M5 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" /></svg>
              <span>Stripe secured checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1l6 3v4c0 3.5-2.5 6.5-6 7-3.5-.5-6-3.5-6-7V4l6-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              <span>30-day money back</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <span>Ready in under 60 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
