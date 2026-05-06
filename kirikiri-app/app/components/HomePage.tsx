"use client";

import { useMemo, useState } from "react";
import { mockPosts, type PostCategory } from "../data/mockPosts";
import { PostCard } from "./PostCard";

type FilterCategory = "전체" | PostCategory;

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return mockPosts.filter((post) => {
      const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory;
      const matchesSearch =
        query === "" ||
        post.title.toLowerCase().includes(query) ||
        post.gameName?.toLowerCase().includes(query) ||
        post.studyName?.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="mobile-app">
      <header className="home-header">
        <div className="home-brand" aria-label="끼리끼리">
          <span aria-hidden="true">✧</span>
          <h1>끼리끼리</h1>
          <span aria-hidden="true">✧</span>
        </div>
        <p>게임 파티원 &amp; 스터디 그룹 모집</p>

        <div className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="제목, 게임명, 스터디명 검색..."
            aria-label="모집글 검색"
          />
        </div>

        <div className="category-filter" aria-label="카테고리 필터">
          <button
            type="button"
            className={selectedCategory === "전체" ? "active dark" : ""}
            onClick={() => setSelectedCategory("전체")}
          >
            전체
          </button>
          <button
            type="button"
            className={selectedCategory === "게임" ? "active" : ""}
            onClick={() => setSelectedCategory("게임")}
          >
            <span aria-hidden="true">🎮</span>
            게임
          </button>
          <button
            type="button"
            className={selectedCategory === "공부" ? "active" : ""}
            onClick={() => setSelectedCategory("공부")}
          >
            <span aria-hidden="true">📖</span>
            공부
          </button>
        </div>
      </header>

      <section className="post-list-section" aria-labelledby="open-party-title">
        <div className="list-heading">
          <div>
            <div className="list-title-row">
              <span aria-hidden="true">♨</span>
              <h2 id="open-party-title">모집 중인 파티</h2>
            </div>
            <p>{filteredPosts.length}개의 모집글이 있어요</p>
          </div>
        </div>

        <div className="post-list">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="empty-state">검색 결과가 없습니다</div>
          )}
        </div>
      </section>
    </main>
  );
}
