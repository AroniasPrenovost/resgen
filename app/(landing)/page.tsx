import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";
import { LandingContent } from "@/components/landing-content";

const LandingPage = () => {
  const year = new Date().getFullYear();
  return (
    <div className="h-full ">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
      <p className="text-zinc-400 text-sm"
        style={{
        // color: "#ffffff",
        // marginLeft: "36px !important"
      }}>
        © {year} ResumeAI, Inc.
      </p>
      <br/>
    </div>
   );
}

export default LandingPage;
