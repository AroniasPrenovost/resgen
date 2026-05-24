"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Marcus T.",
    avatar: "M",
    title: "Customer Success Manager",
    description: "Three months of applying, basically nothing. I redid my resume here, kept maybe half of what it suggested, and had three interviews lined up two weeks later. Honestly I have no idea which change did it, but something clicked.",
    location: 'Phoenix, AZ',
    rating: 5,
  },
  {
    name: "Priya N.",
    avatar: "P",
    title: "Recent Grad",
    description: "Does what it says.",
    location: 'Edison, NJ',
    rating: 4,
  },
  {
    name: "Bryce P.",
    avatar: "B",
    title: "Project Manager",
    description: "I hadn't touched my resume in like four years and dreaded the whole thing. Had a clean draft in maybe 15 min. I tweaked a couple bullets that felt a little generic, but it got me 90% there.",
    location: 'Seattle, WA',
    rating: 4,
  },
  {
    name: "Sarah K.",
    avatar: "S",
    title: "Software Engineer",
    description: "Expected generic filler, but it pulled the real impact out of my project notes. It also pasted cleanly into our Workday portal without breaking the formatting, which usually takes me ages to fix.",
    location: 'Austin, TX',
    rating: 5,
  },
];


const year = new Date().getFullYear();

export const LandingContent = () => {
  return (
    <div className="px-6 md:px-10 pb-20 pt-2">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl text-white font-extrabold mb-4">Job seekers are landing interviews</h2>
        <p className="text-center text-zinc-400 text-sm md:text-base mb-12 max-w-2xl mx-auto font-normal">
          Join professionals using ResumAI to get past ATS and into interviews
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <Card
              key={item.description}
              className="bg-gradient-to-br from-[#1a2744] to-[#192339] border border-zinc-800/50 text-white hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-base font-semibold">{item.name}</p>
                      <p className="text-zinc-400 text-xs">{item.title}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={cn("w-4 h-4", i < item.rating ? "fill-yellow-400" : "fill-zinc-700")} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <CardContent className="px-0 pb-0">
                  <p className="text-zinc-300 text-sm leading-relaxed relative pl-3">
                    <span className="text-purple-400/40 text-2xl absolute -left-1 top-0 leading-none">&ldquo;</span>
                    <span className="relative z-10">{item.description}</span>
                    <span className="text-purple-400/40 text-2xl absolute -bottom-2 right-0 leading-none">&rdquo;</span>
                  </p>
                  <p className="text-zinc-500 text-xs mt-4 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {item.location}
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Join CTA Section */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 md:p-12 lg:p-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Join over <span className="text-blue-500">3,000+</span>
                <br />
                happy customers
              </h2>
              <p className="text-gray-600 text-lg md:text-xl mt-4 mb-8">
                Start now and get hired faster.
              </p>
              <Link href="/app/resume-generator">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Create my resume
                </button>
              </Link>
            </div>

            {/* Right Visual - Animated Resume */}
            <div className="flex-1 relative flex justify-center items-center">
              <div className="relative">
                {/* Resume Document */}
                <div
                  className="w-56 md:w-64 lg:w-72 bg-white rounded-lg shadow-2xl overflow-hidden"
                  style={{ aspectRatio: '8.5/11' }}
                >
                  <div className="p-4 md:p-5 lg:p-6 h-full">
                    {/* Name */}
                    <div className="text-blue-700 font-bold text-sm md:text-base lg:text-lg mb-1 animate-pulse">
                      Maya Chen
                    </div>

                    {/* Contact Line */}
                    <div className="text-[8px] md:text-[9px] text-gray-500 mb-3 pb-2 border-b border-gray-200">
                      maya.chen@email.com • (555) 123-4567 • linkedin.com/in/mayachen
                    </div>

                    {/* Skills Section */}
                    <div className="mb-3">
                      <div className="text-[9px] md:text-[10px] font-bold text-gray-800 uppercase tracking-wide mb-1">
                        Skills
                      </div>
                      <div className="space-y-0.5">
                        <div className="h-1.5 bg-gray-200 rounded animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '90%' }} />
                        <div className="h-1.5 bg-gray-200 rounded animate-[pulse_2s_ease-in-out_0.3s_infinite]" style={{ width: '75%' }} />
                      </div>
                    </div>

                    {/* Experience Section */}
                    <div className="mb-3">
                      <div className="text-[9px] md:text-[10px] font-bold text-gray-800 uppercase tracking-wide mb-1">
                        Professional Experience
                      </div>

                      {/* Job 1 */}
                      <div className="mb-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[8px] md:text-[9px] font-semibold text-gray-700">NORTHWIND MEDIA</span>
                          <span className="text-[7px] text-gray-500">Summer 2025</span>
                        </div>
                        <div className="text-[7px] md:text-[8px] italic text-gray-600 mb-1">Marketing Intern</div>
                        <div className="space-y-0.5">
                          <div className="h-1 bg-gray-100 rounded animate-[pulse_2s_ease-in-out_0.5s_infinite]" style={{ width: '100%' }} />
                          <div className="h-1 bg-gray-100 rounded animate-[pulse_2s_ease-in-out_0.7s_infinite]" style={{ width: '95%' }} />
                          <div className="h-1 bg-gray-100 rounded animate-[pulse_2s_ease-in-out_0.9s_infinite]" style={{ width: '85%' }} />
                        </div>
                      </div>

                      {/* Job 2 */}
                      <div className="mb-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[8px] md:text-[9px] font-semibold text-gray-700">RIVERVIEW RETAIL CO.</span>
                          <span className="text-[7px] text-gray-500">2024 - 2025</span>
                        </div>
                        <div className="text-[7px] md:text-[8px] italic text-gray-600 mb-1">Marketing Assistant</div>
                        <div className="space-y-0.5">
                          <div className="h-1 bg-gray-100 rounded animate-[pulse_2s_ease-in-out_1.1s_infinite]" style={{ width: '100%' }} />
                          <div className="h-1 bg-gray-100 rounded animate-[pulse_2s_ease-in-out_1.3s_infinite]" style={{ width: '80%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Education Section */}
                    <div>
                      <div className="text-[9px] md:text-[10px] font-bold text-gray-800 uppercase tracking-wide mb-1">
                        Education
                      </div>
                      <div className="text-[8px] md:text-[9px] font-semibold text-gray-700">State University</div>
                      <div className="text-[7px] md:text-[8px] italic text-gray-600">B.A. Communications · 2025</div>
                    </div>
                  </div>
                </div>

                {/* Sparkle/Magic Icon */}
                <div className="absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/>
                  </svg>
                </div>

                {/* AI Badge */}
                <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] md:text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  AI-Optimized
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
