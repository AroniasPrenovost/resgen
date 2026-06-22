"use client";

import { ResumeCounter } from "@/components/resume-counter";
import { IconCheck } from "./icons";

/**
 * Hero — eyebrow (mono) + serif headline with a gradient italic accent + sub +
 * a trustline. Same typographic signature as the marketing landing page.
 */
export function GeneratorHero() {
  return (
    <header className="gen-hero" id="gen-hero">
      <div className="gen-wrap">
        <div className="gen-eyebrow">Upload to download · under 60 seconds</div>
        <h1 className="gen-head">
          A resume worth sending, <em>in minutes.</em>
        </h1>
        <p className="gen-sub">
          Drop in what you have, paste the job you want, and watch it get
          rewritten to clear the bots and read like a recruiter wrote it.
          Preview the whole thing free.
        </p>
        <div className="gen-hero-trustline">
          <span className="t">
            <span className="gen-dot" aria-hidden />
            <span className="num">
              <ResumeCounter variant="number-only" />
            </span>{" "}
            resumes generated
          </span>
          <span className="t">
            <IconCheck stroke="var(--green)" /> ATS-tested on Workday, Greenhouse,
            Lever
          </span>
          <span className="t">
            <IconCheck stroke="var(--green)" /> No card to preview
          </span>
        </div>
      </div>
    </header>
  );
}
