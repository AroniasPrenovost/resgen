"use client";

import { ResumeCounter } from "@/components/resume-counter";
import { cn } from "@/lib/utils";

interface TrustBarProps {
  theme?: "light" | "dark";
  className?: string;
}

/**
 * Sleek, honest trust strip used on both the landing page and the generator.
 * No company-endorsement claims — only signals we can actually back up:
 * live resume count, ATS-optimization, secure checkout, and the free preview.
 */
export function TrustBar({ theme = "light", className }: TrustBarProps) {
  const isDark = theme === "dark";

  const text = isDark ? "text-zinc-300" : "text-gray-600";
  const strong = isDark ? "text-white" : "text-gray-900";
  const divider = isDark ? "bg-zinc-700" : "bg-gray-200";
  const iconWrap = isDark ? "text-purple-400" : "text-purple-600";

  const Item = ({ children }: { children: React.ReactNode }) => (
    <span className={cn("inline-flex items-center gap-1.5 text-sm whitespace-nowrap", text)}>
      {children}
    </span>
  );

  const Divider = () => (
    <span className={cn("hidden sm:block h-4 w-px", divider)} aria-hidden="true" />
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5",
        className
      )}
    >
      {/* Live resume count */}
      <Item>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <strong className={strong}>
          <ResumeCounter variant="number-only" />
        </strong>
        resumes generated
      </Item>

      <Divider />

      {/* ATS-optimized */}
      <Item>
        <svg className={cn("w-4 h-4", iconWrap)} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        ATS-optimized
      </Item>

      <Divider />

      {/* Secure checkout */}
      <Item>
        <svg className={cn("w-4 h-4", iconWrap)} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Secure checkout
      </Item>

      <Divider />

      {/* Free preview */}
      <Item>
        <svg className={cn("w-4 h-4", iconWrap)} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
        Free preview, no card
      </Item>
    </div>
  );
}
