"use client";

import { IconBolt } from "./icons";

/**
 * Generation-credits meter (the 6-pip bar). Reads real entitlement state:
 * `used` free generations out of `max`. Spent pips go grey. Previewing never
 * costs a credit — copy reinforces that.
 */
export function CreditsPips({
  used,
  max = 6,
}: {
  used: number;
  max?: number;
}) {
  const left = Math.max(0, max - used);
  return (
    <div className="gen-credits">
      <div className="gen-credits-top">
        <span className="lhs">
          <IconBolt /> {left} free {left === 1 ? "generation" : "generations"} left
        </span>
        <span className="ct">
          {left} / {max}
        </span>
      </div>
      <div className="gen-pips">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`gen-pip${i >= left ? " spent" : ""}`}
          />
        ))}
      </div>
      <div className="note">
        Regenerate and re-tailor as much as you like — preview never costs a
        credit.
      </div>
    </div>
  );
}
