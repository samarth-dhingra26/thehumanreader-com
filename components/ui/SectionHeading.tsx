import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  title: string;
  children?: React.ReactNode;
};

export default function SectionHeading({ title, children }: SectionHeadingProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.rule} />
      <h2 className={styles.title}>{title}</h2>
      {children && <p className={styles.body}>{children}</p>}
    </div>
  );
}
