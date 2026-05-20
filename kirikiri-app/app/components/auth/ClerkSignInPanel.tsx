"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "./ClerkAuthProvider";

export function ClerkSignInPanel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isConfigured, isLoaded } = useAuth();

  useEffect(() => {
    const node = containerRef.current;

    if (!node || !isLoaded || !isConfigured || !window.Clerk?.mountSignIn) {
      return;
    }

    window.Clerk.mountSignIn(node, {
      redirectUrl: "/",
      afterSignInUrl: "/",
      afterSignUpUrl: "/",
    });

    return () => {
      window.Clerk?.unmountSignIn?.(node);
    };
  }, [isConfigured, isLoaded]);

  if (!isConfigured) {
    return (
      <div className="rounded-[28px] bg-white p-6 text-center shadow-sm border border-slate-100">
        <h1 className="text-xl font-black text-slate-950">Clerk 키가 필요해요</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          `.env.local`에 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`를 추가하면
          로그인 창이 표시됩니다.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} />;
}
