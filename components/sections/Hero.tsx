import Image from "next/image";
import Button from "../ui/Button";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div>
        <span className={styles.badge}>
          <span className={styles.dot} />
          Human Readers, Not AI
        </span>
        <h1 className={styles.title}>Colleges want your essay to be unmistakably yours.</h1>
        <p className={styles.subhead}>
          We help you stand out of the crowd. The Human Reader Coach works
          with you 1-on-1 as you plan, write, revise, and finalize every
          written part of every application — essays, activities lists,
          additional information, portfolios, scholarship essays, and more!
        </p>
        <div className={styles.ctas}>
          <Button href="#free-review">Get one paragraph reviewed, free</Button>
          <Button href="#free-score" variant="secondary">
            Get your free Application Score
          </Button>
        </div>
        <p className={styles.caption}>
          No credit card. No AI-generated feedback. Just a real reader.
        </p>
        <div className={styles.inlineStats}>
          <span>All-human review</span>
          <span>Free to try</span>
          <span>3-day turnaround</span>
        </div>
      </div>
      <div className={styles.photoColumn}>
        <div className={styles.photoCard}>
          <Image
            src="/hero-reader.png"
            alt="Two students celebrating in graduation caps and gowns"
            fill
            sizes="(max-width: 56rem) 90vw, 22rem"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className={styles.statusCard}>
            <span className={styles.dot} />
            <span>
              College Applications reviewed by a human —{" "}
              <span className={styles.statusMuted}>not AI</span>
            </span>
          </div>
        </div>
        <p className={styles.tagline}>
          become <strong>unmistakably you.</strong>
        </p>
      </div>
    </section>
  );
}
