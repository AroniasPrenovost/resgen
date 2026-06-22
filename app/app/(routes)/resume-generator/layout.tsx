import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";

// Same display serif the marketing landing page uses — keeps the two pages
// visually identical so brand trust carries through to checkout.
const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

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
  return (
    <div className={`generator-redesign ${instrumentSerif.variable}`}>
      {children}
    </div>
  );
}
