"use client";

import { useState, type FormEvent } from "react";
import Button from "../ui/Button";
import { CONTACT_EMAIL } from "../../lib/config";
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!endpoint) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      event.currentTarget.reset();
    } catch {
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
      <div className={styles.actions}>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : submitLabel}
        </Button>
        {status === "error" && (
          <p className={`${styles.status} ${styles.error}`}>
            Something went wrong. Email us directly at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> instead.
          </p>
        )}
      </div>
    </form>
  );
}
