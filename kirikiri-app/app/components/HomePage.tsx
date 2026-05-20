"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { mockPosts } from "../data/mockPosts";
import { getSavedPosts } from "../data/postStorage";
import { PostCard } from "../components/PostCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Flame, Plus, Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const ALL_CATEGORIES = "전체";

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPosts, setSavedPosts] = useState<typeof mockPosts>([]);

  useEffect(() => {
    const loadSavedPosts = window.setTimeout(() => {
      setSavedPosts(getSavedPosts());
    }, 0);

    return () => window.clearTimeout(loadSavedPosts);
  }, []);

  const posts = useMemo(() => [...savedPosts, ...mockPosts], [savedPosts]);
  const categories = useMemo(
    () => [ALL_CATEGORIES, ...Array.from(new Set(posts.map((post) => post.category)))],
    [posts],
  );

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES || post.category === selectedCategory;

    const loweredQuery = searchQuery.toLowerCase();
    const topicName = post.topicName || post.gameName || post.studyName || "";
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(loweredQuery) ||
      post.category.toLowerCase().includes(loweredQuery) ||
      topicName.toLowerCase().includes(loweredQuery) ||
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
            함께할 사람을 찾는 가장 쉬운 방법
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
            placeholder="제목, 분야, 모임명 검색..."
            className="h-14 pl-12 rounded-2xl bg-slate-100 border-0 text-base shadow-inner"
          />
        </motion.div>

        <motion.div
          className="mt-4 flex gap-2 overflow-x-auto pb-1"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`h-11 shrink-0 rounded-2xl px-4 ${
                selectedCategory === category
                  ? "bg-violet-600 text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>
      </header>

      <main className="px-5 py-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-violet-600" />
              <h2 className="text-2xl font-black text-slate-950">
                모집 중인 모임
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
