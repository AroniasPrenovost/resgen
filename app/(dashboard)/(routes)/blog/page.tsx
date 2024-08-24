import { MessageSquare } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogPage = async () => {

  return (
    <div className="min-h-screen bg-purple-50">
      <Heading
        title="Resume Writing Blog"
        description="Master the art of resume writing with our expert tips and tricks."
        icon={MessageSquare}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-8 py-2 space-y-2">
        <div className="text-muted-foreground text-sm">
          "Writing the right resume at the right time is all it takes to strike gold."
        </div>

        <div className="space-y-8">
          <a href="/blog/1" title="How to write a resume..." className="text-blue-600 hover:underline">
            How to Write an Attention-Grabbing Resume Summary
          </a>
          <br/>
          <a href="/blog/2" title="How to write a resume..." className="text-blue-600 hover:underline">
            Top Resume Formats to Get You Noticed
          </a>
          <br/>
          <a href="/blog/3" title="How to write a resume..." className="text-blue-600 hover:underline">
            Quantifying Achievements: The Key to Standout Resumes
          </a>
          <br/>
          <a href="/blog/4" title="How to write a resume..." className="text-blue-600 hover:underline">
            Crafting the Perfect Cover Letter to Complement Your Resume
          </a>
          <br/>
          <a href="/blog/5" title="How to write a resume..." className="text-blue-600 hover:underline">
            Common Resume Mistakes and How to Avoid Them
          </a>
          <br/>
          <a href="/blog/6" title="How to write a resume..." className="text-blue-600 hover:underline">
            Leveraging Keywords to Pass Resume Screening Software
          </a>
          <br/>
          <a href="/blog/7" title="How to write a resume..." className="text-blue-600 hover:underline">
            The Importance of Tailoring Your Resume for Each Job Application
          </a>
          <br/>
          <a href="/blog/8" title="How to write a resume..." className="text-blue-600 hover:underline">
            How to Showcase Soft Skills in Your Resume
          </a>
          <br/>
          <a href="/blog/9" title="How to write a resume..." className="text-blue-600 hover:underline">
            Professional Resume Templates that Employers Love
          </a>
          <br/>
          <a href="/blog/10" title="How to write a resume..." className="text-blue-600 hover:underline">
            How to Write a Resume with Little to No Experience
          </a>
          <br/>
        </div>

        {/*<SubscriptionButton />*/}
      </div>
    </div>
  );
}

export default BlogPage;