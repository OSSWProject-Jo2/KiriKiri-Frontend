"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, Send } from "lucide-react";
import { savePost } from "../data/postStorage";
import { useAuth } from "./auth/ClerkAuthProvider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function todayText() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export function NewPostForm() {
  const router = useRouter();
  const { isLoaded, isSignedIn, nickname, openSignIn } = useAuth();
  const [category, setCategory] = useState("");
  const [topicName, setTopicName] = useState("");
  const [title, setTitle] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [description, setDescription] = useState("");
  const [openChatLink, setOpenChatLink] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    savePost({
      id: `local-${Date.now()}`,
      category: category.trim(),
      title: title.trim(),
      description: description.trim(),
      author: nickname || "익명",
      authorTier: "새 멤버",
      currentMembers: 1,
      maxMembers,
      targetScore: targetScore.trim(),
      createdAt: todayText(),
      openChatLink: openChatLink.trim(),
      topicName: topicName.trim(),
    });

    router.push("/");
  };

  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF] px-5 py-10">
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          목록
        </Link>

        <div className="mt-20 rounded-[28px] bg-white p-6 text-center shadow-sm border border-slate-100">
          <h1 className="text-2xl font-black text-slate-950">
            로그인이 필요해요
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            모집글을 작성하려면 먼저 로그인해 주세요.
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
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF]">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-transparent px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            목록
          </Link>
          <span className="text-sm font-bold text-violet-700">모집글 작성</span>
        </div>
      </header>

      <main className="px-5 py-6">
        <form onSubmit={handleSubmit}>
          <section className="space-y-4 rounded-[28px] bg-white p-5 shadow-sm border border-slate-100">
            <div>
              <h1 className="text-2xl font-black text-slate-950">
                새 모집글 만들기
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                분야를 자유롭게 적고, 함께할 사람을 모집해 보세요.
              </p>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">제목</span>
              <Input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="예: 같이 꾸준히 할 분 구해요"
                className="mt-2 h-12 rounded-2xl bg-slate-100 border-0 px-4"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">분야</span>
              <Input
                required
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="예: 게임, 공부, 운동..."
                className="mt-2 h-12 rounded-2xl bg-slate-100 border-0 px-4"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">모임명</span>
              <Input
                required
                value={topicName}
                onChange={(event) => setTopicName(event.target.value)}
                placeholder="예: 리그 오브 레전드, 정보처리기사, 한강 러닝"
                className="mt-2 h-12 rounded-2xl bg-slate-100 border-0 px-4"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">목표</span>
              <Input
                required
                value={targetScore}
                onChange={(event) => setTargetScore(event.target.value)}
                placeholder="예: 플래티넘, 필기 합격, 5km 완주"
                className="mt-2 h-12 rounded-2xl bg-slate-100 border-0 px-4"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">최대 인원</span>
              <Input
                required
                type="number"
                min={2}
                max={20}
                value={maxMembers}
                onChange={(event) => setMaxMembers(Number(event.target.value))}
                className="mt-2 h-12 rounded-2xl bg-slate-100 border-0 px-4"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">상세 설명</span>
              <textarea
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="모집 조건, 진행 시간, 원하는 분위기를 적어주세요"
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl bg-slate-100 border-0 px-4 py-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-violet-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                오픈채팅 링크
              </span>
              <Input
                required
                type="url"
                value={openChatLink}
                onChange={(event) => setOpenChatLink(event.target.value)}
                placeholder="https://open.kakao.com/o/..."
                className="mt-2 h-12 rounded-2xl bg-slate-100 border-0 px-4"
              />
            </label>
          </section>

          <div className="sticky bottom-0 -mx-5 mt-4 px-5 py-4 bg-white/90 backdrop-blur-md border-t border-slate-100">
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 rounded-2xl gap-2 text-base font-bold bg-violet-600 hover:bg-violet-700"
            >
              <Send className="w-5 h-5" />
              등록하기
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
