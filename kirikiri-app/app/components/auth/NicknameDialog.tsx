"use client";

import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuth } from "./ClerkAuthProvider";

export function NicknameDialog() {
  const { isSignedIn, hasNickname, setNickname } = useAuth();
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isSignedIn || hasNickname) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextNickname = value.trim();

    if (!nextNickname) {
      return;
    }

    setIsSaving(true);

    try {
      await setNickname(nextNickname);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[360px] rounded-[28px] bg-white p-5 shadow-2xl"
      >
        <h2 className="text-xl font-black text-slate-950">닉네임 설정</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          키리키리에서 사용할 닉네임을 입력해 주세요.
        </p>

        <Input
          required
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="예: 키리러"
          className="mt-5 h-12 rounded-2xl bg-slate-100 border-0 px-4"
        />

        <Button
          type="submit"
          disabled={isSaving}
          className="mt-4 h-12 w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-700"
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </Button>
      </form>
    </div>
  );
}
