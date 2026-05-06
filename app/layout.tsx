import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akato 抽籤回禮系統",
  description: "LINE x n8n x Vercel integration starter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
