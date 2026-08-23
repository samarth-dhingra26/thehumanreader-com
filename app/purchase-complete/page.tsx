import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import styles from "../../components/auth/AuthForm.module.css";

export default async function PurchaseCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main>
        <div className={styles.wrap}>
          <h1 className={styles.title}>You&rsquo;re all set</h1>
          <p className={styles.hint} style={{ marginBottom: "1rem" }}>
            Thanks for your purchase — a matched human reader will follow up by email to get
            started on your full application.
          </p>
          <p className={styles.hint}>
            {email ? (
              <>
                We&rsquo;ve sent login instructions to <strong>{email}</strong> so you can check
                your dashboard once your reader&rsquo;s feedback is ready.
              </>
            ) : (
              "Check your email for login instructions so you can check your dashboard."
            )}
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
