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

const LandingPage = () => {
  return (
    <div className="h-full">
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
