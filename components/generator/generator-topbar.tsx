"use client";

import Image from "next/image";

import { RATING, BUILT_THIS_MONTH } from "@/lib/social-proof";
import { IconStar, IconLock } from "./icons";

/**
 * Sticky top utility bar — brand + trust signals. Mirrors the marketing page's
 * authority cues right where the funnel starts. Trust items 2-3 hide < 760px
 * (handled in CSS); the live count collapses to "this month" on mobile.
 */
export function GeneratorTopbar() {
  return (
    <div className="gen-topbar">
      <div className="gen-topbar-inner">
        <div className="gen-brand">
          <span className="mark" aria-hidden>
            <Image fill sizes="26px" alt="" src="/transcript.png" />
          </span>
          ResumAI
        </div>
        <div className="gen-topbar-trust">
          <span className="t">
            <span className="gen-dot" aria-hidden />
            <b style={{ color: "var(--ink)" }}>{BUILT_THIS_MONTH}</b>
            &nbsp;built this month
          </span>
          <span className="t">
            <IconStar />
            {RATING} / 5
          </span>
          <span className="t">
            <IconLock />
            Stripe secured
          </span>
        </div>
      </div>
    </div>
  );
}
