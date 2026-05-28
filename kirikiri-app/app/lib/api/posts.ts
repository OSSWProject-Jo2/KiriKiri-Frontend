import type { Post } from "../../data/mockPosts";
import type { Applicant, JoinResponse } from "../mockApi";
import { apiClient } from "./client";

export type CreatePostRequest = Omit<Post, "id" | "createdAt" | "currentMembers">;

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

export async function createPost(post: CreatePostRequest) {
  return apiClient<Post>("/api/posts", {
    method: "POST",
    body: JSON.stringify(post),
  });
}

export async function joinPost(postId: string, request: JoinPostRequest) {
  return apiClient<JoinResponse>(`/api/posts/${postId}/applications`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getApplicants(postId: string) {
  return apiClient<Applicant[]>(`/api/posts/${postId}/applications`, {
    method: "GET",
  });
}

export async function acceptApplicant(postId: string, applicantId: string) {
  return apiClient<{ success: boolean; error?: string }>(
    `/api/posts/${postId}/applications/${applicantId}/accept`,
    {
      method: "PATCH",
    },
  );
}
