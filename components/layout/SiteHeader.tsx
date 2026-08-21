import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.wordmark} href="#top">
        The Human Reader
      </a>
      <nav className={styles.nav}>
        <a href="#services">Services</a>
        <a href="#how-it-works">How it works</a>
        <a href="#free-score">Get your free score</a>
      </nav>
    </header>
  );
}
