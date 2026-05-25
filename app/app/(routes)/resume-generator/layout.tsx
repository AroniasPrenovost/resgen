import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Generator – Build an ATS-Friendly Resume",
  description:
    "Generate a tailored, ATS-friendly resume in minutes. Paste your experience and a job description, and ResumAI builds polished, downloadable resume versions for you.",
  alternates: { canonical: "/app/resume-generator" },
  openGraph: {
    title: "AI Resume Generator – Build an ATS-Friendly Resume | ResumAI",
    description:
      "Generate a tailored, ATS-friendly resume in minutes. Paste your experience and a job description, and ResumAI builds polished, downloadable resume versions for you.",
    url: "/app/resume-generator",
    type: "website",
  },
};

export default function ResumeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
