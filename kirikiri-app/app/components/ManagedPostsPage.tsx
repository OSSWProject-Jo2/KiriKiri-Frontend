"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, LogIn } from "lucide-react";
import { mockPosts, type Post } from "../data/mockPosts";
import { getPosts } from "../lib/api";
import { BottomNavigation } from "./BottomNavigation";
import { useAuth } from "./auth/ClerkAuthProvider";
import { PostCard } from "./PostCard";
import { Button } from "./ui/button";

export function ManagedPostsPage() {
  const { isSignedIn, nickname, openSignIn } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadPosts() {
      setIsLoading(true);

      try {
        const nextPosts = await getPosts();

        if (isActive) {
          setPosts(nextPosts);
          setPostsError("");
        }
      } catch {
        if (isActive) {
          setPosts(mockPosts);
          setPostsError("백엔드 서버에 연결할 수 없어 예시 데이터를 보여주고 있어요.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadPosts();

    return () => {
      isActive = false;
    };
  }, []);

  const myPosts = useMemo(() => {
    if (!nickname) {
      return [];
    }

    return posts.filter((post) => post.author === nickname);
  }, [nickname, posts]);

  return (
    <div className="min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF] pb-28">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            href="/profile"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-transparent px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            관리
          </Link>
          <span className="text-sm font-bold text-violet-700">
            게시글 관리
          </span>
        </div>
      </header>

      <main className="px-5 py-6">
        <section className="rounded-[28px] bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950">
                게시글 관리
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                내가 만든 모집글을 상태와 함께 확인해요.
              </p>
            </div>
          </div>
        </section>

        {!isSignedIn ? (
          <section className="mt-4 rounded-[28px] bg-white p-8 text-center shadow-sm border border-slate-100">
            <p className="text-sm leading-6 text-slate-500">
              로그인하면 내가 만든 게시글을 볼 수 있어요.
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
        ) : (
          <div className="mt-4 space-y-4">
            {isLoading ? (
              <div className="py-20 text-center bg-white rounded-[28px] border border-slate-100">
                <p className="text-slate-500">게시글을 불러오는 중이에요.</p>
              </div>
            ) : myPosts.length > 0 ? (
              myPosts.map((post) => {
                const isFull = post.currentMembers >= post.maxMembers;

                return (
                  <Link key={post.id} href={`/post/${post.id}`} className="block">
                    <div>
                      <span
                        className={`mb-2 ml-auto flex w-fit rounded-full px-3 py-1 text-xs font-bold ${
                          isFull
                            ? "bg-slate-200 text-slate-600"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isFull ? "모집마감" : "모집중"}
                      </span>
                      <PostCard post={post} />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-20 text-center bg-white rounded-[28px] border border-slate-100">
                <p className="text-slate-500">아직 만든 게시글이 없어요.</p>
              </div>
            )}

            {postsError ? (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                {postsError}
              </p>
            ) : null}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
