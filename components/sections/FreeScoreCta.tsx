import SectionHeading from "../ui/SectionHeading";
import ScoreForm from "../forms/ScoreForm";
import styles from "./CtaSection.module.css";

export default function FreeScoreCta() {
  return (
    <section className={styles.section} id="free-score">
      <SectionHeading title="How strong is your essay right now?">
        Get a free Application Score out of 100 — a diagnostic based on a
        rubric built around UC PIQ readiness and general college-essay
        quality, whichever applies to what you&rsquo;re working on. Along
        with your score, you&rsquo;ll get a written explanation of what&rsquo;s
        holding it back and how to raise it.
      </SectionHeading>
      <p className={styles.microcopy}>
        This is a free diagnostic, not the full review — think of it as your
        starting line.
      </p>
      <ScoreForm />
    </section>
  );
}
