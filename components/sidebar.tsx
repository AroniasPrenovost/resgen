"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from 'next/font/google'
import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { FreeCounter } from "@/components/free-counter";

const poppins = Montserrat({ weight: '600', subsets: ['latin'] });

const routes = [
  // {
  //   label: 'Dashboard',
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
  // {
  //   label: 'Settings',
  //   icon: Settings,
  //   href: '/settings',
  // },
];

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false
}: {
  apiLimitCount: number;
  isPro: boolean;
}) => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/transcript.png" />
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
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}

           <div className="space-y-1" style={{paddingTop: '24px', padding: '8px', fontSize: '14px'}}>
              <b style={{fontSize: '18px', marginBottom: '20px !important', marginTop: '20px'}}>How It Works:</b><br/>
              <ol>
                <li><b>1. </b>One-time payment of <s>$9.99</s>$4.99 gets you 30 days of access.</li>
                <br/>
                <li><b>2. </b>Enter your work experience and other relevant information.</li>
                <br/>
                <li><b>3. </b>Our AI assistant generates your new resume.</li>
                <br/>
                <li><b>4. </b>Generate multiple variations until you are satisfied.</li>
                <br/>
                <li><b>5. </b><em>Optional:</em> If you do not own Microsoft Word, upload the downloaded files to <Link className={cn(
                  "hover:text-white transition",
                   "text-zinc-400",
                )} target="_blank" rel="noopener noreferrer" href="https://drive.google.com/drive/home">Google Drive</Link>. 
                {/*to access and modify formatting*/}


                <div className="relative ml-0 mt-5">
                  <Link className={cn(
                  "hover:text-white transition",
                  "text-zinc-400",
                  )} title="Sample Resume" target="_blank" href="/example_resume.png">View Sample Resume</Link> 
                </div>


                 <div className="relative h-60 w-60 ml-0 mt-2">
                  <Link className={cn(
                    "hover:text-white transition",
                    "text-zinc-400",
                    )} title="Example Resume" target="_blank" href="/example_resume.png">
                     <Image fill alt="Sample Resume" src="/example_resume.png" />
                   </Link> 
                 </div>


                </li>
              </ol>
          </div>
        </div>
      </div>
      <FreeCounter
        apiLimitCount={apiLimitCount}
        isPro={isPro}
      />
    </div>
  );
};
