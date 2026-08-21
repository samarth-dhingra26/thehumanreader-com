import type { Metadata } from "next";
import LegalLayout from "../../components/legal/LegalLayout";
import { CONTACT_EMAIL, LEGAL_ENTITY_NAME } from "../../lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy — The Human Reader",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        This policy explains what {LEGAL_ENTITY_NAME} collects when you use
        thehumanreader.com, and how it&rsquo;s used.
      </p>

      <h2>What we collect</h2>
      <p>
        When you submit the free Application Score or free paragraph review
        form, we collect your name, email address, the essay type (if
        applicable), and the essay or paragraph text you paste in. We don&rsquo;t
        use cookies or analytics tracking on this site — we only collect
        what you directly submit through a form.
      </p>

      <h2>How it&rsquo;s used</h2>
      <p>
        We use this information solely to deliver the free score or review
        you requested, to match you with a human reader, and to follow up
        with you by email. We do not sell your data, and we do not use
        submitted essay text to train any AI or machine learning model —
        every essay is read only by a human.
      </p>

      <h2>Where it goes</h2>
      <p>
        Form submissions are processed through Formspree, a third-party form
        service, and delivered to our email inbox. Formspree acts as our
        data processor; see{" "}
        <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
          Formspree&rsquo;s privacy policy
        </a>{" "}
        for how they handle data in transit.
      </p>

      <h2>Retention and deletion</h2>
      <p>
        We keep submitted essays and contact information only as long as
        needed to deliver the requested score or review, and delete
        submissions from our inbox and Formspree dashboard once that&rsquo;s
        done. You can ask us to delete your information at any time by
        emailing <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, and
        we&rsquo;ll confirm once it&rsquo;s removed.
      </p>

      <h2>Minors</h2>
      <p>
        Many of our users are high school students. We collect the minimum
        information needed to provide feedback, and a parent or guardian can
        contact us at any time to review, correct, or delete their
        child&rsquo;s information.
      </p>

      <h2>Your rights</h2>
      <p>
        If you&rsquo;re a California resident, you have the right to know what
        personal information we&rsquo;ve collected about you and to request its
        deletion. We don&rsquo;t sell personal information, so there is nothing
        to opt out of. To exercise these rights, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the service grows. Changes will be
        posted on this page with an updated effective date.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalLayout>
  );
}
