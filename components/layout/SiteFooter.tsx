import { CONTACT_EMAIL } from "../../lib/config";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wordmark}>The Human Reader</div>
      <p className={styles.tagline}>Your essays need to be you. Not AI.</p>
      <p className={styles.meta}>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
      <p className={styles.meta}>© 2026 The Human Reader</p>
    </footer>
  );
}
