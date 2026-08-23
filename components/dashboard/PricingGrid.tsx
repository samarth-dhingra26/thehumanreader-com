"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { TIERS, formatPrice, type TierKey } from "../../lib/stripe/tiers";
import styles from "./PricingGrid.module.css";

export default function PricingGrid() {
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
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error ?? "Something went wrong.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBuyingTier(null);
    }
  }

  return (
    <div className={styles.breakout}>
      <div className={styles.wrap}>
        <h3 className={styles.heading}>Want feedback like this on your whole essay?</h3>
        <p className={styles.subheading}>
          Choose a package to get a matched human reader on your entire application.
        </p>
        <div className={styles.grid}>
          {TIERS.map((tier) => (
            <div className={styles.tier} key={tier.key}>
              {tier.mostPopular && <span className={styles.badge}>Most popular</span>}
              <div className={styles.tierName}>{tier.name}</div>
              <div className={styles.tierPrice}>{formatPrice(tier.priceCents)}</div>
              <div className={styles.tierDescription}>{tier.description}</div>
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
      </div>
    </div>
  );
}
