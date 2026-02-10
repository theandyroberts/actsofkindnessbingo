import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import KindnessButton from "@/components/KindnessButton";
import SiteGate from "@/components/SiteGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acts of Kindness Bingo",
  description:
    "Play Acts of Kindness Birthday Bingo — inspired by Mother Emilie Gamelin. Complete acts of kindness, earn points, and climb the leaderboard!",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "64x64" },
      { url: "/icon.svg?v=3", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteGate>
          {children}
          <Footer />
          <KindnessButton />
        </SiteGate>
      </body>
    </html>
  );
}
