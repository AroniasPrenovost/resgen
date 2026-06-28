import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the ResumAI team — use the in-app chat or email us. We're a small team and read every message.",
  alternates: { canonical: "/contact" },
};

const ContactPage = () => {
  return (
    <LegalShell
      title="Contact us"
      intro="We're a small team and we read every message. Here's the fastest way to reach a human."
    >
      <h2>Live chat</h2>
      <p>
        The quickest option is the chat bubble in the bottom corner of the site.
        Send us a note there and we&apos;ll get back to you as soon as we can.
      </p>

      <h2>Email</h2>
      <p>
        Prefer email? Reach us at{" "}
        <a href="mailto:support@resumai.services">support@resumai.services</a>.
        We typically reply within one business day.
      </p>

      <h2>Before you write</h2>
      <p>
        Many common questions — pricing, how access works, data and privacy — are
        answered on the <a href="/#faq">FAQ</a>. If you don&apos;t find what you
        need there, we&apos;re happy to help.
      </p>
    </LegalShell>
  );
};

export default ContactPage;
