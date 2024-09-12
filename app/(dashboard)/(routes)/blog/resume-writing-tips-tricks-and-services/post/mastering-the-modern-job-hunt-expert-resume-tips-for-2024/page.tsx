
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <article className="min-h-screen bg-gray-50">
      <header>
        <Heading
          title="Mastering the Modern Job Hunt: Expert Resume Tips for 2024"
          description="Unlock the secrets to crafting a standout resume and navigating the job market with confidence."
          icon={ClipboardList}
          iconColor="text-blue-700"
          bgColor="bg-gray-700/10"
        />
      </header>
      <section className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700 custom_html">
          Welcome to the modern job hunt, where the rules have changed, and the competition is fiercer than ever. Whether you are a new grad, a seasoned professional, or someone looking to make a career pivot, your resume is your ticket to getting noticed. In this blog post, we will dive into expert resume tips for 2024 that will help you stand out in the crowded job market.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Understanding the Modern Resume</h2>
        <p className="text-gray-700 custom_html">
          The modern resume is more than just a list of your past jobs. It is a strategic document that showcases your skills, achievements, and potential. Here are some key elements to consider:
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Key Elements of a Standout Resume</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li className="custom_html"><strong>Contact Information:</strong> Ensure your contact details are up-to-date and professional. Include your LinkedIn profile if it is polished.</li>
          <li className="custom_html"><strong>Professional Summary:</strong> Craft a compelling summary that highlights your unique value proposition. This is your elevator pitch.</li>
          <li className="custom_html"><strong>Skills:</strong> List relevant skills that match the job description. Use keywords that are commonly found in job postings.</li>
          <li className="custom_html"><strong>Experience:</strong> Focus on achievements rather than duties. Use quantifiable metrics to demonstrate your impact.</li>
          <li className="custom_html"><strong>Education:</strong> Include your educational background, but do not let it overshadow your professional experience.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Tailoring Your Resume for Each Job</h2>
        <p className="text-gray-700 custom_html">
          One size does not fit all when it comes to resumes. Tailoring your resume for each job application is crucial. Here is how you can do it:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Research the Company:</strong> Understand the company culture, values, and the specific role you are applying for.</p>
          <p><strong>Use Keywords:</strong> Incorporate keywords from the job description into your resume. This helps with Applicant Tracking Systems (ATS).</p>
          <p><strong>Highlight Relevant Experience:</strong> Emphasize experience and skills that are most relevant to the job you are applying for.</          <p><strong>Customize Your Professional Summary:</strong> Tailor your summary to align with the job requirements and the company’s mission.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Common Resume Mistakes to Avoid</h2>
        <p className="text-gray-700 custom_html">
          Even the best candidates can make mistakes on their resumes. Here are some common pitfalls to watch out for:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p className="custom_html"><strong>Typos and Grammar Errors:</strong> Proofread your resume multiple times. Consider using a tool like Grammarly.</p>
          <p className="custom_html"><strong>Overloading with Information:</strong> Keep it concise. Focus on quality over quantity.</p>
          <p className="custom_html"><strong>Using a Generic Template:</strong> Customize your resume to reflect your personal brand and the job you are applying for.</p>
          <p className="custom_html"><strong>Ignoring ATS:</strong> Many companies use ATS to screen resumes. Make sure your resume is ATS-friendly by using relevant keywords and a clean format.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700 custom_html">
          Mastering the modern job hunt requires a strategic approach to resume writing. By understanding the key elements of a standout resume, tailoring it for each job, and avoiding common mistakes, you can increase your chances of landing your dream job. Remember, your resume is your first impression, so make it count.
        </p>
      </section>
      <footer className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Gregory Shaw</p>
            <p className="text-sm text-gray-600 font-small">Corporate Recruiter</p>
            <p className="text-gray-600 pt-2">
              With 15 years in corporate recruitment, Gregory Shaw reveals what large companies are truly looking for, offering strategic advice on interviews, company culture, and long-term career planning.
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default BlogDetailPage;
