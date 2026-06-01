"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, Send } from "lucide-react";
import { useAuth } from "./auth/ClerkAuthProvider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createPost } from "../lib/api";

function getTopicFields(category: string, topicName: string) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("게임") || normalizedCategory.includes("game")) {
    return { gameName: topicName, studyName: "" };
  }

  if (
    normalizedCategory.includes("공부") ||
    normalizedCategory.includes("스터디") ||
    normalizedCategory.includes("study")
  ) {
    return { gameName: "", studyName: topicName };
  }

  return { gameName: "", studyName: "" };
}

const postCategories = ["게임", "공부", "운동"];

export function NewPostForm() {
  const router = useRouter();
  const { isLoaded, isSignedIn, nickname, openSignIn, getToken } = useAuth();
  const [category, setCategory] = useState(postCategories[0]);
  const [topicName, setTopicName] = useState("");
  const [title, setTitle] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [description, setDescription] = useState("");
  const [openChatLink, setOpenChatLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    // API 서버에 post 생성 요청
    try {
      const token = await getToken();
      const trimmedCategory = category.trim();
      const trimmedTopicName = topicName.trim();
      const createdPost = await createPost(
        {
          title: title.trim(),
          category: trimmedCategory,
          categoryTag: trimmedTopicName,
          targetScore: targetScore.trim(),
          maxMembers,
          description: description.trim(),
          openChatLink: openChatLink.trim(),
          author: nickname || "익명",
          password: "clerk-authenticated",
          ...getTopicFields(trimmedCategory, trimmedTopicName),
        },
        token,
      );

      router.push(createdPost?.id ? `/post/${createdPost.id}` : "/");
      router.refresh();
    } catch {
      setSubmitError("모집글 등록에 실패했어요. 백엔드 서버와 로그인을 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
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
            모집글을 작성하려면 먼저 로그인해주세요
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
                모집글 만들기
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                분야와 모임명을 적고 함께할 사람을 모집해보세요
              </p>
            </div>

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
              <span className="text-sm font-bold text-slate-700">분야</span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {postCategories.map((categoryItem) => (
                  <button
                    key={categoryItem}
                    type="button"
                    onClick={() => setCategory(categoryItem)}
                    className={`h-12 rounded-2xl text-sm font-bold transition-colors ${
                      category === categoryItem
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {categoryItem}
                  </button>
                ))}
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">모임명</span>
              <Input
                required
                value={topicName}
                onChange={(event) => setTopicName(event.target.value)}
                placeholder="예: 리그 오브 레전드, 정보처리기사, 새벽 러닝"
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
                placeholder="모집 조건, 진행 시간, 원하는 분위기를 적어주세요."
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

            {submitError ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {submitError}
              </p>
            ) : null}
          </section>

          <div className="sticky bottom-0 -mx-5 mt-4 px-5 py-4 bg-white/90 backdrop-blur-md border-t border-slate-100">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl gap-2 text-base font-bold bg-violet-600 hover:bg-violet-700"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? "등록 중..." : "등록하기"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
