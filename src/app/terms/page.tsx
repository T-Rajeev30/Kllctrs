import Link from "next/link";

export const metadata = {
  title: "Terms of Service | KLLCTBLS",
  description:
    "KLLCTBLS terms of service — rules and guidelines for using the platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-12 max-w-3xl prose prose-invert">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground no-underline mb-8 inline-block"
        >
          &larr; Home
        </Link>

        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: May 2, 2026</p>

        <h2>1. Acceptance</h2>
        <p>
          By accessing or using KLLCTBLS, you agree to these Terms of Service.
          If you do not agree, do not use the platform.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          KLLCTBLS is a discovery platform for sports card collectors. We
          provide a directory of card shows, card shops, and industry sponsors
          across the United States. We also offer AI-powered tools including a
          chatbot assistant and automated blog content.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          You must provide a valid email address to create an account. You are
          responsible for maintaining the confidentiality of your credentials
          and for all activity under your account. You must be at least 13 years
          old to use KLLCTBLS.
        </p>

        <h2>4. User-Submitted Content</h2>
        <p>
          You may submit card show and shop listings for inclusion on the
          platform. By submitting, you represent that the information is
          accurate and that you have the right to share it. All submissions are
          subject to review and approval by our team. We reserve the right to
          reject, edit, or remove any submission at our discretion.
        </p>
        <p>
          You retain ownership of content you submit but grant KLLCTBLS a
          non-exclusive, royalty-free license to display, distribute, and
          promote your submissions on the platform.
        </p>

        <h2>5. AI-Generated Content</h2>
        <p>
          Our chatbot and blog generation features use artificial intelligence.
          AI responses may contain inaccuracies. We display a disclaimer on all
          AI-powered features. Users should verify important information
          independently, especially regarding event dates, locations, pricing,
          and card valuations.
        </p>
        <p>
          eBay price data shown through our chatbot represents current asking
          prices or recent sold listings and should not be considered appraisals
          or guaranteed valuations.
        </p>

        <h2>6. Prohibited Conduct</h2>
        <p>
          You agree not to: submit false or misleading event or shop
          information, use automated tools to scrape or harvest data from the
          platform, attempt to gain unauthorized access to other accounts or
          platform infrastructure, use the platform for illegal purposes, or
          interfere with the normal operation of the service.
        </p>

        <h2>7. Intellectual Property</h2>
        <p>
          The KLLCTBLS name, logo, design, and original content are owned by
          KLLCTBLS. Third-party trademarks (PSA, Beckett, eBay, Topps, etc.)
          belong to their respective owners and are used for identification
          purposes only.
        </p>

        <h2>8. Disclaimer of Warranties</h2>
        <p>
          KLLCTBLS is provided as-is without warranties of any kind. We do not
          guarantee the accuracy, completeness, or timeliness of event listings,
          shop information, or AI-generated content. We are not responsible for
          the actions of event organizers, shop owners, or other users.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, KLLCTBLS shall not be liable
          for any indirect, incidental, special, or consequential damages
          arising from your use of the platform, including but not limited to
          losses from attending events, purchasing cards based on AI-provided
          valuations, or relying on user-submitted information.
        </p>

        <h2>10. Termination</h2>
        <p>
          We may suspend or terminate your account at any time for violation of
          these terms or for any reason at our discretion. You may delete your
          account at any time through your dashboard settings.
        </p>

        <h2>11. Changes</h2>
        <p>
          We may modify these terms at any time. Material changes will be
          communicated via email to registered users. Continued use after
          changes constitutes acceptance.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These terms are governed by the laws of the United States. Any
          disputes shall be resolved in the courts of the State of Delaware.
        </p>

        <h2>13. Contact</h2>
        <p>
          For questions about these terms, contact us at legal@kllctbls.com.
        </p>
      </article>
    </div>
  );
}
