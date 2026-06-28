"use client";

import Link from "next/link";

const included = [
  "AI-tailored to any job description",
  "Matching cover letter",
  "ATS-tested templates",
  "30 generations, unlimited downloads",
  "Edit forever in Word",
];

const notPaying = [
  "Monthly subscription",
  "“14-day trial” that auto-bills",
  "Upsell after upsell",
  "Email spam",
  "Cancellation maze",
];

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 10l3 3 7-7" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round" /></svg>
);

export const LandingPricing = () => {
  return (
    <section id="pricing" className="py-24 border-t border-[var(--border-soft)] bg-[var(--bg-soft)]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-eyebrow mb-3">Pricing</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-4 text-white">
            One price. <span className="italic highlight">No fine print.</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            Pay $9.99 for 30 days of access — 30 resume generations, unlimited downloads. We don&apos;t store your card. There&apos;s nothing to cancel because there&apos;s nothing recurring.
          </p>
        </div>

        <div className="card rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 -translate-y-1/3 translate-x-1/3 rounded-full" style={{ background: "radial-gradient(circle, rgba(167, 139, 250, 0.18) 0%, transparent 70%)" }} />
          <div className="relative grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-serif text-7xl text-white">$9.99</span>
                <span className="text-[var(--text-muted)]">for 30 days of access</span>
              </div>
              <div className="text-sm text-[var(--text-faint)] mb-7 line-through">vs. $337/year if you forget to cancel Zety</div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {included.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-[var(--text)]">
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/app/resume-generator" prefetch={true} className="btn-primary rounded-full px-7 py-4 font-semibold text-white inline-flex items-center gap-2">
                Try it free  ·  $9.99 for 30 days
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>

            <div className="md:col-span-5">
              <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border-soft)]">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] mb-4">What you don&apos;t pay for</div>
                <div className="space-y-3">
                  {notPaying.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm">
                      <CrossIcon />
                      <span className="text-[var(--text-muted)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
