import FormShell from "./FormShell";
import { FORM_ENDPOINTS } from "../../lib/config";
import styles from "./FormShell.module.css";

export default function ContactForm() {
  return (
    <FormShell
      endpoint={FORM_ENDPOINTS.paragraphReview}
      subject="Contact form query"
      submitLabel="Send message"
      successMessage="Got it — we'll get back to you within a business day."
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-name">
          Name
        </label>
        <input className={styles.input} id="contact-name" name="name" type="text" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-email">
          Email
        </label>
        <input className={styles.input} id="contact-email" name="email" type="email" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-message">
          Message
        </label>
        <textarea
          className={styles.textarea}
          id="contact-message"
          name="message"
          maxLength={2000}
          required
        />
      </div>
    </FormShell>
  );
}
