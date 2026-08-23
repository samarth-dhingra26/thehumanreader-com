import styles from "./Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "ghostLight";
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_CLASS = {
  primary: "primary",
  secondary: "secondary",
  accent: "accent",
  ghostLight: "ghostLight",
} as const;

export default function Button({
  children,
  variant = "primary",
  href,
  ...rest
}: ButtonProps) {
  const className = `${styles.button} ${styles[VARIANT_CLASS[variant]]}`;

  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}
