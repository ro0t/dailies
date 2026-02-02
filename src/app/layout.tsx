import type { Metadata } from "next";
import { Literata } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const literata = Literata({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dailies",
  description: "A simple journal for daily thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${literata.variable} min-h-screen bg-[var(--theme-bg)] antialiased text-[var(--theme-text)]`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
