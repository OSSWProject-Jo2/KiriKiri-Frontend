"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ExternalLink,
  Inbox,
  Trash2,
} from "lucide-react";
import {
  type AppNotification,
  getNotifications,
  markNotificationsRead,
} from "../data/notificationStorage";
import {
  acceptApplicant,
  getApplicants,
  getBackendNotifications,
  markBackendNotificationsRead,
} from "../lib/api";
import { useAuth } from "./auth/ClerkAuthProvider";
import { BottomNavigation } from "./BottomNavigation";
import { Button } from "./ui/button";

function formatNotificationTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getNotificationTitle(notification: AppNotification) {
  if (notification.kind === "accepted") {
    return "신청 수락";
  }

  if (notification.kind === "deleted") {
    return "모집글 삭제";
  }

  return "새 참여 신청";
}

function getNotificationMessage(notification: AppNotification) {
  if (notification.kind === "application") {
    return `${notification.actorNickname}님이 ${notification.postTitle}에 참여를 신청했습니다.`;
  }

  return notification.message;
}

export function NotificationsPage() {
  const { isSignedIn, nickname, openSignIn, getToken } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingNotificationId, setAcceptingNotificationId] = useState<
    string | null
  >(null);
  const [acceptedNotificationIds, setAcceptedNotificationIds] = useState<
    Set<string>
  >(() => new Set());

  useEffect(() => {
    let isActive = true;

    async function loadNotifications() {
      if (!nickname) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const nextNotifications = await getBackendNotifications(nickname);

        if (!isActive) {
          return;
        }

        setNotifications(nextNotifications);
        await markBackendNotificationsRead(nickname);
      } catch {
        if (!isActive) {
          return;
        }

        const fallbackNotifications = getNotifications(nickname);
        setNotifications(fallbackNotifications);
        markNotificationsRead(nickname);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadNotifications();

    return () => {
      isActive = false;
    };
  }, [nickname]);

  const emptyMessage = useMemo(() => {
    if (!isSignedIn) {
      return "로그인하면 신청과 수락 알림을 확인할 수 있어요.";
    }

    return "아직 받은 알림이 없어요.";
  }, [isSignedIn]);

  const handleAcceptNotification = async (notification: AppNotification) => {
    setAcceptingNotificationId(notification.id);

    try {
      const token = await getToken();
      const applicants = await getApplicants(notification.postId, token);
      const applicant = applicants.find(
        (item) =>
          item.status === "pending" &&
          item.nickname === notification.actorNickname,
      );

      if (!applicant) {
        window.alert("수락할 신청자를 찾을 수 없어요.");
        return;
      }

      const response = await acceptApplicant(
        notification.postId,
        applicant.id,
        token,
      );

      if (!response.success) {
        throw new Error(response.error || "신청 수락에 실패했어요.");
      }

      setAcceptedNotificationIds((previousIds) => {
        const nextIds = new Set(previousIds);
        nextIds.add(notification.id);
        return nextIds;
      });
      window.alert("신청을 수락했어요.");
    } catch (error: unknown) {
      window.alert(
        error instanceof Error
          ? error.message
          : "신청 수락 중 오류가 발생했어요.",
      );
    } finally {
      setAcceptingNotificationId(null);
    }
  };

  return (
    <div className="min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF] pb-28">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-transparent px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            목록
          </Link>
          <span className="text-sm font-bold text-violet-700">알림</span>
        </div>
      </header>

      <main className="px-5 py-6">
        <section className="rounded-[28px] bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950">알림 탭</h1>
              <p className="mt-1 text-sm text-slate-500">
                신청 도착과 수락 결과를 여기에서 확인해요.
              </p>
            </div>
          </div>
        </section>

        {isLoading || notifications.length > 0 ? (
          <div className="mt-4 space-y-3">
            {notifications.map((notification) => {
              const isAcceptableApplication =
                notification.kind === "application" &&
                !acceptedNotificationIds.has(notification.id);
              const isAccepting =
                acceptingNotificationId === notification.id;

              return (
                <article
                  key={notification.id}
                  className="rounded-[24px] bg-white p-4 shadow-sm border border-slate-100"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        notification.kind === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : notification.kind === "deleted"
                            ? "bg-red-100 text-red-700"
                            : "bg-violet-100 text-violet-700"
                      }`}
                    >
                      {notification.kind === "accepted" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : notification.kind === "deleted" ? (
                        <Trash2 className="h-5 w-5" />
                      ) : (
                        <Inbox className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-sm font-black text-slate-950">
                          {getNotificationTitle(notification)}
                        </h2>
                        <span className="shrink-0 text-xs font-semibold text-slate-400">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {getNotificationMessage(notification)}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        {notification.kind !== "deleted" ? (
                          <Link
                            href={`/post/${notification.postId}`}
                            className="inline-flex h-10 items-center text-sm font-bold text-violet-700"
                          >
                            게시글 보기
                          </Link>
                        ) : null}
                        {notification.kind === "application" ? (
                          <Button
                            type="button"
                            className="ml-auto h-10 rounded-2xl bg-violet-600 px-4 text-sm hover:bg-violet-700"
                            disabled={!isAcceptableApplication || isAccepting}
                            onClick={() =>
                              void handleAcceptNotification(notification)
                            }
                          >
                            {acceptedNotificationIds.has(notification.id)
                              ? "수락 완료"
                              : isAccepting
                                ? "수락 중"
                                : "수락"}
                          </Button>
                        ) : null}
                      </div>
                      {notification.openChatLink ? (
                        <Button
                          className="mt-3 h-11 w-full rounded-2xl gap-2 bg-violet-600 hover:bg-violet-700"
                          onClick={() =>
                            window.open(
                              notification.openChatLink,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                          오픈채팅 열기
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <section className="mt-4 rounded-[28px] bg-white p-8 text-center shadow-sm border border-slate-100">
            <Inbox className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {emptyMessage}
            </p>
            {!isSignedIn ? (
              <Button
                type="button"
                onClick={openSignIn}
                className="mt-5 h-12 rounded-2xl bg-violet-600 px-5 text-white hover:bg-violet-700"
              >
                로그인
              </Button>
            ) : null}
          </section>
        )}
      </main>
      <BottomNavigation />
    </div>
  );
}
