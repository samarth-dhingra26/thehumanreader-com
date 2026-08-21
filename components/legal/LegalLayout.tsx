import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import { LEGAL_EFFECTIVE_DATE } from "../../lib/config";
import styles from "./LegalLayout.module.css";

type LegalLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.effective}>Effective {LEGAL_EFFECTIVE_DATE}</p>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
