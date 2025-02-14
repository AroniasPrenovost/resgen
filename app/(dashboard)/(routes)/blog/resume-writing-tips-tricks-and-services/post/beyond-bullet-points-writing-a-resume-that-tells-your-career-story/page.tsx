
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="Beyond Bullet Points: Writing A Resume That Tells Your Career Story"
         description="Tips and Tricks for Writing a Resume That Stands Out"
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Unleash Your Career Narrative</h2>
       <p className="text-gray-700 custom_html">
         Writing a resume is not just about listing your experiences; it&apos;s about narrating your career story in a way that captivates recruiters.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Key Elements of a Compelling Resume</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>Show, Don&apos;t Tell:</strong> Use quantifiable achievements to showcase your impact.</li>
         <li className="custom_html"><strong>Customize for Each Role:</strong> Tailor your resume to highlight skills relevant to the job.</li>
         <li className="custom_html"><strong>Storytelling Format:</strong> Structure your resume like a story with a clear beginning, middle, and end.</li>
         <li className="custom_html"><strong>Keywords Matter:</strong> Include industry-specific keywords to pass through applicant tracking systems.</li>
         <li className="custom_html"><strong>Design Matters:</strong> Opt for a clean, professional layout that is easy to read.</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">Writing Your Career Journey</h2>
       <p className="text-gray-700 custom_html">
         Your resume is your ticket to the interview stage. Make sure it speaks volumes about your skills, experiences, and aspirations.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>Highlight Your Achievements:</strong> Showcase your accomplishments with numbers and results.</p>
         <p><strong>Be Authentic:</strong> Let your personality shine through in your resume to stand out from the crowd.</p>
         <p><strong>Proofread Thoroughly:</strong> Avoid typos and grammatical errors by proofreading multiple times.</p>
         <p><strong>Seek Feedback:</strong> Get a second opinion from a mentor or friend to ensure your resume is top-notch.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Ready to Craft Your Story?</h2>
       <p className="text-gray-700 custom_html">
         Your resume is more than just a document; it&apos;s your career narrative. Start crafting a compelling story today!
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p className="custom_html"><strong>Need Help Getting Started?</strong> Check out our <a href="https://www.resumai.services/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">Resume Generator</a> for expert guidance.</p>
         <p className="custom_html"><strong>Good luck on your job search journey!</strong> Remember, your story is unique, make sure your resume reflects that.</p>
       </div>
     </section>
     <footer className="bg-gray-100 p-6 mt-8">
       <div className="flex items-center space-x-2">
         <div className="relative h-8 w-8 mr-4">
           <User className="w-8 h-8 text-gray-800" />
         </div>
         <div>
           <p className="text-lg font-medium text-gray-800">Eli Lewis</p>
           <p className="text-sm text-gray-600 font-small">Sales Recruitment Specialist</p>
           <p className="text-gray-600 pt-2">
             Writing career stories one resume at a time.
           </p>
         </div>
       </div>
     </footer>
   </article>
 );
}

export default BlogDetailPage;
