import SectionHeading from "../ui/SectionHeading";
import styles from "./Differentiation.module.css";

export default function Differentiation() {
  return (
    <section className={styles.section}>
      <SectionHeading title="Human-matched, not AI-written" />
      <p className={styles.body}>
        Plenty of tools will write your essay for you, or run it through a
        model and hand back generic notes. We think that&rsquo;s exactly
        backwards. Admissions officers are trained to spot a flattened,
        AI-smoothed voice — and they&rsquo;re looking for yours, not a
        template&rsquo;s.
      </p>
      <p className={styles.body}>
        So we use AI behind the scenes for one job only: matching. Every
        essay is paired with a human reader chosen for your specific profile
        — your intended major, your background, the type of essay
        you&rsquo;re writing (Common App personal statement, UC PIQ, or a
        supplemental). The match is smart. The feedback is always, entirely
        human.
      </p>
      <ul className={styles.bullets}>
        <li>Matched to a reader who has actually read essays like yours before.</li>
        <li>Feedback in your reader&rsquo;s own words, not a model&rsquo;s.</li>
        <li>Nothing about your writing is ever rewritten by a machine.</li>
      </ul>
    </section>
  );
}
