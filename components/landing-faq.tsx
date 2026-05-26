"use client";

const faqs = [
  {
    q: "Is this really one-time payment? What's the catch?",
    a: (
      <>
        No catch. $9.99 buys a full month of access — 30 resume generations and unlimited downloads, not a charge per download. Stripe handles the transaction. We don&apos;t store your card. There&apos;s no account that auto-renews. When the month&apos;s up, it&apos;s up — nothing bills automatically. Need access again later? Pay another $9.99. We&apos;d rather earn it each month than trap you in a $24/month auto-renewal you forget about.
      </>
    ),
  },
  {
    q: "Can't I just use ChatGPT for free?",
    a: (
      <>
        You can. You&apos;ll spend 30&ndash;90 minutes wrestling with prompts, formatting in Google Docs, breaking ATS parsing, and re-iterating. We&apos;ve done that work: tested prompts, calibrated against the ATS systems Fortune 500s actually use, and built templates that download as clean .docx.
      </>
    ),
  },
  {
    q: "What if it doesn't work for my industry?",
    a: (
      <>
        The AI tailors to whatever JD you paste in. We&apos;ve shipped resumes for software engineers, nurses, account executives, teachers, mechanics, and analysts. The tone, keyword density, and seniority signals adapt automatically. If it doesn&apos;t fit your role, refund — see the next question.
      </>
    ),
  },
  {
    q: "Will the output sound like AI wrote it?",
    a: (
      <>
        No, because the AI is rewriting <span className="text-white">your</span> material, not inventing from a blank page. It tightens your wording, surfaces metrics you already mentioned, and matches the JD&apos;s tone. You can preview every word before you pay — and edit anything that doesn&apos;t sound like you.
      </>
    ),
  },
  {
    q: "Do you store my resume data?",
    a: (
      <>
        Your data is only stored in your local browser cookies. It&apos;s never shared, and never used to train models.
      </>
    ),
  },
];

export const LandingFaq = () => {
  return (
    <section id="faq" className="py-24 border-t border-[var(--border-soft)]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-eyebrow mb-3">Questions</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] text-white">
            The stuff we&apos;d want to know <span className="italic">first</span>.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="card p-6 group">
              <summary className="flex items-center justify-between font-medium text-white">
                <span>{item.q}</span>
                <svg className="faq-icon flex-shrink-0 ml-4" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </summary>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mt-4">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
