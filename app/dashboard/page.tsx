import { Suspense } from "react";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import DashboardView from "../../components/dashboard/DashboardView";
import styles from "../../components/dashboard/Dashboard.module.css";

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <h1 className={styles.title}>Your submissions</h1>
        <Suspense>
          <DashboardView />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
