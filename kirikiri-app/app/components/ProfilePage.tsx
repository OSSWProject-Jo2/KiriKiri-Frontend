"use client";

import { LogIn, User } from "lucide-react";
import { BottomNavigation } from "./BottomNavigation";
import { useAuth } from "./auth/ClerkAuthProvider";
import { Button } from "./ui/button";

export function ProfilePage() {
  const { isSignedIn, nickname, openSignIn } = useAuth();

  return (
    <div className="min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF] pb-28">
      <header className="px-5 pt-8 pb-6 bg-white rounded-b-[32px] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950">프로필</h1>
            <p className="mt-1 text-sm text-slate-500">
              기본 프로필 화면입니다.
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 py-6">
        <section className="rounded-[28px] bg-white p-5 shadow-sm border border-slate-100">
          {isSignedIn ? (
            <>
              <p className="text-sm font-bold text-slate-500">닉네임</p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {nickname || "사용자"}
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm leading-6 text-slate-500">
                로그인하면 프로필 정보를 확인할 수 있어요.
              </p>
              <Button
                type="button"
                onClick={openSignIn}
                className="mt-5 h-12 rounded-2xl gap-2 bg-violet-600 px-5 text-white hover:bg-violet-700"
              >
                <LogIn className="h-4 w-4" />
                로그인
              </Button>
            </div>
          )}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
