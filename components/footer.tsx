import { Icon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface FooterProps {
  title: any;
  // description: string;
  // icon: Icon;
  // iconColor?: string;
  // bgColor?: string;
}

export const Footer = ({
  title,
  // description,
  // icon: Icon,
  // iconColor,
  // bgColor,
}: FooterProps) => {
  return (
    <>
      <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8">
 {/*       <div className={cn("p-2 w-fit rounded-md", bgColor)}>
          <Icon className={cn("w-10 h-10", iconColor)} />
        </div>*/}
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {/*{description} <b style={{color:"rgba(111, 90, 246, 0.97)"}}></b>*/}
          

          


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


 
</p>

          

          
        </div>
      </div>
    </>
  );
};
