
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="From Bland to Grand: Transform Your Resume and Land Your Dream Job"
         description="Tips and Tricks to Spice Up Your Resume and Stand Out in the Job Market"
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Revamp Your Resume Like a Pro</h2>
       <p className="text-gray-700 custom_html">
         Your resume is your ticket to your dream job. Let&apos;s dive into some creative ways to transform your resume from bland to grand!
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Key Ingredients for a Stand-Out Resume</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>Quantify Your Achievements:</strong> Numbers speak louder than words. Use metrics to showcase your accomplishments.</li>
         <li className="custom_html"><strong>Showcase Your Skills:</strong> Highlight your unique skills and how they align with the job requirements.</li>
         <li className="custom_html"><strong>Tailor Your Resume:</strong> Customize your resume for each job application to make it relevant and impactful.</li>
         <li className="custom_html"><strong>Add a Personal Touch:</strong> Share a bit about your personality or interests to make your resume memorable.</li>
         <li className="custom_html"><strong>Use Power Words:</strong> Action verbs can make your resume more dynamic and engaging.</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">Crafting a Compelling Cover Letter</h2>
       <p className="text-gray-700 custom_html">
         Your cover letter is your chance to narrate your story beyond the resume. Make it compelling and tailored to the job you&apos;re applying for.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>Pro Tip:</strong> Use the cover letter to explain any career transitions or gaps in your resume.</p>
         <p><strong>Remember:</strong> Your cover letter should complement your resume, not repeat it.</p>
         <p><strong>Keep It Concise:</strong> Aim for a one-page cover letter that is impactful and to the point.</p>
         <p><strong>Show Your Enthusiasm:</strong> Let your passion for the role shine through in your cover letter.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Stand Out from the Crowd</h2>
       <p className="text-gray-700 custom_html">
         In a competitive job market, a well-crafted resume and cover letter can make all the difference. Put in the effort to make yours shine!
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p className="custom_html"><strong>Ready to Transform Your Resume?</strong> Visit <a href="https://www.resumai.services/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">ResumAI&apos;s Resume Generator</a> to create a standout resume today!</p>
         <p className="custom_html"><strong>Connect with Me:</strong> Reach out on <a href="https://www.linkedin.com/in/ian-vensel-%F0%9F%8F%81-a2047146" className="text-blue-700 hover:underline" title="Ian Vensel on LinkedIn">LinkedIn</a> for more career advice and tips.</p>
       </div>

     </section>
     <footer className="bg-gray-100 p-6 mt-8">
       <div className="flex items-center space-x-2">
         <div className="relative h-8 w-8 mr-4">
           <User className="w-8 h-8 text-gray-800" />
         </div>
         <div>
           <p className="text-lg font-medium text-gray-800">Ian Vensel</p>
           <p className="text-sm text-gray-600 font-small">Senior Business Development Manager</p>
           <p className="text-gray-600 pt-2">
             Ian has been providing transformative career advice for over a decade. Get in touch with him at <a href="https://empirestrategists.com" className="text-blue-700 hover:underline" title="Empire Strategists">Empire Strategists</a> and Let&apos;s elevate your business together!
           </p>
         </div>
       </div>
     </footer>
   </article>
 );
}

export default BlogDetailPage;
