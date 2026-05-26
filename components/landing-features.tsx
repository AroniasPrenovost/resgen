"use client";

const atsSystems = ["Workday", "Greenhouse", "Lever", "iCIMS", "Taleo", "+12 more"];

export const LandingFeatures = () => {
  return (
    <section id="features" className="py-24 border-t border-[var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <div className="section-eyebrow mb-3">What you actually get</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-4 text-white">
            Three things every <span className="italic highlight">$300/year competitor</span> doesn&apos;t do.
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="card card-hover p-7 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(52, 211, 153, 0.12) 0%, transparent 70%)" }} />
            <div className="relative">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(52, 211, 153, 0.14)", border: "1px solid rgba(52, 211, 153, 0.25)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6l3 3 5-5M3 12l3 3 9-9" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">One payment. Done forever.</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">
                $9.99 unlocks your download. No card on file. No &ldquo;14-day trial&rdquo; that bills $24 next week. No &ldquo;we couldn&apos;t process your cancellation&rdquo; emails. We don&apos;t have your card after checkout.
              </p>
              <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border-soft)]">
                <div className="flex items-center gap-3 text-xs">
                  <div className="font-mono text-emerald-400">2,847</div>
                  <div className="text-[var(--text-faint)]">customers in the last 30 days. Zero auto-billed. Zero recurring charges.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card card-hover p-7 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%)" }} />
            <div className="relative">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(167, 139, 250, 0.14)", border: "1px solid rgba(167, 139, 250, 0.25)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.5 4.5l2 2M13.5 13.5l2 2M4.5 15.5l2-2M13.5 6.5l2-2" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Paste the JD. AI does the rest.</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">
                Drop in any job posting from LinkedIn, Greenhouse, Workday. Our AI rewrites your resume to mirror the exact keywords, skills, and tone the recruiter wrote into the listing. Different job, different resume. In seconds.
              </p>
              <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border-soft)] space-y-2.5">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                  <span className="text-[var(--text-muted)]">JD:</span>
                  <span className="font-mono text-white truncate">&ldquo;Senior PM at Stripe, 5+ yrs growth...&rdquo;</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[var(--text-muted)]">Resume:</span>
                  <span className="font-mono text-emerald-400 truncate">94% keyword match</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card card-hover p-7 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(236, 72, 153, 0.13) 0%, transparent 70%)" }} />
            <div className="relative">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(236, 72, 153, 0.14)", border: "1px solid rgba(236, 72, 153, 0.25)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5v5c0 4 3 7 7 8 4-1 7-4 7-8V5l-7-3z" stroke="#EC4899" strokeWidth="1.8" strokeLinejoin="round" /><path d="M7 10l2 2 4-4" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Reverse-engineered for real ATS.</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">
                We tested every template against Workday, Greenhouse, Lever, iCIMS, and Taleo. Your resume parses clean. No &ldquo;Section: Unknown.&rdquo; No mangled formatting. The 75% of resumes that get auto-rejected? Yours won&apos;t be one of them.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {atsSystems.map((s) => (
                  <span key={s} className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border-soft)] text-[var(--text-muted)]">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
