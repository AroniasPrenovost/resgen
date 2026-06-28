"use client";

import Image from "next/image";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "vs. Zety", href: "#compare" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "ATS Guide", href: "#" },
      { label: "Resume Templates", href: "#" },
      { label: "Cover Letter Tips", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Refund Policy", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export const LandingFooter = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border-soft)] bg-[var(--bg-soft)] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative h-7 w-7">
                <Image fill sizes="28px" alt="ResumAI logo" src="/transcript.png" />
              </div>
              <span className="font-semibold tracking-tight text-white">ResumAI</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">AI resumes that beat the bots. $9.99 for 30 days of access. No subscription.</p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] mb-3">{col.heading}</div>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                {col.links.map((link) => (
                  <li key={link.label}><a href={link.href} className="hover:text-white transition">{link.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-[var(--border-soft)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-faint)]">
          <div>© {year} ResumAI</div>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1l6 3v4c0 3.5-2.5 6.5-6 7-3.5-.5-6-3.5-6-7V4l6-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            Stripe secured checkout
          </div>
        </div>
      </div>
    </footer>
  );
};
