"use client";

import Link from "next/link";
import { ArrowRight, FileText, LogIn, Settings } from "lucide-react";
import { BottomNavigation } from "./BottomNavigation";
import { useAuth } from "./auth/ClerkAuthProvider";
import { Button } from "./ui/button";

export function ProfilePage() {
  const { isSignedIn, openSignIn } = useAuth();

  return (
    <div className="app-shell min-h-screen pb-28">
      <header className="px-5 pt-8 pb-6 bg-white rounded-b-[32px] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950">관리</h1>
            <p className="mt-1 text-sm text-slate-500">
              내가 만든 모집글을 확인하고 관리해요.
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 py-6">
        {isSignedIn ? (
          <section className="space-y-3">
            <Link
              href="/profile/posts"
              className="flex items-center justify-between rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition-colors hover:bg-slate-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-black text-slate-950">
                    게시글 관리
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    모집마감된 글까지 한 번에 확인해요.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />
            </Link>
          </section>
        ) : (
          <section className="rounded-[28px] bg-white p-8 text-center shadow-sm border border-slate-100">
            <p className="text-sm leading-6 text-slate-500">
              로그인하면 관리 기능을 사용할 수 있어요.
            </p>
            <Button
              type="button"
              onClick={openSignIn}
              className="mt-5 h-12 rounded-2xl gap-2 bg-violet-600 px-5 text-white hover:bg-violet-700"
            >
              <LogIn className="h-4 w-4" />
              로그인
            </Button>
          </section>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
