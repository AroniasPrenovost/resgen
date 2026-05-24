"use client";

import { Zap } from "lucide-react";

interface CreditMeterProps {
  /** How many free AI generations the user has already spent. */
  used: number;
  /** Total free AI generations granted. */
  max?: number;
  className?: string;
}

/**
 * Bold, scarcity-driven free-credit display.
 *
 * Renders a row of pips that deplete as the user spends free AI generations,
 * with copy + color that ramp up urgency as they run low. Built to feel like a
 * game meter so users keep moving through the funnel toward the paywall.
 */
export function CreditMeter({ used, max = 6, className = "" }: CreditMeterProps) {
  const left = Math.max(0, max - used);
  const isOut = left <= 0;
  const isLow = !isOut && left <= 2;

  // Tone shifts: plenty (purple) -> low (amber, urgent) -> out (red/locked).
  const tone = isOut
    ? {
        chip: "bg-red-50 text-red-600 border-red-200",
        bar: "from-red-500 to-rose-500",
        label: "0 free generations left",
        sub: "Unlock unlimited generations + download below",
      }
    : isLow
      ? {
          chip: "bg-amber-50 text-amber-700 border-amber-200",
          bar: "from-amber-400 to-orange-500",
          label: `Only ${left} free ${left === 1 ? "generation" : "generations"} left!`,
          sub: "Make it count — or unlock unlimited below",
        }
      : {
          chip: "bg-purple-50 text-purple-700 border-purple-200",
          bar: "from-purple-500 to-pink-500",
          label: `${left} free AI generations left`,
          sub: "Regenerate & re-tailor as much as you like",
        };

  return (
    <div
      className={`w-full max-w-md mx-auto rounded-2xl border ${tone.chip} px-4 py-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Zap
            className={`w-4 h-4 ${isOut ? "text-red-500" : isLow ? "text-amber-500" : "text-purple-500"} ${
              isLow && !isOut ? "animate-pulse" : ""
            }`}
            fill="currentColor"
          />
          <span>{tone.label}</span>
        </div>
        <span className="text-xs font-semibold tabular-nums opacity-70">
          {left}/{max}
        </span>
      </div>

      {/* Depleting pips */}
      <div className="mt-2 flex items-center gap-1.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < left;
          return (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                filled
                  ? `bg-gradient-to-r ${tone.bar}`
                  : "bg-gray-200/80"
              }`}
            />
          );
        })}
      </div>

      <p className="mt-2 text-[11px] leading-tight opacity-70">{tone.sub}</p>
    </div>
  );
}
