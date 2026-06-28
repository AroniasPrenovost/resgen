import { ImageResponse } from "next/server";

// Site-wide branded OpenGraph/social card, generated at the edge.
// Inherited by every route that doesn't define its own opengraph-image.
export const runtime = "edge";
export const alt = "ResumAI – AI-Powered Resume Generator for ATS-Friendly Resumes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0A0B14",
          backgroundImage:
            "linear-gradient(135deg, #0A0B14 0%, #161232 52%, #211425 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: wordmark + offer chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: "linear-gradient(135deg, #A78BFA, #EC4899)",
                color: "#0A0B14",
                fontSize: "30px",
                fontWeight: 800,
              }}
            >
              R
            </div>
            <div
              style={{
                marginLeft: "20px",
                color: "#F5F5F7",
                fontSize: "34px",
                fontWeight: 700,
              }}
            >
              ResumAI
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 22px",
              borderRadius: "999px",
              border: "1px solid rgba(52,211,153,0.4)",
              backgroundColor: "rgba(52,211,153,0.08)",
              color: "#6EE7B7",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            $9.99 · No subscription
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#FFFFFF",
              fontSize: "78px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            AI resumes that get you hired.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "28px",
              color: "#9097A8",
              fontSize: "32px",
              lineHeight: 1.3,
              maxWidth: "880px",
            }}
          >
            Paste any job description. We rewrite your resume to beat the ATS bots
            and land on a recruiter&apos;s desk — in minutes.
          </div>
        </div>

        {/* Bottom row: feature tags + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {["ATS-Friendly", "Tailored", "Download .docx"].map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  marginRight: "16px",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#C4B5FD",
                  fontSize: "24px",
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", color: "#6B7280", fontSize: "26px" }}>
            resumai.services
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
