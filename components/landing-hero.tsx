"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";


// import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { ResumeCounter } from "@/components/resume-counter";

export const LandingHero = () => {
  // const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-16 px-4 text-center space-y-8">
      <ResumeCounter />
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-1 font-extrabold">
        <h1>Stop getting ignored.</h1>
        <h1>Get a resume that</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 min-h-[80px] sm:min-h-[100px] md:min-h-[110px] lg:min-h-[120px]">
          <TypewriterComponent
            options={{
              strings: [
                "actually gets read.",
                "beats the ATS bots.",
                "turns into interviews.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>

      {/* Trust indicators - moved up */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-zinc-400 text-xs md:text-sm font-normal">ATS-optimized content that passes automated screening</p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-zinc-400 text-xs md:text-sm font-normal">Professional formatting recruiters actually read</p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-zinc-400 text-xs md:text-sm font-normal">Industry keywords that get you shortlisted</p>
          </div>
        </div>
      </div>

      <div>
        {/* <Link href={isSignedIn ? "/dashboard" : "/sign-up"}> */}
        <Link href="/resume-generator" prefetch={true}>
          <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
            Create My Resume Free
          </Button>
        </Link>
        <p className="text-zinc-400 text-xs md:text-sm mt-4 font-normal">
          Free to generate & edit • $9.99 to download • No credit card needed
        </p>
      </div>

      {/* Story section - condensed and moved below CTA */}
      <div className="max-w-3xl mx-auto px-4 pt-8 space-y-5">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-zinc-300 text-base md:text-lg font-semibold mb-4">
            Why ResumAI works
          </p>

          <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
            I once paid a resume writer $200+ and got back something generic that didn&apos;t feel like <em>me</em>. Then it hit me: the resumes that actually landed me interviews weren&apos;t fancy - they were simple, clear, and tailored my experience directly to the job description.
          </p>

          <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed mt-4">
            ResumAI gives you that winning approach instantly. Upload your current resume or enter experience manually, and we generate polished, ATS-optimized content.
          </p>

          <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed mt-4">
            Get your rewrite free - only pay <b style={{color:"rgba(255, 140, 0, 0.97)"}}>$9.99</b> to download (+30 days of revisions).
          </p>

        </div>
      </div>
    </div>
  );
};
