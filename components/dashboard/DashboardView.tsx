"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { dataClient } from "../../lib/amplify/client";
import type { Schema } from "../../amplify/data/resource";
import SubmissionStatus from "./SubmissionStatus";
import PricingGrid from "./PricingGrid";
import { formatDate } from "../../lib/date/format";
import styles from "./Dashboard.module.css";

type Submission = Schema["Submission"]["type"];
type Review = Schema["Review"]["type"];
type Purchase = Schema["Purchase"]["type"];

export default function DashboardView() {
  const searchParams = useSearchParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reviews, setReviews] = useState<Record<string, Review | null>>({});
  const [purchases, setPurchases] = useState<Purchase[]>([]);
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

      const { data: purchaseData } = await dataClient.models.Purchase.list();
      setPurchases(purchaseData);

      setLoading(false);
    }
    load();

    if (searchParams.get("purchase") === "success") {
      const interval = setInterval(load, 3000);
      return () => clearInterval(interval);
    }
  }, [searchParams]);

  if (loading) return null;

  if (submissions.length === 0) {
    return <p className={styles.empty}>You haven&rsquo;t submitted a paragraph yet.</p>;
  }

  const hasPurchase = purchases.length > 0;
  const awaitingConfirmation = !hasPurchase && searchParams.get("purchase") === "success";
  const hasReviewed = submissions.some((s) => s.status === "REVIEWED");

  return (
    <div className={styles.layout}>
      <div className={styles.timeline}>
        {submissions.map((submission) => {
          const review = reviews[submission.id];
          return (
            <div className={styles.timelineItem} key={submission.id}>
              <div className={styles.timelineRail}>
                <span className={styles.timelineDot} />
                <span className={styles.timelineLine} />
              </div>
              <div className={styles.card}>
                <div className={styles.timelineDate}>{formatDate(submission.submittedAt)}</div>
                <SubmissionStatus status={submission.status} submittedAt={submission.submittedAt} />
                <p className={styles.paragraph}>{submission.paragraphText}</p>
                {review && (
                  <>
                    <div className={styles.timelineDate}>{formatDate(review.reviewedAt)}</div>
                    <p className={styles.reviewLabel}>Your reader&rsquo;s feedback</p>
                    <p className={styles.reviewText}>{review.reviewText}</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.sidebar}>
        {hasPurchase && (
          <div className={styles.upsell}>
            <h3 className={styles.upsellTitle}>You&rsquo;re all set</h3>
            <p className={styles.upsellBody}>
              We&rsquo;ve got your purchase — a matched reader will follow up by email to get
              started on your full application.
            </p>
          </div>
        )}

        {!hasPurchase && awaitingConfirmation && (
          <div className={styles.upsell}>
            <h3 className={styles.upsellTitle}>Confirming your payment…</h3>
            <p className={styles.upsellBody}>This usually takes just a few seconds.</p>
          </div>
        )}

        {!hasPurchase && !awaitingConfirmation && hasReviewed && <PricingGrid />}

        {!hasPurchase && !awaitingConfirmation && !hasReviewed && (
          <div className={styles.upsell}>
            <h3 className={styles.upsellTitle}>Full application packages</h3>
            <p className={styles.upsellBody}>
              Once your free paragraph review is complete, you&rsquo;ll be able to choose a
              package to get every essay and PIQ reviewed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
