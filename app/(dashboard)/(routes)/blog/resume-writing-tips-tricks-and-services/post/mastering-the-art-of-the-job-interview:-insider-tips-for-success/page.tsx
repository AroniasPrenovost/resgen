import { ClipboardList, Edit3 } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Mastering the Art of the Job Interview: Insider Tips for Success"
        description="Unlock the secrets to acing your next job interview with these expert strategies and insights."
        icon={ClipboardList}
        iconColor="text-blue-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          The job interview is your golden opportunity to shine and make a lasting impression on potential employers. In this post, we will explore key strategies and tips to help you navigate the interview process with confidence and finesse.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Preparation is Key</h2>
        <p className="text-gray-700">
          Before you even step foot into the interview room, thorough preparation is essential. Research the company, understand its culture, and familiarize yourself with the job description. This will not only help you tailor your responses but also demonstrate your genuine interest in the role.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Crafting Your Elevator Pitch</h2>
        <p className="text-gray-700">
          Your elevator pitch is a concise summary of who you are, what you do, and why you are the perfect fit for the job. Practice delivering it with confidence and clarity. Remember, first impressions matter, and a strong elevator pitch can set the tone for the rest of the interview.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Answering Common Interview Questions</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Tell me about yourself:</strong> Focus on your professional background, key achievements, and how your experience aligns with the job.</li>
          <li><strong>Why do you want to work here:</strong> Highlight your knowledge of the company and how its values and goals resonate with you.</li>
          <li><strong>What are your strengths and weaknesses:</strong> Be honest and provide examples that showcase your strengths. When discussing weaknesses, focus on how you are working to improve them.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">The Power of Body Language</h2>
        <p className="text-gray-700">
          Non-verbal communication plays a significant role in how you are perceived during an interview. Maintain good posture, make eye contact, and offer a firm handshake. These subtle cues can convey confidence and professionalism.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Asking Thoughtful Questions</h2>
        <p className="text-gray-700">
          Towards the end of the interview, you will likely be given the opportunity to ask questions. Use this time to inquire about the company culture, team dynamics, and growth opportunities. Thoughtful questions demonstrate your interest and can help you assess if the company is the right fit for you.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          A successful job interview is a blend of preparation, confidence, and effective communication. By mastering these key strategies, you can present yourself as the ideal candidate and increase your chances of landing the job. Now, go forth and conquer that interview!
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