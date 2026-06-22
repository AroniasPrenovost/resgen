"use client";

import { IconLock } from "./icons";

/**
 * Locked preview document — the top is readable to prove a tailored resume
 * exists; the bottom ~60% sits behind a blur veil to create the unlock motive.
 *
 * Deliberately a TEASER, not the full rewrite: we render the real name, role
 * and section headers but skeleton lines for the body, so the full unblurred
 * document never ships to the DOM before payment. The actual full resume stays
 * available free via the preview modal ("see the full preview free" link).
 */
export function PreviewDoc({
  name,
  role,
  atsScore = 92,
  onPreviewFree,
}: {
  name: string;
  role: string;
  atsScore?: number;
  onPreviewFree?: () => void;
}) {
  // ATS ring geometry (r=15 → circumference ≈ 94.2)
  const C = 94.2;
  const offset = C * (1 - Math.min(Math.max(atsScore, 0), 100) / 100);

  return (
    <div className="gen-preview-doc">
      <div className="gen-ats-badge">
        <svg className="ats-ring" viewBox="0 0 36 36" aria-hidden>
          <circle cx="18" cy="18" r="15" fill="none" stroke="#eaeaf0" strokeWidth="4" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="#34d399"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            transform="rotate(-90 18 18)"
          />
          <text x="18" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15151c">
            {atsScore}
          </text>
        </svg>
        <span className="lbl">
          ATS Score
          <b>Excellent</b>
        </span>
      </div>

      <div className="pv-name">{name}</div>
      <div className="pv-role">{role}</div>
      <div className="pv-rule" />

      <div className="pv-block">
        <div className="pv-h">Professional Summary</div>
        <div className="pv-line w1" />
        <div className="pv-line w2" />
        <div className="pv-line w3" />
      </div>
      <div className="pv-block">
        <div className="pv-h">Experience — tailored to this role</div>
        <div className="pv-line w1" />
        <div className="pv-line w4" />
        <div className="pv-line w2" />
      </div>

      <div className="pv-veil">
        <div className="pv-lock-ic">
          <IconLock />
        </div>
        <h4>The full rewrite is ready</h4>
        <p>
          Re-tailored to the posting, 94% keyword match. Unlock to download it in
          Word — yours to edit forever.
        </p>
        {onPreviewFree && (
          <button type="button" className="free-link" onClick={onPreviewFree}>
            See the full preview free
          </button>
        )}
      </div>
    </div>
  );
}
