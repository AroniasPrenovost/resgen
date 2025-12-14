"use client";

import { useEffect, useState } from "react";

// Set your base count here - update this manually when you push code each day
const BASE_COUNT = 500;

export const ResumeCounter = () => {
  const [count, setCount] = useState(BASE_COUNT);

  useEffect(() => {
    const calculateCount = () => {
      const now = new Date();
      const hours = now.getHours();

      // Time-based increments:
      // 12am-6am: +0
      // 6am-12pm: +3
      // 12pm-6pm: +1
      // 6pm-12am: +3
      let increment = 0;

      if (hours >= 6 && hours < 12) {
        increment = 3;
      } else if (hours >= 12 && hours < 18) {
        increment = 1;
      } else if (hours >= 18 && hours < 24) {
        increment = 3;
      }

      setCount(BASE_COUNT + increment);
    };

    calculateCount();

    // Update every hour in case user stays on page
    const interval = setInterval(calculateCount, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
