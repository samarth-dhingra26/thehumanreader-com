"use client";

import { useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";
import { TIERS, formatPrice, type TierKey } from "../../lib/stripe/tiers";
import styles from "./PricingSection.module.css";

export default function PricingSection() {
  const [buyingTier, setBuyingTier] = useState<TierKey | null>(null);
  const [error, setError] = useState("");

  async function handleBuy(tier: TierKey) {
    setBuyingTier(tier);
    setError("");
    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      if (response.status === 401) {
        window.location.href = `/login?redirect=${encodeURIComponent("/#pricing")}`;
        return;
      }
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error ?? "Something went wrong.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBuyingTier(null);
    }
  }

  return (
    <section className={styles.section} id="pricing">
      <SectionHeading title="Packages for your full application">
        Choose a package to get every essay and PIQ reviewed by a matched human reader.
      </SectionHeading>
      <div className={styles.grid}>
        {TIERS.map((tier) => (
          <div className={styles.card} key={tier.key}>
            {tier.mostPopular && <span className={styles.badge}>Most popular</span>}
            <div className={styles.tierName}>{tier.name}</div>
            <div className={styles.tierPrice}>{formatPrice(tier.priceCents)}</div>
            <p className={styles.tierDescription}>{tier.description}</p>
            <Button
              variant={tier.mostPopular ? "primary" : "secondary"}
              onClick={() => handleBuy(tier.key)}
              disabled={buyingTier !== null}
            >
              {buyingTier === tier.key ? "Redirecting…" : "Choose"}
            </Button>
          </div>
        ))}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.cta}>
        <Button href="#free-review" variant="secondary">
          Not sure yet? Start with a free paragraph review
        </Button>
      </div>
    </section>
  );
}
