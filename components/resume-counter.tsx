"use client";

import { useEffect, useState } from "react";

// Base count starting from April 1, 2024
const BASE_COUNT = 4500;
const START_DATE = new Date('2024-04-01');
const DAILY_INCREMENT = 3;

interface ResumeCounterProps {
  variant?: "default" | "number-only";
}

export const ResumeCounter = ({ variant = "default" }: ResumeCounterProps) => {
  const [count, setCount] = useState(BASE_COUNT);

  useEffect(() => {
    const calculateCount = () => {
      const now = new Date();

      // Calculate days since April 1, 2024
      const diffTime = now.getTime() - START_DATE.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Add 2 for every day since start date
      const totalCount = BASE_COUNT + (diffDays * DAILY_INCREMENT);

      setCount(totalCount);
    };

    calculateCount();

    // Update once per day (check every hour in case user stays on page overnight)
    const interval = setInterval(calculateCount, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Number-only variant for use in larger displays
  if (variant === "number-only") {
    return <>{count.toLocaleString()}+</>;
  }

  // Default badge variant
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-full border border-purple-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-zinc-300 text-sm md:text-base">
            <span className="font-bold text-white">{count.toLocaleString()}+</span> resumes generated
          </span>
        </div>
      </div>
    </div>
  );
};
