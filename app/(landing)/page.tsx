import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";
import { LandingSocialProof } from "@/components/landing-social-proof";
import { LandingComparison } from "@/components/landing-comparison";
import { LandingFeatures } from "@/components/landing-features";
import { LandingHowItWorks } from "@/components/landing-how-it-works";
import { LandingContent } from "@/components/landing-content";
import { LandingPricing } from "@/components/landing-pricing";
import { LandingFaq } from "@/components/landing-faq";
import { LandingFinalCta } from "@/components/landing-final-cta";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { softwareApplicationSchema, faqSchema } from "@/lib/structured-data";

// Mirrors the visible Q&A in components/landing-faq.tsx (required for FAQ rich results).
const landingFaqs = [
  {
    question: "Is this really one-time payment? What's the catch?",
    answer:
      "No catch. $9.99 buys 30 days of access — 30 resume generations and unlimited downloads, not a charge per download. Stripe handles the transaction and we don't store your card. Nothing auto-renews; when the 30 days are up, that's it. Need access again later? Pay another $9.99.",
  },
  {
    question: "Can't I just use ChatGPT for free?",
    answer:
      "You can, but you'll spend 30–90 minutes wrestling with prompts, formatting in Google Docs, and breaking ATS parsing. We've already done that work: tested prompts, calibrated against the ATS systems Fortune 500s use, and built templates that download as clean .docx.",
  },
  {
    question: "What if it doesn't work for my industry?",
    answer:
      "The AI tailors to whatever job description you paste in. We've shipped resumes for software engineers, nurses, account executives, teachers, mechanics, and analysts. The tone, keyword density, and seniority signals adapt automatically.",
  },
  {
    question: "Will the output sound like AI wrote it?",
    answer:
      "No, because the AI is rewriting your material, not inventing from a blank page. It tightens your wording, surfaces metrics you already mentioned, and matches the job description's tone. You can preview every word before you pay and edit anything that doesn't sound like you.",
  },
  {
    question: "Do you store my resume data?",
    answer:
      "Your data is only stored in your local browser cookies. It's never shared, and never used to train models.",
  },
];

const LandingPage = () => {
  return (
    <div className="h-full">
      <JsonLd data={[softwareApplicationSchema(), faqSchema(landingFaqs)]} />
      <LandingNavbar />
      <LandingHero />
      <LandingSocialProof />
      <LandingComparison />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingContent />
      <LandingPricing />
      <LandingFaq />
      <LandingFinalCta />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
