"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "aws-amplify/auth";
import "../../lib/amplify/client";
import Button from "../ui/Button";
import styles from "./AuthForm.module.css";

type Status = "idle" | "submitting" | "error";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      await signIn({ username: email, password });
      router.push(searchParams.get("redirect") || "/dashboard");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Log in</h1>
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
        Don&rsquo;t have an account? <a href="/#free-review">Get a free paragraph reviewed</a> to
        create one.
      </p>
    </div>
  );
}
