import Image from "next/image";
import Button from "../ui/Button";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.desktopHero}>
        <div className={styles.frame}>
          <Image
            src="/hero-reader.png"
            alt="Two students celebrating in graduation caps and gowns"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className={styles.scrim} />
          <div className={styles.content}>
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
              <Button href="#free-review" variant="accent">
                Get one paragraph reviewed, free
              </Button>
              <Button href="#free-score" variant="ghostLight">
                Get your free Application Score
              </Button>
            </div>
            <div className={styles.inlineStats}>
              <span>All-human review</span>
              <span>Free to try</span>
              <span>3-day turnaround</span>
              <span className={styles.tagline}>
                become <strong>unmistakably you.</strong>
              </span>
            </div>
          </div>
          <div className={styles.statusCard}>
            <span className={styles.statusDot} />
            <span>
              College applications reviewed by a human —{" "}
              <span className={styles.statusMuted}>not AI</span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.mobileHero}>
        <span className={styles.mobileBadge}>
          <span className={styles.dot} />
          Human Readers, Not AI
        </span>
        <h1 className={styles.mobileTitle}>Colleges want your essay to be unmistakably yours.</h1>
        <p className={styles.mobileSubhead}>
          The Human Reader Coach works 1-on-1 with you on every essay.
        </p>
        <Button href="#free-review" variant="accent">
          Get one paragraph reviewed, free
        </Button>
        <p className={styles.mobileCaption}>No card. No AI. A real reader replies in 3 days.</p>
        <div className={styles.mobilePhoto}>
          <Image
            src="/essay-hero.jpg"
            alt="A handwritten college application essay draft with pencil notes in the margin"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  );
}
