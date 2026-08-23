"use client";

import { useState, type FormEvent } from "react";
import Button from "../ui/Button";
import { CONTACT_EMAIL } from "../../lib/config";
import { isValidEmail } from "../../lib/validation";
import styles from "./FormShell.module.css";

type FormShellProps = {
  endpoint: string;
  subject: string;
  submitLabel: string;
  successMessage: string;
  children: React.ReactNode;
};

type Status = "idle" | "submitting" | "success" | "error";

export default function FormShell({
  endpoint,
  subject,
  submitLabel,
  successMessage,
  children,
}: FormShellProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email");
    if (typeof email === "string" && email && !isValidEmail(email)) {
      setErrorMessage("That email address doesn't look right — double-check it and try again.");
      setStatus("error");
      return;
    }

    if (!endpoint) {
      setErrorMessage("");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("");
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className={`${styles.status} ${styles.success}`}>{successMessage}</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="hidden" name="_subject" value={subject} />
      {children}
      <label className={styles.consent}>
        <input type="checkbox" name="consent" required />
        <span>
          I&rsquo;m 13 or older. If I&rsquo;m under 18, a parent or guardian
          consents to this submission and its use as described in the{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </span>
      </label>
      <div className={styles.actions}>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : submitLabel}
        </Button>
        {status === "error" && (
          <p className={`${styles.status} ${styles.error}`}>
            {errorMessage || (
              <>
                Something went wrong. Email us directly at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> instead.
              </>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
