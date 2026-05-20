"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Gamepad2, Send } from "lucide-react";
import type { PostCategory } from "../data/mockPosts";
import { savePost } from "../data/postStorage";
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
  const [category, setCategory] = useState<PostCategory>("게임");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [authorTier, setAuthorTier] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [openChatLink, setOpenChatLink] = useState("");

  const categoryNameLabel = useMemo(
    () => (category === "게임" ? "게임명" : "스터디명"),
    [category],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const post = {
      id: `local-${Date.now()}`,
      category,
      title: title.trim(),
      description: description.trim(),
      author: author.trim(),
      authorTier: authorTier.trim() || "새 멤버",
      currentMembers: 1,
      maxMembers,
      targetScore: targetScore.trim(),
      createdAt: todayText(),
      openChatLink: openChatLink.trim(),
      gameName: category === "게임" ? trimmedName : undefined,
      studyName: category === "공부" ? trimmedName : undefined,
    };

    savePost(post);
    router.push("/");
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="rounded-[28px] bg-white p-5 shadow-sm border border-slate-100">
            <h1 className="text-2xl font-black text-slate-950">
              새 모집글 만들기
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              필요한 정보를 채우면 홈 목록에 바로 추가됩니다.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <Button
                type="button"
                onClick={() => setCategory("게임")}
                className={`h-12 rounded-2xl gap-1.5 ${
                  category === "게임"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-50 text-slate-700 border border-slate-200"
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                게임
              </Button>
              <Button
                type="button"
                onClick={() => setCategory("공부")}
                className={`h-12 rounded-2xl gap-1.5 ${
                  category === "공부"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-50 text-slate-700 border border-slate-200"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                공부
              </Button>
            </div>
          </section>

          <section className="space-y-3 rounded-[28px] bg-white p-5 shadow-sm border border-slate-100">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">제목</span>
              <Input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="예: 같이 랭크 올릴 파티 구해요"
                className="mt-2 h-12 rounded-2xl bg-slate-100 border-0 px-4"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                {categoryNameLabel}
              </span>
              <Input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={
                  category === "게임" ? "예: 리그 오브 레전드" : "예: 정보처리기사"
                }
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
          </section>

          <section className="space-y-3 rounded-[28px] bg-white p-5 shadow-sm border border-slate-100">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">작성자</span>
                <Input
                  required
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  placeholder="닉네임"
                  className="mt-2 h-12 rounded-2xl bg-slate-100 border-0 px-4"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">
                  티어/레벨
                </span>
                <Input
                  value={authorTier}
                  onChange={(event) => setAuthorTier(event.target.value)}
                  placeholder="골드 II"
                  className="mt-2 h-12 rounded-2xl bg-slate-100 border-0 px-4"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">목표</span>
              <Input
                required
                value={targetScore}
                onChange={(event) => setTargetScore(event.target.value)}
                placeholder={category === "게임" ? "예: 플래티넘" : "예: 필기 합격"}
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

          <div className="sticky bottom-0 -mx-5 px-5 py-4 bg-white/90 backdrop-blur-md border-t border-slate-100">
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
