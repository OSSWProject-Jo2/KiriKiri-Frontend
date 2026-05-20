"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { mockPosts, type PostCategory } from "../data/mockPosts";
import { getSavedPosts } from "../data/postStorage";
import { PostCard } from "../components/PostCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { BookOpen, Flame, Gamepad2, Plus, Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";

type CategoryFilter = "전체" | PostCategory;

export function HomePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPosts] = useState(getSavedPosts);

  const posts = useMemo(() => [...savedPosts, ...mockPosts], [savedPosts]);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "전체" || post.category === selectedCategory;

    const loweredQuery = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(loweredQuery) ||
      post.gameName?.toLowerCase().includes(loweredQuery) ||
      post.studyName?.toLowerCase().includes(loweredQuery) ||
      post.description.toLowerCase().includes(loweredQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF] pb-24">
      <header className="px-5 pt-10 pb-6 bg-white rounded-b-[32px] shadow-sm">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-violet-500" />
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-violet-700 to-fuchsia-500 bg-clip-text text-transparent">
              키리키리
            </h1>
            <Sparkles className="w-7 h-7 text-violet-500" />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            게임 파티와 스터디 그룹 모집
          </p>
        </motion.div>

        <motion.div
          className="mt-7 relative"
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목, 게임명, 스터디명 검색..."
            className="h-14 pl-12 rounded-2xl bg-slate-100 border-0 text-base shadow-inner"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-2 mt-4"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Button
            onClick={() => setSelectedCategory("전체")}
            className={`h-12 rounded-2xl ${
              selectedCategory === "전체"
                ? "bg-slate-950 text-white"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            전체
          </Button>

          <Button
            onClick={() => setSelectedCategory("게임")}
            className={`h-12 rounded-2xl gap-1.5 ${
              selectedCategory === "게임"
                ? "bg-violet-600 text-white"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            게임
          </Button>

          <Button
            onClick={() => setSelectedCategory("공부")}
            className={`h-12 rounded-2xl gap-1.5 ${
              selectedCategory === "공부"
                ? "bg-violet-600 text-white"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            공부
          </Button>
        </motion.div>
      </header>

      <main className="px-5 py-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-violet-600" />
              <h2 className="text-2xl font-black text-slate-950">
                모집 중인 파티
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {filteredPosts.length}개의 모집글이 있어요
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={`/post/${post.id}`} className="block">
                  <PostCard post={post} />
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[28px] border border-slate-100">
              <p className="text-slate-500">검색 결과가 없습니다</p>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-6 left-0 right-0 z-40 pointer-events-none">
        <div className="max-w-[480px] mx-auto px-5 flex justify-end">
          <Link
            href="/post/new"
            aria-label="모집글 작성"
            title="모집글 작성"
            className="pointer-events-auto inline-flex h-18 w-18 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700 hover:scale-105 active:scale-90"
            >
                <Plus className="h-8 w-8" />
          </Link>
        </div>
      </div>
    </div>
  );
}
