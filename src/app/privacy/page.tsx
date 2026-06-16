import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | KLLCTBLS",
  description:
    "KLLCTBLS privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-12 max-w-3xl prose prose-invert">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground no-underline mb-8 inline-block"
        >
          &larr; Home
        </Link>

        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: May 2, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>
          When you create an account on KLLCTBLS, we collect your email address
          and password. We also store your preferences including saved shows,
          saved shops, alert state selections, and topic interests.
        </p>
        <p>
          When you submit a card show or shop listing, we collect the event or
          business details you provide (name, location, contact information,
          website).
        </p>
        <p>
          We automatically collect basic usage data including pages visited,
          features used, and timestamps. We do not use third-party tracking
          pixels or sell your data to advertisers.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information to provide and improve the KLLCTBLS platform,
          including personalizing your experience with saved shows and
          state-based alerts. Your email is used for account authentication,
          event alert notifications you opt into, and important service updates.
        </p>
        <p>
          Submitted event and shop listings are reviewed by our team and, once
          approved, displayed publicly on the platform.
        </p>

        <h2>3. AI-Powered Features</h2>
        <p>
          KLLCTBLS uses Google Gemini to power our chatbot assistant and blog
          content generation. When you interact with the chatbot, your messages
          are sent to Google Gemini for processing. We log conversations for
          quality improvement and abuse prevention. AI-generated blog posts are
          reviewed by our editorial team before publication.
        </p>
        <p>
          We also query the eBay Browse API to display public sold-listing
          prices when users research card values. No eBay user data is collected
          or stored.
        </p>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell, rent, or share your personal information with third
          parties for marketing purposes. We share data only with service
          providers necessary to operate the platform: Supabase (database and
          authentication), Google Cloud (maps, AI services), eBay (public
          listing data), MailerLite (email notifications), and Vercel (hosting).
        </p>

        <h2>5. Data Security</h2>
        <p>
          We use industry-standard security measures including encrypted
          connections (HTTPS), secure cookie-based authentication, row-level
          security policies on our database, and environment-variable storage
          for all API credentials. Passwords are hashed and never stored in
          plain text.
        </p>

        <h2>6. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. We
          do not use advertising or tracking cookies. You can manage cookie
          preferences through our cookie consent banner.
        </p>

        <h2>7. Your Rights</h2>
        <p>
          You can access, update, or delete your account data at any time
          through your dashboard settings. To request complete data deletion,
          contact us at the email below. We respond to all data requests within
          30 days.
        </p>

        <h2>8. Children</h2>
        <p>
          KLLCTBLS is not directed at children under 13. We do not knowingly
          collect personal information from children under 13. If you believe we
          have collected such information, please contact us immediately.
        </p>

        <h2>9. Changes</h2>
        <p>
          We may update this policy from time to time. We will notify registered
          users of material changes via email. Continued use of the platform
          after changes constitutes acceptance of the updated policy.
        </p>

        <h2>10. Contact</h2>
        <p>
          For privacy questions or data requests, contact us at
          privacy@kllctbls.com.
        </p>
      </article>
    </div>
  );
}
