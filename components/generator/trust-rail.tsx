"use client";

import {
  COMPETITOR_PRICES,
  OUR_PRICE,
  BUILT_THIS_MONTH,
  BEFORE_AFTER,
  TESTIMONIAL,
} from "@/lib/social-proof";
import { IconShieldCheck } from "./icons";

/**
 * Honest-math mini-table. The rail's whole job is consistency with the landing
 * page's claims, so the numbers come from lib/social-proof (single source).
 * `compact` drops to two competitor rows for the tighter mobile placement.
 */
export function HonestMathCard({ compact = false }: { compact?: boolean }) {
  const rows = compact ? COMPETITOR_PRICES.slice(0, 2) : COMPETITOR_PRICES;
  return (
    <div className="gen-rail-card">
      <div className="gen-rail-eyebrow">The honest math</div>
      {rows.map((r) => (
        <div className="gen-math-row" key={r.name}>
          <span className="who">{r.name}</span>
          <span className="amt">{r.price}</span>
        </div>
      ))}
      <div className="gen-math-row us">
        <span className="who">ResumAI</span>
        <span className="amt">{OUR_PRICE}</span>
      </div>
      <div className="gen-math-foot">
        Same ATS-ready output. Without the{" "}
        <s>$2 trial that bills $25 next week.</s>
      </div>
    </div>
  );
}

/**
 * Live-proof card: people-this-month + the 0→3 before/after stat + the Marcus
 * testimonial. `variant="mobile"` lays the two stats side-by-side (matches the
 * condensed mobile block); the rail variant stacks them.
 */
export function LiveProofCard({
  variant = "rail",
}: {
  variant?: "rail" | "mobile";
}) {
  const stats =
    variant === "mobile" ? (
      <div className="gen-proof-stats">
        <div className="gen-proof-stat">
          <div className="n">{BEFORE_AFTER.before.value}</div>
          <div className="l">{BEFORE_AFTER.before.label}</div>
        </div>
        <div className="gen-proof-stat">
          <div className="n g">{BEFORE_AFTER.after.value}</div>
          <div className="l">{BEFORE_AFTER.after.label}</div>
        </div>
      </div>
    ) : (
      <>
        <div className="gen-proof-stat" style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="n">{BEFORE_AFTER.before.value}</span>
            <span className="l">{BEFORE_AFTER.before.label}</span>
          </div>
        </div>
        <div className="gen-proof-stat">
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="n g">{BEFORE_AFTER.after.value}</span>
            <span className="l">{BEFORE_AFTER.after.label}</span>
          </div>
        </div>
      </>
    );

  return (
    <div className="gen-rail-card">
      <div className="gen-proof-live">
        <span className="gen-dot" aria-hidden /> {BUILT_THIS_MONTH} people built
        one this month
      </div>
      {stats}
      <div className="gen-proof-sep" />
      <div className="gen-mini-quote">
        <span className="stars" aria-hidden>★★★★★</span>
        &ldquo;{TESTIMONIAL.quote}&rdquo;
        <div className="gen-mini-by">
          <b>{TESTIMONIAL.name}</b> · {TESTIMONIAL.role}
        </div>
      </div>
    </div>
  );
}

/** 30-day money-back guarantee card (desktop rail). */
export function GuaranteeCard() {
  return (
    <div className="gen-rail-card">
      <div className="gen-guarantee">
        <div className="gic">
          <IconShieldCheck />
        </div>
        <div>
          <h4>30-day money-back</h4>
          <p>
            Download, use it, and if it doesn&apos;t feel like a sane person built
            it — full refund. No maze.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Desktop sticky trust rail composing the three cards. */
export function TrustRail() {
  return (
    <aside className="gen-rail gen-only-desktop">
      <HonestMathCard />
      <LiveProofCard variant="rail" />
      <GuaranteeCard />
    </aside>
  );
}
