import SectionHeading from "../ui/SectionHeading";
import styles from "./HowMatchingWorks.module.css";

const STEPS = [
  {
    title: "Tell us about your essay",
    body: "Share your essay type, intended major or interests, and background.",
  },
  {
    title: "We match you to a human reader",
    body: "Our system looks across our reader pool for the best fit for your specific profile — not just whoever's next in line.",
  },
  {
    title: "A real person reads and responds",
    body: "Your matched reader reads your work and writes feedback themselves. No AI ever touches your words.",
  },
  {
    title: "You revise in your own voice",
    body: "You get notes designed to sharpen what's already yours, not replace it.",
  },
];

export default function HowMatchingWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <SectionHeading title="How our matching works" />
      <div className={styles.steps}>
        {STEPS.map((step, index) => (
          <div className={styles.step} key={step.title}>
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
