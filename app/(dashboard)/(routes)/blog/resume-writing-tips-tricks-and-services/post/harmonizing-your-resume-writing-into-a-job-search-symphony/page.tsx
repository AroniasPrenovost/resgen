
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="Harmonizing Your Resume Writing into a Job Search Symphony"
         description="Tips and Tricks for Crafting an Optimized Resume"
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Crafting Your Resume: The Art of SEO</h2>
       <p className="text-gray-700 custom_html">
         Your resume is the melody that sings your professional story. Just like a well-orchestrated symphony, each section should harmonize to create a masterpiece that catches the eye of recruiters and hiring managers.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Key Notes to Hit in Your Resume</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>Keywords:</strong> Infuse relevant industry keywords to conduct a search engine optimization (SEO) serenade.</li>
         <li className="custom_html"><strong>Formatting:</strong> Ensure a clean, structured format for an easy read and navigation.</li>
         <li className="custom_html"><strong>Achievements:</strong> Highlight your accomplishments like a crescendo in a musical piece.</li>
         <li className="custom_html"><strong>Skills:</strong> Showcase your skills like a virtuoso flaunting their talents.</li>
         <li className="custom_html"><strong>Online Presence:</strong> Link your resume to your professional online profiles for a harmonious online presence.</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">Fine-Tuning Your Resume for Success</h2>
       <p className="text-gray-700 custom_html">
         Just like a musician fine-tunes their instrument, continuously refine and update your resume to stay in tune with the job market&apos;s demands.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>Tip:</strong> Use online tools to analyze and optimize your resume for SEO.</p>
         <p><strong>Remember:</strong> Your resume is your first impression, make it a lasting one!</p>
         <p><strong>Pro Tip:</strong> Tailor your resume for each job application to strike the right chord with recruiters.</p>
         <p><strong>Final Note:</strong> Keep your resume updated like a hit song on the charts!</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Compose Your Success Story</h2>
       <p className="text-gray-700 custom_html">
         Your resume is your symphony, each section playing a crucial role in the grand performance of your career. Craft it with care, attention to detail, and a touch of SEO magic to stand out in the job search orchestra.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p className="custom_html"><strong>Ready to create your resume masterpiece?</strong> Visit our <a href="https://www.resumai.services/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">Resume Generator</a> page now!</p>
       </div>

     </section>
     <footer className="bg-gray-100 p-6 mt-8">
       <div className="flex items-center space-x-2">
         <div className="relative h-8 w-8 mr-4">
           <User className="w-8 h-8 text-gray-800" />
         </div>
         <div>
           <p className="text-lg font-medium text-gray-800">Sarah Cole</p>
           <p className="text-sm text-gray-600 font-small">SEO Strategist and Content Creator</p>
           <p className="text-gray-600 pt-2">
             Helping you hit the right notes in your job search symphony.
           </p>
         </div>
       </div>
     </footer>
   </article>
 );
}

export default BlogDetailPage;
