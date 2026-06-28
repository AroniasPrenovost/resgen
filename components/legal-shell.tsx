import { LandingNavbar } from "@/components/landing-navbar";
import { LandingFooter } from "@/components/landing-footer";

// Shared frame for the static content pages (privacy, terms, contact). Renders
// the marketing navbar/footer so these pages stay on-brand and navigable, and
// styles the body via the `.legal-prose` rules in globals.css.
export function LegalShell({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated?: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNavbar />
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="section-eyebrow mb-3">ResumAI</div>
        <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] text-white mb-3">
          {title}
        </h1>
        {updated && (
          <p className="text-sm text-[var(--text-faint)] mb-2">Last updated {updated}</p>
        )}
        {intro && (
          <p className="text-[var(--text-muted)] leading-relaxed mb-8 max-w-2xl">{intro}</p>
        )}
        <div className="legal-prose space-y-5 text-[var(--text-muted)] leading-relaxed">
          {children}
        </div>
      </article>
      <LandingFooter />
    </>
  );
}
