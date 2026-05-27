import { apiClient } from "./client";

export type UserProfile = {
  id: string;
  nickname: string;
  email?: string;
};

export type UpdateNicknameRequest = {
  nickname: string;
};

export async function getMyProfile() {
  return apiClient<UserProfile>("/users/me", {
    method: "GET",
  });
}

export async function updateNickname({ nickname }: UpdateNicknameRequest) {
  return apiClient<UserProfile>("/users/me/nickname", {
    method: "PATCH",
    body: JSON.stringify({ nickname }),
  });
}
