import Button from "../ui/Button";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div>
        <span className={styles.badge}>
          <span className={styles.dot} />
          human readers matched daily
        </span>
        <h1 className={styles.title}>Your essays need to be you. Not AI.</h1>
        <p className={styles.subhead}>
          We use AI for exactly one thing: finding the right human for your
          essay. Every review, every score, every note in the margins comes
          from a real person who reads for a living.
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
      </div>
      <div className={styles.photoColumn}>
        <div className={styles.photoCard}>
          {/* TODO: replace with a real portrait image (e.g. public/hero-reader.jpg + <img>) */}
          <div className={styles.photoPlaceholderHint}>photo of a matched human reader</div>
          <div className={styles.statusCard}>
            <span className={styles.dot} />
            <span>
              reviewed by a human — <span className={styles.statusMuted}>not AI</span>
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
