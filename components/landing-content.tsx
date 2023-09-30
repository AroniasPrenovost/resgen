"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Bryce",
    avatar: "B",
    title: "Project Manager",
    description: "I recently re-entered the workforce and this tool saved me a lot of time. I'm pleased with how my resume turned out.",
  },
  {
    name: "Mary",
    avatar: "M",
    title: "Program Manager",
    description: "As someone who struggles writing resumes and overcoming writer's block, this tool was a game-changer to help me quit overthinking things and starting putting words on the page.",
  },
  {
    name: "Mitch",
    avatar: "M",
    title: "Project Manager",
    description: "The investment was worth it, and I've since gotten interviews (and an offer) using the template.",
  },
  {
    name: "Joel",
    avatar: "J",
    title: "Software Engineer",
    description: "The resume you gave me was simple and effective. Thanks again.",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">What customers are saying...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card key={item.description} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}