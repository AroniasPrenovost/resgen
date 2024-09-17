
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="Insider Secrets To Stand Out In The Job Market"
         description="Tips and Tricks to Elevate Your Resume Game"
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Unleash Your Resume&apos;s Potential By Getting Personal</h2>
       <p className="text-gray-700 custom_html">
         Let&apos;s dive into some insider secrets to make your resume standout to hiring managers.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">So, what are the key elements of a standout resume</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>Quantify Your Achievements:</strong> Numbers speak louder than words. What % of sales did you bring to the table? What process did your app streamline, and how much $ did it save the company?</li>
         <li className="custom_html"><strong>Showcase Relevant Skills:</strong> Tailor your resume to the job you want. You want to be a developer, add details that demonstrate your development prowess.</li>
         <li className="custom_html"><strong>Use Action Words:</strong> Led, initiated, created, achieved, sold, collaborated, and executed.</li>
         <li className="custom_html"><strong>Keep It Concise:</strong> One page is plenty, brevity is key.</li>
         <li className="custom_html"><strong>Design Matters:</strong> This is a fine line to walk, because a visually appealing layout can make a big difference. But remember to KEEP IT SIMPLE!</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">Crafting a Compelling Summary</h2>
       <p className="text-gray-700 custom_html">
         Your resume summary is the first thing recruiters see. Make it count by highlighting <em>your</em> unique value proposition.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>Pro Tip:</strong> Tailor your summary to each job application for maximum impact.</p>
         <p><strong>Remember:</strong> Your summary should be a snapshot of your career highlights.</p>
         <p><strong>Be Bold:</strong> Don&apos;t be afraid to showcase your achievements and skills upfront.</p>
         <p><strong>Stay Honest:</strong> Authenticity is key, don&apos;t add anything you&apos;re unable to explain.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
       <p className="text-gray-700 custom_html">
         Face it - crafting a stellar resume is an art form. If you're ready to take it to the next level, get started now w/ our <a href="https://www.resumai.services/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">Resume Generator</a>!
       </p>
     </section>
     <footer className="bg-gray-100 p-6 mt-8">
       <div className="flex items-center space-x-2">
         <div className="relative h-8 w-8 mr-4">
           <User className="w-8 h-8 text-gray-800" />
         </div>
         <div>
           <p className="text-lg font-medium text-gray-800">Alec Bondahl</p>
           <p className="text-sm text-gray-600 font-small">Finance Recruiting Manager</p>
           <p className="text-gray-600 pt-2">
             Seattle, WA
           </p>
         </div>
       </div>
     </footer>
   </article>
 );
}

export default BlogDetailPage;
