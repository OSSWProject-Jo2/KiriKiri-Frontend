import type { Post } from "./mockPosts";

const STORAGE_KEY = "kirikiri_posts";

export function getSavedPosts(): Post[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawPosts = window.localStorage.getItem(STORAGE_KEY);

  if (!rawPosts) {
    return [];
  }

  try {
    const posts = JSON.parse(rawPosts);
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
}

export function savePost(post: Post) {
  const posts = getSavedPosts();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([post, ...posts]));
}

export function getSavedPostById(id: string) {
  return getSavedPosts().find((post) => post.id === id);
}
