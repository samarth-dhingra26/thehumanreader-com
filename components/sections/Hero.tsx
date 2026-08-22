import Button from "../ui/Button";
import GraduateEmblem from "./GraduateEmblem";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.emblem}>
        <GraduateEmblem />
      </div>
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
    </section>
  );
}
