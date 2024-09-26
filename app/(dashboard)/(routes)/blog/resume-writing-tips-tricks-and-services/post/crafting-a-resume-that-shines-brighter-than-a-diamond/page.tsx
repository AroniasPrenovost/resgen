
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="Crafting a Resume that Shines Brighter than a Diamond"
         description="Learn how to stand out like a diamond in the rough."
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
       <p className="text-gray-700 custom_html">
         Crafting a resume that shines brighter than a Detroit diamond is crucial in today&apos;s job market. Let&apos;s dive into some insider tips to help you craft the perfect resume that will have recruiters knocking down your door.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">1. Tailor Your Resume to the Job</h2>
       <p className="text-gray-700 custom_html">
         When applying for a job, make sure your resume is as tailored as a custom-made suit. Highlight the skills and experiences that align with the job description to catch the recruiter&apos;s eye.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">2. Quantify Your Achievements</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>Show Me the Numbers:</strong> Use quantifiable data to showcase your achievements. Numbers speak louder than words!</li>
         <li className="custom_html"><strong>Results Matter:</strong> Highlight the impact of your work by quantifying results. Employers love to see tangible outcomes.</li>
         <li className="custom_html"><strong>Metrics Rule:</strong> Whether it&apos;s sales numbers, project completion rates, or cost savings, quantify your accomplishments with metrics.</li>
         <li className="custom_html"><strong>Be Specific:</strong> Don&apos;t just say you improved processes; quantify it by stating you increased efficiency by 30%.</li>
         <li className="custom_html"><strong>Paint a Picture:</strong> Use numbers to paint a clear picture of your achievements and contributions.</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">3. Use Keywords Wisely</h2>
       <p className="text-gray-700 custom_html">
         In the digital age, many companies use Applicant Tracking Systems (ATS) to scan resumes. Make sure to include relevant keywords from the job description to increase your chances of getting noticed.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>Pro Tip:</strong> Tailoring your resume with keywords can help you beat the ATS and land an interview.</p>
         <p><strong>Remember:</strong> Keywords are the secret sauce to getting past the digital gatekeepers.</p>
         <p><strong>Don&apos;t Overdo It:</strong> Use keywords naturally throughout your resume to maintain readability.</p>
         <p><strong>Research:</strong> Study the job description and industry trends to identify the right keywords to include.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
       <p className="text-gray-700 custom_html">
         Crafting a standout resume is the first step towards landing your dream job. Follow these insider tips to create a resume that will make recruiters do a double-take. Ready to craft your perfect resume? Visit <a href="https://www.resumai.services/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">ResumAI&apos;s Resume Generator</a> now!
       </p>

       <footer className="bg-gray-100 p-6 mt-8">
         <div className="flex items-center space-x-2">
           <div className="relative h-8 w-8 mr-4">
             <User className="w-8 h-8 text-gray-800" />
           </div>
           <div>
           <p className="text-lg font-medium text-gray-800">Ian Vensel</p>
           <p className="text-sm text-gray-600 font-small">Senior Business Development Manager</p>
           <p className="text-gray-600 pt-2">
             Providing transformative career advice for over a decade. Get in touch with me at at <a href="https://empirestrategists.com" className="text-blue-700 hover:underline" title="Empire Strategists">Empire Strategists</a> and Let&apos;s elevate your business together!
           </p>
           </div>
         </div>
       </footer>
     </section>
   </article>
 );
}

export default BlogDetailPage;
