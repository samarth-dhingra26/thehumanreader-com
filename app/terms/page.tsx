import type { Metadata } from "next";
import LegalLayout from "../../components/legal/LegalLayout";
import { CONTACT_EMAIL, LEGAL_ENTITY_NAME } from "../../lib/config";

export const metadata: Metadata = {
  title: "Terms of Service — The Human Reader",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        These terms govern your use of {LEGAL_ENTITY_NAME} (&ldquo;we,&rdquo;
        &ldquo;us&rdquo;) and the services offered at thehumanreader.com. By
        submitting a form or otherwise using this site, you agree to these
        terms.
      </p>

      <h2>What we provide</h2>
      <p>
        We provide feedback, scores, and coaching on college application
        essays, UC Personal Insight Questions (PIQs), and related written
        materials. All feedback is written by a human reader — we do not use
        AI to write, rewrite, or generate any part of your essay, and we do
        not use AI to generate the substance of the feedback you receive. We
        use automated matching only to pair your submission with an
        appropriate human reader.
      </p>

      <h2>No guarantee of outcomes</h2>
      <p>
        Your Application Score and any written feedback are diagnostic
        opinions intended to help you improve your writing. They are not a
        guarantee of admission, a specific score improvement, financial aid,
        or any other outcome. College admissions decisions depend on many
        factors outside our control.
      </p>

      <h2>Your essay stays yours</h2>
      <p>
        You retain full ownership of anything you submit. Submitting an
        essay, PIQ, or paragraph to us does not transfer any ownership or
        license beyond what is needed for a matched reader to read and
        respond to it. Do not submit writing that isn&rsquo;t your own or that
        you don&rsquo;t have permission to share.
      </p>

      <h2>Eligibility and parental consent</h2>
      <p>
        You must be at least 13 years old to use this service. If you are
        under 18, you confirm that a parent or guardian is aware of and
        consents to your use of this service, including the submission of
        your essay content to a matched human reader.
      </p>

      <h2>Free offers</h2>
      <p>
        The free Application Score and free paragraph review are each
        limited to one submission per person and are offered at our
        discretion. We may decline or limit submissions that appear abusive,
        automated, or unrelated to a genuine college application essay.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Submit only your own original writing, or writing you have permission to share.</li>
        <li>Do not use this service to plagiarize, or to have someone else&rsquo;s words presented as your own beyond the feedback you receive.</li>
        <li>Do not attempt to disrupt, scrape, or misuse the site or its forms.</li>
      </ul>

      <h2>Limitation of liability</h2>
      <p>
        The service is provided &ldquo;as is,&rdquo; without warranties of any
        kind. To the fullest extent permitted by law, our liability for any
        claim arising from your use of this service is limited to the amount
        you paid us in the twelve months before the claim, and we are not
        liable for indirect, incidental, or consequential damages, including
        lost admissions opportunities or scholarships.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Changes will be posted
        on this page with an updated effective date.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of California.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalLayout>
  );
}
