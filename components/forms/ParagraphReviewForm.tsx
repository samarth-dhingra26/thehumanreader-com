import FormShell from "./FormShell";
import { FORM_ENDPOINTS } from "../../lib/config";
import styles from "./FormShell.module.css";

export default function ParagraphReviewForm() {
  return (
    <FormShell
      endpoint={FORM_ENDPOINTS.paragraphReview}
      subject="New free paragraph review request"
      submitLabel="Get my free paragraph review"
      successMessage="Got it — a matched reader will get back to you within a couple of days."
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="review-name">
          Name
        </label>
        <input className={styles.input} id="review-name" name="name" type="text" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="review-email">
          Email
        </label>
        <input className={styles.input} id="review-email" name="email" type="email" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="review-paragraph">
          Paste one paragraph
        </label>
        <textarea
          className={styles.textarea}
          id="review-paragraph"
          name="paragraph"
          maxLength={1200}
          required
        />
      </div>
    </FormShell>
  );
}
