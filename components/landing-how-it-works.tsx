"use client";

import Link from "next/link";

const steps = [
  {
    label: "01 / UPLOAD",
    title: "Drop your resume in",
    body: ".docx, .txt, or paste plain text. No formatting needed. We'll handle the layout.",
    icon: <path d="M12 4v12m0-12l-4 4m4-4l4 4M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: "02 / TAILOR",
    title: "Paste the job posting",
    body: "AI reads the JD and rewrites your bullets to match its language, keywords, and seniority signals.",
    icon: <path d="M14 4l6 6-10 10-6 1 1-6L14 4z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: "03 / DOWNLOAD",
    title: "Preview free, $9.99 to download",
    body: "See the polished version before you pay. Pay once for the clean .docx. Edit forever in Word or Google Docs.",
    icon: <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export const LandingHowItWorks = () => {
  return (
    <section id="how" className="py-24 border-t border-[var(--border-soft)] bg-[var(--bg-soft)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-eyebrow mb-3">From upload to download</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] text-white">
            Three steps. <span className="italic highlight">Under 60 seconds.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 relative">
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(167, 139, 250, 0.3) 20%, rgba(236, 72, 153, 0.3) 80%, transparent 100%)" }} />

          {steps.map((s) => (
            <div key={s.label} className="card p-7 relative">
              <div className="font-mono text-xs text-[var(--text-faint)] mb-4">{s.label}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative z-10" style={{ background: "linear-gradient(135deg, #A78BFA, #EC4899)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">{s.icon}</svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{s.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/app/resume-generator" prefetch={true} className="btn-secondary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white">
            Start with your current resume
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
