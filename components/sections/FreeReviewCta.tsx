import SectionHeading from "../ui/SectionHeading";
import ParagraphReviewForm from "../forms/ParagraphReviewForm";
import styles from "./CtaSection.module.css";
import cardStyles from "./FreeReviewCta.module.css";

export default function FreeReviewCta() {
  return (
    <section className={styles.section} id="free-review">
      <div className={cardStyles.mobileCard}>
        <SectionHeading title="See a real human read your work">
          Paste in one paragraph — from any essay you&rsquo;re working on — and
          one of our matched human readers will send you real, specific
          feedback. No AI-generated notes, no form-letter advice. This is our
          way of proving it before you ever pay for anything.
        </SectionHeading>
        <p className={styles.microcopy}>
          One paragraph. One real reader. Totally free.
        </p>
        <ParagraphReviewForm />
      </div>
    </section>
  );
}
