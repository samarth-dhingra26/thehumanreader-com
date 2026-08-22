import styles from "./StatsBar.module.css";

const STATS = [
  { number: "100%", label: "Human-written feedback" },
  { number: "0", label: "AI-generated reviews" },
  { number: "3", label: "Business-day turnaround" },
  { number: "$0", label: "To try it" },
];

export default function StatsBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.grid}>
        {STATS.map((stat) => (
          <div className={styles.stat} key={stat.label}>
            <div className={styles.number}>{stat.number}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
