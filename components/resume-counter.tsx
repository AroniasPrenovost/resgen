"use client";

import { useEffect, useState } from "react";

import {
  LOCAL_GENERATIONS_EVENT,
  getLocalGenerationCount,
} from "@/lib/generation-count";

// Base count starting from April 1, 2024
const BASE_COUNT = 4500;
const START_DATE = new Date('2024-04-01');
const DAILY_INCREMENT = 3;

interface ResumeCounterProps {
  variant?: "default" | "number-only";
  // Classes applied to the visible digits. When a gradient/clip is used here it
  // must live on this span (which carries the real digits), not on a parent —
  // the digits are absolutely positioned and won't inherit a parent's bg-clip.
  numberClassName?: string;
}

const calculateTotal = () => {
  const now = new Date();

  // Calculate days since April 1, 2024
  const diffTime = now.getTime() - START_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Synthetic time-based baseline plus the resumes this user has actually
  // generated, so the number stays believable when they watch it tick up.
  return BASE_COUNT + diffDays * DAILY_INCREMENT + getLocalGenerationCount();
};

export const ResumeCounter = ({ variant = "default", numberClassName }: ResumeCounterProps) => {
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

    // Recompute immediately whenever the user generates a resume — same-tab via
    // our custom event, other tabs via the native storage event — so the number
    // visibly jumps and feels live to anyone tracking it.
    const refresh = () => {
      target = calculateTotal();
      setTarget(target);
      setCount(target);
    };
    window.addEventListener(LOCAL_GENERATIONS_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
      window.removeEventListener(LOCAL_GENERATIONS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Renders the animating value on top of an invisible copy of the final
  // value. The invisible copy reserves the maximum width so the box never
  // grows/shrinks while counting; tabular-nums keeps each digit a fixed width.
  const number = (
    <span className="relative inline-block tabular-nums">
      <span aria-hidden className="invisible">{target.toLocaleString()}+</span>
      <span className={`absolute inset-0 ${numberClassName ?? ""}`}>{count.toLocaleString()}+</span>
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
