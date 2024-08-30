import { MessageSquare, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Turning Your Resume into a Masterpiece: The Devil is in the Details"
        description="Explore the intricate elements that transform a mundane resume into a remarkable work of craftsmanship that dazzles hiring managers. Learn best practices, fine-tuning techniques, and secrets to elevate your resume writing services."
        icon={MessageSquare}
        iconColor="text-purple-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          Every resume tells a story, but not all can make hiring managers eager for a sequel. Let us dive deep into the art of resume writing services and reveal those subtle enhancements that turn your professional history into a captivating saga worthy of flipping pages.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">First Impressions through Formatting</h2>
        <p className="text-gray-700">
          A resume’s layout is more than just a coat of paint; it is the frame that supports the masterpiece. Imagine your resume as a piece of visual art. Balancing white space, selecting an elegant font, and using bullet points smartly can turn a list of job experiences into a joy to read. Utilize headings and subheadings to direct the reader’s eye seamlessly from one section to the next.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">Content: Quality over Quantity</h2>
        <p className="text-gray-700">
          Resumes are not novels. Each word must work towards illustrating your excellence. A well-curated resume contains only pertinent information, tailored specifically to the job for which you are applying. Highlight your most notable achievements with quantifiable metrics, e.g., "increased sales by 20%" rather than just “boosted sales”.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">Mastering the Modern Elements</h2>
        <p className="text-gray-700">
          In today’s competitive job market, using employer-specific keywords extracted from job descriptions can significantly enhance your chances with Applicant Tracking Systems (ATS). Adding a dedicated skills section and including soft skills along with technical skills will provide a well-rounded impression of your capability.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Visual Enhancements</h2>
        <p className="text-gray-700">
          Integrating subtle visual elements can boost readability and engagement. This does not mean rainbow-colored text and Comic Sans. Thoughtful use of color for section headers and a professional headshot can add a personal touch. However, moderation and alignment with industry standards are key.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Practical Examples</h2>
        <p className="text-gray-700">
          Below are examples of enhanced resumes that blend content prowess and visual appeal:
        </p>
        
        <div className="border-l-4 border-purple-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Example 1:</strong> Marketing Manager with over seven years of experience. Launched successful multi-channel campaigns leading to a 15% increase in brand engagement. Proficient in SEO (Search Engine Optimization), content strategy, and analytics.</p>
          <p><strong>Example 2:</strong> Skilled software developer with a knack for crafting intuitive user interfaces. Leveraged React and TypeScript to reduce page load times by 30%. Passionate about creating responsive and accessible web applications.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          Transforming a resume into a piece of art requires attention to detail, a deep understanding of what employers seek, and the knack to present information succinctly yet compellingly. By weaving these elements together, your resume writing services will not only showcase professional histories but will also create narratives that captivate and convince.
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">    
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Emily Higginbotham</p>
            <p className="text-sm text-gray-600 font-small">Senior Resume Consultant</p>
            <p className="text-gray-600 pt-2">Emily is a dedicated career strategist with over 12 years of experience in helping professionals craft compelling resumes. She specializes in transforming mundane career histories into engaging narratives that attract top employers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
