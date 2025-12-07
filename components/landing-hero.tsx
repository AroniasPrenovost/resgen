"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";


// import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  // const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-28 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>The best AI tool for</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <TypewriterComponent
            options={{
              strings: [
                "Resume generation.",
                "Getting that first interview.",
                "Getting hired.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 space-y-4 mt-8">
        <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
          After paying a resume writer $300 and getting back something that didn&apos;t even sound like me,
          I realized what actually got me interviews before wasn&apos;t complicated—it was simple, clear, and honest.
          So I built this.
        </p>
        <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
          Upload your existing resume, and the ResumAI assistant <b>instantly</b> starts proofreading and rewriting.
          Once you&apos;re satisfied, download your polished resume for just <b style={{color:"rgba(255, 140, 0, 0.97)"}}>$9.99</b>—includes 30 days of unlimited access.
        </p>
      </div>
      <div className="mt-10 mb-12">
        {/* <Link href={isSignedIn ? "/dashboard" : "/sign-up"}> */}
        <Link href="/resume-generator" prefetch={true}>
          <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
            Generate Your Last Resume
          </Button>
        </Link>
      </div>
    </div>
  );
};
