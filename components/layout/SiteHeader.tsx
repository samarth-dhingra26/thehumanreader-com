import { getServerUser } from "../../lib/amplify/session";
import NavSignOutLink from "../auth/NavSignOutLink";
import Button from "../ui/Button";
import styles from "./SiteHeader.module.css";

export default async function SiteHeader() {
  const user = await getServerUser();

  return (
    <header className={styles.header}>
      <a className={styles.wordmark} href="/#top">
        The Human Reader
      </a>
      <nav className={styles.nav}>
        <a href="/#free-review">Get a free review</a>
        <a href="/#services">Services</a>
        <a href="/#how-it-works">How it works</a>
      </nav>
      <div className={styles.actions}>
        {user ? (
          <>
            <Button href="/dashboard" variant="secondary">
              Dashboard
            </Button>
            <NavSignOutLink className={styles.signOutLink} />
          </>
        ) : (
          <Button href="/login" variant="secondary">
            Log in
          </Button>
        )}
      </div>
    </header>
  );
}
