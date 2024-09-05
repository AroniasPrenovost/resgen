import { ClipboardList, Edit3 } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="The Art of Crafting CV Highlights: Set the Stage for Success"
        description="Learn the nuances of creating riveting resume highlights that captivate hiring managers."
        icon={ClipboardList}
        iconColor="text-green-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          Resume highlights, if crafted correctly, can serve as the dazzling marquee of your professional journey. In this post, we explore the essential elements of magnetic resume highlights, ensuring they attract the attention your talents deserve.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Why Resume Highlights Matter</h2>
        <p className="text-gray-700">
          Job seekers often overlook the impact of succinctly presented achievements at the top of their resumes. Yet, these highlights serve as your opening act, offering a snapshot that can make recruiters eager to delve deeper into your credentials.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Crafting Captivating Resume Highlights</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Lead with Impact:</strong> Begin with quantifiable achievements or notable projects. Numbers speak volumes.</li>
          <li><strong>Use Active Language:</strong> Opt for action verbs to convey energy and dynamism. Words like 'spearheaded', 'optimized', and 'innovated' can add zest to your statements.</li>
          <li><strong>Tailor to the Role:</strong> Sync your highlights with the job description. Demonstrating relevance is key.</li>
          <li><strong>Include Keywords:</strong> Weave in keywords and phrases pertinent to your industry and the specific role. This improves both clarity and the likelihood of passing through applicant tracking systems.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Standout Resume Highlights Examples</h2>
        <p className="text-gray-700">
          Let us examine a few examples that exemplify well-crafted resume highlights:
        </p>

        <div className="border-l-4 border-green-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Example 1:</strong> Engineered a 25% increase in user engagement by developing comprehensive UX/UI enhancements for mobile application, leading to a 30% rise in subscription rates.</p>
          <p><strong>Example 2:</strong> Spearheaded the integration of blockchain technology into corporate architecture, resulting in a 15% reduction in transactional errors and a 20% decrease in operational costs.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          Resume highlights are your moment to shine, offering recruiters a compelling reason to invest time in your resume. By focusing on impact, maintaining relevance, and utilizing powerful language, you can transform your resume into a persuasive narrative that sets you leagues ahead of the competition. Now, take the stage and let your highlights dazzle!
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <Edit3 className="w-8 h-8 text-gray-800" />
          </div>  
          <div>
            <p className="text-lg font-medium text-gray-800">Elijah Lewis</p>
            <p className="text-sm text-gray-600 font-small">Recruiting Manager</p>
            <p className="text-gray-600 pt-2">Elijah Lewis is a seasoned recruiting manager with a knack for crafting resumes that capture the essence of professional journeys. With extensive experience in HR and talent acquisition, Elijah brings a wealth of knowledge to help job seekers present their best selves to potential employers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;