import { MessageSquare, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Crafting the Unforgettable Resume: Unlocking the Secrets"
        description="An expert-led guide on making your resume truly unforgettable by applying unique and effective strategies."
        icon={MessageSquare}
        iconColor="text-purple-700"
        bgColor="bg-blue-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          In a sea of job applications, an unforgettable resume is your lifeboat. It requires masterful techniques and a dash of je ne sais quoi. Today, we are diving deep into how you can make your resume stand out and resonate with hiring managers.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">What Makes a Resume Unforgettable?</h2>
        <p className="text-gray-700">
          An unforgettable resume is not just a list of job titles and dates. It is a well-crafted narrative that captures your professional journey, emphasizes your unique contributions, and aligns with the needs of potential employers. A successful resume does more than inform; it captivates and convinces.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">Techniques to Elevate Your Resume</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Tailor for Each Job:</strong> Customize your resume for each application to address the specific requirements of the job description.</li>
          <li><strong>Show, Do Not Tell:</strong> Use quantifiable achievements to demonstrate your impact, instead of vague statements.</li>
          <li><strong>Include Powerful Keywords:</strong> Integrate industry-specific keywords to ensure compatibility with Applicant Tracking Systems (ATS) and draw attention to your key competencies.</li>
          <li><strong>Prioritize Readability:</strong> Opt for a clean format with consistent headers, bullet points, and ample white space to enhance readability.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-800">Examples of Unforgettable Resume Elements</h2>
        <p className="text-gray-700">
          Incorporating these elements can transform a mundane document into an unforgettable presentation of your career:
        </p>
        
        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Impact Statements:</strong> "Increased annual sales by 30% through strategic market analysis and targeted outreach."</p>
          <p><strong>Personal Touch:</strong> "Created user-centric designs resulting in a 40% increase in user engagement and customer satisfaction scores."</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          Crafting an unforgettable resume is both an art and a science. By personalizing your resume, highlighting measurable achievements, using impactful keywords, and prioritizing readability, you can create a document that not only grabs attention but also leaves a lasting impression. This approach will significantly increase your chances of securing your dream job.
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">   
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Olivia Wellingdon</p>
            <p className="text-sm text-gray-600 font-small">Lead Resume Strategist</p>
            <p className="text-gray-600 pt-2">Olivia is a veteran resume strategist with over 15 years of experience in career consulting. She specializes in creating bespoke resumes that elevate her clients' profiles and unlock new career opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;