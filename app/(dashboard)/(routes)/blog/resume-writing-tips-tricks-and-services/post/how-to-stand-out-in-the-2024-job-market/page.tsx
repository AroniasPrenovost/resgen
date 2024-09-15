
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="How to Stand Out in the 2024 Job Market"
         description="Discover the latest strategies to make your resume shine in the competitive 2024 job market."
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
       <p className="text-gray-700 custom_html">
         The job market in 2024 is more competitive than ever. With new graduates entering the workforce and seasoned professionals seeking new opportunities, standing out is crucial. Your resume is your first impression, and it needs to be impeccable. Here are expert tips to help you revamp your resume and make it shine.
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Tailor Your Resume for Each Job</h2>
       <p className="text-gray-700 custom_html">
         One size does not fit all when it comes to resumes. Tailoring your resume for each job application is essential. Highlight the skills and experiences that are most relevant to the job you are applying for. Use keywords from the job description to ensure your resume passes through Applicant Tracking Systems (ATS).
       </p>

       <h2 className="text-2xl font-bold text-gray-800">Showcase Your Achievements</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>Quantify Your Successes:</strong> Use numbers to demonstrate your achievements. For example, &quot;Increased sales by 20% in six months.&quot;</li>
         <li className="custom_html"><strong>Use Action Verbs:</strong> Start your bullet points with strong action verbs like &quot;led,&quot; &quot;developed,&quot; or &quot;implemented.&quot;</li>
         <li className="custom_html"><strong>Highlight Relevant Skills:</strong> Focus on skills that are directly related to the job you are applying for.</li>
         <li className="custom_html"><strong>Include Certifications:</strong> List any relevant certifications or courses you have completed.</li>
         <li className="custom_html"><strong>Showcase Soft Skills:</strong> Do not forget to mention soft skills like teamwork, communication, and problem-solving.</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">Optimize for ATS</h2>
       <p className="text-gray-700 custom_html">
         Many companies use Applicant Tracking Systems to filter resumes. To ensure your resume gets through, use a simple format with clear headings. Avoid using images or graphics that might confuse the system. Use standard fonts and avoid excessive formatting.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>Use Keywords:</strong> Incorporate keywords from the job description into your resume.</p>
         <p><strong>Keep It Simple:</strong> Use a clean, easy-to-read format.</p>
         <p><strong>Use Standard Fonts:</strong> Stick to fonts like Arial, Times New Roman, or Calibri.</p>
         <p><strong>Avoid Graphics:</strong> Do not use images or graphics that might confuse the ATS.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Keep It Concise</h2>
       <p className="text-gray-700 custom_html">
         Recruiters spend an average of six seconds reviewing a resume. Make sure yours is concise and to the point. Aim for one page if you are a new graduate or have less than ten years of experience. Use bullet points to make your resume easy to scan.
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p className="custom_html"><strong>One Page:</strong> Keep your resume to one page if possible.</p>
         <p className="custom_html"><strong>Use Bullet Points:</strong> Make your resume easy to scan with bullet points.</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
       <p className="text-gray-700 custom_html">
         Revamping your resume for the 2024 job market is essential to stand out among the competition. Tailor your resume for each job, showcase your achievements, optimize for ATS, and keep it concise. Ready to create a standout resume? Visit our <a href="https://www.resumai.services/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">ResumAI - Resume Generator</a> to get started.
       </p>
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
             With over eight years of experience in SEO and content creation, Sarah helps job seekers craft optimized resumes and build an online presence that stands out.
           </p>
         </div>
       </div>
     </footer>
   </article>
 );
}

export default BlogDetailPage;
