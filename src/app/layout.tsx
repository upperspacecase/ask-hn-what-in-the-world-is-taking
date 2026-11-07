import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    'Get an email the minute ubuntu.com flips your CVE from "needed" to "released" for linux-generic on 24.04.',
  description:
    "For the sysadmin running 10 to 200 Ubuntu LTS boxes without Pro, who set the sysctl by hand last week and is now waiting on Canonical with no ETA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="body min-h-full">{children}</body>
    </html>
  );
}
