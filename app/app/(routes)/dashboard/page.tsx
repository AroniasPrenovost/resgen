"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { tools } from "@/constants";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A0B14] text-[#F5F5F7] py-10">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-white">
          AI-assisted resumes
        </h2>
        <p className="text-[#9097A8] font-light text-sm md:text-lg text-center">
          Generate your next resume and CV with ease
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 flex items-center justify-between cursor-pointer bg-white/[0.03] border border-[#1C1E2E] text-white hover:border-[#A78BFA]/40 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#9097A8]" />
          </Card>
        ))}
      </div>
    </div>
  );
}
