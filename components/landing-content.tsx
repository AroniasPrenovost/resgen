"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Bryce M.",
    avatar: "B",
    title: "Project Manager",
    description: "I recently re-entered the workforce and this tool saved me a lot of time. I'm pleased with how my resume turned out.",
    location: 'Seattle, WA',
  },
  {
    name: "Mary",
    avatar: "M",
    title: "Student",
    description: "As someone who struggles writing resumes and overcoming writer's block, this tool was a game-changer to help me quit overthinking things and starting putting words on the page.",
    location: 'Grand Rapids, MI',
  },
  {
    name: "Paul W.",
    avatar: "P",
    title: "Customer Success Manager",
    description: "The investment was worth it, and I've since gotten interviews (and an offer) using the template.",
    location: 'Phoenix, AZ',
  },
  {
    name: "Joyce K.",
    avatar: "J",
    title: "Software Engineer",
    description: "The resume I got was simple and effective. Thanks again.",
    location: 'Texas',
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20" style={{marginTop: '-94px'}}>
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">See what users are saying...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card key={item.description} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                    <p className="text-zinc-400 text-xs"><i>{item.location}</i></p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>


           <p className="text-sm text-muted-foreground">
            {/*{description} <b style={{color:"rgba(111, 90, 246, 0.97)"}}></b>*/}
          
                <span>




                      <b>
                        <Link style={{
                           display: 'block',
                           }} className={cn("text-blue-400 hover:underline",
                          )} href="/">Home
                       </Link>
                     </b>

                     <b>
                        <Link style={{
                           display: 'block',
                           }} className={cn("text-blue-400 hover:underline",
                          )} href="/resume-generator">Resume Generator
                       </Link>
                     </b>

                                       <b>
                        <Link style={{
                           display: 'block',
                           }} className={cn("text-blue-400 hover:underline",
                          )} href="/blog">Blog
                       </Link>
                     </b>

               </span>
   
          </p>



    </div>
  )
}