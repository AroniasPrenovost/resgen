import { ClipboardList, Edit3 } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="The Art of Crafting a Standout Resume Title"
        description="Uncover the secrets to creating a resume title that grabs attention and sets you apart from the competition."
        icon={ClipboardList}
        iconColor="text-green-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          The resume title is often overlooked, but it can wield the power to captivate hiring managers instantly. In this blog post, we will explore how to craft a resume title that speaks volumes about your professional prowess and compels recruiters to delve deeper into your narrative.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Why the Resume Title Matters</h2>
        <p className="text-gray-700">
          Picture your resume title as the headline of an enticing news article. Just as a gripping headline urges readers to consume the entire story, a powerful resume title hooks hiring managers, urging them to read the details of your career journey. 
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Tips for Crafting an Engaging Resume Title</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Be Specific:</strong> Ensure your title clearly reflects your professional identity and core strengths. Avoid vague or generic labels.</li>
          <li><strong>Incorporate Keywords:</strong> Integrate keywords related to the job description to make it ATS-friendly and relevant.</li>
          <li><strong>Highlight Achievements:</strong> Use strong action words and specify your key accomplishments or unique skills.</li>
          <li><strong>Keep it Concise:</strong> Limit your title to a compact, impactful phrase that delivers your value proposition succinctly.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Examples of Impactful Resume Titles</h2>
        <p className="text-gray-700">
          To ignite your inspiration, here are a few examples of resume titles that strike the perfect balance between clarity and magnetism:
        </p>

        <div className="border-l-4 border-green-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Example 1:</strong> Data Analytics Specialist with Expertise in Predictive Modeling</p>
          <p><strong>Example 2:</strong> Award-Winning Graphic Designer with a Flair for Modern Aesthetics</p>
          <p><strong>Example 3:</strong> Certified Financial Planner with Proven Track Record in Wealth Management</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          Your resume title is more than mere words—it is a strategic hook that can pique interest and set the tone for your entire job application. By being specific, using keywords, highlighting achievements, and maintaining conciseness, you can craft a captivating resume title that stands out in any crowded job market. With these tips in hand, you are now ready to create a headline that truly shines.
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <Edit3 className="w-8 h-8 text-gray-800" />
          </div>  
          <div>
            <p className="text-lg font-medium text-gray-800">Fawn Freeman</p>
            <p className="text-sm text-gray-600 font-small">Job Recruiter & Resume Writing Expert</p>
            <p className="text-gray-600 pt-2">With years of professional experience in the recruiting industry, Fawn Freeman is dedicated to providing job seekers with the tools they need to craft compelling resumes that stand out to hiring managers and beat the Applicant Tracking Systems.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;