import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Human Reader — Your essays need to be you. Not AI.",
  description:
    "Human-matched college essay and PIQ review. Get a free 0-100 Application Score and a free paragraph review from a real, matched human reader.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
