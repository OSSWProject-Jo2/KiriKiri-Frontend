import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "끼리끼리 | 게임 파티원 & 스터디 그룹 모집",
  description: "게임 파티원과 스터디 그룹을 모집하는 끼리끼리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
