"use client";

import { useEffect, useState } from "react";

// Base count starting from April 1, 2024
const BASE_COUNT = 4500;
const START_DATE = new Date('2024-04-01');
const DAILY_INCREMENT = 3;

interface ResumeCounterProps {
  variant?: "default" | "number-only";
}

const calculateTotal = () => {
  const now = new Date();

  // Calculate days since April 1, 2024
  const diffTime = now.getTime() - START_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Add DAILY_INCREMENT for every day since start date
  return BASE_COUNT + diffDays * DAILY_INCREMENT;
};

export const ResumeCounter = ({ variant = "default" }: ResumeCounterProps) => {
  const [count, setCount] = useState(0);
  // The final value the counter animates toward, used to reserve layout width
  // up front so the surrounding text doesn't reflow as the digits grow.
  const [target, setTarget] = useState(calculateTotal);

  useEffect(() => {
    let frame: number;
    let target = calculateTotal();

    // Animate the displayed value up to the target on mount
    const ANIMATION_MS = 1700;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / ANIMATION_MS, 1);
      // easeOutCubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    // Keep in sync once per day (check hourly in case the page stays open overnight)
    const interval = setInterval(() => {
      target = calculateTotal();
      setTarget(target);
      setCount(target);
    }, 60 * 60 * 1000);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
    };
  }, []);

  // Renders the animating value on top of an invisible copy of the final
  // value. The invisible copy reserves the maximum width so the box never
  // grows/shrinks while counting; tabular-nums keeps each digit a fixed width.
  const number = (
    <span className="relative inline-block tabular-nums">
      <span aria-hidden className="invisible">{target.toLocaleString()}+</span>
      <span className="absolute inset-0">{count.toLocaleString()}+</span>
    </span>
  );

  // Number-only variant for use in larger displays
  if (variant === "number-only") {
    return number;
  }

  // Default badge variant
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-full border border-purple-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-zinc-300 text-sm md:text-base">
            <span className="font-bold text-white">{number}</span> resumes generated
          </span>
        </div>
      </div>
    </div>
  );
};
