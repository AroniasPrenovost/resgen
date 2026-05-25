import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard – AI-Assisted Resumes",
  description:
    "Your ResumAI dashboard. Access the AI resume generator and create tailored, ATS-friendly resumes that help you land more interviews.",
  alternates: { canonical: "/app/dashboard" },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
