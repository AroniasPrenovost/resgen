javascript
import { MessageSquare, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="From Humdrum to Head-Turner: Spicing Up Your Resume's Bullet Points"
        description="Injecting life into the plain and often overlooked bullet points on your resume."
        icon={MessageSquare}
        iconColor="text-purple-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          Bullet points: they are the unsung heroes of your resume, simultaneously the most straightforward and most facilely overlooked. Let us embark on a journey to morph these pedestrian markers into eloquent bursts of professional prowess.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">Why Focus on Bullet Points?</h2>
        <p className="text-gray-700">
          Bullet points are not just placeholders; they are potent snippets of your professional narrative. A well-crafted bullet point can lasso a hiring manager's attention faster than you can say "curriculum vitae." With the right phrasing, every bullet can become a dynamic story about your qualifications. 
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">Tips for Crafting Compelling Bullet Points</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Action-Oriented Language:</strong> Start each bullet point with powerful action verbs that convey responsibility and dynamism. Think "spearheaded," "orchestrated," or "transformed."</li>
          <li><strong>Quantify Achievements:</strong> Numbers resonate. Do not merely state that you managed a team; specify that you led a team of 10 to increase productivity by 30%.</li>
          <li><strong>Tailor to the Job Description:</strong> Reflect on the role you seek and mirror the language and requirements in the bullet points. Thus, ensure they serve as a spotlight on your most relevant experiences.</li>
          <li><strong>Show Real Impact:</strong> Go beyond tasks and denote the actual impact of your work. If you implemented a new system, elucidate how it improved efficiency or cut costs.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-800">Examples of Transformed Bullet Points</h2>
        <p className="text-gray-700">
          Observe the evolution from generic to remarkable with these transformed bullet points:
        </p>
        
        <div className="border-l-4 border-purple-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Before:</strong> Managed customer service team.</p>
          <p><strong>After:</strong> Spearheaded a 15-member customer service team, enhancing customer satisfaction ratings by 25% within six months through comprehensive training and innovative feedback systems.</p>
          <p><strong>Before:</strong> Created marketing materials.</p>
          <p><strong>After:</strong> Engineered compelling marketing materials and campaigns, resulting in a 40% increase in lead generation and a 20% boost in customer engagement.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          Elevating the bullet points on your resume is akin to alchemy; a touch of creativity, a sprinkle of precision, and behold—a transformative impact unfolds. With these strategies in tow, let your bullet points metamorphose into hard-hitting statements that resonate and captivate.
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">    
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Mary Poppins</p>
            <p className="text-sm text-gray-600 font-small">Senior Resume Writer</p>
            <p className="text-gray-600 pt-2">Mary has an uncanny knack for transforming lackadaisical resumes into vibrant narratives of professional triumph. With over a decade in the field, she continues to help individuals seize their dream roles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
