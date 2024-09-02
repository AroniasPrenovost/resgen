import { ClipboardList, Edit3 } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Crafting a Killer Personal Statement for Your Resume"
        description="Mastering the art of creating a captivating personal statement that will elevate your resume to the top of the pile."
        icon={ClipboardList}
        iconColor="text-blue-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          Your personal statement is the golden nugget nestled at the top of your resume that offers a quick glimpse into who you are and what you bring to the professional table. In this post, we delve into tips and strategies for writing a personal statement that commands attention and leaves a lasting impression.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Why a Personal Statement Matters</h2>
        <p className="text-gray-700">
          Think of your personal statement as your elevator pitch—it is your chance to quickly showcase your qualifications, highlight your career trajectory, and make a persuasive case for why you are the ideal candidate for the job. A well-crafted personal statement can set the tone for the rest of your resume and capture the interest of hiring managers right from the start.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Tips for Writing a Compelling Personal Statement</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Be Authentic:</strong> Reflect your true self and unique value propositions. Avoid clichés and generic statements.</li>
          <li><strong>Keep it Concise:</strong> Limit your personal statement to 2-3 impactful sentences. Make every word count.</li>
          <li><strong>Highlight Your Strengths:</strong> Focus on your key skills and accomplishments that align with the job you are applying for.</li>
          <li><strong>Tailor it to the Role:</strong> Customize your personal statement for each job application by incorporating relevant keywords and phrases from the job description.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Examples of Personal Statements That Shine</h2>
        <p className="text-gray-700">
          Here are some examples of personal statements that effortlessly blend personality, professionalism, and purpose:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Example 1:</strong> Dynamic marketing strategist with over 10 years of experience in digital and content marketing. Adept at analyzing data to craft innovative, audience-focused campaigns that drive engagement and growth.</p>
          <p><strong>Example 2:</strong> Results-oriented project manager with a knack for streamlining operations and enhancing productivity. Proven track record in leading cross-functional teams to deliver projects on time and within budget.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          A powerful personal statement is your ticket to making a memorable first impression. By infusing authenticity, sharpness, and a tailored approach, your personal statement can elevate your resume and position you as the standout candidate among a sea of applicants. Now, go forth and craft!
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