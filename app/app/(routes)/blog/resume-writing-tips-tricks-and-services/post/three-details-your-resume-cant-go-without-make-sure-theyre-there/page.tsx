import type { Metadata } from "next";
import { Send, User } from "lucide-react";
import { Heading } from "@/components/heading";
import { JsonLd } from "@/components/json-ld";
import { blogPostSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Three details your resume can't go without. Make sure they're there.",
  description: "Make your resume clean, readable, and ATS-friendly with these key formatting tips.",
  alternates: {
    canonical: "/app/blog/resume-writing-tips-tricks-and-services/post/three-details-your-resume-cant-go-without-make-sure-theyre-there",
  },
  openGraph: {
    title: "Three details your resume can't go without. Make sure they're there. | ResumAI Blog",
    description: "Make your resume clean, readable, and ATS-friendly with these key formatting tips.",
    url: "/app/blog/resume-writing-tips-tricks-and-services/post/three-details-your-resume-cant-go-without-make-sure-theyre-there",
    type: "article",
    publishedTime: "2026-08-12T21:14:06.000Z",
  },
};

const BlogDetailPage = async () => {
  return (
    <article className="min-h-screen bg-gray-50">
      <JsonLd
        data={blogPostSchema({
          title: "Three details your resume can't go without. Make sure they're there.",
          description: "Make your resume clean, readable, and ATS-friendly with these key formatting tips.",
          slug: "three-details-your-resume-cant-go-without-make-sure-theyre-there",
          datePublished: "2026-08-12T21:14:06.000Z",
          authorName: "Ian Vensel",
          authorRole: "Career Coach",
          faqs: [{"question": "How do I make my resume ATS-friendly?", "answer": "Use simple templates, include relevant keywords, and avoid complex graphics that ATS systems can't read."}],
        })}
      />
      <header>
        <Heading
          title={"Three details your resume can't go without. Make sure they're there."}
          description={"Keep your resume polished for human and machine eyes alike."}
          icon={Send}
          iconColor="text-blue-700"
          bgColor="bg-gray-700/10"
        />
      </header>
      <section className="px-8 lg:px-16 py-0 space-y-6">
        <p className="text-gray-700 custom_html">I stumbled upon a headline about job opportunities at the Kern County Fair, and it got me thinking: many folks might be sending off resumes that aren&apos;t ready for prime time. Let&apos;s cut through the noise and talk about making your resume clean, skimmable, and ATS-safe.</p>

        <h2 className="text-2xl font-bold text-gray-800">Think like a recruiter scanning fast</h2>

        <p className="text-gray-700 custom_html">When a recruiter looks at your resume, trust me, it&apos;s not a leisurely read. It&apos;s a quick scan for key phrases that match the job description. So, what can you do? Keep it clean by using simple layouts and avoiding fancy fonts. Use headers like &apos;Experience&apos; and &apos;Education&apos; to guide the reader&apos;s eye. If I can&apos;t find your skills in 10 seconds, I&apos;m onto the next resume.</p>

        <p className="text-gray-700 custom_html">Here&apos;s a quick before and after to consider:</p>

        <p className="text-gray-700 custom_html">Before: Managed team of 5 in daily tasks</p>

        <p className="text-gray-700 custom_html">After: Led a team of 5, boosting productivity by 15%</p>

        <h2 className="text-2xl font-bold text-gray-800">Why details matter more than ever</h2>

        <p className="text-gray-700 custom_html">Ever wonder why the ATS spits out your resume before a human even gets a look? It&apos;s because many resumes lack the right details. Use industry-specific keywords from the job description to make sure your resume doesn&apos;t get filtered out. Specificity is your friend here.</p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li className="custom_html"><strong>Use relevant keywords:</strong> If the job description mentions &apos;project management,&apos; make sure it&apos;s in your resume.</li>
          <li className="custom_html"><strong>Quantify achievements:</strong> Numbers stand out, don&apos;t just say you led a team; note the percentage increase in efficiency you achieved.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Is your resume ATS-safe?</h2>

        <p className="text-gray-700 custom_html">What does it even mean to be ATS-safe? In simple terms, it means your resume can be read by the software employers use to sort through applications. Avoid images, charts, or anything the software might not be able to read. Stick to simple bullet points and clear, concise language.</p>

        <h2 className="text-2xl font-bold text-gray-800">Proofread like your job depends on it</h2>

        <p className="text-gray-700 custom_html">I&apos;ll be honest: a typo might not be the end of the world, but it won&apos;t do you any favors. Proofread your resume until you&apos;re sure it&apos;s spotless. Run it by a friend or use a tool like Grammarly to catch any errors you might miss. It&apos;s a small step that can make a big difference.</p>

        <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-2">How do I make my resume ATS-friendly?</h3>

        <p className="text-gray-700 custom_html">Use simple templates, include relevant keywords, and avoid complex graphics that ATS systems can&apos;t read.</p>

        <p className="text-gray-700 custom_html">
          Generate a tailored, ATS-friendly resume with ResumAI&apos;s Resume Generator today.{" "}
          <a href="https://www.resumai.services/app/resume-generator" className="text-blue-700 hover:underline" title="ResumAI - Resume Generator">Resume Generator</a>{" "}
          and give your next application a real shot at getting read.
        </p>
      </section>
      <footer className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Ian Vensel</p>
            <p className="text-sm text-gray-600 font-small">Career Coach</p>
            <p className="text-gray-600 pt-2">
              Ian spent 19 years in agency recruiting before going independent, and is happy to tell you when the popular advice is wrong.
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default BlogDetailPage;
