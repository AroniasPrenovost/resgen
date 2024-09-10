
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="Job Search Journeys: Navigating the Resume Writing Maze for Success"
         description="Tips and Tricks for Crafting an SEO-Optimized Resume"
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Crafting Your Resume: A Journey Worth Taking</h2>
       <p className="text-gray-700 custom_html">
         Your resume is your digital handshake, your virtual first impression. In the vast online jungle of job applications, a well-crafted resume can be your compass, guiding you through the maze of opportunities.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Top Tips for Resume Success</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>Keywords Are Key:</strong> Tailor your resume with relevant keywords from the job description.</li>
         <li className="custom_html"><strong>Quantify Your Achievements:</strong> Use numbers to showcase your accomplishments and impact.</li>
         <li className="custom_html"><strong>Keep It Concise:</strong> Stick to the essentials and make every word count.</li>
         <li className="custom_html"><strong>Show Your Personality:</strong> Let your unique voice shine through in your resume.</li>
         <li className="custom_html"><strong>Proofread, Then Proofread Again:</strong> Typos are the enemy of a polished resume.</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">Building Your Online Presence</h2>
       <p className="text-gray-700 custom_html">
         In today&apos;s digital age, your online presence is just as important as your resume. Create a professional LinkedIn profile, showcase your work on a personal website, and engage with industry influencers on social media.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>SEO for Job Seekers:</strong> Optimize your online profiles with relevant keywords to increase your visibility to recruiters.</p>
         <p><strong>Networking Matters:</strong> Connect with professionals in your field to expand your opportunities and gain valuable insights.</p>
         <p><strong>Stay Consistent:</strong> Ensure that your resume and online profiles align in terms of information and tone.</p>
         <p><strong>Be Authentic:</strong> Let your personality shine through in your online interactions.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Embrace the Journey</h2>
       <p className="text-gray-700 custom_html">
         Navigating the resume writing maze can be daunting, but with the right tools and mindset, you can turn it into an exciting adventure. Embrace the process, learn from each application, and keep refining your approach. Your dream job is out there waiting for you!
       </p>

       <footer className="bg-gray-100 p-6 mt-8">
         <div className="flex items-center space-x-2">
           <div className="relative h-8 w-8 mr-4">
             <User className="w-8 h-8 text-gray-800" />
           </div>
           <div>
             <p className="text-lg font-medium text-gray-800">Sarah Cole</p>
             <p className="text-sm text-gray-600 font-small">SEO Strategist and Content Creator</p>
             <p className="text-gray-600 pt-2">
               Crafting engaging content and optimizing it for search engines for over 8 years. Let&apos;s connect on LinkedIn for more career tips!
             </p>
           </div>
         </div>
       </footer>
     </section>
   </article>
 );
}

export default BlogDetailPage;
