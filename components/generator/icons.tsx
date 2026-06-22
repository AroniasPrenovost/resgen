/**
 * Shared inline SVG icons for the generator redesign. All use currentColor so
 * the scoped CSS controls their color. Kept here so the page/components stay
 * readable instead of repeating raw <svg> markup everywhere.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconCheck = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.4} {...p}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const IconLock = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

export const IconClock = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconStar = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6 5.7 21l2.3-7.2-6-4.4h7.6z" />
  </svg>
);

export const IconSpark = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.5 6.5L22 12l-6.5 2.5L13 21l-2.5-6.5L4 12l6.5-2.5z" />
  </svg>
);

export const IconFile = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

export const IconCloudUp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M7 16a4 4 0 01-.88-7.9A5 5 0 0115.9 6 5 5 0 0117 15.9" />
    <path d="M12 12v9" />
    <path d="M8.5 15.5L12 12l3.5 3.5" />
  </svg>
);

export const IconX = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.4} {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const IconShieldCheck = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const IconBolt = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
  </svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconSpinner = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
    <path
      d="M4 12a8 8 0 018-8"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);
