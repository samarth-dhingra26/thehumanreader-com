import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";
import { TIERS, formatPrice } from "../../lib/stripe/tiers";
import styles from "./PricingSection.module.css";

export default function PricingSection() {
  return (
    <section className={styles.section} id="pricing">
      <SectionHeading title="Packages for your full application">
        Start with a free paragraph review. Once you see the feedback, choose
        a package to get every essay and PIQ reviewed.
      </SectionHeading>
      <div className={styles.grid}>
        {TIERS.map((tier) => (
          <div className={styles.card} key={tier.key}>
            {tier.mostPopular && <span className={styles.badge}>Most popular</span>}
            <div className={styles.tierName}>{tier.name}</div>
            <div className={styles.tierPrice}>{formatPrice(tier.priceCents)}</div>
            <p className={styles.tierDescription}>{tier.description}</p>
          </div>
        ))}
      </div>
      <div className={styles.cta}>
        <Button href="#free-review">Start with a free paragraph review</Button>
      </div>
    </section>
  );
}
