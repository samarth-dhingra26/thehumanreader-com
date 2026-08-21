import Button from "../ui/Button";
import styles from "./Dashboard.module.css";
import { CONTACT_EMAIL } from "../../lib/config";

export default function UpsellSection() {
  return (
    <div className={styles.upsell}>
      <h3 className={styles.upsellTitle}>Want feedback like this on your whole essay?</h3>
      <p className={styles.upsellBody}>
        This free review covers one paragraph. Our full coaching service gets you a matched
        human reader on your entire essay, PIQ, or application — start to finish.
      </p>
      <Button href={`mailto:${CONTACT_EMAIL}`}>Ask about the full review</Button>
    </div>
  );
}
