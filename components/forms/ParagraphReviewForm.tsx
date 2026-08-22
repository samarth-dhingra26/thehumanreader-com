"use client";

import { useState, type FormEvent } from "react";
import { getCurrentUser, signIn, signUp, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { dataClient } from "../../lib/amplify/client";
import Button from "../ui/Button";
import styles from "./FormShell.module.css";

type Stage = "input" | "auth" | "verify" | "success";

export default function ParagraphReviewForm() {
  const [stage, setStage] = useState<Stage>("input");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paragraph, setParagraph] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  async function createSubmission(submitterEmail: string) {
    await dataClient.models.Submission.create({
      paragraphText: paragraph,
      submitterName: name,
      submitterEmail,
      status: "PENDING",
      submittedAt: new Date().toISOString(),
    });
    setStage("success");
  }

  async function handleInputSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await getCurrentUser();
      await createSubmission(user.signInDetails?.loginId ?? email);
    } catch {
      setStage("auth");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      setStage("verify");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      await signIn({ username: email, password });
      await dataClient.models.UserProfile.create({
        consentGivenAt: new Date().toISOString(),
      });
      await createSubmission(email);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
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

  if (stage === "success") {
    return (
      <p className={`${styles.status} ${styles.success}`}>
        Got it — a matched reader will get back to you within 3 business days. Log in anytime to
        check your dashboard.
      </p>
    );
  }

  if (stage === "verify") {
    return (
      <form className={styles.form} onSubmit={handleVerifySubmit}>
        <p className={styles.microcopy}>We emailed a code to {email} — enter it below.</p>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="review-code">
            Verification code
          </label>
          <input
            className={styles.input}
            id="review-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className={styles.actions}>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Confirming…" : "Confirm and submit my review"}
          </Button>
          {errorMessage && <p className={`${styles.status} ${styles.error}`}>{errorMessage}</p>}
          <button
            type="button"
            className={styles.microcopy}
            onClick={handleResendCode}
            disabled={isResending}
            style={{ background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}
          >
            {isResending ? "Resending…" : "Didn't get a code? Resend it"}
          </button>
          {resendMessage && <p className={styles.microcopy}>{resendMessage}</p>}
        </div>
      </form>
    );
  }

  if (stage === "auth") {
    return (
      <form className={styles.form} onSubmit={handleAuthSubmit}>
        <p className={styles.microcopy}>
          Create a free account so we can send your review to your dashboard.
        </p>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="review-account-email">
            Email
          </label>
          <input
            className={styles.input}
            id="review-account-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="review-account-password">
            Password
          </label>
          <input
            className={styles.input}
            id="review-account-password"
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
            submission and its use as described in the <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </span>
        </label>
        <div className={styles.actions}>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account and continue"}
          </Button>
          {errorMessage && <p className={`${styles.status} ${styles.error}`}>{errorMessage}</p>}
        </div>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleInputSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="review-name">
          Name
        </label>
        <input
          className={styles.input}
          id="review-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="review-paragraph">
          Paste one paragraph
        </label>
        <textarea
          className={styles.textarea}
          id="review-paragraph"
          maxLength={1200}
          value={paragraph}
          onChange={(e) => setParagraph(e.target.value)}
          required
        />
      </div>
      <div className={styles.actions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Get my free paragraph review"}
        </Button>
      </div>
    </form>
  );
}
