"use client";


import Link from "next/link";
import Image from "next/image";
import { Montserrat } from 'next/font/google'
import { Code, ImageIcon, LayoutDashboard, FileText, Music, Settings, VideoIcon, PenLine, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { Tooltip } from '@nextui-org/react';

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
    icon: FileText,
    href: '/resume-generator',
    color: "text-violet-500",
  },
    {
    label: 'Blog',
    icon: BookOpen,
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
    <div className="space-y-4 py-6 flex flex-col h-full bg-[#111827] text-white" style={{ width: '80px' }}>
      <div className="px-2 py-2 flex-1 flex flex-col items-center">
        {/* Logo - Icon Only */}
        <Link href="/" className="flex items-center justify-center mb-8">
          <Tooltip
            content="ResumAI Home"
            placement="right"
            classNames={{
              content: "bg-violet-600 text-white font-semibold"
            }}
          >
            <div className="relative h-10 w-10">
              <Image fill
                sizes="40px"
                alt="ResumAI Logo"
                src="/transcript.png"
              />
            </div>
          </Tooltip>
        </Link>

        {/* Navigation Icons */}
        <div className="space-y-3 flex flex-col items-center w-full">
          {routes.map((route) => (
            <Tooltip
              key={route.href}
              content={route.label}
              placement="right"
              classNames={{
                content: "bg-violet-600 text-white font-semibold"
              }}
            >
              <Link
                href={route.href}
                className={cn(
                  "flex p-3 w-full justify-center font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  pathname === route.href
                  ?
                  "text-white bg-white/10"
                  :
                  "text-zinc-200",
                )}
              >
                <route.icon className={cn("h-6 w-6", route.color)} />
              </Link>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};
