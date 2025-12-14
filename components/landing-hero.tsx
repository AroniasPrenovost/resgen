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
    <div className="text-white font-bold py-28 text-center space-y-5">
      <ResumeCounter />
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>The best AI tool for</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <TypewriterComponent
            options={{
              strings: [
                "landing your first interview.",
                "writing a resume that sounds like you.",
                "getting hired faster.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 space-y-4 mt-8">
        <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
          A few years ago, I paid a resume writer $200 - and got back something that was obviously not <em>me</em>.
          That&apos;s when I realized what had actually gotten me interviews before wasn&apos;t complicated — it was simple, clear, and honest experience.
        </p>
        <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
          So I built ResumAI to do exactly that. Simply upload your existing resume or enter experience manually, and we&apos;ll generate polished resume content for free. Edit every word until it&apos;s perfect, then download the professional template for just <b style={{color:"rgba(255, 140, 0, 0.97)"}}>$9.99</b> (a fraction of what I paid) - plus 30 days of unlimited revisions!
        </p>
      </div>
      <div className="mt-10 mb-12">
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
