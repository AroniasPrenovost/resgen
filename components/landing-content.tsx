"use client";

const Star = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="#FBBF24"><path d="M10 1l2.6 6.3L19 8l-5 4.5L15.5 19 10 15.5 4.5 19 6 12.5 1 8l6.4-.7L10 1z" /></svg>
);

const secondary = [
  {
    initials: "BP",
    from: "#60A5FA",
    to: "#A78BFA",
    name: "Bryce P.",
    title: "Project Manager · Seattle, WA",
    quote: (
      <>
        &ldquo;Hadn&apos;t touched my resume in four years and dreaded the whole thing. Had a clean draft in maybe 15 minutes. Tweaked a couple bullets that felt generic, but it got me <span className="text-white font-medium">90% there</span>.&rdquo;
      </>
    ),
  },
  {
    initials: "SK",
    from: "#34D399",
    to: "#60A5FA",
    name: "Sarah K.",
    title: "Software Engineer · Austin, TX",
    quote: (
      <>
        &ldquo;Expected generic AI filler. Got something that pulled the real impact out of my project notes. <span className="text-white font-medium">Pasted into Workday clean</span>, which usually takes me an hour of formatting.&rdquo;
      </>
    ),
  },
  {
    initials: "DR",
    from: "#FBBF24",
    to: "#EC4899",
    name: "Devon R.",
    title: "Senior Engineer · Bellevue, WA",
    quote: (
      <>
        &ldquo;Laid off in February. Had Zety for like a week and they charged me $24 I didn&apos;t authorize. Paid <span className="text-white font-medium">$9.99 here, redid my resume a bunch of times that month, and that was it</span> — no card on file waiting to bill me. Felt like a sane person built it.&rdquo;
      </>
    ),
  },
];

export const LandingContent = () => {
  return (
    <section className="py-24 border-t border-[var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-eyebrow mb-3">What customers actually said</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] text-white">
            From <span className="italic">&ldquo;three months of nothing&rdquo;</span> to <span className="italic highlight">three interviews</span>.
          </h2>
        </div>

        {/* Featured testimonial */}
        <div className="card rounded-3xl p-10 md:p-14 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30" style={{ background: "radial-gradient(ellipse at center right, rgba(167, 139, 250, 0.18) 0%, transparent 70%)" }} />
          <div className="relative grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <div className="flex mb-5 gap-0.5"><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /></div>
              <p className="font-serif text-2xl md:text-3xl leading-snug mb-6 text-white">
                &ldquo;Three months of applying, basically nothing. Redid my resume here, kept maybe half of what it suggested, and had <span className="highlight">three interviews lined up two weeks later</span>. I&apos;m not saying it&apos;s magic. I&apos;m saying something clicked.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: "linear-gradient(135deg, #A78BFA, #EC4899)" }}>MT</div>
                <div>
                  <div className="font-medium text-white">Marcus Torres</div>
                  <div className="text-xs text-[var(--text-muted)]">Customer Success Manager · Phoenix, AZ</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-4 md:border-l md:border-[var(--border-soft)] md:pl-8">
              <div className="space-y-5">
                <div>
                  <div className="font-mono text-xs text-[var(--text-faint)] mb-1">Before</div>
                  <div className="font-mono text-2xl text-[var(--danger)]">0 callbacks</div>
                  <div className="text-xs text-[var(--text-muted)]">in 3 months</div>
                </div>
                <div className="w-12 h-px bg-[var(--border)]" />
                <div>
                  <div className="font-mono text-xs text-[var(--text-faint)] mb-1">After</div>
                  <div className="font-mono text-2xl text-emerald-400">3 interviews</div>
                  <div className="text-xs text-[var(--text-muted)]">in 2 weeks</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary testimonials */}
        <div className="grid md:grid-cols-3 gap-5">
          {secondary.map((t) => (
            <div key={t.name} className="card card-hover p-7">
              <div className="flex mb-4 gap-0.5"><Star /><Star /><Star /><Star /><Star /></div>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">{t.quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-soft)]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}>{t.initials}</div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
