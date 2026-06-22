"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

/**
 * App chrome (icon sidebar + top navbar). The resume generator is a standalone,
 * full-bleed experience with its own dark topbar (to match the marketing page),
 * so we drop the dashboard chrome for that route and let the page own the
 * viewport.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/app/resume-generator");

  if (bare) {
    return <>{children}</>;
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-20 md:flex-col md:fixed md:inset-y-0 z-80 bg-[#0A0B14]">
        <Sidebar isPro={true} apiLimitCount={0} />
      </div>
      <main className="md:pl-20 pb-1">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
