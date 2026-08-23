"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, confirmSignUp, resendSignUpCode, signIn } from "aws-amplify/auth";
import { dataClient } from "../../lib/amplify/client";
import { getTier, formatPrice } from "../../lib/stripe/tiers";
import Button from "../ui/Button";
import styles from "./AuthForm.module.css";

type Stage = "input" | "verify";
type Status = "idle" | "submitting" | "error";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stage, setStage] = useState<Stage>("input");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const tier = searchParams.get("tier");
  const selectedTier = tier ? getTier(tier) : undefined;
  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const loginHref = `/login?redirect=${encodeURIComponent(redirectTarget)}${
    tier ? `&tier=${encodeURIComponent(tier)}` : ""
  }`;

  const cartSummary = selectedTier && (
    <div className={styles.cart}>
      <div className={styles.cartLabel}>Your cart</div>
      <div className={styles.cartRow}>
        <span className={styles.cartName}>{selectedTier.name}</span>
        <span className={styles.cartPrice}>{formatPrice(selectedTier.priceCents)}</span>
      </div>
      <p className={styles.cartDescription}>{selectedTier.description}</p>
    </div>
  );

  async function finishSignupAndContinue() {
    await dataClient.models.UserProfile.create({
      consentGivenAt: new Date().toISOString(),
    }).catch(() => {});

    if (tier) {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }
    }
    router.push(redirectTarget);
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      await signUp({ username: email, password, options: { userAttributes: { email } } });
      setStage("verify");
      setStatus("idle");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      await signIn({ username: email, password });
      await finishSignupAndContinue();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  async function handleResendCode() {
    setIsResending(true);
    setResendMessage("");
    try {
      await resendSignUpCode({ username: email });
      setResendMessage("Code resent — check your email.");
    } catch (err) {
      setResendMessage(err instanceof Error ? err.message : "Couldn't resend the code.");
    } finally {
      setIsResending(false);
    }
  }

  if (stage === "verify") {
    return (
      <div className={styles.wrap}>
        <h1 className={styles.title}>Check your email</h1>
        {cartSummary}
        <form className={styles.form} onSubmit={handleVerify}>
          <p className={styles.hint}>We emailed a code to {email} — enter it below.</p>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="signup-code">
              Verification code
            </label>
            <input
              className={styles.input}
              id="signup-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className={styles.actions}>
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Confirming…" : "Confirm and continue"}
            </Button>
            {errorMessage && <p className={`${styles.status} ${styles.error}`}>{errorMessage}</p>}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              style={{ background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}
            >
              {isResending ? "Resending…" : "Didn't get a code? Resend it"}
            </button>
            {resendMessage && <p className={styles.hint}>{resendMessage}</p>}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Create your account</h1>
      {cartSummary}
      {selectedTier && (
        <p className={styles.hint} style={{ marginBottom: "1.2rem" }}>
          Create an account, then you&rsquo;ll enter your card details on Stripe&rsquo;s secure
          checkout page to complete this purchase.
        </p>
      )}
      <form className={styles.form} onSubmit={handleSignup}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="signup-email">
            Email
          </label>
          <input
            className={styles.input}
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="signup-password">
            Password
          </label>
          <input
            className={styles.input}
            id="signup-password"
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <label className={styles.consent}>
          <input type="checkbox" required />
          <span>
            I&rsquo;m 13 or older. If I&rsquo;m under 18, a parent or guardian consents to this
            account and its use as described in the <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </span>
        </label>
        <div className={styles.actions}>
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Creating account…" : "Create account and continue"}
          </Button>
          {errorMessage && <p className={`${styles.status} ${styles.error}`}>{errorMessage}</p>}
        </div>
      </form>
      <p className={styles.hint}>
        Already have an account? <a href={loginHref}>Log in</a>
      </p>
    </div>
  );
}
