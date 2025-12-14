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
    <div className="text-white font-bold py-28 text-center space-y-12">
      <ResumeCounter />
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-1 font-extrabold">
        <h1>The AI that helps you</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <TypewriterComponent
            options={{
              strings: [
                "land that first interview.",
                "stand out to hiring managers.",
                "sound like you, not a template.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
          A few years ago, I paid a resume writer over $200 - and got back something that was obviously not <em>me</em>. Then it hit me: the resumes that landed me interviews in the past weren&apos;t fancy or complicated. They were simple, clear, and tied my experience directly to real accomplishments.
        </p>

        <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
          That lesson stuck, and after a few more years in the job market - gaining interviewing experience and sharpening my coding skillset - I finally had what I needed to solve the problem.
        </p>

        <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
          So, I built ResumAI to give you the same winning approach without the big price tag. Upload your current resume or enter your experience, and we generate polished, professional content instantly. Try it free - only pay <b style={{color:"rgba(255, 140, 0, 0.97)"}}>$9.99</b> if you love it and want the premium template. Includes 30 days of revisions.
        </p>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-zinc-400 text-xs md:text-sm">ATS-optimized content that passes automated screening</p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-zinc-400 text-xs md:text-sm">Professional formatting that recruiters actually read</p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-zinc-400 text-xs md:text-sm">Industry-specific keywords that get you interviews</p>
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
        <p className="text-zinc-400 text-xs md:text-sm mt-4">
          Free to generate & edit • $9.99 to download • No credit card needed
        </p>
      </div>
    </div>
  );
};
