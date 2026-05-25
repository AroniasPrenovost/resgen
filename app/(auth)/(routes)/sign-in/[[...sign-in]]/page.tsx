import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to ResumAI to build and download your AI-powered, ATS-friendly resume.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/sign-in" },
};

export default function Page() {
  return <SignIn />;
}