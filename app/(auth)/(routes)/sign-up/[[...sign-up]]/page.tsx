import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Create Your Free Account",
  description: "Sign up for ResumAI and start building a tailored, ATS-friendly resume in minutes — free to start.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/sign-up" },
};

export default function Page() {
  return <SignUp />;
};
