"use client";

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "./ClerkAuthProvider";

type LoginRequiredDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LoginRequiredDialog({
  open,
  onOpenChange,
}: LoginRequiredDialogProps) {
  const { openSignIn, isConfigured } = useAuth();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-5">
      <div className="w-full max-w-[360px] rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              로그인이 필요해요
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              모집글을 작성하려면 먼저 로그인해 주세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-12 flex-1 rounded-2xl bg-slate-100 text-slate-700"
          >
            닫기
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (isConfigured) {
                openSignIn();
              }
              onOpenChange(false);
            }}
            className="h-12 flex-1 rounded-2xl bg-violet-600 text-white hover:bg-violet-700"
          >
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
