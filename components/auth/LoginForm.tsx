"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "aws-amplify/auth";
import "../../lib/amplify/client";
import { getTier, formatPrice } from "../../lib/stripe/tiers";
import Button from "../ui/Button";
import styles from "./AuthForm.module.css";

type Status = "idle" | "submitting" | "error";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");

  const tierParam = searchParams.get("tier");
  const selectedTier = tierParam ? getTier(tierParam) : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      await signIn({ username: email, password });

      const tier = searchParams.get("tier");
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

      router.push(searchParams.get("redirect") || "/dashboard");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Log in</h1>
      {selectedTier && (
        <div className={styles.cart}>
          <div className={styles.cartLabel}>Your cart</div>
          <div className={styles.cartRow}>
            <span className={styles.cartName}>{selectedTier.name}</span>
            <span className={styles.cartPrice}>{formatPrice(selectedTier.priceCents)}</span>
          </div>
          <p className={styles.cartDescription}>{selectedTier.description}</p>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-email">
            Email
          </label>
          <input className={styles.input} id="login-email" name="email" type="email" required />
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
            <p className={`${styles.status} ${styles.error}`}>
              That email/password didn&rsquo;t work. Try again.
            </p>
          )}
        </div>
      </form>
      <p className={styles.hint}>
        Don&rsquo;t have an account?{" "}
        <a href={`/signup?${searchParams.toString()}`}>Create one</a>.
      </p>
    </div>
  );
}
