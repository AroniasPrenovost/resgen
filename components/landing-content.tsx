"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Bryce P.",
    avatar: "B",
    title: "Project Manager",
    description: "Hadn't updated my resume in years. This took about 10 minutes and I had something professional I could actually send out. Beats staring at a blank doc.",
    location: 'Seattle, WA',
    rating: 5,
  },
  {
    name: "Mary",
    avatar: "M",
    title: "Student",
    description: "I was skeptical, but needed to apply to internships fast. The bullet points it generated were actually better than what I was writing myself.",
    location: 'Grand Rapids, MI',
    rating: 5,
  },
  {
    name: "Marcus T.",
    avatar: "M",
    title: "Customer Success Manager",
    description: "Got 3 interviews within 2 weeks. Worth the $10 just to avoid spending hours fighting with Word formatting.",
    location: 'Phoenix, AZ',
    rating: 5,
  },
  {
    name: "Sarah K.",
    avatar: "S",
    title: "Software Engineer",
    description: "Simple, clean design that actually made it through the ATS screening. Didn't feel like just another template.",
    location: 'Texas',
    rating: 5,
  },
];


const year = new Date().getFullYear();

export const LandingContent = () => {
  return (
    <div className="px-6 md:px-10 pb-20 pt-2">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl text-white font-extrabold mb-4">Real results from real job seekers</h2>
        <p className="text-center text-zinc-400 text-sm md:text-base mb-12 max-w-2xl mx-auto">
          Join professionals using ResumAI to land their next role
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
                  {[...Array(item.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
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
      </div>
    </div>
  )
}
