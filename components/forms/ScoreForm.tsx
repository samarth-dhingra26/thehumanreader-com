import FormShell from "./FormShell";
import { FORM_ENDPOINTS } from "../../lib/config";
import styles from "./FormShell.module.css";

export default function ScoreForm() {
  return (
    <FormShell
      endpoint={FORM_ENDPOINTS.scoreRequest}
      subject="New free Application Score request"
      submitLabel="Get my free score"
      successMessage="Got it — we'll send your score and notes within 3 business days."
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="score-name">
          Name
        </label>
        <input className={styles.input} id="score-name" name="name" type="text" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="score-email">
          Email
        </label>
        <input
          className={styles.input}
          id="score-email"
          name="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="score-essay-type">
          Essay type
        </label>
        <select className={styles.select} id="score-essay-type" name="essayType" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          <option value="Common App personal essay">Common App personal essay</option>
          <option value="UC PIQ">UC PIQ</option>
          <option value="Supplemental essay">Supplemental essay</option>
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="score-essay-text">
          Paste your essay or draft
        </label>
        <textarea
          className={styles.textarea}
          id="score-essay-text"
          name="essayText"
          maxLength={6000}
          required
        />
      </div>
    </FormShell>
  );
}
