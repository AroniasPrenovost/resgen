import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <article className="min-h-screen bg-gray-50">
      <header>
        <Heading
          title="Crafting Your Dream Job: Insider Tips for a Winning Resume"
          description="Unlock the secrets to creating a resume that stands out in today's competitive job market."
          icon={ClipboardList}
          iconColor="text-blue-700"
          bgColor="bg-gray-700/10"
        />
      </header>
      <section className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700 custom_html">
          In the bustling world of job hunting, your resume is your golden ticket. It is the first impression you make on potential employers, and it can make or break your chances of landing that dream job. As a senior hiring manager with over 15 years of experience, I have seen my fair share of resumes. Today, I am here to share some insider tips on how to craft a winning resume that will help you stand out from the crowd.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Know Your Audience</h2>
        <p className="text-gray-700 custom_html">
          Before you start writing your resume, it is crucial to understand who will be reading it. Tailor your resume to the specific job you are applying for. Research the company, understand their values, and align your resume to reflect those values. This shows that you have taken the time to understand the company and are genuinely interested in the position.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Highlight Your Achievements</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li className="custom_html"><strong>Quantify Your Successes:</strong> Use numbers to highlight your achievements. For example, "Increased sales by 20% in six months" is more impactful than "Responsible for increasing sales."</li>
          <li className="custom_html"><strong>Use Action Verbs:</strong> Start your bullet points with strong action verbs like "Led," "Developed," "Implemented," and "Achieved."</li>
          <li className="custom_html"><strong>Be Specific:</strong> Provide specific examples of your accomplishments. This gives potential employers a clear picture of what you can bring to the table.</li>
          <li className="custom_html"><strong>Showcase Relevant Skills:</strong> Highlight skills that are relevant to the job you are applying for. This can include technical skills, soft skills, and industry-specific skills.</li>
          <li className="custom_html"><strong>Keep It Concise:</strong> Your resume should be no longer than two pages. Be concise and focus on the most important information.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Format Matters</h2>
        <p className="text-gray-700 custom_html">
          The format of your resume is just as important as the content. A clean, well-organized resume is easier to read and makes a better impression. Use a professional font, keep the layout simple, and ensure there is plenty of white space. Avoid using too many colors or graphics, as this can be distracting.
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Tip:</strong> Use bullet points to break up large blocks of text. This makes your resume easier to scan and highlights key information.</p>
          <p><strong>Tip:</strong> Use consistent formatting throughout your resume. This includes font size, bullet points, and spacing.</p>
          <p><strong>Tip:</strong> Save your resume as a PDF to ensure the formatting remains consistent when viewed on different devices.</p>
          <p><strong>Tip:</strong> Include a professional email address and ensure your contact information is up to date.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Proofread, Proofread, Proofread</h2>
        <p className="text-gray-700 custom_html">
          Spelling and grammar mistakes can be a deal-breaker. Take the time to proofread your resume carefully. Consider asking a friend or family member to review it as well. A fresh pair of eyes can often catch mistakes you might have missed.
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p className="custom_html"><strong>Tip:</strong> Use online tools like Grammarly to help catch spelling and grammar errors.</p>
          <p className="custom_html"><strong>Tip:</strong> Read your resume out loud. This can help you catch awkward phrasing and ensure your resume flows smoothly.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700 custom_html">
          Crafting a winning resume takes time and effort, but it is worth it. By tailoring your resume to the job, highlighting your achievements, using a clean format, and proofreading carefully, you can create a resume that stands out from the crowd. Remember, your resume is your first impression, so make it count. Good luck on your job search!
        </p>
      </section>
      <footer className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Alice Zhu</p>
            <p className="text-sm text-gray-600 font-small">Senior Hiring Manager</p>
            <p className="text-gray-600 pt-2">
              With over 15 years of experience in the hiring industry, Alice Zhu is passionate about helping job seekers navigate the complex hiring process with confidence. She enjoys sharing practical advice and insider tips to help individuals craft resumes that stand out.
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default BlogDetailPage;
