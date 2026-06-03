import type { AppNotification } from "../../data/notificationStorage";
import { apiClient } from "./client";

function withNickname(path: string, nickname: string) {
  return `${path}?nickname=${encodeURIComponent(nickname)}`;
}

export async function getBackendNotifications(nickname: string) {
  return apiClient<AppNotification[]>(withNickname("/api/notifications", nickname), {
    method: "GET",
  });
}

export async function getBackendUnreadNotificationCount(nickname: string) {
  return apiClient<number>(
    withNickname("/api/notifications/unread-count", nickname),
    {
      method: "GET",
    },
  );
}

export async function markBackendNotificationsRead(nickname: string) {
  return apiClient<void>(withNickname("/api/notifications/read", nickname), {
    method: "PATCH",
  });
}
