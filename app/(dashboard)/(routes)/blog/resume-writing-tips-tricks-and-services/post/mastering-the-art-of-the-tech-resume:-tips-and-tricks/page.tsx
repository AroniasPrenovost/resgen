import { ClipboardList, UserPen } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Mastering the Art of the Tech Resume: Tips and Tricks"
        description="Learn how to craft a tech resume that highlights your skills, experience, and potential, making you stand out in a competitive job market."
        icon={ClipboardList}
        iconColor="text-blue-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          In the fast-paced world of technology, your resume is your ticket to landing that dream job. It is not just a document; it is a marketing tool that showcases your skills, experience, and potential. In this post, we will delve into the nuances of creating a tech resume that grabs attention and sets you apart from the competition.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Understanding the Tech Resume</h2>
        <p className="text-gray-700">
          A tech resume is more than a list of your job history. It is a strategic document that highlights your technical skills, projects, and achievements. It should reflect your ability to solve problems, work in teams, and adapt to new technologies. Let us explore how to make your tech resume a powerful tool in your job search arsenal.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 custom_html">Key Elements of a Tech Resume</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 custom_html">
          <li><strong>Technical Skills:</strong> List your technical skills prominently. Include programming languages, tools, and technologies you are proficient in.</li>
          <li><strong>Projects:</strong> Highlight significant projects you have worked on. Describe your role, the technologies used, and the impact of the project.</li>
          <li><strong>Experience:</strong> Detail your work experience, focusing on your achievements and contributions. Use quantifiable results to demonstrate your impact.</li>
          <li><strong>Education:</strong> Include your educational background, certifications, and any relevant coursework.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Tips for Crafting a Standout Tech Resume</h2>
        <p className="text-gray-700">
          Creating a standout tech resume requires attention to detail and a strategic approach. Here are some tips to help you craft a resume that stands out:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2 custom_html">
          <p><strong>Tip 1:</strong> Tailor your resume for each job application. Use keywords from the job description to align your resume with the employers requirements.</p>
          <p><strong>Tip 2:</strong> Keep it concise. Aim for a one-page resume if you have less than 10 years of experience. Focus on the most relevant information.</p>
          <p><strong>Tip 3:</strong> Use a clean, professional format. Avoid flashy designs and stick to a simple, easy-to-read layout.</p>
          <p><strong>Tip 4:</strong> Highlight your achievements. Use bullet points to list your accomplishments and quantify your results whenever possible.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Examples of Effective Tech Resumes</h2>
        <p className="text-gray-700">
          Here are some examples of tech resumes that effectively showcase the candidates skills and experience:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2 custom_html">
          <p><strong>Example 1:</strong> Software engineer with 5 years of experience in full-stack development. Proficient in JavaScript, Python, and React. Led a team to develop a web application that increased user engagement by 30%.</p>
          <p><strong>Example 2:</strong> Data scientist with a strong background in machine learning and data analysis. Experienced in Python, R, and SQL. Developed predictive models that improved sales forecasting accuracy by 25%.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700 custom_html">
          A well-crafted tech resume is essential for standing out in a competitive job market. By focusing on your technical skills, projects, and achievements, and tailoring your resume for each application, you can create a resume that highlights your strengths and positions you as the ideal candidate. Now, it is time to put these tips into action and craft a tech resume that shines!
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <UserPen className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Alicia Graham</p>
            <p className="text-sm text-gray-600 font-small">Tech Recruiter & Author</p>
            <p className="text-gray-600 pt-2">Alicia Graham is a seasoned tech recruiter and author with a passion for helping job seekers create optimized resumes and build an online presence that stands out. With over 10 years of experience in tech recruitment, Alicia provides valuable insights and practical tips for crafting resumes that get noticed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
