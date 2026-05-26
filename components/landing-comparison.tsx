"use client";

const Check = () => <span className="check-yes text-xl">✓</span>;
const Cross = () => <span className="check-no text-xl">✕</span>;

export const LandingComparison = () => {
  return (
    <section id="compare" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-eyebrow mb-3">The honest math</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-4 text-white">
            Why pay <span className="italic text-[var(--danger)]">$337/year</span> when you only need <span className="italic highlight">one resume</span>?
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
            Every other &ldquo;AI resume builder&rdquo; hides a $20&ndash;30/month subscription behind a $2 trial. We don&apos;t. Here&apos;s the math you&apos;re not supposed to see.
          </p>
        </div>

        <div className="card rounded-2xl overflow-hidden overflow-x-auto">
          <div className="grid grid-cols-5 text-sm min-w-[640px]">
            {/* Header row */}
            <div className="p-5 bg-[var(--surface)] border-b border-[var(--border)]" />
            <div className="p-5 bg-[var(--surface-2)] border-b border-[var(--border)] text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: "linear-gradient(135deg, #A78BFA, #EC4899)", color: "white" }}>You&apos;re here</div>
              <div className="font-semibold text-white">ResumAI</div>
            </div>
            <div className="p-5 bg-[var(--surface)] border-b border-[var(--border)] text-center"><div className="font-medium text-[var(--text-muted)]">Zety</div></div>
            <div className="p-5 bg-[var(--surface)] border-b border-[var(--border)] text-center"><div className="font-medium text-[var(--text-muted)]">Resume.io</div></div>
            <div className="p-5 bg-[var(--surface)] border-b border-[var(--border)] text-center"><div className="font-medium text-[var(--text-muted)]">Resume Genius</div></div>

            {/* Real cost */}
            <div className="p-5 border-b border-[var(--border-soft)] text-[var(--text-muted)]">Real annual cost</div>
            <div className="p-5 border-b border-[var(--border-soft)] bg-[var(--surface-2)] text-center">
              <div className="font-mono text-2xl font-semibold text-emerald-400">$9.99</div>
              <div className="text-xs text-[var(--text-faint)]">once</div>
            </div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><div className="font-mono text-xl text-[var(--danger)]">$337</div><div className="text-xs text-[var(--text-faint)]">per year</div></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><div className="font-mono text-xl text-[var(--danger)]">$389</div><div className="text-xs text-[var(--text-faint)]">per year</div></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><div className="font-mono text-xl text-[var(--danger)]">$311</div><div className="text-xs text-[var(--text-faint)]">per year</div></div>

            {/* Trial trap */}
            <div className="p-5 border-b border-[var(--border-soft)] text-[var(--text-muted)]">Trial trap</div>
            <div className="p-5 border-b border-[var(--border-soft)] bg-[var(--surface-2)] text-center"><span className="check-yes text-xl">—</span><div className="text-xs text-[var(--text-faint)]">none</div></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><Cross /><div className="text-xs text-[var(--text-faint)]">$1.95 → $25.95</div></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><Cross /><div className="text-xs text-[var(--text-faint)]">$2.95 → $29.95</div></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><Cross /><div className="text-xs text-[var(--text-faint)]">$2.95 → $23.95</div></div>

            {/* Auto-renewal */}
            <div className="p-5 border-b border-[var(--border-soft)] text-[var(--text-muted)]">Auto-renewal billing</div>
            <div className="p-5 border-b border-[var(--border-soft)] bg-[var(--surface-2)] text-center"><Check /><div className="text-xs text-[var(--text-faint)]">No, never</div></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><Cross /></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><Cross /></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><Cross /></div>

            {/* AI tailored */}
            <div className="p-5 border-b border-[var(--border-soft)] text-[var(--text-muted)]">AI tailors to job posting</div>
            <div className="p-5 border-b border-[var(--border-soft)] bg-[var(--surface-2)] text-center"><Check /></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><span className="text-[var(--text-faint)]">Limited</span></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><span className="text-[var(--text-faint)]">Limited</span></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><Cross /></div>

            {/* Cover letter */}
            <div className="p-5 border-b border-[var(--border-soft)] text-[var(--text-muted)]">Cover letter generator</div>
            <div className="p-5 border-b border-[var(--border-soft)] bg-[var(--surface-2)] text-center"><Check /><div className="text-xs text-[var(--text-faint)]">included</div></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><span className="text-[var(--text-faint)]">paid add-on</span></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><span className="text-[var(--text-faint)]">paid add-on</span></div>
            <div className="p-5 border-b border-[var(--border-soft)] text-center"><span className="text-[var(--text-faint)]">paid add-on</span></div>

            {/* ATS */}
            <div className="p-5 text-[var(--text-muted)]">ATS-optimized output</div>
            <div className="p-5 bg-[var(--surface-2)] text-center"><Check /></div>
            <div className="p-5 text-center"><Check /></div>
            <div className="p-5 text-center"><Check /></div>
            <div className="p-5 text-center"><Check /></div>
          </div>
        </div>
      </div>
    </section>
  );
};
