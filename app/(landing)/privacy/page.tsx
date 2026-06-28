import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ResumAI handles your data: resume content stays in your browser, payments run through Stripe, and we never sell your information.",
  alternates: { canonical: "/privacy" },
};

const PrivacyPage = () => {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="June 28, 2026"
      intro="ResumAI is built to need as little of your data as possible. There's no account to create, and your resume content lives on your own device — not our servers."
    >
      <h2>What we collect</h2>
      <p>
        ResumAI does not require you to create an account. The resume details you
        type or upload are kept in your browser&apos;s local storage on your own
        device. We do not store your resume content on our servers.
      </p>

      <h2>How your resume is processed</h2>
      <p>
        To rewrite and tailor your resume, the content you provide is sent to our
        AI provider (OpenAI) solely to generate your result. Under their API
        terms, this content is not used to train their models. We do not retain
        a copy after the result is returned to your browser.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed by <strong>Stripe</strong>. We never see or store
        your full card details. Stripe handles the transaction and its own
        handling of your payment information is governed by Stripe&apos;s privacy
        policy.
      </p>

      <h2>Analytics and support</h2>
      <ul>
        <li>
          We use privacy-friendly product analytics (Vercel Analytics) to
          understand aggregate, anonymized usage — not to identify you.
        </li>
        <li>
          If you message us through the in-app chat (Crisp), those messages are
          processed by that provider so we can respond.
        </li>
      </ul>

      <h2>Cookies and local storage</h2>
      <p>
        We use your browser&apos;s local storage to remember your progress, how
        many resumes you&apos;ve generated, and whether you have active access.
        Clearing your browser storage removes this data — and may also remove
        access you&apos;ve paid for on that device.
      </p>

      <h2>Data sharing</h2>
      <p>
        We do not sell your personal information. We share data only with the
        service providers above (OpenAI, Stripe, Vercel, Crisp) strictly to
        operate ResumAI.
      </p>

      <h2>Your choices</h2>
      <p>
        Because your resume content is stored locally, you can remove it at any
        time by clearing your browser&apos;s site data for ResumAI.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Reach us via the chat bubble in the corner of
        the site, or see our <a href="/contact">contact page</a>.
      </p>
    </LegalShell>
  );
};

export default PrivacyPage;
