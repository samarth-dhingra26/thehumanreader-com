import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const TITLE = "The Human Reader — Your essays need to be you. Not AI.";
const DESCRIPTION =
  "Human-matched college essay and PIQ review. Get a free 0-100 Application Score and a free paragraph review from a real, matched human reader.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://thehumanreader.com"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://thehumanreader.com",
    siteName: "The Human Reader",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={bodyFont.variable}>
      <body>{children}</body>
    </html>
  );
}
