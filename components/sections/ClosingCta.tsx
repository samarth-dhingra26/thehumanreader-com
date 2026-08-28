import Button from "../ui/Button";
import styles from "./ClosingCta.module.css";

export default function ClosingCta() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Not sure yet?</h2>
      <p className={styles.body}>Start with one free paragraph. It costs nothing to see.</p>
      <Button href="#free-review" variant="primary">
        Get my free review
      </Button>
    </section>
  );
}
