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
        className={`${literata.variable} grid grid-rows-[auto_1fr] min-h-screen max-h-screen overflow-auto bg-theme-bg antialiased text-theme-text`}
      >
        <Header />
        <div className="overflow-auto h-full">{children}</div>
      </body>
    </html>
  );
}
