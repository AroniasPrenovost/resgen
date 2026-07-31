import type { Metadata } from "next";
import { Compass, User } from "lucide-react";
import { Heading } from "@/components/heading";
import { JsonLd } from "@/components/json-ld";
import { blogPostSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Staying Employable in Times of AI Job Cuts",
  description: "How to safeguard your career amid AI-driven layoffs.",
  alternates: {
    canonical: "/app/blog/resume-writing-tips-tricks-and-services/post/staying-employable-in-times-of-ai-job-cuts",
  },
  openGraph: {
    title: "Staying Employable in Times of AI Job Cuts | ResumAI Blog",
    description: "How to safeguard your career amid AI-driven layoffs.",
    url: "/app/blog/resume-writing-tips-tricks-and-services/post/staying-employable-in-times-of-ai-job-cuts",
    type: "article",
    publishedTime: "2026-07-31T23:42:38.000Z",
  },
};

const BlogDetailPage = async () => {
  return (
    <article className="min-h-screen bg-gray-50">
      <JsonLd
        data={blogPostSchema({
          title: "Staying Employable in Times of AI Job Cuts",
          description: "How to safeguard your career amid AI-driven layoffs.",
          slug: "staying-employable-in-times-of-ai-job-cuts",
          datePublished: "2026-07-31T23:42:38.000Z",
        })}
      />
      <header>
        <Heading
          title={"Staying Employable in Times of AI Job Cuts"}
          description={"Stay ahead in the job market despite AI disruptions."}
          icon={Compass}
          iconColor="text-violet-500"
          bgColor="bg-violet-500/10"
        />
      </header>
      <section className="px-8 lg:px-16 py-0 space-y-6">
        <p className="text-gray-700 custom_html">Chime slashing 10% of its workforce due to AI efficiencies is a hard pill to swallow, but it&apos;s not an isolated event. As more companies turn to automation, staying employable takes on a new dimension.</p>

        <h2 className="text-2xl font-bold text-gray-800">Identify Your Transferable Skills</h2>

        <p className="text-gray-700 custom_html">When a job loss strikes, the first step is to take stock of your skills. Not just the tasks you&apos;ve done at work, but the underlying skills that you can take anywhere. Are you a problem-solver, a mediator, or a data whisperer? These are transferable skills that you can sell to potential employers.</p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li className="custom_html"><strong>Communication::</strong> Essential across all industries, hone your ability to convey ideas clearly.</li>
          <li className="custom_html"><strong>Adaptability::</strong> Showcase your ability to pivot and learn new skills quickly.</li>
          <li className="custom_html"><strong>Tech Savvy::</strong> Understanding current technology trends is vital, even outside tech roles.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Don&apos;t Underestimate the Power of Networking</h2>

        <p className="text-gray-700 custom_html">If AI is taking your job, human connection is your new best friend. Reach out to former colleagues, join industry groups, and don&apos;t be shy about asking for introductions. Real opportunities often come from the people you know.</p>

        <h2 className="text-2xl font-bold text-gray-800">Customize Your Resume for Each Application</h2>

        <p className="text-gray-700 custom_html">It&apos;s tempting to blast out the same resume when you&apos;re in a crunch, but this rarely works. Tailor your resume for each job application by emphasizing different skills and achievements based on the job description. Hiring managers want to see that you understand the job and how you fit.</p>

        <h2 className="text-2xl font-bold text-gray-800">Consider Continuous Learning</h2>

        <p className="text-gray-700 custom_html">Nothing makes you more employable than staying relevant. Look into online courses, certifications, or even part-time schooling to fill in any gaps. This shows prospective employers that you&apos;re proactive and committed to evolving with the industry.</p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p className="custom_html"><strong>Remember::</strong> Your learning doesn&apos;t have to be formal. Reading industry reports or following thought leaders can also keep you ahead of the curve.</p>
        </div>

        <p className="text-gray-700 custom_html">
          Ready to make your next move? Use ResumAI&apos;s Resume Generator to craft the perfect application.{" "}
          <a href="https://www.resumai.services/app/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">Resume Generator</a>{" "}
          and spend your energy on the jobs that matter.
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
