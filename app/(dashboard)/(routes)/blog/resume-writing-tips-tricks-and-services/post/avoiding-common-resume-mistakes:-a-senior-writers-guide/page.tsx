import { ClipboardList, Edit3 } from "luide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Avoiding Common Resume Mistakes: A Senior Writer's Guide"
        description="Navigate the pitfalls of resume writing by learning from the most common mistakes job seekers make and secure that interview."
        icon={ClipboardList}
        iconColor="text-green-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          Crafting a resume is like cooking a gourmet dish; you need to get all the ingredients just right. In this post, we peel away the layers of common resume mistakes, helping you become a master chef in the kitchen of job applications.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Overloading with Information</h2>
        <p className="text-gray-700">
          A resume is not a place for your entire life story. Too many job seekers fall into the trap of overloading their resumes with irrelevant details. Follow the rule of thumb: less is more. Focus on the most impactful experiences, those that demonstrate your capabilities and value to potential employers.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Ignoring Keywords</h2>
        <p className="text-gray-700">
          Keywords are the secret sauce to getting your resume past the Applicant Tracking Systems (ATS) used by many companies. Tailor your resume by incorporating industry-specific terminology, making it more likely to catch the automated eye and impress human hiring managers alike.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Neglecting Action Verbs</h2>
        <p className="text-gray-700">
          Do not just list your job duties—make them sing! Use strong action verbs to highlight your achievements. Words like "spearheaded," "orchestrated," and "optimized" can power up your resume and show that you are someone who makes things happen.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Neglecting to Quantify Achievements</h2>
        <p className="text-gray-700">
          Numbers will back up your claims and provide a clearer picture of your impact. For example, instead of saying you "increased sales," you might state you "boosted sales by 30 percent in Q1 2022." Specifics make your achievements more credible and impressive.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Examples of Revamped Resumes</h2>
        <p className="text-gray-700">
          Let us explore a couple of resumes before and after they avoided these common mistakes:
        </p>

        <div className="border-l-4 border-green-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Before:</strong> Worked on marketing campaigns. Was responsible for social media. Improved engagement.</p>
          <p><strong>After:</strong> Spearheaded innovative marketing campaigns, managing social media channels to boost engagement by 50 percent over six months.</p>
        </div>
        
        <div className="border-l-4 border-green-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Before:</strong> Managed a team. Increased sales.</p>
          <p><strong>After:</strong> Orchestrated a team of 10, leading to a 30 percent increase in sales over Q1 2022 through strategic leadership and targeted initiatives.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          Avoiding these common resume mistakes is the first step in creating a standout resume. By focusing on relevant information, leveraging keywords, using action verbs, and quantifying achievements, you are well on your way to crafting a resume that captures attention. Happy writing!
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <Edit3 className="w-8 h-8 text-gray-800" />
          </div>  
          <div>
            <p className="text-lg font-medium text-gray-800">Oliver Thompson</p>
            <p className="text-sm text-gray-600 font-small">Senior Resume Writer</p>
            <p className="text-gray-600 pt-2">Oliver Thompson is a seasoned hr professional with a knack for witty prose and an in-depth understanding of the job application process. With years of experience, Oliver helps job seekers navigate the complexities of resume writing and secure the interviews they deserve.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;