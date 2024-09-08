import { ClipboardList, Edit3 } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Strategies for Job Seekers to Elevate Thier Resume"
        description="Discover innovative strategies to enhance your resume, making it a powerful tool in your job search journey."
        icon={ClipboardList}
        iconColor="text-blue-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          In the competitive job market of today, your resume is more than just a list of your work history. It is a dynamic document that showcases your skills, achievements, and potential. This post will guide you through innovative strategies to elevate your resume and make it a powerful tool in your job search journey.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Understanding the Modern Resume</h2>
        <p className="text-gray-700">
          A modern resume goes beyond listing your job titles and responsibilities. It is a strategic document that highlights your unique value proposition. It should reflect your ability to solve problems, lead projects, and drive results. Let us explore how to transform your resume into a compelling narrative of your professional journey.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 custom_html">Key Elements of a Modern Resume</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 custom_html">
          <li><strong>Professional Summary:</strong> Start with a strong professional summary that captures your career highlights and key skills.</li>
          <li><strong>Core Competencies:</strong> List your core competencies and technical skills prominently. Include industry-specific keywords.</li>
          <li><strong>Achievements:</strong> Highlight your achievements with quantifiable results. Use bullet points to make them stand out.</li>
          <li><strong>Experience:</strong> Detail your work experience, focusing on your contributions and the impact you made in each role.</li>
          <li><strong>Education and Certifications:</strong> Include your educational background, certifications, and any relevant training.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Tips for Crafting a Standout Resume</h2>
        <p className="text-gray-700">
          Crafting a standout resume requires a blend of creativity and strategy. Here are some tips to help you create a resume that stands out:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2 custom_html">
          <p><strong>Tip 1:</strong> Tailor your resume for each job application. Use keywords from the job description to align your resume with the requirements of the employer.</p>
          <p><strong>Tip 2:</strong> Keep it concise. Aim for a one-page resume if you have less than 10 years of experience. Focus on the most relevant information.</p>
          <p><strong>Tip 3:</strong> Use a clean, professional format. Avoid flashy designs and stick to a simple, easy-to-read layout.</p>
          <p><strong>Tip 4:</strong> Highlight your achievements. Use bullet points to list your accomplishments and quantify your results whenever possible.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Examples of Effective Resumes</h2>
        <p className="text-gray-700">
          Here are some examples of resumes that effectively showcase your skills and experience:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2 custom_html">
          <p><strong>Example 1:</strong> Marketing professional with 7 years of experience in digital marketing. Proficient in SEO, content marketing, and social media strategy. Increased website traffic by 40% through targeted campaigns.</p>
          <p><strong>Example 2:</strong> Project manager with a strong background in agile methodologies and team leadership. Successfully led cross-functional teams to deliver projects on time and within budget, resulting in a 20% increase in client satisfaction.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700 custom_html">
          A well-crafted resume is essential for standing out in a competitive job market. By focusing on your professional summary, core competencies, and achievements, and tailoring your resume for each application, you can create a resume that highlights your strengths and positions you as the ideal candidate. Now, it is time to put these tips into action and elevate your resume to new heights!
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <Edit3 className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Eli Lewis</p>
            <p className="text-sm text-gray-600 font-small">Sales Recruitment Specialist & Author</p>
            <p className="text-gray-600 pt-2">Eli Lewis is a seasoned sales recruitment specialist and author with a passion for helping job seekers create optimized resumes and build an online presence that stands out. With over 12 years of experience in sales recruitment, Eli provides valuable insights and practical tips for crafting resumes that get noticed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
