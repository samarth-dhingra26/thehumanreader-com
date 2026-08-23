"use client";

import { useEffect, useState } from "react";
import { dataClient } from "../../lib/amplify/client";
import type { Schema } from "../../amplify/data/resource";
import Button from "../ui/Button";
import styles from "./AdminReviewList.module.css";

type Submission = Schema["Submission"]["type"];
type Review = Schema["Review"]["type"];

export default function AdminReviewList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reviews, setReviews] = useState<Record<string, Review | null>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await dataClient.models.Submission.list();
    setSubmissions(data);

    const reviewEntries = await Promise.all(
      data.map(async (submission) => {
        const { data: review } = await submission.review();
        return [submission.id, review] as const;
      })
    );
    const reviewMap = Object.fromEntries(reviewEntries);
    setReviews(reviewMap);

    setDrafts((prev) => {
      const next = { ...prev };
      for (const [id, review] of Object.entries(reviewMap)) {
        if (!(id in next)) next[id] = review?.reviewText ?? "";
      }
      return next;
    });

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSaveNew(submission: Submission) {
    const reviewText = drafts[submission.id];
    if (!reviewText) return;
    setSavingId(submission.id);

    await dataClient.models.Review.create({
      submissionId: submission.id,
      reviewText,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "The Human Reader",
      owner: submission.owner,
    });
    await dataClient.models.Submission.update({ id: submission.id, status: "REVIEWED" });

    setSavingId(null);
    await load();
  }

  async function handleUpdateExisting(review: Review) {
    const reviewText = drafts[review.submissionId];
    if (!reviewText) return;
    setSavingId(review.submissionId);

    await dataClient.models.Review.update({
      id: review.id,
      reviewText,
      reviewedAt: new Date().toISOString(),
    });

    setSavingId(null);
    await load();
  }

  if (loading) return null;

  const pending = submissions.filter((s) => s.status === "PENDING");
  const completed = submissions.filter((s) => s.status === "REVIEWED");

  return (
    <div>
      <h2 className={styles.sectionTitle}>Pending ({pending.length})</h2>
      {pending.length === 0 && <p className={styles.empty}>No pending submissions.</p>}
      {pending.map((submission) => (
        <div className={styles.card} key={submission.id}>
          <p className={styles.meta}>
            {submission.submitterName} — {submission.submitterEmail}
          </p>
          <p className={styles.paragraph}>{submission.paragraphText}</p>
          <textarea
            className={styles.textarea}
            placeholder="Write your review…"
            value={drafts[submission.id] ?? ""}
            onChange={(e) => setDrafts({ ...drafts, [submission.id]: e.target.value })}
          />
          <Button
            onClick={() => handleSaveNew(submission)}
            disabled={savingId === submission.id}
          >
            {savingId === submission.id ? "Saving…" : "Save review"}
          </Button>
        </div>
      ))}

      <h2 className={styles.sectionTitle}>Completed ({completed.length})</h2>
      {completed.length === 0 && <p className={styles.empty}>No completed reviews yet.</p>}
      {completed.map((submission) => {
        const review = reviews[submission.id];
        if (!review) return null;
        return (
          <div className={styles.card} key={submission.id}>
            <p className={styles.meta}>
              {submission.submitterName} — {submission.submitterEmail}
            </p>
            <p className={styles.paragraph}>{submission.paragraphText}</p>
            <textarea
              className={styles.textarea}
              value={drafts[submission.id] ?? ""}
              onChange={(e) => setDrafts({ ...drafts, [submission.id]: e.target.value })}
            />
            <Button
              variant="secondary"
              onClick={() => handleUpdateExisting(review)}
              disabled={savingId === submission.id}
            >
              {savingId === submission.id ? "Saving…" : "Update review"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
