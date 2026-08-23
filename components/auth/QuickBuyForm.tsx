"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Button from "../ui/Button";
import { TIERS, getTier, formatPrice } from "../../lib/stripe/tiers";
import styles from "./AuthForm.module.css";

type Status = "idle" | "submitting" | "error";

export default function QuickBuyForm() {
  const searchParams = useSearchParams();
  const [tierKey, setTierKey] = useState(searchParams.get("tier") ?? "");
  const [changingPlan, setChangingPlan] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [existingAccount, setExistingAccount] = useState(false);

  const selectedTier = getTier(tierKey);
  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const loginHref = `/login?redirect=${encodeURIComponent(redirectTarget)}&tier=${encodeURIComponent(
    tierKey
  )}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTier) return;
    setStatus("submitting");
    setErrorMessage("");
    setExistingAccount(false);
    try {
      const response = await fetch("/api/checkout/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedTier.key, email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Something went wrong.");

      if (data.status === "existing_account") {
        setExistingAccount(true);
        setStatus("idle");
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      throw new Error("Something went wrong.");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (!selectedTier) {
    return (
      <div className={styles.wrap}>
        <h1 className={styles.title}>Choose a package</h1>
        <p className={styles.hint}>
          <a href="/#pricing">Pick a package</a> to get started.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Get your full review</h1>

      <div className={styles.cart}>
        <div className={styles.cartHeader}>
          <span className={styles.cartLabel}>Your cart</span>
          <button
            type="button"
            className={styles.cartChangeLink}
            onClick={() => setChangingPlan((v) => !v)}
          >
            {changingPlan ? "Close" : "Change"}
          </button>
        </div>
        <div className={styles.cartRow}>
          <span className={styles.cartName}>{selectedTier.name}</span>
          <span className={styles.cartPrice}>{formatPrice(selectedTier.priceCents)}</span>
        </div>
        <p className={styles.cartDescription}>{selectedTier.description}</p>

        {changingPlan && (
          <div className={styles.cartOptions}>
            {TIERS.map((t) => (
              <button
                type="button"
                key={t.key}
                className={`${styles.cartOption} ${
                  t.key === tierKey ? styles.cartOptionActive : ""
                }`}
                onClick={() => {
                  setTierKey(t.key);
                  setChangingPlan(false);
                }}
              >
                <span>{t.name}</span>
                <span>{formatPrice(t.priceCents)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {existingAccount ? (
        <p className={styles.hint}>
          Looks like you already have an account with that email. <a href={loginHref}>Log in</a>{" "}
          to complete this purchase.
        </p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="quickbuy-email">
              Email
            </label>
            <input
              className={styles.input}
              id="quickbuy-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <label className={styles.consent}>
            <input type="checkbox" required />
            <span>
              I&rsquo;m 13 or older. If I&rsquo;m under 18, a parent or guardian consents to this
              purchase as described in the <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </span>
          </label>
          <div className={styles.actions}>
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Taking you to checkout…" : "Continue to payment"}
            </Button>
            {errorMessage && <p className={`${styles.status} ${styles.error}`}>{errorMessage}</p>}
          </div>
        </form>
      )}

      <p className={styles.hint}>
        Already have an account? <a href={loginHref}>Log in</a>.
      </p>
    </div>
  );
}
