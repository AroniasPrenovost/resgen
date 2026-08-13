// Centralized JSON-LD structured data builders for SEO rich results.
// All builders return plain objects rendered via <JsonLd /> (components/json-ld.tsx).

export const SITE_URL = "https://resumai.services";
export const SITE_NAME = "ResumAI";
const LOGO_URL = `${SITE_URL}/transcript.png`;

/** Absolute URL helper — accepts a path ("/app/blog") or an already-absolute URL. */
export const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Organization — establishes the brand entity for the knowledge graph. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
    description:
      "ResumAI is an AI-powered resume builder that turns your experience into tailored, ATS-friendly resumes in minutes.",
  };
}

/** WebSite — names the site and links it to the publishing organization. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

/** SoftwareApplication — describes the product so Google can surface it as an app/offer. */
export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI-powered resume builder that rewrites your experience into tailored, ATS-friendly resumes. Paste a job description and download polished resume versions in minutes.",
    offers: {
      "@type": "Offer",
      price: "9.99",
      priceCurrency: "USD",
      description: "30 days of access — 30 resume generations and unlimited downloads. No subscription.",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

type Faq = { question: string; answer: string };

/** FAQPage — eligible for FAQ rich snippets. Answers must match visible page text. */
export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** BreadcrumbList — renders the breadcrumb trail in search results. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** BlogPosting + breadcrumb trail + optional FAQ rich-result for a single article. */
export function blogPostSchema(post: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  authorName?: string;
  authorRole?: string;
  faqs?: { question: string; answer: string }[];
}) {
  const url = abs(`/app/blog/resume-writing-tips-tricks-and-services/post/${post.slug}`);

  const author =
    post.authorName
      ? { "@type": "Person", name: post.authorName, ...(post.authorRole ? { jobTitle: post.authorRole } : {}) }
      : { "@type": "Organization", name: SITE_NAME, url: SITE_URL };

  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      datePublished: post.datePublished,
      dateModified: post.datePublished,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: LOGO_URL,
      author,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/app/blog" },
      { name: post.title, path: `/app/blog/resume-writing-tips-tricks-and-services/post/${post.slug}` },
    ]),
  ];

  if (post.faqs && post.faqs.length > 0) {
    schemas.push(faqSchema(post.faqs));
  }

  return schemas;
}
