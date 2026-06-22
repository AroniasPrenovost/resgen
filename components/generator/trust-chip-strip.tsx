"use client";

import { ResumeCounter } from "@/components/resume-counter";
import { RATING } from "@/lib/social-proof";
import { IconCheck, IconLock } from "./icons";

/**
 * Horizontal-scrolling trust chips shown under the hero on mobile only.
 * Keeps the social proof present without burying the form. Hidden on desktop
 * (the trust rail carries it there).
 */
export function TrustChipStrip() {
  return (
    <div className="gen-trust-strip gen-only-mobile" aria-label="Trust signals">
      <span className="gen-chip">
        <span className="gen-dot" aria-hidden />
        <b>
          <ResumeCounter variant="number-only" />
        </b>{" "}
        generated
      </span>
      <span className="gen-chip">
        <span className="star" aria-hidden>★</span>
        <b>{RATING}</b>/5 rating
      </span>
      <span className="gen-chip">
        <IconCheck stroke="var(--green)" /> No card to preview
      </span>
      <span className="gen-chip">
        <IconLock stroke="var(--green)" /> Stripe secured
      </span>
      <span className="gen-chip">
        <IconCheck stroke="var(--green)" /> ATS-tested
      </span>
    </div>
  );
}
