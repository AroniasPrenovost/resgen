import type { Metadata } from "next";
import { Compass, User } from "lucide-react";
import { Heading } from "@/components/heading";
import { JsonLd } from "@/components/json-ld";
import { blogPostSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Highlight Your Impact: Swap Duties for Achievements",
  description: "Refocus your resume by emphasizing achievements over duties to make it stand out.",
  alternates: {
    canonical: "/app/blog/resume-writing-tips-tricks-and-services/post/highlight-your-impact-swap-duties-for-achievements",
  },
  openGraph: {
    title: "Highlight Your Impact: Swap Duties for Achievements | ResumAI Blog",
    description: "Refocus your resume by emphasizing achievements over duties to make it stand out.",
    url: "/app/blog/resume-writing-tips-tricks-and-services/post/highlight-your-impact-swap-duties-for-achievements",
    type: "article",
    publishedTime: "2026-08-15T16:18:38.000Z",
  },
};

const BlogDetailPage = async () => {
  return (
    <article className="min-h-screen bg-gray-50">
      <JsonLd
        data={blogPostSchema({
          title: "Highlight Your Impact: Swap Duties for Achievements",
          description: "Refocus your resume by emphasizing achievements over duties to make it stand out.",
          slug: "highlight-your-impact-swap-duties-for-achievements",
          datePublished: "2026-08-15T16:18:38.000Z",
          authorName: "Sarah Cole",
          authorRole: "Senior Hiring Manager",
          faqs: [{"question": "How can I quantify my achievements on a resume?", "answer": "Identify results you achieved, like increased sales or reduced costs, and express them with concrete numbers or percentages."}],
        })}
      />
      <header>
        <Heading
          title={"Highlight Your Impact: Swap Duties for Achievements"}
          description={"Turn your job duties into compelling achievements."}
          icon={Compass}
          iconColor="text-blue-700"
          bgColor="bg-gray-700/10"
        />
      </header>
      <section className="px-8 lg:px-16 py-0 space-y-6">
        <p className="text-gray-700 custom_html">Netflix&apos;s Reed Hastings recently warned that AI could slash the workforce by 50%. That&apos;s a big number &mdash; and while it might sound scary, it also means now is the time to make sure your resume stands out. Here&apos;s what actually gets you past the first screen, and it&rsquo;s not just listing job duties.</p>

        <h2 className="text-2xl font-bold text-gray-800">Stop Listing Duties &mdash; Show Achievements</h2>

        <p className="text-gray-700 custom_html">Here&apos;s the cold truth: recruiters don&apos;t care about your day-to-day tasks. They want to know what you&apos;ve accomplished. If your resume reads like a job description, it&apos;s time to change gears. Instead of mentioning you &apos;managed a team,&apos; specify that you &apos;led a team to increase sales by 20% in six months.&apos; It&apos;s all about the impact.</p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li className="custom_html"><strong>Duty:</strong> Responsible for managing customer accounts.</li>
          <li className="custom_html"><strong>Achievement:</strong> Achieved a 30% increase in customer retention over one year by improving account management processes.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Quantify Your Contributions</h2>

        <p className="text-gray-700 custom_html">Numbers talk. If you can quantify your contributions, do it. &apos;Improved efficiency&apos; is nice, but &apos;Cut processing time by 15% through workflow optimization&apos; is better. Concrete figures help your application cut through the noise.</p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li className="custom_html"><strong>Vague:</strong> Improved team communication.</li>
          <li className="custom_html"><strong>Specific:</strong> Implemented a weekly team update mechanism that reduced project delays by 25%.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Tailor Your Resume for the Job</h2>

        <p className="text-gray-700 custom_html">Every job is a little different, and your resume should reflect that. Tailor it to the specific job description &mdash; it shows you understand the role and have the skills and experience they need. Use keywords from the job ad, but don&apos;t just copy-paste them. Weave them into your acheivements. (For what it&rsquo;s worth, this is where using AI tools like ResumAI can save you time and sanity.)</p>

        <h2 className="text-2xl font-bold text-gray-800">Use Active Language</h2>

        <p className="text-gray-700 custom_html">Ditch the passive voice. Active verbs are your friends &mdash; they make your accomplishments feel real and immediate. Words like &apos;initiated,&apos; &apos;designed,&apos; and &apos;championed&apos; have more punch than &apos;responsible for&apos; or &apos;worked with.&apos;</p>

        <p className="text-gray-700 custom_html">Consider this: &apos;Worked on a project to optimize supply chain&apos; versus &apos;Led a team in optimizing the supply chain, reducing costs by 12%.&apos; Which one sounds more compelling?</p>

        <h2 className="text-2xl font-bold text-gray-800">Keep It Forward-Looking</h2>

        <p className="text-gray-700 custom_html">Yes, your resume is about the past, but it should be framed with an eye to the future. Highlight skills and experiences that align with where you want to go, not just where you&apos;ve been. This isn&rsquo;t about ignoring your history &mdash; it&rsquo;s about positioning it to support your next career move.</p>

        <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-2">How can I quantify my achievements on a resume?</h3>

        <p className="text-gray-700 custom_html">Identify results you achieved, like increased sales or reduced costs, and express them with concrete numbers or percentages.</p>

        <p className="text-gray-700 custom_html">
          Ready to showcase your achievements? Try ResumAI&apos;s Resume Generator today.{" "}
          <a href="https://www.resumai.services/app/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">Resume Generator</a>{" "}
          and see how fast a tailored version comes together.
        </p>
      </section>
      <footer className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Sarah Cole</p>
            <p className="text-sm text-gray-600 font-small">Senior Hiring Manager</p>
            <p className="text-gray-600 pt-2">
              Sarah has 13 years helping people navigate layoffs, pivots, and comebacks, and has zero patience for buzzwords.
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default BlogDetailPage;
