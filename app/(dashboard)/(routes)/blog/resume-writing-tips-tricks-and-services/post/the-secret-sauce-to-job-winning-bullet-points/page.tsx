
import { ClipboardList, Edit3 } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="The Secret Sauce to Job-Winning Bullet Points"
        description="Transforming mundane duties into standout achievements to elevate your resume above the competition."
        icon={ClipboardList}
        iconColor="text-blue-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          You may have crafted a stellar resume header and composed a compelling personal statement, but what about those bullet points? In this blog post, we dive into how to craft dynamic bullet points that will capture a hiring manager"s attention and turn mundane responsibilities into impressive achievements.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Why Bullet Points Matter</h2>
        <p className="text-gray-700">
          Bullet points are the backbone of your resume. They highlight your specific accomplishments and skills in a digestible format, allowing hiring managers to quickly understand your value. Effective bullet points can create a powerful narrative about your professional experience and distinguish you from other applicants.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Tips for Crafting Effective Bullet Points</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Action Verbs:</strong> Start each bullet point with a robust action verb to make your responsibilities and achievements come to life.</li>
          <li><strong>Quantify Achievements:</strong> Use numbers and metrics to provide concrete evidence of your impact. For instance, "increased sales by 20%" carries more weight than "responsible for sales."</li>
          <li><strong>Be Specific:</strong> Focus on your unique achievements rather than general job duties. Tailor each bullet point to reflect your personal contributions.</li>
          <li><strong>Keep it Concise:</strong> Aim for brevity while maintaining clarity. Each bullet point should be a potent blend of impact and information.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Examples of Outstanding Bullet Points</h2>
        <p className="text-gray-700">
          To inspire your bullet point crafting, here are some examples that showcase how to translate duties into successful narratives:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Example 1:</strong> Spearheaded a team project that resulted in a 30% increase in customer satisfaction ratings by revamping the service delivery process.</p>
          <p><strong>Example 2:</strong> Optimized website content, leading to a 25% boost in organic traffic and a 15% rise in conversion rates over six months.</p>
          <p><strong>Example 3:</strong> Managed a $500K budget, successfully reducing operational costs by 10% through strategic negotiations and vendor management.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          Crafting compelling bullet points is both an art and a science. By utilizing action verbs, quantifying your achievements, and maintaining specificity and conciseness, you can turn your resume into a powerful marketing tool that highlights your professional worth. Go forth and polish those bullet points to perfection!
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <Edit3 className="w-8 h-8 text-gray-800" />
          </div>  
          <div>
            <p className="text-lg font-medium text-gray-800">Harper Davies</p>
            <p className="text-sm text-gray-600 font-small">Senior Resume Writer</p>
            <p className="text-gray-600 pt-2">Harper Davies is a seasoned resume writer with a flair for crafting compelling narratives and showcasing candidates unique strengths. With a background in HR and communications, Harper understands what recruiters are looking for and helps job seekers create resumes that stand out.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
