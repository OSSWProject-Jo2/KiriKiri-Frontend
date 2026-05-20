import type { Metadata } from "next";
import { ClerkAuthProvider } from "./components/auth/ClerkAuthProvider";
import { NicknameDialog } from "./components/auth/NicknameDialog";
import "./globals.css";

export const metadata: Metadata = {
  title: "키리키리 | 모임 모집",
  description: "함께할 사람을 찾고 모임을 모집하는 키리키리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ClerkAuthProvider>
          {children}
          <NicknameDialog />
        </ClerkAuthProvider>
      </body>
    </html>
  );
}
