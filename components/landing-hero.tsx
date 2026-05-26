"use client";

import Link from "next/link";

export const LandingHero = () => {
  return (
    <section id="hero" className="hero-bg relative overflow-hidden">
      <div className="texture-grid absolute inset-0 opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* LEFT: Copy */}
          <div className="lg:col-span-6 rise" style={{ animationDelay: "0.1s" }}>
            <span className="tag mb-6">
              <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              $9.99 for a month. No subscription. Ever.
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6 text-white">
              AI resume that gets you<br />
              <span className="word-rotator">
                <span>the interview.</span>
                <span>hired.</span>
                <span>shortlisted.</span>
                <span>the interview.</span>
              </span>
            </h1>

            <p className="text-lg text-[var(--text-muted)] max-w-xl mb-8 leading-relaxed">
              Upload your resume. Paste any job posting. We rewrite it to beat the ATS bots and land on a recruiter&apos;s desk. Pay <span className="text-white font-medium">$9.99 once</span> for a full month — 30 resume generations, unlimited downloads. Not per download. That&apos;s it.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/app/resume-generator"
                prefetch={true}
                className="btn-primary rounded-full px-7 py-4 font-semibold text-white flex items-center justify-center gap-2"
              >
                Build my resume free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <a href="#how" className="btn-secondary rounded-full px-7 py-4 font-medium text-white flex items-center justify-center gap-2">
                See how it works
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs text-[var(--text-faint)]">
              {["No credit card", "Preview before you pay", "30-day refund"].map((label) => (
                <div key={label} className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 4L6 11l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Resume preview */}
          <div className="lg:col-span-6 rise" style={{ animationDelay: "0.25s" }}>
            <div className="relative">
              {/* Floating ATS badge */}
              <div className="absolute -top-4 -right-4 z-10 ats-badge rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "conic-gradient(#34D399 0deg, #34D399 331deg, rgba(255,255,255,0.08) 331deg)" }}>
                  <div className="w-7 h-7 rounded-full bg-[var(--bg)] flex items-center justify-center text-[10px] font-mono font-semibold text-emerald-400">92</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">ATS Score</div>
                  <div className="text-sm font-semibold text-emerald-400">Excellent</div>
                </div>
              </div>

              {/* Floating job-match badge */}
              <div className="absolute -bottom-4 -left-4 z-10 rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "linear-gradient(135deg, rgba(167, 139, 250, 0.16) 0%, rgba(236, 72, 153, 0.10) 100%)", border: "1px solid rgba(167, 139, 250, 0.3)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.39 4.84L18 8l-4 3.9.95 5.5L10 14.77 5.05 17.4 6 11.9 2 8l5.61-1.16L10 2z" fill="#A78BFA" /></svg>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">Tailored to</div>
                  <div className="text-sm font-semibold text-white">Senior PM @ Stripe</div>
                </div>
              </div>

              {/* Resume card */}
              <div className="card resume-shadow rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg" style={{ background: "linear-gradient(135deg, #A78BFA, #EC4899)" }}>MC</div>
                  <div>
                    <div className="font-semibold text-white">Maya Chen</div>
                    <div className="text-sm text-[var(--text-muted)]">Senior Product Manager</div>
                    <div className="text-xs text-[var(--text-faint)] mt-1">maya.chen@email.com  ·  San Francisco, CA</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-faint)] mb-2">Tailored Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs px-2.5 py-1 rounded-md" style={{ background: "rgba(167, 139, 250, 0.14)", color: "#C4B5FD" }}>Product Strategy</span>
                      <span className="text-xs px-2.5 py-1 rounded-md" style={{ background: "rgba(236, 72, 153, 0.14)", color: "#F9A8D4" }}>Roadmapping</span>
                      <span className="text-xs px-2.5 py-1 rounded-md" style={{ background: "rgba(52, 211, 153, 0.14)", color: "#6EE7B7" }}>A/B Testing</span>
                      <span className="text-xs px-2.5 py-1 rounded-md" style={{ background: "rgba(251, 191, 36, 0.14)", color: "#FCD34D" }}>SQL</span>
                      <span className="text-xs px-2.5 py-1 rounded-md" style={{ background: "rgba(96, 165, 250, 0.14)", color: "#93C5FD" }}>Stakeholder Mgmt</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-faint)] mb-2">Experience</div>
                    <div className="space-y-2">
                      <div className="bg-[rgba(255,255,255,0.02)] border border-[var(--border-soft)] rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-white">Product Manager · Northwind</div>
                          <div className="text-[10px] font-mono text-[var(--text-faint)]">2023 — Now</div>
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                          Led 0→1 launch of payments platform serving <span className="text-emerald-400">2.4M MAU</span>, growing GMV <span className="text-emerald-400">38% YoY</span>.
                        </div>
                      </div>
                      <div className="bg-[rgba(255,255,255,0.02)] border border-[var(--border-soft)] rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-white">Associate PM · Riverview</div>
                          <div className="text-[10px] font-mono text-[var(--text-faint)]">2021 — 2023</div>
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                          Shipped <span className="text-emerald-400">12 features</span> driving <span className="text-emerald-400">$4.1M ARR</span> across 3 product lines.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)] pt-4 border-t border-[var(--border-soft)]">
                  <span>resumai.services</span>
                  <span className="text-emerald-400">✓ ATS Optimized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
