import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationProgress from "@/components/NavigationProgress";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plainrank – クリーンなSaaSレビューサイト",
  description: "広告なし・スポンサーなし。SaaS・AIツールの本音のレビューが集まる独立評価サイト。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body style={{ margin: 0, padding: 0 }}>
          <NavigationProgress />
          <Header />
          {children}
        </body>
    </html>
  );
}
