
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <article className="min-h-screen bg-gray-50">
      <header>
        <Heading
          title="Unleash Your Career Potential: Expert Resume Writing Strategies for Job Seekers"
          description="Master the art of resume writing with these expert strategies tailored for job seekers, new grads, and professionals."
          icon={ClipboardList}
          iconColor="text-blue-700"
          bgColor="bg-gray-700/10"
        />
      </header>
      <section className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700 custom_html">
          In the competitive world of job searching, your resume is your golden ticket. Whether you are a new graduate, a seasoned professional, or someone looking to pivot careers, crafting a standout resume is crucial. This blog post will guide you through expert resume writing strategies to help you unleash your career potential.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Understanding the Basics</h2>
        <p className="text-gray-700 custom_html">
          Before diving into advanced techniques, it is essential to understand the basics of resume writing. A resume should be clear, concise, and tailored to the job you are applying for. Here are some fundamental tips:
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Key Elements of a Strong Resume</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li className="custom_html"><strong>Contact Information:</strong> Ensure your name, phone number, and email address are prominently displayed.</li>
          <li className="custom_html"><strong>Professional Summary:</strong> A brief statement that highlights your skills, experience, and career goals.</li>
          <li className="custom_html"><strong>Work Experience:</strong> List your previous jobs in reverse chronological order, focusing on achievements and responsibilities.</li>
          <li className="custom_html"><strong>Education:</strong> Include your degrees, certifications, and relevant coursework.</li>
          <li className="custom_html"><strong>Skills:</strong> Highlight both technical and soft skills that are relevant to the job.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Advanced Resume Writing Strategies</h2>
        <p className="text-gray-700 custom_html">
          Now that you have the basics down, let us explore some advanced strategies to make your resume stand out:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Use Action Verbs:</strong> Start each bullet point with a strong action verb to convey your accomplishments effectively.</p>
          <p><strong>Quantify Achievements:</strong> Whenever possible, use numbers to quantify your achievements (e.g., &apos;Increased sales by 20%&apos;).</p>
          <p><strong>Tailor Your Resume:</strong> Customize your resume for each job application by highlighting relevant experience and skills.</p>
          <p><strong>Include Keywords:</strong> Incorporate keywords from the job description to pass through Applicant Tracking Systems (ATS).</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Common Mistakes to Avoid</h2>
        <p className="text-gray-700 custom_html">
          Even the most experienced professionals can make mistakes on their resumes. Here are some common pitfalls to avoid:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p className="custom_html"><strong>Typos and Grammatical Errors:</strong> Proofread your resume multiple times to ensure it is error-free.</p>
          <p className="custom_html"><strong>Using a Generic Template:</strong> Avoid using a one-size-fits-all template. Personalize your resume to reflect your unique qualifications.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700 custom_html">
          Crafting a compelling resume is an art that requires attention to detail and a strategic approach. By following these expert strategies, you can create a resume that not only showcases your skills and experience but also captures the attention of hiring managers. Ready to take your resume to the next level? Visit our <a href="https://www.resumai.services/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">ResumAI - Resume Generator</a> to get started.
        </p>
      </section>
      <footer className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Alicia Graham</p>
            <p className="text-sm text-gray-600 font-small">Tech Recruiter</p>
            <p className="text-gray-600 pt-2">
              With over a decade of experience in tech recruitment, Alicia Graham is passionate about helping job seekers navigate the ever-evolving job market. She specializes in resume writing, interview preparation, and career coaching.
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default BlogDetailPage;
