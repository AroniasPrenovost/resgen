import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="Unlocking Success: Mastering the Art of Resume Writing and Job Searching"
         description="Tips and Tricks for Crafting the Perfect Resume and Navigating the Job Market"
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Crafting Your Masterpiece: The Resume</h2>
       <p className="text-gray-700 custom_html">
         Your resume is your ticket to the big show, the key to unlocking the doors of opportunity in the job market jungle. It's not just a piece of paper; it's your personal marketing brochure, your chance to shine brighter than the Vegas strip at night.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Resume Writing Do's and Don'ts</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>Do:</strong> Tailor your resume to each job posting.</li>
         <li className="custom_html"><strong>Do:</strong> Use action verbs to showcase your achievements.</li>
         <li className="custom_html"><strong>Don't:</strong> Include irrelevant personal information like your favorite ice cream flavor.</li>
         <li className="custom_html"><strong>Don't:</strong> Use a font size that requires a magnifying glass to read.</li>
         <li className="custom_html"><strong>Do:</strong> Proofread, proofread, and then proofread again.</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">Navigating the Job Market Maze</h2>
       <p className="text-gray-700 custom_html">
         Searching for a job can feel like trying to find a hidden speakeasy in the heart of Sin City. But fear not, with the right strategy and a killer resume, you'll be sipping success in no time.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>Tip:</strong> Network like a high-roller at a VIP poker table.</p>
         <p><strong>Tip:</strong> Utilize online job boards and professional networking sites.</p>
         <p><strong>Tip:</strong> Don't be afraid to follow up on applications; persistence pays off.</p>
         <p><strong>Tip:</strong> Dress to impress for interviews; think James Bond, not Elvis impersonator.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">The Final Act: Landing Your Dream Job</h2>
       <p className="text-gray-700 custom_html">
         You've aced the interviews, dazzled with your resume, and now it's time to seal the deal. Negotiate like a pro, sign on the dotted line, and get ready to embark on the next chapter of your career journey.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p className="custom_html"><strong>Remember:</strong> You're not just looking for a job; you're searching for a career that lights your soul on fire.</p>
         <p className="custom_html"><strong>Remember:</strong> Stay true to yourself; authenticity is your secret weapon in the job market arena.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">In Conclusion</h2>
       <p className="text-gray-700 custom_html">
         Crafting a stellar resume and mastering the art of job searching is no easy feat, but with perseverance, a touch of Vegas luck, and a sprinkle of resume magic, you'll be well on your way to unlocking the doors of success.
       </p>
     </section>
     <footer className="bg-gray-100 p-6 mt-8">
       <div className="flex items-center space-x-2">
         <div className="relative h-8 w-8 mr-4">
           <User className="w-8 h-8 text-gray-800" />
         </div>
         <div>
           <p className="text-lg font-medium text-gray-800">Olivia Reed</p>
           <p className="text-sm text-gray-600 font-small">Resume Specialist and Blogger</p>
           <p className="text-gray-600 pt-2">
             Connect with Olivia on <span className="italic">LinkedIn</span> for more resume tips and job search advice.
           </p>
         </div>
       </div>
     </footer>
   </article>
 );
}

export default BlogDetailPage;
