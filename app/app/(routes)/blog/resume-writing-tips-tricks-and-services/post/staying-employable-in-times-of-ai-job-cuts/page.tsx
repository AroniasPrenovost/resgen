import type { Metadata } from "next";
import { Compass, User } from "lucide-react";
import { Heading } from "@/components/heading";
import { JsonLd } from "@/components/json-ld";
import { blogPostSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Staying Employable in Times of AI Job Cuts",
  description: "Layoffs are rising, but the sharpest, most tailored resume still wins interviews. Here's how to make yours one of them.",
  alternates: {
    canonical: "/app/blog/resume-writing-tips-tricks-and-services/post/staying-employable-in-times-of-ai-job-cuts",
  },
  openGraph: {
    title: "Staying Employable in Times of AI Job Cuts | ResumAI Blog",
    description: "Layoffs are rising, but the sharpest, most tailored resume still wins interviews. Here's how to make yours one of them.",
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
          description: "Layoffs are rising, but the sharpest, most tailored resume still wins interviews. Here's how to make yours one of them.",
          slug: "staying-employable-in-times-of-ai-job-cuts",
          datePublished: "2026-07-31T23:42:38.000Z",
        })}
      />
      <header>
        <Heading
          title={"Staying Employable in Times of AI Job Cuts"}
          description={"The market is shifting, but a sharp, tailored resume is still the lever you control."}
          icon={Compass}
          iconColor="text-violet-500"
          bgColor="bg-violet-500/10"
        />
      </header>
      <section className="px-8 lg:px-16 py-0 space-y-6">
        <p className="text-gray-700 custom_html">Chime just cut 10% of its team and pointed to AI efficiencies &mdash; and it won&apos;t be the last headline like it. But here&apos;s the part actually worth your attention: the biggest lever you control in any market is how clearly your resume matches the job in front of you. That&apos;s fixable today, and it&apos;s where a little effort pays off fastest.</p>

        <h2 className="text-2xl font-bold text-gray-800">Put Your Energy Where It Moves the Needle</h2>

        <p className="text-gray-700 custom_html">You can&apos;t stop a company from restructuring. You can decide how sharp and specific you look on paper when the right role opens up. In every market I&apos;ve hired in, the people who tailor beat the people who blast out one generic file &mdash; so that&apos;s where your energy belongs: the resume and the application itself.</p>

        <h2 className="text-2xl font-bold text-gray-800">Tailor Every Resume to the Role</h2>

        <p className="text-gray-700 custom_html">A generic resume asks the reader to do the work of connecting you to the job. A tailored one hands them the match on a plate. It doesn&apos;t take hours &mdash; it takes a few focused edits every time you apply.</p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li className="custom_html"><strong>Mirror the posting:</strong> Pull the exact skills and job titles the description uses, and make sure your resume reflects the same language.</li>
          <li className="custom_html"><strong>Lead with outcomes:</strong> &ldquo;Cut onboarding time 30%&rdquo; lands far harder than &ldquo;responsible for onboarding.&rdquo;</li>
          <li className="custom_html"><strong>Trim the noise:</strong> Cut anything that doesn&apos;t support this specific role so your strongest, most relevant work stands out.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Get Past the Screener First</h2>

        <p className="text-gray-700 custom_html">Most resumes are read by software before a person ever sees them. That&apos;s not a reason to panic &mdash; it&apos;s a checklist. Use the words from the posting, keep the formatting clean and simple, and make your most relevant experience easy to find in the top third of the page.</p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p className="custom_html"><strong>The reframe:</strong> A layoff wave isn&apos;t the end of your options. It&apos;s a reason to show up sharper than everyone still sending the same generic resume into the void.</p>
        </div>

        <p className="text-gray-700 custom_html">
          You don&apos;t have to do the tailoring by hand. ResumAI rewrites your experience into a focused, ATS-ready resume for each role you want &mdash; try the{" "}
          <a href="https://www.resumai.services/app/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">Resume Generator</a>{" "}
          and tailor your next application in minutes, not hours.
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
