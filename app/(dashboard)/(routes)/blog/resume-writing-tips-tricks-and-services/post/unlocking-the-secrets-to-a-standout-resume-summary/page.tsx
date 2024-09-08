import { ClipboardList, UserPen } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Unlocking the Secrets to a Standout Resume Summary"
        description="Discover the key elements to crafting a resume summary that grabs attention and sets you apart from the competition."
        icon={ClipboardList}
        iconColor="text-blue-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          Your resume summary is the first impression you make on potential employers. It is a snapshot of your professional identity, showcasing your skills, experience, and career aspirations. In this post, we will explore how to create a resume summary that captivates hiring managers and propels you to the top of the candidate list.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">The Importance of a Resume Summary</h2>
        <p className="text-gray-700">
          A resume summary serves as a quick overview of your qualifications and career highlights. It is your opportunity to make a strong case for why you are the best fit for the job. A well-crafted summary can set the tone for the rest of your resume and entice recruiters to read further.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 custom_html">Crafting an Effective Resume Summary</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Be Specific:</strong> Highlight your most relevant skills and achievements. Avoid vague statements and focus on concrete examples.</li>
          <li><strong>Keep it Brief:</strong> Aim for 3-4 concise sentences that pack a punch. Every word should add value.</li>
          <li><strong>Showcase Your Value:</strong> Emphasize how your skills and experience can benefit the employer. Use quantifiable results when possible.</li>
          <li><strong>Tailor to the Job:</strong> Customize your summary for each application by incorporating keywords from the job description.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Examples of Impactful Resume Summaries</h2>
        <p className="text-gray-700 custom_html">
          Here are some examples of resume summaries that effectively highlight the strengths of the candidate and their potential contributions:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2 custom_html">
          <p><strong>Example 1:</strong> Experienced software developer with a strong background in full-stack development. Proven ability to design and implement scalable web applications, resulting in a 20% increase in user engagement.</p>
          <p><strong>Example 2:</strong> Accomplished sales manager with over 8 years of experience in driving revenue growth and building high-performing teams. Adept at developing strategic sales plans and exceeding targets.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700 custom_html">
          A compelling resume summary is your ticket to making a memorable first impression. By being specific, concise, and showcasing your value, you can create a summary that stands out and positions you as the ideal candidate. Now, it is time to put these tips into action and craft a resume summary that shines!
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <UserPen className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Sarah Cole</p>
            <p className="text-sm text-gray-600 font-small">SEO Strategist & Author</p>
            <p className="text-gray-600 pt-2">Sarah Cole is a seasoned SEO strategist and author with a passion for helping job seekers create optimized resumes and build an online presence that stands out. With over 8 years of experience in content creation and SEO, Sarah provides valuable insights and practical tips for crafting resumes that get noticed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
