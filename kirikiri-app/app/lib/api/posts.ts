import type { Post } from "../../data/mockPosts";
import type { Applicant, JoinResponse } from "../mockApi";
import { apiClient } from "./client";

export type CreatePostRequest = {
  title: string;
  category: string;
  categoryTag: string;
  targetScore: string;
  maxMembers: number;
  description: string;
  openChatLink: string;
  author: string;
  password?: string;
  gameName?: string;
  studyName?: string;
};

export type JoinPostRequest = {
  nickname: string;
};

export async function getPosts() {
  return apiClient<Post[]>("/api/posts", {
    method: "GET",
  });
}

export async function getPost(postId: string) {
  return apiClient<Post>(`/api/posts/${postId}`, {
    method: "GET",
  });
}

export async function createPost(post: CreatePostRequest, authToken?: string | null) {
  return apiClient<Post>("/api/posts", {
    method: "POST",
    authToken: authToken || undefined,
    body: JSON.stringify(post),
  });
}

export async function updatePost(
  postId: string,
  post: CreatePostRequest,
  authToken?: string | null,
) {
  return apiClient<Post>(`/api/posts/${postId}`, {
    method: "PUT",
    authToken: authToken || undefined,
    body: JSON.stringify(post),
  });
}

export async function deletePost(postId: string, authToken?: string | null) {
  return apiClient<void>(`/api/posts/${postId}`, {
    method: "DELETE",
    authToken: authToken || undefined,
  });
}

export async function joinPost(
  postId: string,
  request: JoinPostRequest,
  authToken?: string | null,
) {
  return apiClient<JoinResponse>(`/api/posts/${postId}/applications`, {
    method: "POST",
    authToken: authToken || undefined,
    body: JSON.stringify(request),
  });
}

export async function getApplicants(postId: string, authToken?: string | null) {
  return apiClient<Applicant[]>(`/api/posts/${postId}/applications`, {
    method: "GET",
    authToken: authToken || undefined,
  });
}

export async function acceptApplicant(
  postId: string,
  applicantId: string,
  authToken?: string | null,
) {
  return apiClient<{ success: boolean; error?: string }>(
    `/api/posts/${postId}/applications/${applicantId}/accept`,
    {
      method: "PATCH",
      authToken: authToken || undefined,
    },
  );
}
