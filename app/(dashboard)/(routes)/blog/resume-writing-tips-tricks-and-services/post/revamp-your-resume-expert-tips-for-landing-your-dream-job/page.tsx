import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="Revamp Your Resume: Expert Tips for Landing Your Dream Job"
         description="Unlock the Secrets to Crafting a Winning Resume"
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Stand Out from the Crowd</h2>
       <p className="text-gray-700 custom_html">
         Your resume is your ticket to the big leagues, your golden key to unlock the doors of opportunity. It&apos;s not just a piece of paper; it&apos;s your personal marketing brochure. So, let&apos;s jazz it up and make it shine like a diamond in a sea of coal.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Top Tips for Resume Success</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>Keywords Are King:</strong> Tailor your resume with industry-specific keywords to pass through the digital gatekeepers.</li>
         <li className="custom_html"><strong>Quantify Your Achievements:</strong> Numbers speak louder than words. Show off your accomplishments with quantifiable results.</li>
         <li className="custom_html"><strong>Format with Flair:</strong> Keep it clean, concise, and visually appealing. A cluttered resume is like a messy desk - no one wants to deal with it.</li>
         <li className="custom_html"><strong>Highlight Your Skills:</strong> Showcase your unique skills and strengths. Let your potential employer know what makes you the MVP of the team.</li>
         <li className="custom_html"><strong>Proofread, Proofread, Proofread:</strong> Typos are the enemy of a good resume. Don&apos;t let a simple mistake cost you your dream job.</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">Crafting a Killer Cover Letter</h2>
       <p className="text-gray-700 custom_html">
         Your cover letter is your chance to shine even brighter. Use it to tell your story, connect the dots between your experience and the job requirements, and show your passion for the role.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>Personalize It:</strong> Address the hiring manager by name. Show them you&apos;ve done your homework and you&apos;re serious about this opportunity.</p>
         <p><strong>Show Your Personality:</strong> Let your personality shine through. Don&apos;t be afraid to inject a bit of your authentic self into your cover letter.</p>
         <p><strong>Call to Action:</strong> End with a strong call to action. Let them know you&apos;re ready to take on the challenge and make a difference in their organization.</p>
         <p><strong>Customize, Customize, Customize:</strong> Tailor each cover letter to the specific job you&apos;re applying for. One size does not fit all in the world of cover letters.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Final Thoughts</h2>
       <p className="text-gray-700 custom_html">
         Your resume and cover letter are your first impression on a potential employer. Make it count. Put in the effort, show your value, and let your personality shine through. With these expert tips, you&apos;re one step closer to landing your dream job.
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
             Crafting compelling resumes and landing dream jobs for over a decade. Let&apos;s make your career dreams a reality!
           </p>
         </div>
       </div>
     </footer>
   </article>
 );
}

export default BlogDetailPage;
