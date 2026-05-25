"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";


// import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { ResumeCounter } from "@/components/resume-counter";
import { TrustBar } from "@/components/trust-bar";

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
              <Link href="/app/resume-generator" prefetch={true}>
                <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                  Create My Resume Free
                </Button>
              </Link>
              <p className="text-zinc-400 text-xs md:text-sm mt-4 font-normal">
                Free to generate & edit • $9.99 to download • No credit card needed
              </p>
              <TrustBar theme="dark" className="mt-6 justify-center lg:justify-start" />
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
                  MC
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">Maya Chen</h3>
                  <p className="text-sm text-gray-500">Marketing Coordinator</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>maya.chen@email.com</span>
                    <span>•</span>
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">SEO</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">Google Analytics</span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">Content Strategy</span>
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-200">AI Tools</span>
                </div>
              </div>

              {/* Experience Preview */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Experience</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-bold text-gray-600 border">N</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Marketing Intern · Northwind Media</p>
                      <p className="text-xs text-gray-400">Summer 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-bold text-gray-600 border">R</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Marketing Assistant · Riverview Retail Co.</p>
                      <p className="text-xs text-gray-400">2024 - 2025</p>
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

      {/* Feature Showcase - Bento Grid */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="border-t border-zinc-800 pt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Way beyond a resume builder...
          </h2>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Step-by-step guidance - Large card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/30 transition-colors flex flex-col">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                AI-powered
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Step-by-step guidance</h3>
              <p className="text-zinc-400 text-sm mb-6">
                No need to think much. We guide you through every step of the process. It&apos;s clear and simple.
              </p>
              {/* Visual mockup */}
              <div className="bg-white rounded-xl p-4 shadow-lg flex-grow">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-500 text-sm">Step 1 •</span>
                    <span className="text-gray-800 text-sm font-medium">Personal Details</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-500 text-sm">Step 2 •</span>
                    <span className="text-gray-800 text-sm font-medium">Professional Summary</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <span className="text-gray-500 text-sm">Step 3 •</span>
                    <span className="text-gray-800 text-sm font-semibold">Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 pl-8">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs border border-gray-200">Management Skills +</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs border border-gray-200">Leadership +</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs border border-gray-200">Communication +</span>
                  </div>
                </div>
              </div>
              <Link href="/app/resume-generator" className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium mt-5 group transition-colors">
                Create my resume
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* AI writes for you */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/30 transition-colors flex flex-col">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                AI-powered
              </span>
              <h3 className="text-xl font-bold text-white mb-2">AI writes for you</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Stuck on what to write? Our AI generates professional bullet points and summaries tailored to your experience.
              </p>
              {/* Visual mockup */}
              <div className="bg-white rounded-xl p-4 shadow-lg flex-grow">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Professional Summary</p>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <span>Driven and detail-oriented </span>
                  <span className="bg-purple-100 text-purple-700 px-1 rounded">Marketing Coordinator</span>
                  <span> with hands-on experience running </span>
                  <span className="bg-purple-100 text-purple-700 px-1 rounded">data-driven campaigns</span>
                  <span> that grow engagement. Passionate about building brands that connect and convert...</span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded bg-gray-100 text-gray-500 text-xs font-bold">B</button>
                    <button className="p-1.5 rounded bg-gray-100 text-gray-500 text-xs italic">I</button>
                    <button className="p-1.5 rounded bg-gray-100 text-gray-500 text-xs underline">U</button>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-purple-500 text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    AI Enhanced
                  </div>
                </div>
              </div>
            </div>

            {/* Instant cover letters */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/30 transition-colors flex flex-col">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                AI-powered
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Instant cover letters</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Get a matching cover letter generated automatically with your resume. You&apos;re done in 2 mins. Purpose built to impress recruiters.
              </p>
              {/* Visual mockup - Cover letter preview */}
              <div className="bg-white rounded-xl p-4 shadow-lg flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    MC
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">Maya Chen</p>
                    <p className="text-xs text-gray-500">Marketing Coordinator</p>
                    <div className="mt-2 space-y-1">
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Cover Letter</span>
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Auto-generated
                  </span>
                </div>
              </div>
            </div>

            {/* Paste job description */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/30 transition-colors flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">Paste a job description</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Drop in any job posting and we generate a tailored resume + cover letter that matches perfectly. One click, full application ready.
              </p>
              {/* Visual mockup */}
              <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 flex-grow">
                <div className="bg-zinc-900 rounded-lg px-3 py-2 border border-zinc-700 text-xs text-zinc-500 mb-3">
                  <span className="text-zinc-400">Marketing Coordinator at Acme Co...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-zinc-900/50 rounded-lg p-2 border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs text-zinc-300 font-medium">Resume</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500 text-[10px]">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Tailored
                    </div>
                  </div>
                  <div className="flex-1 bg-zinc-900/50 rounded-lg p-2 border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-zinc-300 font-medium">Cover Letter</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500 text-[10px]">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Generated
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/app/resume-generator" className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium mt-5 group transition-colors">
                Tailor my resume
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
