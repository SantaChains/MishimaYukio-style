import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SantaChains | 三島由紀夫の美学",
  description:
    "SantaChainsの個人ブログ。三島由紀夫の美学を継承し、言葉の中に血のような情熱を宿す。",
  keywords: ["SantaChains", "三島由紀夫", "美学", "文学", "ブログ"],
  authors: [{ name: "SantaChains" }],
  openGraph: {
    title: "SantaChains | 三島由紀夫の美学",
    description: "言葉は、血に変わる。三島由紀夫の美学を継承する個人ブログ。",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
