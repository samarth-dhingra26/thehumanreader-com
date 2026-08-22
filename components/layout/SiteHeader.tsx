import { getServerUser } from "../../lib/amplify/session";
import NavSignOutLink from "../auth/NavSignOutLink";
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
        {user ? (
          <>
            <a href="/dashboard">Dashboard</a>
            <NavSignOutLink />
          </>
        ) : (
          <a href="/login">Log in</a>
        )}
      </nav>
    </header>
  );
}
