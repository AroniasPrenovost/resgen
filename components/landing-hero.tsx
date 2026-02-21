"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";


// import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { ResumeCounter } from "@/components/resume-counter";

export const LandingHero = () => {
  // const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-12 md:py-16 px-4">
      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left space-y-6">

            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <h1>This resume</h1>
              <h1>builder gets you</h1>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 min-h-[50px] sm:min-h-[60px] md:min-h-[70px] lg:min-h-[80px]">
                <TypewriterComponent
                  options={{
                    strings: [
                      "an interview.",
                      "a remote job.",
                      "a promotion.",
                      "a career change.",
                    ],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </div>
            </div>
            <p className="text-zinc-400 text-sm md:text-base font-normal">
              Only 2% of resumes win. Yours will be one of them.
            </p>

            {/* Trust indicators */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2 justify-center lg:justify-start">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-zinc-400 text-xs md:text-sm font-normal">ATS-optimized content that passes automated screening</p>
              </div>
              <div className="flex items-start gap-2 justify-center lg:justify-start">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-zinc-400 text-xs md:text-sm font-normal">Professional formatting recruiters actually read</p>
              </div>
              <div className="flex items-start gap-2 justify-center lg:justify-start">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-zinc-400 text-xs md:text-sm font-normal">Industry keywords that get you shortlisted</p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/resume-generator" prefetch={true}>
                <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                  Create My Resume Free
                </Button>
              </Link>
              <p className="text-zinc-400 text-xs md:text-sm mt-4 font-normal">
                Free to generate & edit • $9.99 to download • No credit card needed
              </p>
            </div>
          </div>

          {/* Right Side - Resume Preview Mockup */}
          <div className="relative hidden lg:block">
            {/* Decorative background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>

            {/* Main Resume Preview Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-purple-500/20 p-6 transform hover:scale-[1.02] transition-transform duration-300">
              {/* Resume Header */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  JD
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">John Doe</h3>
                  <p className="text-sm text-gray-500">Senior Software Engineer</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>john@email.com</span>
                    <span>•</span>
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">React</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">TypeScript</span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">Node.js</span>
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-200">AWS</span>
                </div>
              </div>

              {/* Experience Preview */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Experience</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-bold text-gray-600 border">G</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Google</p>
                      <p className="text-xs text-gray-400">2020 - Present</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-bold text-gray-600 border">M</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Meta</p>
                      <p className="text-xs text-gray-400">2018 - 2020</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge - ATS Score */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl px-4 py-3 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="#e5e7eb" strokeWidth="4" fill="none"/>
                      <circle cx="24" cy="24" r="20" stroke="#22c55e" strokeWidth="4" fill="none" strokeDasharray="125" strokeDashoffset="10" strokeLinecap="round"/>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-green-600">92</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">ATS Score</p>
                    <p className="text-[10px] text-green-600 font-medium">Excellent</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge - ATS Optimized */}
              <div className="absolute -bottom-3 right-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg px-4 py-2 text-white text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                ATS Optimized
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width counter section */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-8">
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                <ResumeCounter variant="number-only" />
              </span>
              <span className="text-white ml-2">resumes created</span>
            </p>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="border-t border-zinc-800 pt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
            How it works
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Get an interview-winning resume in 3 simple steps
          </p>

          {/* 3 Step Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Step 1 */}
            <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload your resume</h3>
              <p className="text-zinc-400 text-sm">
                Drop your existing resume or paste your experience. We support .docx and .txt files.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI optimizes your content</h3>
              <p className="text-zinc-400 text-sm">
                Our AI rewrites your experience with power verbs, quantified achievements, and ATS-friendly formatting.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Download & apply</h3>
              <p className="text-zinc-400 text-sm">
                Preview for free, then download your polished resume for just $9.99. Includes 30 days of revisions.
              </p>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-t border-zinc-800">
            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/50">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-1">Done in minutes</h4>
              <p className="text-zinc-500 text-sm">10x faster than writing from scratch on your own</p>
            </div>
            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/50">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-1">Zero mistakes</h4>
              <p className="text-zinc-500 text-sm">No typos, perfect grammar. You&apos;ll sound polished and professional</p>
            </div>
            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/50">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-1">100% ATS compliant</h4>
              <p className="text-zinc-500 text-sm">Your resume passes the bots. Recruiters will actually see you</p>
            </div>
            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/50">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-1">Land higher offers</h4>
              <p className="text-zinc-500 text-sm">Strong resumes lead to better negotiations and higher starting salaries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
