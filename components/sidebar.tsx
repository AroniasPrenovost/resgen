"use client";


import Link from "next/link";
import Image from "next/image";
import { Montserrat } from 'next/font/google'
import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon, PenLine, RssIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
// import { FreeCounter } from "@/components/free-counter";

const poppins = Montserrat({ weight: '600', subsets: ['latin'] });

const routes = [
  // {
  //   label: 'Home',
  //   icon: LayoutDashboard,
  //   href: '/dashboard',
  //   color: "text-sky-500"
  // },
  {
    label: 'Resume Generator',
    icon: MessageSquare,
    href: '/resume-generator',
    color: "text-violet-500",
  },
    {
    label: 'Blog',
    icon: RssIcon,
    href: '/blog',
  },
  // {
  //   label: 'Settings',
  //   icon: Settings,
  //   href: '/settings',
  // },
];

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false,
}: {
  apiLimitCount: number;
  isPro: boolean;
}) => {
  const pathname = usePathname();
  const isResumeGeneratorPage = pathname === '/resume-generator';

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-6">
          <div className="relative h-8 w-8 mr-4">
            <Image fill
            sizes="(max-width: 768px) 100vw, 33vw"
            alt="ResumAI Logo"
            src="/transcript.png"
            />
          </div>
          <h1 className={cn("text-2xl font-bold", poppins.className)}>
            ResumAI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                ?
                "text-white bg-white/10"
                :
                "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}

           <div className="space-y-1" style={{paddingTop: '24px', padding: '8px', fontSize: '14px'}}>
              <b style={{fontSize: '18px', marginBottom: '20px !important', marginTop: '20px'}}>How Does It Work?</b><br/>
              <ol>
         {/*       <li><b>1. </b><b style={{color:"orange"}}>$3.99</b> gets you access for 30 days.</li>
                  <br/>*/}
                <li><b style={{color: 'orange', fontSize: '15px'}}>1. </b>Copy + paste a job description so ResumAI can tailor the resume to match (optional).</li>
                <br/>
                <li><b style={{color: 'orange', fontSize: '15px'}}>2. </b>Upload your current resume (or manually enter any relevant data).</li>
                <br/>
                <li><b style={{color: 'orange', fontSize: '15px'}}>3. </b>ResumAI assistant analyzes and improves the resume content.</li>
                <br/>
                <li><b style={{color: 'orange', fontSize: '15px'}}>4. </b>When you generate the new resume template, the AI assistant performs one last round of revision.</li>
                <br/>

                <li> A single payment of <b style={{ color: "orange"}}>$9.99</b> gets you <b>30</b> days of access to unlimited downloads and live support.</li>

                <br/>
                <li>
                  <em>Pro tip:</em> If you do not have Microsoft Word, you can upload your new resume template to <Link className={cn(
                    "hover:text-white transition",
                     "text-zinc-400",
                  )} target="_blank" rel="noopener noreferrer" href="https://drive.google.com/drive/home">Google Drive</Link>.
                  {/*to access and modify formatting*/}

        {/*
                  <div style={{
                     display: !isResumeGeneratorPage ? 'none' : 'block',
                   }}>
                    <div className="relative ml-0 mt-5">
                      <Link className={cn(
                      "hover:text-white transition",
                      "text-zinc-400",
                    )} title="Sample Resume" target="_blank" href="/example_resume.png">View a sample resume</Link>
                    </div>


                     <div className="relative h-60 w-60 ml-0 mt-2">
                      <Link className={cn(
                        "hover:text-white transition",
                        "text-zinc-400",
                        )} title="Example Resume" target="_blank" href="/example_resume.png">
                         <Image fill alt="Sample Resume" src="/example_resume.png" />
                       </Link>
                     </div>
                  </div>

          */}

                  <br/>
                  <br/>

                    <b>
                      <Link style={{
                         display: isResumeGeneratorPage ? 'none' : 'block',
                         }} className={cn("text-orange-400 hover:underline",
                        )} href="/resume-generator">Get Started!
                     </Link>
                   </b>
                </li>
              </ol>
          </div>
        </div>
      </div>
        {/*
      <FreeCounter
        apiLimitCount={apiLimitCount}
        isPro={isPro}
      />
        */}
    </div>
  );
};
