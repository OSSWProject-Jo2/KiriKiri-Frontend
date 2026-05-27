"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, FileText, User } from "lucide-react";
import { getUnreadNotificationCount } from "../data/notificationStorage";
import { useAuth } from "./auth/ClerkAuthProvider";

const navItems = [
  {
    href: "/profile",
    label: "프로필",
    icon: User,
  },
  {
    href: "/",
    label: "포스트",
    icon: FileText,
  },
  {
    href: "/notifications",
    label: "알림",
    icon: Bell,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const { nickname } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = window.setTimeout(() => {
      setUnreadCount(getUnreadNotificationCount(nickname));
    }, 0);

    return () => window.clearTimeout(loadUnreadCount);
  }, [nickname, pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="mx-auto max-w-[480px] border-t border-slate-100 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md pointer-events-auto">
        <div className="grid grid-cols-3 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const showBadge = item.href === "/notifications" && unreadCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {showBadge ? (
                    <span className="absolute -right-2.5 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] leading-none text-white ring-2 ring-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : null}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
