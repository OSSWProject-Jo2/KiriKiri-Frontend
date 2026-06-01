export type NotificationKind = "application" | "accepted" | "deleted";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  postId: string;
  postTitle: string;
  recipientNickname: string;
  actorNickname: string;
  message: string;
  openChatLink?: string;
  read: boolean;
  createdAt: string;
};

const STORAGE_KEY = "kirikiri_notifications";

function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawNotifications = window.localStorage.getItem(STORAGE_KEY);
    const notifications = rawNotifications ? JSON.parse(rawNotifications) : [];
    return Array.isArray(notifications) ? notifications : [];
  } catch {
    return [];
  }
}

function saveNotifications(notifications: AppNotification[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export function getNotifications(nickname?: string) {
  const notifications = loadNotifications();

  if (!nickname) {
    return notifications;
  }

  return notifications.filter(
    (notification) => notification.recipientNickname === nickname,
  );
}

export function addNotification(
  notification: Omit<AppNotification, "id" | "read" | "createdAt">,
) {
  const notifications = loadNotifications();
  saveNotifications([
    {
      ...notification,
      id: `notice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      read: false,
      createdAt: new Date().toISOString(),
    },
    ...notifications,
  ]);
}

export function markNotificationsRead(nickname?: string) {
  const notifications = loadNotifications();
  const nextNotifications = notifications.map((notification) => {
    if (nickname && notification.recipientNickname !== nickname) {
      return notification;
    }

    return {
      ...notification,
      read: true,
    };
  });

  saveNotifications(nextNotifications);
}

export function getUnreadNotificationCount(nickname?: string) {
  return getNotifications(nickname).filter((notification) => !notification.read)
    .length;
}
