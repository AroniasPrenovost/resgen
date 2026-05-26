"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const LandingNavbar = () => {
  return (
    <nav className="border-b border-[var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-8 w-8">
            <Image fill alt="ResumAI logo" src="/transcript.png" />
          </div>
          <span className="font-semibold tracking-tight text-white text-lg">ResumAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-muted)]">
          <a href="#how" className="hover:text-white transition">How it works</a>
          <a href="#compare" className="hover:text-white transition">vs. Zety</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </div>

        <Link
          href="/app/resume-generator"
          prefetch={true}
          className={cn("btn-secondary rounded-full px-5 py-2 text-sm font-medium text-white")}
        >
          Build my resume
        </Link>
      </div>
    </nav>
  );
};
