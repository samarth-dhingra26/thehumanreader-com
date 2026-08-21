"use client";

import { useEffect, useState } from "react";
import { dataClient } from "../../lib/amplify/client";
import type { Schema } from "../../amplify/data/resource";
import Button from "../ui/Button";
import styles from "./AdminReviewList.module.css";

type Submission = Schema["Submission"]["type"];

export default function AdminReviewList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await dataClient.models.Submission.list();
    setSubmissions(data.filter((s) => s.status === "PENDING"));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(submission: Submission) {
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

  if (loading) return null;
  if (submissions.length === 0) return <p className={styles.empty}>No pending submissions.</p>;

  return (
    <div>
      {submissions.map((submission) => (
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
          <Button onClick={() => handleSave(submission)} disabled={savingId === submission.id}>
            {savingId === submission.id ? "Saving…" : "Save review"}
          </Button>
        </div>
      ))}
    </div>
  );
}
