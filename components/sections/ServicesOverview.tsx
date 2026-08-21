import SectionHeading from "../ui/SectionHeading";
import styles from "./ServicesOverview.module.css";

const SERVICES = [
  {
    title: "Common App Essay Review",
    body: "Line-by-line, structure, and voice feedback on your personal statement from a reader matched to your intended major and background.",
  },
  {
    title: "UC PIQ Review",
    body: "Feedback on your Personal Insight Question responses from a reader who understands what UC readers are actually looking for across all eight prompts.",
  },
  {
    title: "Application Coaching",
    body: "Broader guidance on supplemental essays, story selection across your application, and how to keep your voice consistent from school to school.",
  },
];

export default function ServicesOverview() {
  return (
    <section className={styles.section} id="services">
      <SectionHeading title="What we help with" />
      <div className={styles.grid}>
        {SERVICES.map((service) => (
          <div className={styles.card} key={service.title}>
            <h3 className={styles.cardTitle}>{service.title}</h3>
            <p className={styles.cardBody}>{service.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
