"use client";

import Link from "next/link";

export const LandingFinalCta = () => {
  return (
    <section className="py-24 border-t border-[var(--border-soft)] relative overflow-hidden">
      <div className="hero-bg absolute inset-0 opacity-60" />
      <div className="texture-grid absolute inset-0 opacity-40" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-serif text-5xl md:text-6xl leading-[1.05] mb-6 text-white">
          A resume worth sending, <span className="italic highlight">in minutes</span>.
        </h2>
        <p className="text-lg text-[var(--text-muted)] mb-10 max-w-xl mx-auto">
          Upload your current resume. Paste a job description. Preview the polished version free. Unlock 30 days of access for $9.99 when you&apos;re ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link href="/app/resume-generator" prefetch={true} className="btn-primary rounded-full px-8 py-4 font-semibold text-white inline-flex items-center justify-center gap-2">
            Build my resume free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--text-faint)]">
          <span>No credit card to start</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-faint)]" />
          <span>$9.99 for 30 days of access</span>
        </div>
      </div>
    </section>
  );
};
