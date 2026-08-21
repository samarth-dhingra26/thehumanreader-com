"use client";

import { useEffect, useState } from "react";
import { dataClient } from "../../lib/amplify/client";
import type { Schema } from "../../amplify/data/resource";
import UpsellSection from "./UpsellSection";
import styles from "./Dashboard.module.css";

type Submission = Schema["Submission"]["type"];
type Review = Schema["Review"]["type"];

export default function DashboardView() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reviews, setReviews] = useState<Record<string, Review | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await dataClient.models.Submission.list();
      setSubmissions(data);

      const reviewEntries = await Promise.all(
        data.map(async (submission) => {
          const { data: review } = await submission.review();
          return [submission.id, review] as const;
        })
      );
      setReviews(Object.fromEntries(reviewEntries));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return null;

  if (submissions.length === 0) {
    return <p className={styles.empty}>You haven&rsquo;t submitted a paragraph yet.</p>;
  }

  return (
    <div>
      {submissions.map((submission) => {
        const review = reviews[submission.id];
        return (
          <div className={styles.card} key={submission.id}>
            <span className={styles.status}>{submission.status}</span>
            <p className={styles.paragraph}>{submission.paragraphText}</p>
            {review && (
              <>
                <p className={styles.reviewLabel}>Your reader&rsquo;s feedback</p>
                <p className={styles.reviewText}>{review.reviewText}</p>
                <UpsellSection />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
