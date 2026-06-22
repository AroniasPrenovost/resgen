"use client";

import { IconSpark, IconSpinner } from "./icons";

/**
 * Sticky bottom CTA bar for mobile — slides in after the hero scrolls off and
 * hides once the result is open (visibility controlled by the parent via
 * IntersectionObserver). Respects safe-area-inset-bottom. Desktop-hidden in CSS.
 */
export function StickyMobileCTA({
  show,
  onGenerate,
  busy = false,
}: {
  show: boolean;
  onGenerate: () => void;
  busy?: boolean;
}) {
  return (
    <div className={`gen-sticky-cta${show ? " show" : ""}`} aria-hidden={!show}>
      <div className="gen-sticky-cta-inner">
        <div className="meta">
          <div className="p">Free</div>
          <div className="s">preview</div>
        </div>
        <button
          type="button"
          className="gen-btn-primary"
          onClick={onGenerate}
          disabled={busy}
          tabIndex={show ? 0 : -1}
        >
          {busy ? <IconSpinner className="spin" /> : <IconSpark />}
          Generate my resume
        </button>
      </div>
    </div>
  );
}
