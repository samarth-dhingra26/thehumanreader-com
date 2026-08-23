"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, confirmSignIn } from "aws-amplify/auth";
import "../../lib/amplify/client";
import { TIERS, getTier, formatPrice } from "../../lib/stripe/tiers";
import Button from "../ui/Button";
import styles from "./AuthForm.module.css";

type Status = "idle" | "submitting" | "error";
type Stage = "login" | "newPassword";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stage, setStage] = useState<Stage>("login");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [tierKey, setTierKey] = useState(searchParams.get("tier") ?? "");
  const [changingPlan, setChangingPlan] = useState(false);

  const selectedTier = getTier(tierKey);

  async function afterSignedIn() {
    if (tierKey) {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierKey }),
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }
    }
    router.push(searchParams.get("redirect") || "/dashboard");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    const formData = new FormData(event.currentTarget);
    const submittedEmail = String(formData.get("email"));
    const password = String(formData.get("password"));
    setEmail(submittedEmail);

    try {
      const result = await signIn({ username: submittedEmail, password });
      if (result.nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setStage("newPassword");
        setStatus("idle");
        return;
      }
      await afterSignedIn();
    } catch {
      setErrorMessage("That email/password didn't work. Try again.");
      setStatus("error");
    }
  }

  async function handleNewPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      await confirmSignIn({ challengeResponse: newPassword });
      await afterSignedIn();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const cartSummary = selectedTier && (
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
              className={`${styles.cartOption} ${t.key === tierKey ? styles.cartOptionActive : ""}`}
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
  );

  if (stage === "newPassword") {
    return (
      <div className={styles.wrap}>
        <h1 className={styles.title}>Set your password</h1>
        {cartSummary}
        <p className={styles.hint} style={{ marginBottom: "1.2rem" }}>
          This is your first time logging in with the temporary password we emailed you — choose
          a permanent password to finish.
        </p>
        <form className={styles.form} onSubmit={handleNewPassword}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="new-password">
              New password
            </label>
            <input
              className={styles.input}
              id="new-password"
              type="password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.actions}>
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Saving…" : "Set password and continue"}
            </Button>
            {errorMessage && <p className={`${styles.status} ${styles.error}`}>{errorMessage}</p>}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Log in</h1>
      {cartSummary}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-email">
            Email
          </label>
          <input
            className={styles.input}
            id="login-email"
            name="email"
            type="email"
            defaultValue={email}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-password">
            Password
          </label>
          <input
            className={styles.input}
            id="login-password"
            name="password"
            type="password"
            required
          />
        </div>
        <div className={styles.actions}>
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Logging in…" : "Log in"}
          </Button>
          {status === "error" && (
            <p className={`${styles.status} ${styles.error}`}>{errorMessage}</p>
          )}
        </div>
      </form>
      <p className={styles.hint}>
        {tierKey ? (
          <>
            Don&rsquo;t have an account?{" "}
            <a
              href={`/buy?tier=${encodeURIComponent(tierKey)}&redirect=${encodeURIComponent(
                searchParams.get("redirect") || "/dashboard"
              )}`}
            >
              Get your package
            </a>
            .
          </>
        ) : (
          <>
            Don&rsquo;t have an account?{" "}
            <a href="/#free-review">Get a free paragraph reviewed</a> to create one.
          </>
        )}
      </p>
    </div>
  );
}
