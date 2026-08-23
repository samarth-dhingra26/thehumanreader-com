import { addBusinessDays, businessDaysRemaining } from "../../lib/date/businessDays";
import styles from "./Dashboard.module.css";

export default function SubmissionStatus({
  status,
  submittedAt,
}: {
  status: string | null | undefined;
  submittedAt: string;
}) {
  if (status === "REVIEWED") {
    return <span className={styles.status}>Review complete</span>;
  }

  const now = new Date();
  const target = addBusinessDays(new Date(submittedAt), 3);
  const remaining = businessDaysRemaining(now, target);

  const label =
    remaining > 0
      ? `Under review — less than ${remaining} business day${remaining === 1 ? "" : "s"} remaining`
      : "Under review — response expected any time now";

  return <span className={styles.status}>{label}</span>;
}
