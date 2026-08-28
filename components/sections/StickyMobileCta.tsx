import Button from "../ui/Button";
import styles from "./StickyMobileCta.module.css";

export default function StickyMobileCta() {
  return (
    <div className={styles.bar}>
      <Button href="#free-review" variant="accent">
        Get one paragraph reviewed, free
      </Button>
    </div>
  );
}
