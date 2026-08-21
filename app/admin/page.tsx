import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import AdminReviewList from "../../components/admin/AdminReviewList";
import styles from "../../components/admin/AdminReviewList.module.css";

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <h1 className={styles.title}>Pending reviews</h1>
        <AdminReviewList />
      </main>
      <SiteFooter />
    </>
  );
}
