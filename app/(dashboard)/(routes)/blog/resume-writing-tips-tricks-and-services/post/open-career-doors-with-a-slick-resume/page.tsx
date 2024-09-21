
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="Open Career Doors with a Slick Resume"
         description="Master the art of resume writing with these expert tips and open the door to your dream job."
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">The Power of a Polished Resume</h2>
       <p className="text-gray-700 custom_html">
         In the bustling job market, your resume is your golden ticket. It is the first impression you make on potential employers, and it needs to be impeccable. Whether you are a new grad, a seasoned professional, or someone looking to switch careers, a well-crafted resume can open doors you never thought possible.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Crafting a Compelling Summary</h2>
       <p className="text-gray-700 custom_html">
         Your resume summary is your elevator pitch. It should be concise, engaging, and tailored to the job you are applying for. Highlight your key achievements, skills, and what makes you a perfect fit for the role. Remember, this is your chance to grab the recruiter’s attention right from the start.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Highlighting Your Unique Skillset - And Don&ldquo;t Be Shy About It!</h2>
       <p className="text-gray-700 custom_html">
         Your skills section should be a snapshot of your abilities. Include both hard skills (technical abilities) and soft skills (interpersonal abilities). Make sure to align your skills with the job requirements. This section is crucial for passing through ATS and catching the eye of hiring managers.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>Hard Skills:</strong> Examples include programming languages, software proficiency, and technical certifications.</p>
         <p><strong>Soft Skills:</strong> Examples include communication, teamwork, and problem-solving abilities.</p>
         <p><strong>Industry-Specific Skills:</strong> Tailor this section to the industry you are targeting. For instance, marketing skills for a marketing role.</p>
         <p><strong>Transferable Skills:</strong> Skills that are valuable across various roles, such as project management, leadership, or people skills.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Education and Certifications</h2>
       <p className="text-gray-700 custom_html">
         Your education section should include your degrees, certifications, and any relevant coursework. If you are a recent graduate, place this section near the top of your resume, but not before any relevant coursework or projets applicable to the job you are applying to.
       </p>
       <p className="text-gray-700 custom_html">
          For experienced professionals, it can be placed towards the bottom. Do not forget to include any honors or awards.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p className="custom_html"><strong>Degrees:</strong> List your degrees in reverse chronological order (most recent first).</p>
         <p className="custom_html"><strong>Certifications:</strong> Include any certifications relevant to the job you are applying for.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Final Touches</h2>
       <p className="text-gray-700 custom_html">
         Before you hit send, you want to make sure to proofread your resume. Check for typos, grammatical errors, and ensure the formatting is consistent. Using a tool like ResumAI helps alleviate these concerns.
       </p>
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
             Ready to take your resume to the next level? Visit our <a href="https://www.resumai.services/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">Resume Generator</a> and create a standout resume today!
           </p>
         </div>
       </div>
     </footer>
   </article>
 );
}

export default BlogDetailPage;
