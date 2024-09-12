
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="Crack the Code: Elevate Your Job Search with Expert Resume Writing Strategies"
         description="Unlock the Secrets to Crafting a Standout Resume and Boosting Your Online Presence"
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Crafting a Winning Resume</h2>
       <p className="text-gray-700 custom_html">
         Your resume is your ticket to the job of your dreams. To stand out in the digital crowd, sprinkle relevant keywords throughout your resume like fairy dust. Tailor each resume to the job description, showcasing your skills and experience in a way that screams, "I&apos;m the one you&apos;re looking for!"
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Optimizing Your Online Presence</h2>
       <p className="text-gray-700 custom_html">
         In today&apos;s digital age, your online presence matters. Employers often Google candidates before making hiring decisions. Ensure your LinkedIn profile shines like a diamond in the rough. Use industry-specific keywords, share relevant content, and engage with professionals in your field.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Expert Resume Writing Strategies</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>Keyword Optimization:</strong> Tailor your resume with industry-specific keywords.</li>
         <li className="custom_html"><strong>Quantify Achievements:</strong> Use numbers to showcase your accomplishments.</li>
         <li className="custom_html"><strong>Professional Formatting:</strong> Keep it clean, concise, and easy to read.</li>
         <li className="custom_html"><strong>Showcase Skills:</strong> Highlight your unique skills and experiences.</li>
         <li className="custom_html"><strong>Proofread, Proofread, Proofread:</strong> Typos are the enemy; eliminate them with a fine-tooth comb.</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">Building Your Brand Online</h2>
       <p className="text-gray-700 custom_html">
         Your personal brand is your digital fingerprint. Create a professional website or blog to showcase your expertise. Share your insights, projects, and achievements to establish yourself as a thought leader in your industry.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>Stand Out Tip:</strong> Create a portfolio showcasing your work samples and projects.</p>
         <p><strong>Remember:</strong> Consistency is key; maintain a cohesive brand across all your online platforms.</p>
         <p><strong>Network:</strong> Connect with professionals in your field to expand your opportunities.</p>
         <p><strong>Stay Updated:</strong> Keep abreast of industry trends and update your online profiles regularly.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">In Conclusion</h2>
       <p className="text-gray-700 custom_html">
         By mastering the art of resume writing and enhancing your online presence, you can unlock doors to exciting career opportunities. Remember, your resume is not just a piece of paper; it&apos;s your personal marketing tool. Craft it with care, and watch your job search soar to new heights!
       </p>
     </section>
     <footer className="bg-gray-100 p-6 mt-8">
       <div className="flex items-center space-x-2">
         <div className="relative h-8 w-8 mr-4">
           <User className="w-8 h-8 text-gray-800" />
         </div>
         <div>
           <p className="text-lg font-medium text-gray-800">Sarah Cole</p>
           <p className="text-sm text-gray-600 font-small">SEO Strategist & Content Creator</p>
           <p className="text-gray-600 pt-2">
             Connect with me on LinkedIn for more career tips and insights.
           </p>
         </div>
       </div>
     </footer>
   </article>
 );
}

export default BlogDetailPage;
