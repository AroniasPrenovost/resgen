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
      <div className="text-sm md:text-xl font-light text-zinc-400">
        Create your resume 10x faster
      </div>
      <div>
        {/* <Link href={isSignedIn ? "/dashboard" : "/sign-up"}> */}
        <Link href="/resume-generator" prefetch={true}>
          <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
            Generate Your Last Resume
          </Button>
        </Link>
      </div>
      <div className="text-zinc-400 text-xs md:text-sm font-normal p-4">
        Use the power of AI to <b>instantly</b> generate an professional resume optimized for ATS systems (applicant tracking software).<br/><b>How does it work?</b> You provide as much (or as little) info as you want, and AI does the rest. 
      </div>
    </div>
  );
};

