
  import { MessageSquare, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Write an Attention Grabbing Resume Summary"
        description="A guide to crafting a compelling resume summary that captures the attention of hiring managers."
        icon={MessageSquare}
        iconColor="text-purple-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          Your resume summary is one of the first things a potential employer
          sees, so it is crucial to make it stand out. In this post, we will cover
          some tips and strategies to help you write a resume summary that not
          only grabs attention but also effectively showcases your skills and
          experiences.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">What is a Resume Summary?</h2>
        <p className="text-gray-700">
          A resume summary is a short statement at the top of your resume that
          highlights your professional qualifications. It provides a snapshot of
          your skills, achievements, and career goals, making it easier for hiring
          managers to quickly assess your suitability for a role.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">Tips for Writing a Resume Summary</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Be Concise:</strong> Aim for 3-5 impactful sentences that summarize your professional background.</li>
          <li><strong>Highlight Achievements:</strong> Focus on your key accomplishments and skills relevant to the job you’re applying for.</li>
          <li><strong>Use Keywords:</strong> Incorporate terms and phrases from the job description to increase your chances with applicant tracking systems (ATS).</li>
          <li><strong>Showcase Your Value:</strong> Emphasize how you can benefit the employer and contribute to their success.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-800">Examples of Effective Resume Summaries</h2>
        <p className="text-gray-700">
          Here are some examples of resume summaries that effectively communicate
          values and qualifications of the candidate:
        </p>
        
        <div className="border-l-4 border-purple-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Example 1:</strong> Experienced marketing professional with a proven track record in managing successful campaigns and increasing brand awareness. Skilled in digital marketing, content creation, and data analysis.</p>
          <p><strong>Example 2:</strong> Detail-oriented software engineer with 5+ years of experience in full-stack development. Expertise in JavaScript, React, and Node.js. Passionate about building scalable web applications and enhancing user experience.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          Writing an attention-grabbing resume summary is an essential part of crafting
          a compelling resume. By following these tips and showcasing your unique value,
          you can make a strong impression on potential employers and increase your chances
          of landing your desired job.
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">    
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">John Ashford</p>
            <p className="text-sm text-gray-600 font-small">Senior Software Engineer</p>
            <p className="text-gray-600 pt-2">John is a seasoned developer with over 10 years of experience in the tech industry. He specializes in web development, particularly in using NextJS and React to build high-performing, user-friendly applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;